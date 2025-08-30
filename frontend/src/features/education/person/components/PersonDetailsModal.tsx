// features/person/components/PersonDetailsModal.tsx
import { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import {
  Close,
  Person as PersonIcon,
  Email,
  LocationOn,
  CalendarToday,
  AttachFile,
  Badge,
  Work,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '~/app/store/hooks';

// General lookups
import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
  selectDesignations,
  selectDesignationCategories,
  selectPersonCategories,
  selectMaritalStatuses,
} from '~/features/core/store/generalSlice';

// Geography lookups
import {
  selectNationalities,
  selectDivisions,
  selectDistricts,
  selectSubDistricts,
  selectPostOffices,
  selectVillages,
} from '~/features/core/store/geographySlice';

// Person Category lookups (✅ path adjust করুন আপনার প্রজেক্ট অনুযায়ী)

import type { Person } from '~/features/education/person/types/personType';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';

interface PersonDetailsModalProps {
  open: boolean;
  onClose: () => void;
  person?: Person | null;
}

/**
 * Person details modal component
 */
const PersonDetailsModal = memo(({ open, onClose, person }: PersonDetailsModalProps) => {
  const { t } = useTranslation();

  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const maritalStatus = useAppSelector(selectMaritalStatuses);
  const nationalities = useAppSelector(selectNationalities);
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);
  const villages = useAppSelector(selectVillages);

  const personCategories = useAppSelector(selectPersonCategories);
  const designationCategories = useAppSelector(selectDesignationCategories);
  const designations = useAppSelector(selectDesignations);

  if (!person) return null;

  /** Get entity name by ID */
  const getEntityName = (entities: any[], id?: string): string => {
    if (!id) return 'Not specified';
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Not specified';
  };

  /** Get address string from address object */
  const getAddressString = (address: any): string => {
    if (!address) return 'Not specified';

    const parts: string[] = [];
    if (address.villageId) parts.push(getEntityName(villages, address.villageId));
    if (address.postOfficeId) parts.push(getEntityName(postOffices, address.postOfficeId));
    if (address.subDistrictId) parts.push(getEntityName(subDistricts, address.subDistrictId));
    if (address.districtId) parts.push(getEntityName(districts, address.districtId));
    if (address.divisionId) parts.push(getEntityName(divisions, address.divisionId));
    if (address.nationalityId) parts.push(getEntityName(nationalities, address.nationalityId));

    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  /** Calculate age from date of birth */
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const personCategoryName = getEntityName(personCategories, person.personCategoryId);
  const isStaff =
    (personCategoryName || '').toLowerCase() === 'staff';

  const designationCategoryName = getEntityName(designationCategories, person.designationCategoryId);
  const designationName = getEntityName(designations, person.designationId);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Person Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={person.photo || undefined}
                    sx={{ width: 100, height: 100 }}
                  >
                    <PersonIcon sx={{ fontSize: 50 }} />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {person.firstName} {person.lastName}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={person.status}
                        color={getStatusColor(person.status)}
                        variant="outlined"
                      />
                      <Chip
                        icon={<Badge />}
                        label={personCategoryName}
                        variant="outlined"
                      />
                      <Chip
                        label={`Age: ${calculateAge(person.dateOfBirth)} years`}
                        variant="outlined"
                      />
                      {isStaff && person.designationId && (
                        <Chip
                          icon={<Work />}
                          label={designationName}
                          variant="outlined"
                          color="primary"
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {person.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{person.email}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Personal Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={new Date(person.dateOfBirth).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Father's Name"
                      secondary={person.fatherName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Mother's Name"
                      secondary={person.motherName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="NID Number"
                      secondary={person.nidNumber || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Birth Registration Number"
                      secondary={person.brnNumber || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Father NID Number"
                      secondary={person.fatherNidNumber || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Mother BRN Number"
                      secondary={person.motherBrnNumber || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Health Condition"
                      secondary={person.healthCondition || 'No specific conditions'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Demographics */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Demographics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Gender"
                      secondary={getEntityName(genders, person.genderId)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Blood Group"
                      secondary={person.bloodGroupId ? getEntityName(bloodGroups, person.bloodGroupId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Religion"
                      secondary={person.religionId ? getEntityName(religions, person.religionId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nationality"
                      secondary={person.nationalityId ? getEntityName(nationalities, person.nationalityId) : 'Not specified'}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Marital Status"
                      secondary={person.maritalStatusId ? getEntityName(maritalStatus, person.maritalStatusId) : 'Not specified'}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary="Person Category"
                      secondary={personCategoryName}
                    />
                  </ListItem>

                  {isStaff && (
                    <>
                      <ListItem>
                        <ListItemText
                          primary="Designation Category"
                          secondary={person.designationCategoryId ? designationCategoryName : 'Not specified'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Designation"
                          secondary={person.designationId ? designationName : 'Not specified'}
                        />
                      </ListItem>
                    </>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Address Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Present Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getAddressString(person.presentAddress)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Permanent Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {person.sameAsPresent
                        ? 'Same as present address'
                        : getAddressString(person.permanentAddress)
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Document Files */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <AttachFile sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Document Files
                </Typography>

                <Grid container spacing={2}>
                  {person.necessary?.nidFileName && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>NID:</Typography>
                        <Chip
                          label={person.necessary.nidFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={person.nidFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}

                  {person.necessary?.brnFileName && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Birth Registration:</Typography>
                        <Chip
                          label={person.necessary.brnFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={person.brnFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}

                  {person.necessary?.fatherNidFileName && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Father's NID:</Typography>
                        <Chip
                          label={person.necessary.fatherNidFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={person.fatherNidFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}

                  {person.necessary?.motherNidFileName && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Mother's NID:</Typography>
                        <Chip
                          label={person.necessary.motherNidFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={person.motherNidFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}

                  {person.necessary?.digitalSignatureFileName && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Digital Signature:</Typography>
                        <Chip
                          label={person.necessary.digitalSignatureFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={person.digitalSignatureFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {!person.necessary?.nidFileName &&
                  !person.necessary?.brnFileName &&
                  !person.necessary?.fatherNidFileName &&
                  !person.necessary?.motherNidFileName &&
                  !person.necessary?.digitalSignatureFileName && (
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded
                    </Typography>
                  )}
              </CardContent>
            </Card>
          </Grid>

          {/* Metadata */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Record Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(person.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  {person.updatedAt && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> {new Date(person.updatedAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

PersonDetailsModal.displayName = 'PersonDetailsModal';

export { PersonDetailsModal };
