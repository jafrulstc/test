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
} from '@mui/material';
import {
  Close,
  Person,
  Email,
  Phone,
  LocationOn,
  School,
  Work,
  ContactPhone,
  MonetizationOn,
  CalendarToday,
  Computer,
} from '@mui/icons-material';
import { useAppSelector } from '~/app/store/hooks';
import {
  selectGenders,
  selectBloodGroups,
  selectMaritalStatuses,
} from '~/features/core/store/generalSlice';
import {
  selectNationalities,
  selectDivisions,
  selectDistricts,
  selectSubDistricts,
  selectPostOffices,
  selectVillages,
} from '~/features/core/store/geographySlice';
import {
  selectSubjects,
  selectGradeLevels,
  selectLanguageProficiencies,
} from '~/features/core/store/academicSlice';
import { formatPhoneNumber } from '~/shared/utils/formatters';
import type { StaffDetail } from '~/features/education/staff/types/staffType';

interface StaffDetailsModalProps {
  open: boolean;
  onClose: () => void;
  staff?: StaffDetail | null;
}

const StaffDetailsModal = memo(({ open, onClose, staff }: StaffDetailsModalProps) => {
  // master lists
  const genders = useAppSelector(selectGenders);
  const bloodGroups = useAppSelector(selectBloodGroups);
  const nationalities = useAppSelector(selectNationalities);
  const maritalStatuses = useAppSelector(selectMaritalStatuses);

  const subjects = useAppSelector(selectSubjects);
  const gradeLevels = useAppSelector(selectGradeLevels);
  const languageProficiencies = useAppSelector(selectLanguageProficiencies);

  // geography lists
  const divisions = useAppSelector(selectDivisions);
  const districts = useAppSelector(selectDistricts);
  const subDistricts = useAppSelector(selectSubDistricts);
  const postOffices = useAppSelector(selectPostOffices);
  const villages = useAppSelector(selectVillages);

  if (!staff) return null;

  const p = staff.person ?? null;
  const pAny = p as any; // optional/legacy fields safeguard

  /** helpers */
  const getEntityName = (entities: Array<{ id: string; name: string }>, id?: string | null): string => {
    if (!id) return 'Not specified';
    const e = entities.find(x => x.id === id);
    return e ? e.name : 'Not specified';
  };

  const getEntityNames = (entities: Array<{ id: string; name: string }>, ids?: string[] | null): string[] => {
    if (!ids || ids.length === 0) return [];
    return ids.map(id => getEntityName(entities, id));
  };

  const getAddressString = (address?: {
    villageId?: string;
    postOfficeId?: string;
    subDistrictId?: string;
    districtId?: string;
    divisionId?: string;
    nationalityId?: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
  } | null): string => {
    if (!address) return 'Not specified';
    const parts: string[] = [];
    if (address.addressLine1) parts.push(address.addressLine1);
    if (address.addressLine2) parts.push(address.addressLine2);
    if (address.villageId) parts.push(getEntityName(villages, address.villageId));
    if (address.postOfficeId) parts.push(getEntityName(postOffices, address.postOfficeId));
    if (address.subDistrictId) parts.push(getEntityName(subDistricts, address.subDistrictId));
    if (address.districtId) parts.push(getEntityName(districts, address.districtId));
    if (address.divisionId) parts.push(getEntityName(divisions, address.divisionId));
    if (address.postalCode) parts.push(address.postalCode);
    if (address.nationalityId) parts.push(getEntityName(nationalities, address.nationalityId));
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
  };

  const getStatusColor = (status?: string): 'success' | 'warning' | 'error' | 'default' => {
    switch ((status || '').toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'warning';
      case 'PENDING': return 'error';
      case 'ARCHIVE': return 'warning';
      default: return 'default';
    }
  };

  const fullName =
    `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim() || 'Unknown';

  const email = p?.email ?? '';
  const phone = p?.phone ? formatPhoneNumber(String(p.phone)) : '';

  const photo = p?.photo || undefined;

  const dob = p?.dateOfBirth ?? null;
  const placeOfBirth = pAny?.placeOfBirth ?? ''; // optional/legacy

  const fatherName = p?.fatherName ?? '';
  const motherName = p?.motherName ?? '';
  const nidNumber = pAny?.nidNumber ?? ''; // optional/legacy
  const birthRegNumber = pAny?.birthRegNumber ?? ''; // optional/legacy
  const emergencyContact = (pAny?.emergencyContact ?? pAny?.emergencyCont) ?? '';

  const genderId = p?.genderId ?? '';
  const bloodGroupId = p?.bloodGroupId ?? '';
  const nationalityId = p?.nationalityId ?? '';
  const maritalStatusId = p?.maritalStatusId ?? '';

  const presentAddress = p?.presentAddress ?? null;
  const permanentAddress = p?.permanentAddress ?? null;
  const sameAsPresent = p?.sameAsPresent === true;

  const yearsOfExperience = staff.yearsOfExperience ?? 0;

  const qualifs = staff.educationalQualifications ?? [];
  const experiences = staff.professionalExperience ?? [];
  const refs = staff.references ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Staff Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar src={photo} sx={{ width: 100, height: 100 }}>
                    <Person sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {fullName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={staff.status}
                        color={getStatusColor(staff.status)}
                        variant="outlined"
                      />
                      <Chip
                        label={`${yearsOfExperience} years experience`}
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      {email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{email}</Typography>
                        </Box>
                      )}
                      {phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">{phone}</Typography>
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
                      secondary={dob ? new Date(dob).toLocaleDateString() : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Place of Birth" secondary={placeOfBirth || 'Not specified'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Father's Name" secondary={fatherName || 'Not specified'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Mother's Name" secondary={motherName || 'Not specified'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="National ID" secondary={nidNumber || 'Not specified'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Birth Certificate Number" secondary={birthRegNumber || 'Not specified'} />
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
                    <ListItemText primary="Gender" secondary={getEntityName(genders, genderId)} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Blood Group"
                      secondary={bloodGroupId ? getEntityName(bloodGroups, bloodGroupId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Nationality"
                      secondary={nationalityId ? getEntityName(nationalities, nationalityId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Marital Status"
                      secondary={maritalStatusId ? getEntityName(maritalStatuses, maritalStatusId) : 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emergency Contact"
                      secondary={emergencyContact ? formatPhoneNumber(String(emergencyContact)) : 'Not specified'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Address */}
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
                      {getAddressString(presentAddress)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Permanent Address
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sameAsPresent ? 'Same as present address' : getAddressString(permanentAddress)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Educational Qualifications */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Educational Qualifications
                </Typography>
                {qualifs.length > 0 ? (
                  <Grid container spacing={2}>
                    {qualifs.map((q, idx) => (
                      <Grid size={{ xs: 12, md: 6 }} key={idx}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {q.degreeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {q.institution}
                            </Typography>
                            <Typography variant="body2">
                              Year: {q.year} {q.grade ? `| Grade: ${q.grade}` : ''}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No educational qualifications specified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Professional Experience */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Work sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Professional Experience
                </Typography>
                {experiences.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {experiences.map((exp, idx) => (
                      <Card key={idx} variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {exp.jobTitle} {exp.companyName ? `at ${exp.companyName}` : ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {exp.startDate || '--'} - {exp.endDate || 'Present'}
                          </Typography>
                          {exp.responsibilities && (
                            <Typography variant="body2" gutterBottom>
                              <strong>Responsibilities:</strong> {exp.responsibilities}
                            </Typography>
                          )}
                          {exp.achievements && (
                            <Typography variant="body2">
                              <strong>Achievements:</strong> {exp.achievements}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No professional experience specified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* References */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <ContactPhone sx={{ mr: 1, verticalAlign: 'middle' }} />
                  References
                </Typography>
                {refs.length > 0 ? (
                  <Grid container spacing={2}>
                    {refs.map((ref, idx) => (
                      <Grid size={{ xs: 12, md: 6 }} key={idx}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {ref.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {ref.relationship}
                            </Typography>
                            {ref.contactNumber && (
                              <Typography variant="body2">
                                {formatPhoneNumber(String(ref.contactNumber))}
                              </Typography>
                            )}
                            {ref.email && (
                              <Typography variant="body2">{ref.email}</Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No references specified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Teaching Specialization */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Teaching Specialization
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Subjects
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(subjects, staff.subjectIds).map((name, i) => (
                        <Chip key={i} label={name} size="small" variant="outlined" color="primary" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Grade Levels
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(gradeLevels, staff.gradeLevelIds).map((name, i) => (
                        <Chip key={i} label={name} size="small" variant="outlined" color="secondary" />
                      ))}
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Language Proficiencies
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {getEntityNames(languageProficiencies, staff.languageProficiencyIds).map((name, i) => (
                        <Chip key={i} label={name} size="small" variant="outlined" color="info" />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Employment Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <MonetizationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Employment Details
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Salary Expectation"
                      secondary={
                        staff.salaryExpectation != null
                          ? `৳${Number(staff.salaryExpectation).toLocaleString()}`
                          : 'Not specified'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Joining Date"
                      secondary={
                        staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : 'Not specified'
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Years of Experience" secondary={`${yearsOfExperience} years`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Notice Period" secondary={staff.noticePeriod || 'Not specified'} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Skills & Competencies */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Computer sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Skills & Competencies
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Computer Skills" secondary={staff.computerSkills || 'Not specified'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Teaching Methodology"
                      secondary={staff.teachingMethodology || 'Not specified'}
                    />
                  </ListItem>
                  {staff.onlineProfiles?.linkedin && (
                    <ListItem>
                      <ListItemText primary="LinkedIn" secondary={staff.onlineProfiles.linkedin} />
                    </ListItem>
                  )}
                  {staff.onlineProfiles?.personalWebsite && (
                    <ListItem>
                      <ListItemText primary="Personal Website" secondary={staff.onlineProfiles.personalWebsite} />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Details */}
          {staff.details && (
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Additional Details
                  </Typography>
                  <Typography variant="body2">{staff.details}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

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
                      <strong>Created:</strong>{' '}
                      {staff.createdAt ? new Date(staff.createdAt).toLocaleString() : '—'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2">
                      <strong>Last Updated:</strong>{' '}
                      {staff.updatedAt ? new Date(staff.updatedAt).toLocaleString() : '—'}
                    </Typography>
                  </Grid>
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

StaffDetailsModal.displayName = 'StaffDetailsModal';
export { StaffDetailsModal };
