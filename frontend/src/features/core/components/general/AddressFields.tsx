// import { useEffect, memo } from 'react';
// import {
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
// } from '@mui/material';
// import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
// import {
//   selectNationalities,
//   selectDivisions,
//   selectDistricts,
//   selectSubDistricts,
//   selectPostOffices,
//   selectVillages,
//   fetchNationalities,
//   fetchDivisions,
//   fetchDistricts,
//   fetchSubDistricts,
//   fetchPostOffices,
//   fetchVillages,
// } from '~/features/core/store/geographySlice';
// import type { Address } from '~/features/core/types/geography';

// interface AddressFieldsProps {
//   value: Address;
//   onChange: (address: Address) => void;
//   error?: any;
// }

// /**
//  * Reusable address fields component
//  * Uses geography master data for dropdowns
//  */
// const AddressFields = memo(({ value, onChange, error }: AddressFieldsProps) => {
//   const dispatch = useAppDispatch();

//   const nationalities = useAppSelector(selectNationalities);
//   const divisions = useAppSelector(selectDivisions);
//   const districts = useAppSelector(selectDistricts);
//   const subDistricts = useAppSelector(selectSubDistricts);
//   const postOffices = useAppSelector(selectPostOffices);
//   const villages = useAppSelector(selectVillages);

//   // Fetch geography data on mount
//   useEffect(() => {
//     const fetchParams = { page: 1, limit: 1000, filters: {} };
    
//     if (nationalities.length === 0) {
//       dispatch(fetchNationalities(fetchParams));
//     }
//     if (divisions.length === 0) {
//       dispatch(fetchDivisions(fetchParams));
//     }
//     if (districts.length === 0) {
//       dispatch(fetchDistricts(fetchParams));
//     }
//     if (subDistricts.length === 0) {
//       dispatch(fetchSubDistricts(fetchParams));
//     }
//     if (postOffices.length === 0) {
//       dispatch(fetchPostOffices(fetchParams));
//     }
//     if (villages.length === 0) {
//       dispatch(fetchVillages(fetchParams));
//     }
//   }, [dispatch, nationalities.length, divisions.length, districts.length, subDistricts.length, postOffices.length, villages.length]);

//   /**
//    * Handle field change
//    */
//   const handleFieldChange = (field: keyof Address, newValue: string) => {
//     const newAddress = { ...value, [field]: newValue || undefined };
    
//     // Clear dependent fields when parent changes
//     if (field === 'nationalityId') {
//       newAddress.divisionId = undefined;
//       newAddress.districtId = undefined;
//       newAddress.subDistrictId = undefined;
//       newAddress.postOfficeId = undefined;
//       newAddress.villageId = undefined;
//     } else if (field === 'divisionId') {
//       newAddress.districtId = undefined;
//       newAddress.subDistrictId = undefined;
//       newAddress.postOfficeId = undefined;
//       newAddress.villageId = undefined;
//     } else if (field === 'districtId') {
//       newAddress.subDistrictId = undefined;
//       newAddress.postOfficeId = undefined;
//       newAddress.villageId = undefined;
//     } else if (field === 'subDistrictId') {
//       newAddress.postOfficeId = undefined;
//       newAddress.villageId = undefined;
//     } else if (field === 'postOfficeId') {
//       newAddress.villageId = undefined;
//     }
    
//     onChange(newAddress);
//   };

//   /**
//    * Get filtered options based on parent selection
//    */
//   const getFilteredDivisions = () => {
//     if (!value.nationalityId) return [];
//     return divisions.filter(div => div.nationalityId === value.nationalityId);
//   };

//   const getFilteredDistricts = () => {
//     if (!value.divisionId) return [];
//     return districts.filter(dist => dist.divisionId === value.divisionId);
//   };

//   const getFilteredSubDistricts = () => {
//     if (!value.districtId) return [];
//     return subDistricts.filter(sub => sub.districtId === value.districtId);
//   };

//   const getFilteredPostOffices = () => {
//     if (!value.subDistrictId) return [];
//     return postOffices.filter(po => po.subDistrictId === value.subDistrictId);
//   };

//   const getFilteredVillages = () => {
//     if (!value.postOfficeId) return [];
//     return villages.filter(village => village.postOfficeId === value.postOfficeId);
//   };

//   return (
//     <Grid container spacing={2}>
//       {/* Nationality */}
//       <Grid size={{xs: 12, md: 6}}>
//         <FormControl fullWidth error={!!error?.nationalityId}>
//           <InputLabel>Nationality</InputLabel>
//           <Select
//             value={value.nationalityId || ''}
//             label="Nationality"
//             onChange={(e) => handleFieldChange('nationalityId', e.target.value)}
//           >
//             <MenuItem value="">Select Nationality</MenuItem>
//             {nationalities.map((nationality) => (
//               <MenuItem key={nationality.id} value={nationality.id}>
//                 {nationality.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {error?.nationalityId && (
//             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//               {error.nationalityId.message}
//             </Typography>
//           )}
//         </FormControl>
//       </Grid>

//       {/* Division */}
//       <Grid size={{xs: 12, md: 6}}>
//         <FormControl fullWidth error={!!error?.divisionId}>
//           <InputLabel>Division</InputLabel>
//           <Select
//             value={value.divisionId || ''}
//             label="Division"
//             onChange={(e) => handleFieldChange('divisionId', e.target.value)}
//             disabled={!value.nationalityId}
//           >
//             <MenuItem value="">Select Division</MenuItem>
//             {getFilteredDivisions().map((division) => (
//               <MenuItem key={division.id} value={division.id}>
//                 {division.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {error?.divisionId && (
//             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//               {error.divisionId.message}
//             </Typography>
//           )}
//         </FormControl>
//       </Grid>

//       {/* District */}
//       <Grid size={{xs: 12, md: 6}}>
//         <FormControl fullWidth error={!!error?.districtId}>
//           <InputLabel>District</InputLabel>
//           <Select
//             value={value.districtId || ''}
//             label="District"
//             onChange={(e) => handleFieldChange('districtId', e.target.value)}
//             disabled={!value.divisionId}
//           >
//             <MenuItem value="">Select District</MenuItem>
//             {getFilteredDistricts().map((district) => (
//               <MenuItem key={district.id} value={district.id}>
//                 {district.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {error?.districtId && (
//             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//               {error.districtId.message}
//             </Typography>
//           )}
//         </FormControl>
//       </Grid>

//       {/* Sub District */}
//       <Grid size={{xs: 12, md: 6}}>
//         <FormControl fullWidth error={!!error?.subDistrictId}>
//           <InputLabel>Sub District</InputLabel>
//           <Select
//             value={value.subDistrictId || ''}
//             label="Sub District"
//             onChange={(e) => handleFieldChange('subDistrictId', e.target.value)}
//             disabled={!value.districtId}
//           >
//             <MenuItem value="">Select Sub District</MenuItem>
//             {getFilteredSubDistricts().map((subDistrict) => (
//               <MenuItem key={subDistrict.id} value={subDistrict.id}>
//                 {subDistrict.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {error?.subDistrictId && (
//             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//               {error.subDistrictId.message}
//             </Typography>
//           )}
//         </FormControl>
//       </Grid>

//       {/* Post Office */}
//       <Grid size={{xs: 12, md: 6}}>
//         <FormControl fullWidth error={!!error?.postOfficeId}>
//           <InputLabel>Post Office</InputLabel>
//           <Select
//             value={value.postOfficeId || ''}
//             label="Post Office"
//             onChange={(e) => handleFieldChange('postOfficeId', e.target.value)}
//             disabled={!value.subDistrictId}
//           >
//             <MenuItem value="">Select Post Office</MenuItem>
//             {getFilteredPostOffices().map((postOffice) => (
//               <MenuItem key={postOffice.id} value={postOffice.id}>
//                 {postOffice.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {error?.postOfficeId && (
//             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//               {error.postOfficeId.message}
//             </Typography>
//           )}
//         </FormControl>
//       </Grid>

//       {/* Village */}
//       <Grid size={{xs: 12, md: 6}}>
//         <FormControl fullWidth error={!!error?.villageId}>
//           <InputLabel>Village</InputLabel>
//           <Select
//             value={value.villageId || ''}
//             label="Village"
//             onChange={(e) => handleFieldChange('villageId', e.target.value)}
//             disabled={!value.postOfficeId}
//           >
//             <MenuItem value="">Select Village</MenuItem>
//             {getFilteredVillages().map((village) => (
//               <MenuItem key={village.id} value={village.id}>
//                 {village.name}
//               </MenuItem>
//             ))}
//           </Select>
//           {error?.villageId && (
//             <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
//               {error.villageId.message}
//             </Typography>
//           )}
//         </FormControl>
//       </Grid>
//     </Grid>
//   );
// });

// AddressFields.displayName = 'AddressFields';

// export { AddressFields };







import { useEffect, memo } from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/app/store/hooks';
import {
  selectNationalities,
  selectDivisions,
  selectDistricts,
  selectSubDistricts,
  selectPostOffices,
  selectVillages,
  fetchNationalities,
  fetchDivisions,
  fetchDistricts,
  fetchSubDistricts,
  fetchPostOffices,
  fetchVillages,
} from '~/features/core/store/geographySlice';
import type { Address } from '~/features/core/types/geography';

interface AddressFieldsProps {
  value: Address;
  onChange: (address: Address) => void;
  error?: any;
}

/**
 * Reusable address fields component
 * Uses geography master data for dropdowns
 */
const AddressFields = memo(({ value, onChange, error }: AddressFieldsProps) => {
  const dispatch = useAppDispatch();

  const nationalities = useAppSelector(selectNationalities);
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);
  const villages = useAppSelector(selectVillages);

  // Fetch geography data on mount
  useEffect(() => {
    const fetchParams = { page: 1, limit: 1000, filters: {} };
    
    if (nationalities.length === 0) {
      dispatch(fetchNationalities(fetchParams));
    }
    if (divisions.length === 0) {
      dispatch(fetchDivisions(fetchParams));
    }
    if (districts.length === 0) {
      dispatch(fetchDistricts(fetchParams));
    }
    if (subDistricts.length === 0) {
      dispatch(fetchSubDistricts(fetchParams));
    }
    if (postOffices.length === 0) {
      dispatch(fetchPostOffices(fetchParams));
    }
    if (villages.length === 0) {
      dispatch(fetchVillages(fetchParams));
    }
  }, [dispatch, nationalities.length, divisions.length, districts.length, subDistricts.length, postOffices.length, villages.length]);

  /**
   * Handle field change and clear dependent fields.
   * When a parent field changes, its children and their children should be cleared.
   * This also applies when the component initializes with a value that doesn't exist
   * in the currently loaded options, ensuring a valid default of '' for the Select.
   * (However, for initial load, the checks inside Select's value prop are more critical).
   */
  const handleFieldChange = (field: keyof Address, newValue: string) => {
    const newAddress = { ...value, [field]: newValue || undefined };
    
    // Clear dependent fields when parent changes
    if (field === 'nationalityId') {
      newAddress.divisionId = undefined;
      newAddress.districtId = undefined;
      newAddress.subDistrictId = undefined;
      newAddress.postOfficeId = undefined;
      newAddress.villageId = undefined;
    } else if (field === 'divisionId') {
      newAddress.districtId = undefined;
      newAddress.subDistrictId = undefined;
      newAddress.postOfficeId = undefined;
      newAddress.villageId = undefined;
    } else if (field === 'districtId') {
      newAddress.subDistrictId = undefined;
      newAddress.postOfficeId = undefined;
      newAddress.villageId = undefined;
    } else if (field === 'subDistrictId') {
      newAddress.postOfficeId = undefined;
      newAddress.villageId = undefined;
    } else if (field === 'postOfficeId') {
      newAddress.villageId = undefined;
    }
    
    onChange(newAddress);
  };

  /**
   * Get filtered options based on parent selection
   */
  const getFilteredDivisions = () => {
    if (!value.nationalityId) return [];
    return divisions.filter(div => div.nationalityId === value.nationalityId);
  };

  const getFilteredDistricts = () => {
    if (!value.divisionId) return [];
    return districts.filter(dist => dist.divisionId === value.divisionId);
  };

  const getFilteredSubDistricts = () => {
    if (!value.districtId) return [];
    return subDistricts.filter(sub => sub.districtId === value.districtId);
  };

  const getFilteredPostOffices = () => {
    if (!value.subDistrictId) return [];
    return postOffices.filter(po => po.subDistrictId === value.subDistrictId);
  };

  const getFilteredVillages = () => {
    if (!value.postOfficeId) return [];
    return villages.filter(village => village.postOfficeId === value.postOfficeId);
  };

  return (
    <Grid container spacing={2}>
      {/* Nationality */}
      <Grid size={{xs: 12, md: 6}}>
        <FormControl fullWidth error={!!error?.nationalityId}>
          <InputLabel>Nationality</InputLabel>
          <Select
            // নিশ্চিত করুন যে মানটি অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
            value={value.nationalityId && nationalities.some(nat => nat.id === value.nationalityId)
              ? value.nationalityId
              : ''
            }
            label="Nationality"
            onChange={(e) => handleFieldChange('nationalityId', e.target.value)}
            // ন্যাশনালিটি লোড না হলে অক্ষম করুন
            disabled={nationalities.length === 0}
          >
            <MenuItem value="">Select Nationality</MenuItem>
            {nationalities.map((nationality) => (
              <MenuItem key={nationality.id} value={nationality.id}>
                {nationality.name}
              </MenuItem>
            ))}
          </Select>
          {error?.nationalityId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {error.nationalityId.message}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Division */}
      <Grid size={{xs: 12, md: 6}}>
        <FormControl fullWidth error={!!error?.divisionId}>
          <InputLabel>Division</InputLabel>
          <Select
            // নিশ্চিত করুন যে মানটি ফিল্টার করা অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
            value={value.divisionId && getFilteredDivisions().some(div => div.id === value.divisionId)
              ? value.divisionId
              : ''
            }
            label="Division"
            onChange={(e) => handleFieldChange('divisionId', e.target.value)}
            // কোনো ন্যাশনালিটি নির্বাচন না হলে বা ফিল্টার করা ডিভিশন লোড না হলে অক্ষম করুন
            disabled={!value.nationalityId || getFilteredDivisions().length === 0}
          >
            <MenuItem value="">Select Division</MenuItem>
            {getFilteredDivisions().map((division) => (
              <MenuItem key={division.id} value={division.id}>
                {division.name}
              </MenuItem>
            ))}
          </Select>
          {error?.divisionId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {error.divisionId.message}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* District */}
      <Grid size={{xs: 12, md: 6}}>
        <FormControl fullWidth error={!!error?.districtId}>
          <InputLabel>District</InputLabel>
          <Select
            // নিশ্চিত করুন যে মানটি ফিল্টার করা অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
            value={value.districtId && getFilteredDistricts().some(dist => dist.id === value.districtId)
              ? value.districtId
              : ''
            }
            label="District"
            onChange={(e) => handleFieldChange('districtId', e.target.value)}
            // কোনো ডিভিশন নির্বাচন না হলে বা ফিল্টার করা জেলা লোড না হলে অক্ষম করুন
            disabled={!value.divisionId || getFilteredDistricts().length === 0}
          >
            <MenuItem value="">Select District</MenuItem>
            {getFilteredDistricts().map((district) => (
              <MenuItem key={district.id} value={district.id}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
          {error?.districtId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {error.districtId.message}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Sub District */}
      <Grid size={{xs: 12, md: 6}}>
        <FormControl fullWidth error={!!error?.subDistrictId}>
          <InputLabel>Sub District</InputLabel>
          <Select
            // নিশ্চিত করুন যে মানটি ফিল্টার করা অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
            value={value.subDistrictId && getFilteredSubDistricts().some(sub => sub.id === value.subDistrictId)
              ? value.subDistrictId
              : ''
            }
            label="Sub District"
            onChange={(e) => handleFieldChange('subDistrictId', e.target.value)}
            // কোনো জেলা নির্বাচন না হলে বা ফিল্টার করা উপজেলা লোড না হলে অক্ষম করুন
            disabled={!value.districtId || getFilteredSubDistricts().length === 0}
          >
            <MenuItem value="">Select Sub District</MenuItem>
            {getFilteredSubDistricts().map((subDistrict) => (
              <MenuItem key={subDistrict.id} value={subDistrict.id}>
                {subDistrict.name}
              </MenuItem>
            ))}
          </Select>
          {error?.subDistrictId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {error.subDistrictId.message}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Post Office */}
      <Grid size={{xs: 12, md: 6}}>
        <FormControl fullWidth error={!!error?.postOfficeId}>
          <InputLabel>Post Office</InputLabel>
          <Select
            // নিশ্চিত করুন যে মানটি ফিল্টার করা অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
            value={value.postOfficeId && getFilteredPostOffices().some(po => po.id === value.postOfficeId)
              ? value.postOfficeId
              : ''
            }
            label="Post Office"
            onChange={(e) => handleFieldChange('postOfficeId', e.target.value)}
            // কোনো উপজেলা নির্বাচন না হলে বা ফিল্টার করা পোস্ট অফিস লোড না হলে অক্ষম করুন
            disabled={!value.subDistrictId || getFilteredPostOffices().length === 0}
          >
            <MenuItem value="">Select Post Office</MenuItem>
            {getFilteredPostOffices().map((postOffice) => (
              <MenuItem key={postOffice.id} value={postOffice.id}>
                {postOffice.name}
              </MenuItem>
            ))}
          </Select>
          {error?.postOfficeId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {error.postOfficeId.message}
            </Typography>
          )}
        </FormControl>
      </Grid>

      {/* Village */}
      <Grid size={{xs: 12, md: 6}}>
        <FormControl fullWidth error={!!error?.villageId}>
          <InputLabel>Village</InputLabel>
          <Select
            // নিশ্চিত করুন যে মানটি ফিল্টার করা অপশনগুলির মধ্যে বিদ্যমান, অন্যথায় ডিফল্ট হিসাবে '' ব্যবহার করুন
            value={value.villageId && getFilteredVillages().some(village => village.id === value.villageId)
              ? value.villageId
              : ''
            }
            label="Village"
            onChange={(e) => handleFieldChange('villageId', e.target.value)}
            // কোনো পোস্ট অফিস নির্বাচন না হলে বা ফিল্টার করা গ্রাম লোড না হলে অক্ষম করুন
            disabled={!value.postOfficeId || getFilteredVillages().length === 0}
          >
            <MenuItem value="">Select Village</MenuItem>
            {getFilteredVillages().map((village) => (
              <MenuItem key={village.id} value={village.id}>
                {village.name}
              </MenuItem>
            ))}
          </Select>
          {error?.villageId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {error.villageId.message}
            </Typography>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
});

AddressFields.displayName = 'AddressFields';

export { AddressFields };