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
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';
import {
  Close,
  Person,
  School,
  CalendarToday,
  MonetizationOn,
  AttachFile,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '~/app/store/hooks';
import {
  selectGuardians,
} from '~/features/core/store/generalSlice';
import {
  selectAcademicYears,
  selectAcademicClasses,
  selectAcademicGroups,
  selectShifts,
  selectSections,
} from '~/features/core/store/academicSlice';
import {
  selectTeachers,
} from '~/features/education/teachers/store/teacherSlice';
import {
  selectStudents,
} from '../store/studentSlice';
import type { Admission } from '../types';
import { getStatusColor } from '~/features/boarding/core/components/utils/masterBoardingUtils';

interface AdmissionDetailsModalProps {
  open: boolean;
  onClose: () => void;
  admission?: Admission | null;
}

/**
 * Admission details modal component
 */
const AdmissionDetailsModal = memo(({ open, onClose, admission }: AdmissionDetailsModalProps) => {
  const { t } = useTranslation();

  const guardians = useAppSelector(selectGuardians);
  const teachers = useAppSelector(selectTeachers);
  const students = useAppSelector(selectStudents);
  const academicYears = useAppSelector(selectAcademicYears);
  const academicClasses = useAppSelector(selectAcademicClasses);
  const academicGroups = useAppSelector(selectAcademicGroups);
  const shifts = useAppSelector(selectShifts);
  const sections = useAppSelector(selectSections);

  if (!admission) return null;

  /**
   * Get entity name by ID
   */
  const getEntityName = (entities: any[], id: string): string => {
    const entity = entities.find(e => e.id === id);
    return entity ? entity.name : 'Not specified';
  };

  /**
   * Get student name by ID
   */
  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Student not found';
  };

  /**
   * Get guardian name by ID
   */
  const getGuardianName = (guardianId: string): string => {
    const guardian = guardians.find(g => g.id === guardianId);
    return guardian ? guardian.name : 'Guardian not found';
  };

  /**
   * Get teacher name by ID
   */
  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Teacher not found';
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Admission Details
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Admission #{admission.admissionNumber}
                    </Typography>
                    {admission.registrationNumber && (
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Registration: {admission.registrationNumber}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={admission.status}
                        color={getStatusColor(admission.status)}
                        variant="outlined"
                      />
                      <Chip
                        label={`Roll: ${admission.rollNumber}`}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary" fontWeight={600}>
                      ৳{admission.admissionFee.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Admission Fee
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Student Information */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Student Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Student Name"
                      secondary={getStudentName(admission.studentId)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Roll Number"
                      secondary={admission.rollNumber}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Admission Date"
                      secondary={new Date(admission.admissionDate).toLocaleDateString()}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Guardian/Teacher Information */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Guardian/Teacher Information
                </Typography>
                <List dense>
                  {admission.guardianId ? (
                    <ListItem>
                      <ListItemText
                        primary="Guardian"
                        secondary={getGuardianName(admission.guardianId)}
                      />
                    </ListItem>
                  ) : admission.teacherId ? (
                    <ListItem>
                      <ListItemText
                        primary="Teacher (Acting as Guardian)"
                        secondary={getTeacherName(admission.teacherId)}
                      />
                    </ListItem>
                  ) : (
                    <ListItem>
                      <ListItemText
                        primary="Guardian/Teacher"
                        secondary="Not specified"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Academic Information */}
          <Grid size={{xs: 12}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <School sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Academic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{xs: 12, md: 3}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Academic Year
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getEntityName(academicYears, admission.academicYearId)}
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 12, md: 3}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Academic Class
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getEntityName(academicClasses, admission.academicClassId)}
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 12, md: 3}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Academic Group
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {admission.academicGroupId ? getEntityName(academicGroups, admission.academicGroupId) : 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid size={{xs: 12, md: 3}}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Shift & Section
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {admission.shiftId ? getEntityName(shifts, admission.shiftId) : 'Not specified'}
                      {admission.sectionId && ` - ${getEntityName(sections, admission.sectionId)}`}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Previous School Details */}
          {admission.previousSchoolDetails && admission.previousSchoolDetails.length > 0 && (
            <Grid size={{xs: 12}}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Previous School Details
                  </Typography>
                  {admission.previousSchoolDetails.map((school, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          {school.schoolName}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="body2">
                              <strong>TC Number:</strong> {school.tcNumber}
                            </Typography>
                          </Grid>
                          {school.schoolPhone && (
                            <Grid size={{xs: 12, md: 4}}>
                              <Typography variant="body2">
                                <strong>Phone:</strong> {school.schoolPhone}
                              </Typography>
                            </Grid>
                          )}
                          {school.schoolEmail && (
                            <Grid size={{xs: 12, md: 4}}>
                              <Typography variant="body2">
                                <strong>Email:</strong> {school.schoolEmail}
                              </Typography>
                            </Grid>
                          )}
                          {school.tcFileName && (
                            <Grid size={{xs: 12}}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AttachFile fontSize="small" />
                                <Typography variant="body2" fontWeight={500}>TC File:</Typography>
                                <Chip
                                  label={school.tcFileName}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  clickable
                                  component={Link}
                                  href={school.tcFileUrl}
                                  target="_blank"
                                />
                              </Box>
                            </Grid>
                          )}
                          {school.details && (
                            <Grid size={{xs: 12}}>
                              <Typography variant="body2">
                                <strong>Details:</strong> {school.details}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Financial Information */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <MonetizationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Financial Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Admission Fee"
                      secondary={`৳${admission.admissionFee.toLocaleString()}`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Metadata */}
          <Grid size={{xs: 12, md: 6}}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Record Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Created"
                      secondary={new Date(admission.createdAt).toLocaleString()}
                    />
                  </ListItem>
                  {admission.updatedAt && (
                    <ListItem>
                      <ListItemText
                        primary="Last Updated"
                        secondary={new Date(admission.updatedAt).toLocaleString()}
                      />
                    </ListItem>
                  )}
                </List>
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

AdmissionDetailsModal.displayName = 'AdmissionDetailsModal';

export { AdmissionDetailsModal };