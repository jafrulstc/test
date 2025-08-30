import React, { useState, useEffect, memo, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Paper,
  Chip,
  TextField,
  Fab,
} from '@mui/material';
import {
  ExpandMore,
  ChevronRight,
  Public,
  LocationCity,
  Domain,
  LocationOn,
  LocalPostOffice,
  Home,
  Edit,
  Delete,
  Add,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import { useDebounce } from '~/shared/hooks/useDebounce';
import {
  selectGeographyState,
  selectNationalities,
  selectDivisions,
  selectDistricts,
  selectSubDistricts,
  selectPostOffices,
  selectVillages,
  deleteNationality,
  deleteDivision,
  deleteDistrict,
  deleteSubDistrict,
  deletePostOffice,
  deleteVillage,
} from '~/features/core/store/geographySlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import type { GeographyTreeNode, GeographyEntity } from '~/features/core/types/geography';
import { GEOGRAPHY_ENTITY, GeographyEntityType, SUCCESS_MESSAGES } from '~/app/constants';

interface GeographyTreeViewProps {
  // onEdit: (item: GeographyEntity) => void;
  onEdit: (item: GeographyEntity, type: GeographyEntityType) => void;
}

/**
 * Geography tree view component
 * Displays geography data in hierarchical tree format
 */
const GeographyTreeView = memo(({ onEdit }: GeographyTreeViewProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading } = useAppSelector(selectGeographyState);
  const nationalities = useAppSelector(selectNationalities);
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);
  const villages = useAppSelector(selectVillages);

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ item: GeographyEntity; type: GeographyEntityType } | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  /**
   * Build tree structure from flat data
   */
  const buildTreeData = useCallback((): GeographyTreeNode[] => {
    const tree: GeographyTreeNode[] = [];

    // Filter data based on search term
    const filterBySearch = (name: string) => {
      if (!debouncedSearchTerm) return true;
      return name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    };

    nationalities.forEach((nationality) => {
      if (!filterBySearch(nationality.name)) return;

      const nationalityNode: GeographyTreeNode = {
        id: nationality.id,
        name: nationality.name,
        type: 'nationality',
        children: [],
      };

      // Add divisions
      divisions
        .filter((division) => division.nationalityId === nationality.id)
        .forEach((division) => {
          if (!filterBySearch(division.name)) return;

          const divisionNode: GeographyTreeNode = {
            id: division.id,
            name: division.name,
            type: 'division',
            parentId: nationality.id,
            children: [],
          };

          // Add districts
          districts
            .filter((district) => district.divisionId === division.id)
            .forEach((district) => {
              if (!filterBySearch(district.name)) return;

              const districtNode: GeographyTreeNode = {
                id: district.id,
                name: district.name,
                type: 'district',
                parentId: division.id,
                children: [],
              };

              // Add sub districts
              subDistricts
                .filter((subDistrict) => subDistrict.districtId === district.id)
                .forEach((subDistrict) => {
                  if (!filterBySearch(subDistrict.name)) return;

                  const subDistrictNode: GeographyTreeNode = {
                    id: subDistrict.id,
                    name: subDistrict.name,
                    type: GEOGRAPHY_ENTITY.SUB_DISTRICT,
                    parentId: district.id,
                    children: [],
                  };

                  // Add post offices
                  postOffices
                    .filter((postOffice) => postOffice.subDistrictId === subDistrict.id)
                    .forEach((postOffice) => {
                      if (!filterBySearch(postOffice.name)) return;

                      const postOfficeNode: GeographyTreeNode = {
                        id: postOffice.id,
                        name: postOffice.name,
                        type: GEOGRAPHY_ENTITY.POST_OFFICE,
                        parentId: subDistrict.id,
                        children: [],
                      };

                      // Add villages
                      villages
                        .filter((village) => village.postOfficeId === postOffice.id)
                        .forEach((village) => {
                          if (!filterBySearch(village.name)) return;

                          const villageNode: GeographyTreeNode = {
                            id: village.id,
                            name: village.name,
                            type: GEOGRAPHY_ENTITY.VILLAGE,
                            parentId: postOffice.id,
                          };

                          postOfficeNode.children!.push(villageNode);
                        });

                      if (postOfficeNode.children!.length > 0 || filterBySearch(postOffice.name)) {
                        subDistrictNode.children!.push(postOfficeNode);
                      }
                    });

                  if (subDistrictNode.children!.length > 0 || filterBySearch(subDistrict.name)) {
                    districtNode.children!.push(subDistrictNode);
                  }
                });

              if (districtNode.children!.length > 0 || filterBySearch(district.name)) {
                divisionNode.children!.push(districtNode);
              }
            });

          if (divisionNode.children!.length > 0 || filterBySearch(division.name)) {
            nationalityNode.children!.push(divisionNode);
          }
        });

      if (nationalityNode.children!.length > 0 || filterBySearch(nationality.name)) {
        tree.push(nationalityNode);
      }
    });

    return tree;
  }, [nationalities, divisions, districts, subDistricts, postOffices, villages, debouncedSearchTerm]);

  /**
   * Toggle node expansion
   */
  const toggleExpanded = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  /**
   * Get icon for entity type
   */
  const getEntityIcon = (type: GeographyEntityType) => {
    const icons = {
      nationality: Public,
      division: LocationCity,
      district: Domain,
      sub_district: LocationOn,
      post_office: LocalPostOffice,
      village: Home,
    };
    const IconComponent = icons[type];
    return <IconComponent fontSize="small" />;
  };

  /**
   * Get entity from tree node
   */
  const getEntityFromNode = (node: GeographyTreeNode): GeographyEntity | null => {
    switch (node.type) {
      case GEOGRAPHY_ENTITY.NATIONALITY:
        return nationalities.find((item) => item.id === node.id) || null;
      case GEOGRAPHY_ENTITY.DIVISION:
        return divisions.find((item) => item.id === node.id) || null;
      case GEOGRAPHY_ENTITY.DISTRICT:
        return districts.find((item) => item.id === node.id) || null;
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return subDistricts.find((item) => item.id === node.id) || null;
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return postOffices.find((item) => item.id === node.id) || null;
      case GEOGRAPHY_ENTITY.VILLAGE:
        return villages.find((item) => item.id === node.id) || null;
      default:
        return null;
    }
  };

  /**
   * Handle edit item
   */
  const handleEdit = useCallback((node: GeographyTreeNode) => {
    const entity = getEntityFromNode(node);
    if (entity) {
      // onEdit(entity);
      onEdit(entity, node.type);
    }
  }, [onEdit, getEntityFromNode]);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((node: GeographyTreeNode) => {
    const entity = getEntityFromNode(node);
    if (entity) {
      setItemToDelete({ item: entity, type: node.type });
      setDeleteDialogOpen(true);
    }
  }, [getEntityFromNode]);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      switch (itemToDelete.type) {
        case GEOGRAPHY_ENTITY.NATIONALITY:
          await dispatch(deleteNationality(itemToDelete.item.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.DIVISION:
          await dispatch(deleteDivision(itemToDelete.item.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.DISTRICT:
          await dispatch(deleteDistrict(itemToDelete.item.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.SUB_DISTRICT:
          await dispatch(deleteSubDistrict(itemToDelete.item.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.POST_OFFICE:
          await dispatch(deletePostOffice(itemToDelete.item.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.VILLAGE:
          await dispatch(deleteVillage(itemToDelete.item.id)).unwrap();
          break;
      }

      showToast(`${getEntityDisplayName(itemToDelete.type)} ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
    }
  }, [itemToDelete, dispatch, showToast]);

  /**
   * Get entity display name
   */
  const getEntityDisplayName = (type: GeographyEntityType): string => {
    const names = {
      nationality: 'Nationality',
      division: 'Division',
      district: 'District',
      sub_district: 'Sub District',
      post_office: 'Post Office',
      village: 'Village',
    };
    return names[type];
  };

  /**
   * Render tree node
   */
  const renderTreeNode = (node: GeographyTreeNode, level: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);

    return (
      <Box key={node.id}>
        <ListItem
          sx={{
            pl: level * 3 + 1,
            py: 0.5,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={() => toggleExpanded(node.id)}
                sx={{ p: 0.5 }}
              >
                {isExpanded ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
            ) : (
              <Box sx={{ width: 24 }} />
            )}
          </ListItemIcon>

          <ListItemIcon sx={{ minWidth: 32 }}>
            {getEntityIcon(node.type)}
          </ListItemIcon>

          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {node.name}
                </Typography>
                <Chip
                  label={getEntityDisplayName(node.type)}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </Box>
            }
          />

          <ListItemSecondaryAction>
            <IconButton
              size="small"
              onClick={() => handleEdit(node)}
              color="primary"
              sx={{ mr: 0.5 }}
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleDelete(node)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>

        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {node.children!.map((child) => renderTreeNode(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const treeData = buildTreeData();

  if (loading) {
    return <LoadingSpinner message="Loading geography data..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search in tree..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Tree View */}
      <Paper variant="outlined" sx={{ maxHeight: 600, overflow: 'auto' }}>
        {treeData.length > 0 ? (
          <List dense>
            {treeData.map((node) => renderTreeNode(node))}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {debouncedSearchTerm ? 'No matching items found' : 'No data available'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${itemToDelete ? getEntityDisplayName(itemToDelete.type) : ''}`}
        message={`Are you sure you want to delete "${itemToDelete?.item.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

GeographyTreeView.displayName = 'GeographyTreeView';

export { GeographyTreeView };
