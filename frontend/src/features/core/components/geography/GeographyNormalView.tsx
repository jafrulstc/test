import React, { useEffect, useState, memo, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  Pagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
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
  setFilters,
  setPagination,
  fetchNationalities,
  fetchDivisions,
  fetchDistricts,
  fetchSubDistricts,
  fetchPostOffices,
  fetchVillages,
  deleteNationality,
  deleteDivision,
  deleteDistrict,
  deleteSubDistrict,
  deletePostOffice,
  deleteVillage,
} from '~/features/core/store/geographySlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import type { GeographyEntity } from '~/features/core/types/geography';

import { GEOGRAPHY_ENTITY, GeographyEntityType, SUCCESS_MESSAGES } from '~/app/constants';

interface GeographyNormalViewProps {
  onEdit: (item: GeographyEntity) => void;
}

/**
 * Geography normal view component
 * Displays geography data in table format with CRUD operations
 */
const GeographyNormalView = memo(({ onEdit }: GeographyNormalViewProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const {
    activeEntity,
    loading,
    filters,
    pagination,
  } = useAppSelector(selectGeographyState);

  const nationalities = useAppSelector(selectNationalities);
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);
  const villages = useAppSelector(selectVillages);

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GeographyEntity | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update filters when search term changes
  useEffect(() => {
    dispatch(setFilters({ ...filters, search: debouncedSearchTerm || undefined }));
  }, [debouncedSearchTerm, dispatch]);

  // Fetch data when activeEntity, pagination, or filters change
  useEffect(() => {
    const fetchParams = {
      page: pagination.page,
      limit: pagination.limit,
      filters,
    };

    switch (activeEntity) {
      case GEOGRAPHY_ENTITY.NATIONALITY:
        dispatch(fetchNationalities(fetchParams));
        break;
      case GEOGRAPHY_ENTITY.DIVISION:
        dispatch(fetchDivisions(fetchParams));
        break;
      case GEOGRAPHY_ENTITY.DISTRICT:
        dispatch(fetchDistricts(fetchParams));
        break;
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        dispatch(fetchSubDistricts(fetchParams));
        break;
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        dispatch(fetchPostOffices(fetchParams));
        break;
      case GEOGRAPHY_ENTITY.VILLAGE:
        dispatch(fetchVillages(fetchParams));
        break;
    }
  }, [activeEntity, pagination.page, pagination.limit, filters, dispatch]);

  /**
   * Get current data based on active entity
   */
  const getCurrentData = (): GeographyEntity[] => {
    switch (activeEntity) {
      case GEOGRAPHY_ENTITY.NATIONALITY:
        return nationalities;
      case GEOGRAPHY_ENTITY.DIVISION:
        return divisions;
      case GEOGRAPHY_ENTITY.DISTRICT:
        return districts;
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return subDistricts;
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return postOffices;
      case GEOGRAPHY_ENTITY.VILLAGE:
        return villages;
      default:
        return [];
    }
  };

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);

  /**
   * Handle delete item
   */
  const handleDelete = useCallback((item: GeographyEntity) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirm delete
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      switch (activeEntity) {
        case GEOGRAPHY_ENTITY.NATIONALITY:
          await dispatch(deleteNationality(itemToDelete.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.DIVISION:
          await dispatch(deleteDivision(itemToDelete.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.DISTRICT:
          await dispatch(deleteDistrict(itemToDelete.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.SUB_DISTRICT:
          await dispatch(deleteSubDistrict(itemToDelete.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.POST_OFFICE:
          await dispatch(deletePostOffice(itemToDelete.id)).unwrap();
          break;
        case GEOGRAPHY_ENTITY.VILLAGE:
          await dispatch(deleteVillage(itemToDelete.id)).unwrap();
          break;
      }

      showToast(`${getEntityDisplayName(activeEntity)} ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error');
    }
  }, [itemToDelete, activeEntity, dispatch, showToast]);

  /**
   * Get entity display name
   */
  const getEntityDisplayName = (entity: GeographyEntityType): string => {
    const names = {
      nationality: 'Nationality',
      division: 'Division',
      district: 'District',
      sub_district: 'Sub District',
      post_office: 'Post Office',
      village: 'Village',
    };
    return names[entity];
  };


  /**
   * Get parent information for hierarchical entities
   */
  const getParentInfo = (item: GeographyEntity): string => {

    if ('nationality' in item && item.nationality) {
      return item.nationality.name;
    }
    if ('division' in item && item.division) {
      return item.division.name;
    }
    if ('district' in item && item.district) {
      return item.district.name;
    }
    if ('subDistrict' in item && item.subDistrict) {
      return item.subDistrict.name;
    }
    if ('postOffice' in item && item.postOffice) {
      return item.postOffice.name;
    }
    return '-';
  };

  /**
   * Get parent column name
   */
  const getParentColumnName = (): string => {
    switch (activeEntity) {
      case GEOGRAPHY_ENTITY.DIVISION:
        return 'Nationality';
      case GEOGRAPHY_ENTITY.DISTRICT:
        return 'Division';
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return 'District';
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return 'Sub District';
      case GEOGRAPHY_ENTITY.VILLAGE:
        return 'Post Office';
      default:
        return '';
    }
  };

  /**
   * Render filter controls for hierarchical entities
   */
  const renderFilters = () => {
    if (activeEntity === 'nationality') return null;

    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by {getParentColumnName()}</InputLabel>
          <Select
            value={getFilterValue()}
            label={`Filter by ${getParentColumnName()}`}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All {getParentColumnName()}s</MenuItem>
            {getFilterOptions().map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </Box>
    );
  };

  /**
   * Get filter value based on active entity
   */
  const getFilterValue = (): string => {
    switch (activeEntity) {
      case GEOGRAPHY_ENTITY.DIVISION:
        return filters.nationalityId || '';
      case GEOGRAPHY_ENTITY.DISTRICT:
        return filters.divisionId || '';
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return filters.districtId || '';
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return filters.subDistrictId || '';
      case GEOGRAPHY_ENTITY.VILLAGE:
        return filters.postOfficeId || '';
      default:
        return '';
    }
  };

  /**
   * Get filter options based on active entity
   */
  const getFilterOptions = (): { id: string; name: string }[] => {
    switch (activeEntity) {
      case  GEOGRAPHY_ENTITY.DIVISION:
        return nationalities;
      case GEOGRAPHY_ENTITY.DISTRICT:
        return divisions;
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        return districts;
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        return subDistricts;
      case GEOGRAPHY_ENTITY.VILLAGE:
        return postOffices;
      default:
        return [];
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (event: any) => {
    const value = event.target.value;
    const newFilters = { ...filters };

    switch (activeEntity) {
      case GEOGRAPHY_ENTITY.DIVISION:
        newFilters.nationalityId = value || undefined;
        break;
      case GEOGRAPHY_ENTITY.DISTRICT:
        newFilters.divisionId = value || undefined;
        break;
      case GEOGRAPHY_ENTITY.SUB_DISTRICT:
        newFilters.districtId = value || undefined;
        break;
      case GEOGRAPHY_ENTITY.POST_OFFICE:
        newFilters.subDistrictId = value || undefined;
        break;
      case GEOGRAPHY_ENTITY.VILLAGE:
        newFilters.postOfficeId = value || undefined;
        break;
    }

    dispatch(setFilters(newFilters));
  };

  const currentData = getCurrentData();

  if (loading && currentData.length === 0) {
    return <LoadingSpinner message={`Loading ${getEntityDisplayName(activeEntity).toLowerCase()}s...`} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={`Search ${getEntityDisplayName(activeEntity).toLowerCase()}s...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ mb: 2 }}
        />
        {renderFilters()}
      </Box>

      {/* Data Table */}
      {currentData.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  {getParentColumnName() && <TableCell>{getParentColumnName()}</TableCell>}
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {item.name}
                      </Typography>
                    </TableCell>
                    {getParentColumnName() && (
                      <TableCell>
                        <Chip
                          label={getParentInfo(item)}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(item)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(item)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        <EmptyState
          title={`No ${getEntityDisplayName(activeEntity).toLowerCase()}s found`}
          description="No data available for the current selection"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${getEntityDisplayName(activeEntity)}`}
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

GeographyNormalView.displayName = 'GeographyNormalView';

export { GeographyNormalView };
