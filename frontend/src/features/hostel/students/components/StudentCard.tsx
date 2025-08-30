import type React from "react"

import { memo, useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Divider,
  Avatar,
} from "@mui/material"
import {
  MoreVert,
  Edit,
  Delete,
  School,
  Person,
  Home,
  Phone,
  Email,
  Bloodtype,
  FamilyRestroom,
} from "@mui/icons-material"
import type { StudentDetail } from "~/features/hostel/students/types"

interface StudentCardProps {
  student: StudentDetail
  onEdit: (student: StudentDetail) => void
  onDelete: (student: StudentDetail) => void
  onViewDetails: (student: StudentDetail) => void
  onAssignHostel?: (student: StudentDetail) => void
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

  // Simple hash function to get consistent color based on ID
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

const StudentCard = memo(({ student, onEdit, onDelete, onViewDetails, onAssignHostel }: StudentCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit(student)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDelete(student)
    handleMenuClose()
  }

  const handleAssignHostel = () => {
    if (onAssignHostel) {
      onAssignHostel(student)
    }
    handleMenuClose()
  }

  const hasHostelAssignment = !!student.roomId && !!student.bedId

  return (
    <Card
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "visible",
      }}
      onClick={() => onViewDetails(student)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: getAvatarColor(student.id),
                width: 50,
                height: 50,
              }}
              src={student.photoUrl}
            >
              {getInitials(student.firstName, student.lastName)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight={600}>
                {student.firstName} {student.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {student.registrationNumber}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={hasHostelAssignment ? "Hostel Assigned" : "No Hostel"}
              color={hasHostelAssignment ? "success" : "default"}
              size="small"
              variant="filled"
            />
            <IconButton size="small" onClick={handleMenuOpen} sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <School sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {student.academicClass?.name} {student.academicClass?.section}
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Person sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {student.gender || "Not specified"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <FamilyRestroom sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Guardian: {student.guardian?.firstName} {student.guardian?.lastName}
              </Typography>
            </Box>
          </Grid>

          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {student.contactNumber || "No contact number"}
              </Typography>
            </Box>
          </Grid>

          {student.email && (
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {student.email}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {hasHostelAssignment && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Home sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography variant="body2" color="primary">
                Room: {student.room?.roomNumber}, Bed: {student.bed?.bedNumber}
              </Typography>
            </Box>
          </Box>
        )}

        {student.bloodGroup && (
          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<Bloodtype fontSize="small" />}
              label={`Blood Group: ${student.bloodGroup}`}
              color="error"
              variant="outlined"
              size="small"
              sx={{ fontSize: "0.75rem" }}
            />
          </Box>
        )}
      </CardContent>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Student</ListItemText>
        </MenuItem>

        {onAssignHostel && !hasHostelAssignment && (
          <MenuItem onClick={handleAssignHostel}>
            <ListItemIcon>
              <Home fontSize="small" />
            </ListItemIcon>
            <ListItemText>Assign Hostel</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Delete Student</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  )
})

StudentCard.displayName = "StudentCard"

export { StudentCard }
