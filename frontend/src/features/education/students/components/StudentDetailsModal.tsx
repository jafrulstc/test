import React, { memo } from 'react';
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
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  AttachFile,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '~/app/store/hooks';
import {
  selectGenders,
  selectBloodGroups,
  selectReligions,
} from '~/features/core/store/generalSlice';
import {
  selectNationalities,
  selectDivisions,
  selectDistricts,
  selectSubDistricts,
  selectPostOffices,
  selectVillages,
} from '~/features/core/store/geographySlice';
import { formatPhoneNumber } from '~/shared/utils/formatters';
import { STUDENT_STATUS_TYPES, STUDENT_STATUS_COLOR_MAP } from '~/features/education/const/studentConst';
import type { Student } from '../types';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';

interface StudentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
}

/**
 * Student details modal component
 */
const StudentDetailsModal = memo(({ open, onClose, student }: StudentDetailsModalProps) => {
  const { t } = useTranslation();

  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const religions = useAppSelector(selectReligions);
  const nationalities = useAppSelector(selectNationalities);
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);
  const villages = useAppSelector(selectVillages);

  if (!student) return null;

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Not specified';
  };

  /**
   * Get address string from address object
   */
  const getAddressString = (address: any): string => {
    if (!address) return 'Not specified';

    const parts = [];
    if (address.villageId) parts.push(getEntityName(villages, address.villageId));
    if (address.postOfficeId) parts.push(getEntityName(postOffices, address.postOfficeId));
    if (address.subDistrictId) parts.push(getEntityName(subDistricts, address.subDistrictId));
    if (address.districtId) parts.push(getEntityName(districts, address.districtId));
    if (address.divisionId) parts.push(getEntityName(divisions, address.divisionId));
    if (address.nationalityId) parts.push(getEntityName(nationalities, address.nationalityId));

    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  /**
   * Calculate age from date of birth
   */
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Student Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={student.studentPhoto}
                    sx={{ width: 100, height: 100 }}
                  >
                    <Person sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {student.firstName} {student.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={student.status}
                        color={getStatusColor(student.status)}
                        variant="outlined"
                      />
                      <Chip
                        label={`Age: ${calculateAge(student.dateOfBirth)} years`}
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {student.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{student.email}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Personal Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Date of Birth"
                      secondary={new Date(student.dateOfBirth).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Father's Name"
                      secondary={student.fatherName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Mother's Name"
                      secondary={student.motherName}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="NID Number"
                      secondary={student.nidNumber || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Birth Registration Number"
                      secondary={student.brnNumber || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Health Condition"
                      secondary={student.healthCondition || 'No specific conditions'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Demographics */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Demographics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Gender"
                      secondary={getEntityName(genders, student.genderId)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Blood Group"
                      secondary={student.bloodGroupId ? getEntityName(bloodGroups, student.bloodGroupId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Religion"
                      secondary={student.religionId ? getEntityName(religions, student.religionId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nationality"
                      secondary={student.nationalityId ? getEntityName(nationalities, student.nationalityId) : 'Not specified'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Address Information */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Address Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Present Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getAddressString(student.presentAddress)}
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Permanent Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {student.sameAsPresent 
                        ? 'Same as present address'
                        : getAddressString(student.permanentAddress)
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Document Files */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <AttachFile sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Document Files
                </Typography>
                <Grid container spacing={2}>
                  {student.studentNidFileName && (
                    <Grid size={{xs: 12, md: 6}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Student NID:</Typography>
                        <Chip
                          label={student.studentNidFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={student.studentNidFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}
                  {student.studentBrnFileName && (
                    <Grid size={{xs: 12, md: 6}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Birth Registration:</Typography>
                        <Chip
                          label={student.studentBrnFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={student.studentBrnFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}
                  {student.fatherNidFileName && (
                    <Grid size={{xs: 12, md: 6}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Father's NID:</Typography>
                        <Chip
                          label={student.fatherNidFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={student.fatherNidFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}
                  {student.motherNidFileName && (
                    <Grid size={{xs: 12, md: 6}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Mother's NID:</Typography>
                        <Chip
                          label={student.motherNidFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={student.motherNidFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}
                  {student.digitalSignatureFileName && (
                    <Grid size={{xs: 12, md: 6}}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>Digital Signature:</Typography>
                        <Chip
                          label={student.digitalSignatureFileName}
                          size="small"
                          variant="outlined"
                          color="primary"
                          clickable
                          component={Link}
                          href={student.digitalSignatureFile}
                          target="_blank"
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
                {!student.studentNidFileName && !student.studentBrnFileName && !student.fatherNidFileName && !student.motherNidFileName && !student.digitalSignatureFileName && (
                  <Typography variant="body2" color="text.secondary">
                    No documents uploaded
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Metadata */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Record Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="body2">
                      <strong>Created:</strong> {new Date(student.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  {student.updatedAt && (
                    <Grid size={{xs: 12, md: 6}}>
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> {new Date(student.updatedAt).toLocaleString()}
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

StudentDetailsModal.displayName = 'StudentDetailsModal';

export { StudentDetailsModal };