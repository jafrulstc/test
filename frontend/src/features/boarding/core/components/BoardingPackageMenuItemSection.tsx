//  import React, { useEffect, useState, memo, useCallback } from 'react';
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
//   TextField,
//   Pagination,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
// } from '@mui/material';
// import { Delete, Search, Add, Close } from '@mui/icons-material'; // No Edit icon needed based on schema
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useTranslation } from 'react-i18next';
// import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
// import { useToastContext } from '~/app/providers/ToastProvider';
// import { useDebounce } from '~/shared/hooks/useDebounce';
// import {
//   selectMasterBoardingState,
//   setFilters,
//   setPagination,
//   fetchBoardingPackageMenuItems,
//   createBoardingPackageMenuItem,
//   deleteBoardingPackageMenuItem,
//   selectMasterBoardingPackageMenuItems,
//   fetchBoardingPackages, // For dropdown in form and display in table
//   selectMasterBoardingPackages, // For dropdown in form and display in table
//   fetchBoardingMenuItems, // For dropdown in form and display in table
//   selectMasterBoardingMenuItems, // For dropdown in form and display in table
// } from '~/features/boarding/core/store/masterBoardingSlice';
// import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
// import { EmptyState } from '~/shared/components/ui/EmptyState';
// import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
// import { boardingPackageMenuItemSchema, type BoardingPackageMenuItemFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
// import type { BoardingPackageMenuItem, BoardingPackageMenuItemFilters } from '~/features/boarding/core/types/masterBoardingType';
// import { SUCCESS_MESSAGES } from '~/app/constants';
// // No getChangedFields needed as there's no update operation based on schema

// /**
//  * Boarding Package Menu Item section component
//  */
// const BoardingPackageMenuItemSection = memo(() => {
//   const { t } = useTranslation();
//   const dispatch = useAppDispatch();
//   const { showToast } = useToastContext();

//   const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
//   const boardingPackageMenuItems = useAppSelector(selectMasterBoardingPackageMenuItems);
//   const packages = useAppSelector(selectMasterBoardingPackages); // For dropdowns
//   const menuItems = useAppSelector(selectMasterBoardingMenuItems); // For dropdowns

//   const [packageFilter, setPackageFilter] = useState<string>(''); // Filter by Package
//   const [menuItemFilter, setMenuItemFilter] = useState<string>(''); // Filter by Menu Item

//   const [formModalOpen, setFormModalOpen] = useState(false);
//   // No selectedItem for edit, as per current schema, it's about adding new associations
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<BoardingPackageMenuItem | null>(null);

//   // No debounced search term as no generic search field for this table

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<BoardingPackageMenuItemFormData>({
//     resolver: zodResolver(boardingPackageMenuItemSchema),
//     defaultValues: {
//       packageId: '',
//       menuItemId: '',
//       mealTypeId: '',
//     },
//   });

//   // Update filters when package or menu item filters change
//   useEffect(() => {
//     const newFilters: BoardingPackageMenuItemFilters = {
//       packageId: packageFilter || undefined,
//       menuItemId: menuItemFilter || undefined,
//     };

//     if (JSON.stringify(newFilters) !== JSON.stringify(filters.packageMenuItems)) {
//       dispatch(setFilters({ section: 'packageMenuItems', filters: newFilters }));
//     }
//   }, [packageFilter, menuItemFilter, dispatch, filters.packageMenuItems]);

//   // Fetch data when pagination or filters change
//   useEffect(() => {
//     const fetchParams = {
//       page: pagination.page,
//       limit: pagination.limit,
//       filters: filters.packageMenuItems,
//     };
//     dispatch(fetchBoardingPackageMenuItems(fetchParams));
//   }, [pagination.page, pagination.limit, filters.packageMenuItems, dispatch]);

//   // Fetch packages and menu items for dropdowns in the form and for displaying names in the table
//   useEffect(() => {
//     dispatch(fetchBoardingPackages({}));
//     dispatch(fetchBoardingMenuItems({}));
//   }, [dispatch]);

//   // Reset form when modal opens
//   useEffect(() => {
//     if (formModalOpen) {
//       reset({
//         packageId: '',
//         menuItemId: '',
//       });
//     }
//   }, [formModalOpen, reset]);

//   /**
//    * Handle page change
//    */
//   const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
//     dispatch(setPagination({ page }));
//   }, [dispatch]);

//   /**
//    * Handle add new item
//    */
//   const handleAddNew = useCallback(() => {
//     setFormModalOpen(true);
//   }, []);

//   /**
//    * Handle delete item
//    */
//   const handleDelete = useCallback((item: BoardingPackageMenuItem) => {
//     setItemToDelete(item);
//     setDeleteDialogOpen(true);
//   }, []);

//   /**
//    * Handle form submission (create)
//    */
//   const onSubmit = async (data: BoardingPackageMenuItemFormData) => {
//     try {
//       // Check for duplicate before creating
//       const isDuplicate = boardingPackageMenuItems.some(
//         (item) => item.packageId === data.packageId && item.menuItemId === data.menuItemId
//       );

//       if (isDuplicate) {
//         showToast('This package-menu item association already exists.', 'info');
//         return;
//       }

//       await dispatch(createBoardingPackageMenuItem(data)).unwrap();
//       showToast(`Package Menu Item ${SUCCESS_MESSAGES.CREATED}`, 'success');
//       handleFormModalClose();
//     } catch (error: any) {
//       showToast(error.message || `Failed to create package menu item`, 'error');
//     }
//   };

//   /**
//    * Handle confirm delete
//    */
//   const handleConfirmDelete = useCallback(async () => {
//     if (!itemToDelete) return;

//     try {
//       await dispatch(deleteBoardingPackageMenuItem(itemToDelete.id)).unwrap();
//       showToast(`Package Menu Item ${SUCCESS_MESSAGES.DELETED}`, 'success');
//       setDeleteDialogOpen(false);
//       setItemToDelete(null);
//     } catch (error: any) {
//       showToast(error.message || 'Failed to delete package menu item', 'error');
//     }
//   }, [itemToDelete, dispatch, showToast]);

//   /**
//    * Handle form modal close
//    */
//   const handleFormModalClose = useCallback(() => {
//     setFormModalOpen(false);
//     reset({ packageId: '', menuItemId: '' });
//   }, [reset]);


//   if (loading && boardingPackageMenuItems.length === 0) {
//     return <LoadingSpinner message="Loading package menu items..." />;
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h6" fontWeight={600}>
//           Package Menu Item Management
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={handleAddNew}
//           disabled={loading}
//         >
//           Add Package Menu Item
//         </Button>
//       </Box>

//       {/* Filters */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h6" fontWeight={600} gutterBottom>
//           Filters
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//           <FormControl size="small" sx={{ minWidth: 200 }}>
//             <InputLabel>Package</InputLabel>
//             <Select
//               value={packageFilter}
//               label="Package"
//               onChange={(e) => setPackageFilter(e.target.value)}
//             >
//               <MenuItem value="">All Packages</MenuItem>
//               {packages.map((pkg) => (
//                 <MenuItem key={pkg.id} value={pkg.id}>
//                   {pkg.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl size="small" sx={{ minWidth: 200 }}>
//             <InputLabel>Menu Item</InputLabel>
//             <Select
//               value={menuItemFilter}
//               label="Menu Item"
//               onChange={(e) => setMenuItemFilter(e.target.value)}
//             >
//               <MenuItem value="">All Menu Items</MenuItem>
//               {menuItems.map((item) => (
//                 <MenuItem key={item.id} value={item.id}>
//                   {item.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>
//       </Paper>

//       {/* Data Table */}
//       {boardingPackageMenuItems.length > 0 ? (
//         <>
//           <TableContainer component={Paper} variant="outlined">
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Package Name</TableCell>
//                   <TableCell>Menu Item Name</TableCell>
//                   <TableCell>Created</TableCell>
//                   <TableCell align="right">Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {boardingPackageMenuItems.map((item) => (
//                   <TableRow key={item.id} hover>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight={500}>
//                         {packages.find((pkg) => pkg.id === item.packageId)?.name || 'N/A'}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight={500}>
//                         {menuItems.find((menuItem) => menuItem.id === item.menuItemId)?.name || 'N/A'}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" color="text.secondary">
//                         {new Date(item.createdAt).toLocaleDateString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="right">
//                       <IconButton
//                         size="small"
//                         onClick={() => handleDelete(item)}
//                         color="error"
//                       >
//                         <Delete />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           {/* Pagination */}
//           {pagination.totalPages > 1 && (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//               <Pagination
//                 count={pagination.totalPages}
//                 page={pagination.page}
//                 onChange={handlePageChange}
//                 color="primary"
//                 showFirstButton
//                 showLastButton
//               />
//             </Box>
//           )}
//         </>
//       ) : (
//         <EmptyState
//           title="No package menu items found"
//           description="No associations between packages and menu items available. Add some to get started."
//           actionLabel="Add Package Menu Item"
//           onAction={handleAddNew}
//         />
//       )}

//       {/* Form Modal */}
//       <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
//         <DialogTitle>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="h6" fontWeight={600}>
//               Add Package Menu Item Association
//             </Typography>
//             <IconButton onClick={handleFormModalClose} size="small">
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <DialogContent dividers>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//               <Controller
//                 name="packageId"
//                 control={control}
//                 render={({ field }) => (
//                   <FormControl fullWidth error={!!errors.packageId}>
//                     <InputLabel>Package *</InputLabel>
//                     <Select {...field} label="Package *">
//                       <MenuItem value="">
//                         <em>None</em>
//                       </MenuItem>
//                       {packages.map((pkg) => (
//                         <MenuItem key={pkg.id} value={pkg.id}>
//                           {pkg.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {errors.packageId && (
//                       <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                         {errors.packageId.message}
//                       </Typography>
//                     )}
//                   </FormControl>
//                 )}
//               />

//               <Controller
//                 name="menuItemId"
//                 control={control}
//                 render={({ field }) => (
//                   <FormControl fullWidth error={!!errors.menuItemId}>
//                     <InputLabel>Menu Item *</InputLabel>
//                     <Select {...field} label="Menu Item *">
//                       <MenuItem value="">
//                         <em>None</em>
//                       </MenuItem>
//                       {menuItems.map((item) => (
//                         <MenuItem key={item.id} value={item.id}>
//                           {item.name}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {errors.menuItemId && (
//                       <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//                         {errors.menuItemId.message}
//                       </Typography>
//                     )}
//                   </FormControl>
//                 )}
//               />
//             </Box>
//           </DialogContent>

//           <DialogActions sx={{ p: 3 }}>
//             <Button onClick={handleFormModalClose} disabled={loading || isSubmitting}>
//               {t('common.cancel')}
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               disabled={loading || isSubmitting}
//               sx={{ minWidth: 100 }}
//             >
//               {loading || isSubmitting ? t('common.loading') : t('common.add')}
//             </Button>
//           </DialogActions>
//         </form>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         onConfirm={handleConfirmDelete}
//         title="Delete Package Menu Item"
//         message={`Are you sure you want to delete this association? This action cannot be undone.`}
//         confirmLabel={t('common.delete')}
//         cancelLabel={t('common.cancel')}
//         severity="error"
//         loading={loading}
//       />
//     </Box>
//   );
// });

// BoardingPackageMenuItemSection.displayName = 'BoardingPackageMenuItemSection';

// export { BoardingPackageMenuItemSection };



// --- START OF FILE BoardingPackageMenuItemSection.tsx ---

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
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { Delete, Add, Close, Edit } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form'; // এখানে useFormState বাদ দিতে হবে
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import { useToastContext } from '~/app/providers/ToastProvider';
import {
  selectMasterBoardingState,
  setFilters,
  setPagination,
  fetchBoardingPackageMenuItems,
  createBoardingPackageMenuItem,
  deleteBoardingPackageMenuItem,
  fetchBoardingPackages,
  fetchBoardingMenuItems,
  fetchBoardingMealTypes,
  fetchBoardingPackageTypes, // Add this import for package types
  selectMasterBoardingPackages,
  selectMasterBoardingMenuItems,
  selectMasterBoardingMealTypes,
  selectMasterBoardingPackageMenuItems,
  selectMasterBoardingPackageTypes, // Add this selector
  updateBoardingPackageMenuItem
} from '~/features/boarding/core/store/masterBoardingSlice';
import { LoadingSpinner } from '~/shared/components/ui/LoadingSpinner';
import { EmptyState } from '~/shared/components/ui/EmptyState';
import { ConfirmDialog } from '~/shared/components/ui/ConfirmDialog';
import { boardingPackageMenuItemSchema, type BoardingPackageMenuItemFormData } from '~/features/boarding/core/schemas/masterBoardingSchema';
import type { BoardingPackageMenuItem, BoardingPackageMenuItemFilters } from '~/features/boarding/core/types/masterBoardingType';
import { SUCCESS_MESSAGES } from '~/app/constants';
import { STATUSES, STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

const BoardingPackageMenuItemSection = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToastContext();

  const { loading, filters, pagination } = useAppSelector(selectMasterBoardingState);
  const boardingPackageMenuItems = useAppSelector(selectMasterBoardingPackageMenuItems);
  const packages = useAppSelector(selectMasterBoardingPackages);
  const menuItems = useAppSelector(selectMasterBoardingMenuItems);
  const mealTypes = useAppSelector(selectMasterBoardingMealTypes);
  const packageTypes = useAppSelector(selectMasterBoardingPackageTypes); // Fetch package types

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BoardingPackageMenuItem | null>(null);

  const [selectedItem, setSelectedItem] = useState<BoardingPackageMenuItem | null>(null);
  const isEdit = Boolean(selectedItem);

  // Add state for UI-only package type filter in the form
  const [formPackageTypeId, setFormPackageTypeId] = useState<string>('');
  const [filteredPackagesForForm, setFilteredPackagesForForm] = useState<typeof packages>([]); // State to hold filtered packages for the form

  const {
    control,
    handleSubmit,
    reset,
    resetField, // <--- এখানে resetField যোগ করুন
    formState: { errors, isSubmitting },
  } = useForm<BoardingPackageMenuItemFormData>({
    resolver: zodResolver(boardingPackageMenuItemSchema),
    defaultValues: {
      packageId: '',
      menuItemId: '',
      mealTypeId: '',
      quantity: 1, // Default values for new fields
      price: 0,
      note: '',
      status: STATUSES_OBJECT.ACTIVE,
    },
  });

  // const { resetField } = useFormState({ control }); // <--- এই লাইনটি সম্পূর্ণভাবে মুছে ফেলুন বা কমেন্ট আউট করুন


  // Fetch all necessary dropdown data on component mount
  useEffect(() => {
    dispatch(fetchBoardingPackages({}));
    dispatch(fetchBoardingMenuItems({}));
    dispatch(fetchBoardingMealTypes({}));
    dispatch(fetchBoardingPackageTypes({})); // Fetch package types
  }, [dispatch]);

  // Fetch boarding package menu items based on pagination and filters
  useEffect(() => {
    dispatch(fetchBoardingPackageMenuItems({
      page: pagination.page,
      limit: pagination.limit,
      filters: filters.packageMenuItems,
    }));
  }, [pagination.page, pagination.limit, filters.packageMenuItems, dispatch]);

  // Handle form initialization/reset when modal opens or selectedItem changes
  useEffect(() => {
    if (formModalOpen) {
      if (selectedItem) {
        // Edit mode: populate form with selected item data
        reset({
          packageId: selectedItem.packageId,
          menuItemId: selectedItem.menuItemId,
          mealTypeId: selectedItem.mealTypeId,
          quantity: selectedItem.quantity || 1,
          price: selectedItem.price || 0,
          note: selectedItem.note || '',
          status: selectedItem.status || STATUSES_OBJECT.ACTIVE,
        });
        // In edit mode, we don't need to set formPackageTypeId as packageId and mealTypeId are fixed
        setFormPackageTypeId(packages.find(pkg => pkg.id === selectedItem.packageId)?.packageTypeId || ''); // Populate for display, but not for submission
      } else {
        // Add mode: reset form to default values
        reset({
          packageId: '',
          menuItemId: '',
          mealTypeId: '',
          quantity: 1,
          price: 0,
          note: '',
          status: STATUSES_OBJECT.ACTIVE,
        });
        setFormPackageTypeId(''); // Reset package type filter for new entries
      }
    }
  }, [formModalOpen, selectedItem, reset, packages]);

  // Filter packages for the form's packageId dropdown based on formPackageTypeId
  useEffect(() => {
    if (formPackageTypeId) {
      setFilteredPackagesForForm(packages.filter(pkg => pkg.packageTypeId === formPackageTypeId));
    } else {
      setFilteredPackagesForForm(packages);
    }
  }, [formPackageTypeId, packages]);


  const handlePageChange = useCallback((_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPagination({ page }));
  }, [dispatch]);


  const handleAddNew = useCallback(() => {
    setSelectedItem(null);
    setFormModalOpen(true);
    setFormPackageTypeId(''); // Ensure package type filter is reset when adding
  }, []);

  const handleEdit = useCallback((item: BoardingPackageMenuItem) => {
    setSelectedItem(item);
    setFormModalOpen(true);
  }, []);

  const handleDelete = useCallback((item: BoardingPackageMenuItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await dispatch(deleteBoardingPackageMenuItem(itemToDelete.id)).unwrap();
      showToast(`Package Menu Item ${SUCCESS_MESSAGES.DELETED}`, 'success');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      // Re-fetch to update the table after deletion, considering pagination
      dispatch(fetchBoardingPackageMenuItems({
        page: pagination.page,
        limit: pagination.limit,
        filters: filters.packageMenuItems,
      }));
    } catch (error: any) {
      showToast(error.message || 'Failed to delete package menu item', 'error');
    }
  }, [itemToDelete, dispatch, showToast, pagination.page, pagination.limit, filters.packageMenuItems]);

  const handleFormModalClose = useCallback(() => {
    setFormModalOpen(false);
    setSelectedItem(null); // Clear selected item on close
    reset(); // Reset form values
    setFormPackageTypeId(''); // Reset form package type filter
  }, [reset]);

  const onSubmit = async (data: BoardingPackageMenuItemFormData) => {
    try {
      if (isEdit && selectedItem) {
        // Only allow updating quantity, price, note, status in edit mode
        await dispatch(updateBoardingPackageMenuItem({
          id: selectedItem.id,
          data: {
            quantity: data.quantity,
            price: data.price,
            note: data.note,
            status: data.status,
          },
        })).unwrap();
        showToast(`Package Menu Item ${SUCCESS_MESSAGES.UPDATED}`, 'success');
      } else {
        // Create mode: check for duplicates and then create
        const isDuplicate = boardingPackageMenuItems.some(
          (item) =>
            item.packageId === data.packageId &&
            item.menuItemId === data.menuItemId &&
            item.mealTypeId === data.mealTypeId
        );

        if (isDuplicate) {
          showToast('This package-menu-meal association already exists.', 'info');
          return;
        }
        // Destructure to exclude packageTypeId from data sent to API
        // boardingPackageMenuItemSchema থেকে packageTypeId সরিয়ে ফেলার কারণে এখানে destructuring এর দরকার নেই
        await dispatch(createBoardingPackageMenuItem(data)).unwrap();
        showToast(`Package Menu Item ${SUCCESS_MESSAGES.CREATED}`, 'success');
      }

      handleFormModalClose();
      // Re-fetch to update the table after creation/update, considering pagination
      dispatch(fetchBoardingPackageMenuItems({
        page: pagination.page,
        limit: pagination.limit,
        filters: filters.packageMenuItems,
      }));
    } catch (error: any) {
      showToast(error.message || 'Failed to submit', 'error');
    }
  };


  if (loading && boardingPackageMenuItems.length === 0) {
    return <LoadingSpinner message="Loading package menu items..." />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Package Menu Item Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddNew}
          disabled={loading}
        >
          Add Package Menu Item
        </Button>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Package Type Filter (for table) - optional, if you want to filter table by package type */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Package Type</InputLabel>
            <Select
              value={
                // Find the packageTypeId of the currently selected package filter
                // If no packageId is selected, or package not found, default to empty string
                (filters.packageMenuItems.packageId && packages.find(pkg => pkg.id === filters.packageMenuItems.packageId)?.packageTypeId) || ''
              }
              label="Package Type"
              onChange={(e) => {
                const selectedType = e.target.value as string;
                let newPackageId: string | undefined = undefined;

                if (selectedType) {
                  // Find packages of this type
                  const pkgOfType = packages.filter(pkg => pkg.packageTypeId === selectedType);
                  // Set the first package of this type as the new packageId filter, if any exist
                  if (pkgOfType.length > 0) {
                    newPackageId = pkgOfType[0].id;
                  }
                }

                dispatch(setFilters({
                  section: 'packageMenuItems',
                  filters: {
                    ...filters.packageMenuItems,
                    packageId: newPackageId, // Set the new packageId based on selected package type
                    menuItemId: undefined, // Clear other filters to ensure coherent filtering
                    mealTypeId: undefined,
                  },
                }));
              }}
            >
              <MenuItem value="">All Package Types</MenuItem>
              {packageTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Package</InputLabel>
            <Select
              value={filters.packageMenuItems.packageId || ''}
              label="Package"
              onChange={(e) =>
                dispatch(setFilters({
                  section: 'packageMenuItems',
                  filters: { ...filters.packageMenuItems, packageId: e.target.value || undefined },
                }))
              }
            >
              <MenuItem value="">All Packages</MenuItem>
              {packages.map((pkg) => (
                <MenuItem key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Menu Item</InputLabel>
            <Select
              value={filters.packageMenuItems.menuItemId || ''}
              label="Menu Item"
              onChange={(e) =>
                dispatch(setFilters({
                  section: 'packageMenuItems',
                  filters: { ...filters.packageMenuItems, menuItemId: e.target.value || undefined },
                }))
              }
            >
              <MenuItem value="">All Menu Items</MenuItem>
              {menuItems.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Meal Type</InputLabel>
            <Select
              value={filters.packageMenuItems.mealTypeId || ''}
              label="Meal Type"
              onChange={(e) =>
                dispatch(setFilters({
                  section: 'packageMenuItems',
                  filters: { ...filters.packageMenuItems, mealTypeId: e.target.value || undefined },
                }))
              }
            >
              <MenuItem value="">All Meal Types</MenuItem>
              {mealTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Data Table */}
      {boardingPackageMenuItems.length > 0 ? (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package Name</TableCell>
                  <TableCell>Menu Item Name</TableCell>
                  <TableCell>Meal Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {boardingPackageMenuItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{packages.find((p) => p.id === item.packageId)?.name || 'N/A'}</TableCell>
                    <TableCell>{menuItems.find((m) => m.id === item.menuItemId)?.name || 'N/A'}</TableCell>
                    <TableCell>{mealTypes.find((m) => m.id === item.mealTypeId)?.name || 'N/A'}</TableCell>
                    <TableCell>{item.quantity ?? 'N/A'}</TableCell>
                    <TableCell>{item.price ?? 'N/A'}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(item)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(item)} color="error">
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
          title="No package menu items found"
          description="No associations between packages and menu items available. Add some to get started."
          actionLabel="Add Package Menu Item"
          onAction={handleAddNew}
        />
      )}


      {/* Form Modal */}
      <Dialog open={formModalOpen} onClose={handleFormModalClose} maxWidth="sm" fullWidth disableRestoreFocus>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {isEdit ? 'Edit Package Menu Item' : 'Add Package Menu Item Association'}
            </Typography>
            <IconButton onClick={handleFormModalClose} size="small"><Close /></IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* These fields are only editable/visible when adding a new item */}
              {!isEdit ? (
                <>
                  <FormControl fullWidth>
                    <InputLabel>Package Type *</InputLabel>
                    <Select
                      value={formPackageTypeId}
                      label="Package Type *"
                      onChange={(e) => {
                        setFormPackageTypeId(e.target.value as string);
                        resetField('packageId', { defaultValue: '' }); // Reset packageId when packageType changes
                      }}
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      {packageTypes.map((pt) => (
                        <MenuItem key={pt.id} value={pt.id}>{pt.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Controller
                    name="packageId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.packageId}>
                        <InputLabel>Package *</InputLabel>
                        <Select {...field} label="Package *" disabled={!formPackageTypeId}> {/* Disable if no packageType selected */}
                          <MenuItem value=""><em>None</em></MenuItem>
                          {filteredPackagesForForm.map((pkg) => (
                            <MenuItem key={pkg.id} value={pkg.id}>{pkg.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.packageId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                            {errors.packageId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="menuItemId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.menuItemId}>
                        <InputLabel>Menu Item *</InputLabel>
                        <Select {...field} label="Menu Item *">
                          <MenuItem value=""><em>None</em></MenuItem>
                          {menuItems.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.menuItemId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                            {errors.menuItemId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="mealTypeId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.mealTypeId}>
                        <InputLabel>Meal Type *</InputLabel>
                        <Select {...field} label="Meal Type *">
                          <MenuItem value=""><em>None</em></MenuItem>
                          {mealTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                          ))}
                        </Select>
                        {errors.mealTypeId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                            {errors.mealTypeId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </>
              ) : (
                <>
                  {/* Display read-only values for package, menu item, meal type in edit mode */}
                  <TextField
                    label="Package"
                    value={packages.find((p) => p.id === selectedItem?.packageId)?.name || 'N/A'}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                  <TextField
                    label="Menu Item"
                    value={menuItems.find((m) => m.id === selectedItem?.menuItemId)?.name || 'N/A'}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                  <TextField
                    label="Meal Type"
                    value={mealTypes.find((m) => m.id === selectedItem?.mealTypeId)?.name || 'N/A'}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                  />
                </>
              )}


              {/* These fields are always editable/visible */}
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Quantity *"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    onChange={(e) => field.onChange(+e.target.value)}
                    inputProps={{ min: 0 }} // Allow 0 quantity
                  />
                )}
              />

              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Price (Tk) *"
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    onChange={(e) => field.onChange(+e.target.value)}
                    inputProps={{ min: 0 }}
                  />
                )}
              />

              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Note"
                    fullWidth
                    multiline
                    minRows={2}
                    error={!!errors.note}
                    helperText={errors.note?.message}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Status *</InputLabel>
                    <Select {...field} label="Status *">
                      {STATUSES.map((item, index) => (
                        <MenuItem key={index} value={item}>{item}</MenuItem>
                      ))

                      }
                    </Select>
                    {errors.status && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.status.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleFormModalClose} disabled={loading || isSubmitting}>{t('common.cancel')}</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || isSubmitting}
              sx={{ minWidth: 100 }}
            >
              {loading || isSubmitting ? t('common.loading') : isEdit ? t('common.save') : t('common.add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Package Menu Item"
        message="Are you sure you want to delete this association? This action cannot be undone."
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        severity="error"
        loading={loading}
      />
    </Box>
  );
});

BoardingPackageMenuItemSection.displayName = 'BoardingPackageMenuItemSection';

export { BoardingPackageMenuItemSection };

// --- END OF FILE BoardingPackageMenuItemSection.tsx ---
