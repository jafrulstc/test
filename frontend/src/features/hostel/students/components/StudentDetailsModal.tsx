import { memo, useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from "@mui/material"
import {
  Close,
  Person,
  School,
  Home,
  Phone,
  Email,
  Bloodtype,
  FamilyRestroom,
  LocationOn,
  CalendarToday,
  MedicalServices,
} from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { useAppDispatch } from "~/shared/store/hooks"
import { fetchStudentById } from "~/features/hostel/students/store/studentsSlice"
import type { StudentDetail } from "~/features/hostel/students/types"

interface StudentDetailsModalProps {
  open: boolean
  onClose: () => void
  student: StudentDetail | null
  onEdit?: (student: StudentDetail) => void
  onAssignHostel?: (student: StudentDetail) => void
  onRemoveFromHostel?: (student: StudentDetail) => void
}

const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : ""
  const last = lastName ? lastName.charAt(0).toUpperCase() : ""
  return `${first}${last}`
}

const getAvatarColor = (id: string): string => {
  const colors = [
    "#1E88E5", // blue
    "#43A047", // green
    "#E53935", // red
    "#FB8C00", // orange
    "#8E24AA", // purple
    "#00ACC1", // cyan
    "#F4511E", // deep orange
    "#3949AB", // indigo
    "#00897B", // teal
    "#7CB342", // light green
  ]

  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const StudentDetailsModal = memo(
  ({ open, onClose, student, onEdit, onAssignHostel, onRemoveFromHostel }: StudentDetailsModalProps) => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const [currentStudent, setCurrentStudent] = useState<StudentDetail | null>(student)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Update current student when prop changes
    useEffect(() => {
      setCurrentStudent(student)
    }, [student])

    // Refresh student data when modal opens or refresh is triggered
    useEffect(() => {
      if (open && student?.id) {
        const refreshStudentData = async () => {
          try {
            const updatedStudent = await dispatch(fetchStudentById(student.id)).unwrap()
            setCurrentStudent(updatedStudent)
          } catch (error) {
            console.error("Failed to refresh student data:", error)
          }
        }
        refreshStudentData()
      }
    }, [open, student?.id, dispatch, refreshTrigger])

    // Function to trigger refresh (can be called after hostel operations)
    const triggerRefresh = () => {
      setRefreshTrigger((prev) => prev + 1)
    }

    // Expose refresh function to parent components
    useEffect(() => {
      if (open && student) {
        // Add a small delay to ensure any pending operations complete
        const timer = setTimeout(() => {
          triggerRefresh()
        }, 500)
        return () => clearTimeout(timer)
      }
    }, [open])

    if (!currentStudent) return null

    const hasHostelAssignment = !!currentStudent.roomId && !!currentStudent.bedId

    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString()
      } catch {
        return "Invalid date"
      }
    }

    const handleAssignHostel = () => {
      if (onAssignHostel && currentStudent) {
        onAssignHostel(currentStudent)
        // Trigger refresh after a delay to allow for state updates
        setTimeout(() => {
          triggerRefresh()
        }, 1000)
      }
    }

    const handleRemoveFromHostel = () => {
      if (onRemoveFromHostel && currentStudent) {
        onRemoveFromHostel(currentStudent)
        // Trigger refresh after a delay to allow for state updates
        setTimeout(() => {
          triggerRefresh()
        }, 1000)
      }
    }

    const handleEdit = () => {
      if (onEdit && currentStudent) {
        onEdit(currentStudent)
      }
    }

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            {/* Header with Avatar and Basic Info */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(currentStudent.id),
                        width: 80,
                        height: 80,
                        fontSize: "2rem",
                      }}
                      src={currentStudent.photoUrl}
                    >
                      {getInitials(currentStudent.firstName, currentStudent.lastName)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        {currentStudent.firstName} {currentStudent.lastName}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        Registration: {currentStudent.registrationNumber}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={hasHostelAssignment ? "Hostel Assigned" : "No Hostel"}
                          color={hasHostelAssignment ? "success" : "default"}
                          size="small"
                        />
                        {currentStudent.gender && (
                          <Chip label={currentStudent.gender} size="small" variant="outlined" />
                        )}
                        {currentStudent.bloodGroup && (
                          <Chip
                            icon={<Bloodtype fontSize="small" />}
                            label={currentStudent.bloodGroup}
                            color="error"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Personal Information */}
            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Person color="primary" />
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1">{formatDate(currentStudent.dateOfBirth)}</Typography>
                    </Box>
                  </Box>

                  {currentStudent.contactNumber && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Phone fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Contact Number
                        </Typography>
                        <Typography variant="body1">{currentStudent.contactNumber}</Typography>
                      </Box>
                    </Box>
                  )}

                  {currentStudent.email && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Email fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">{currentStudent.email}</Typography>
                      </Box>
                    </Box>
                  )}

                  {currentStudent.emergencyContact && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Phone fontSize="small" color="error" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Emergency Contact
                        </Typography>
                        <Typography variant="body1">{currentStudent.emergencyContact}</Typography>
                      </Box>
                    </Box>
                  )}

                  {currentStudent.address && (
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <LocationOn fontSize="small" color="action" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1">{currentStudent.address}</Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Academic Information */}
            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <School color="primary" />
                    Academic Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Academic Class
                    </Typography>
                    <Typography variant="body1">
                      {currentStudent.academicClass?.name} {currentStudent.academicClass?.section}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Academic Year: {currentStudent.academicClass?.academicYear}
                    </Typography>
                  </Box>

                  {currentStudent.guardian && (
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <FamilyRestroom fontSize="small" color="action" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Guardian
                        </Typography>
                        <Typography variant="body1">
                          {currentStudent.guardian.firstName} {currentStudent.guardian.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentStudent.guardian.relationship} • {currentStudent.guardian.contactNumber}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Hostel Information */}
            {hasHostelAssignment && (
              <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Home color="primary" />
                      Hostel Assignment
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                        <Typography variant="body2" color="text.secondary">
                          Room Number
                        </Typography>
                        <Typography variant="body1">{currentStudent.room?.roomNumber}</Typography>
                      </Grid>
                      <Grid sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                        <Typography variant="body2" color="text.secondary">
                          Bed Number
                        </Typography>
                        <Typography variant="body1">{currentStudent.bed?.bedNumber}</Typography>
                      </Grid>
                      <Grid sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                        <Typography variant="body2" color="text.secondary">
                          Floor
                        </Typography>
                        <Typography variant="body1">{currentStudent.room?.floor}</Typography>
                      </Grid>
                      <Grid sx={{ gridColumn: { xs: "span 6", sm: "span 3" } }}>
                        <Typography variant="body2" color="text.secondary">
                          Building
                        </Typography>
                        <Typography variant="body1">{currentStudent.room?.building}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Medical Information */}
            {currentStudent.medicalConditions && (
              <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <MedicalServices color="primary" />
                      Medical Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">{currentStudent.medicalConditions}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {onEdit && (
              <Button variant="outlined" onClick={handleEdit}>
                Edit Student
              </Button>
            )}

            {onAssignHostel && !hasHostelAssignment && (
              <Button variant="contained" onClick={handleAssignHostel}>
                Assign Hostel
              </Button>
            )}

            {onRemoveFromHostel && hasHostelAssignment && (
              <Button variant="outlined" color="warning" onClick={handleRemoveFromHostel}>
                Remove from Hostel
              </Button>
            )}

            <Button onClick={onClose}>Close</Button>
          </Box>
        </DialogActions>
      </Dialog>
    )
  },
)

StudentDetailsModal.displayName = "StudentDetailsModal"

export { StudentDetailsModal }
