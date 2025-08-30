import type React from "react"

import { memo, useState, useEffect } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from "@mui/material"
import { Close, Home, Bed, People, Edit, Delete, Add, MoreVert, Person } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import type { Room, Bed as BedType } from "~/features/hostel/rooms/types"

// Add these imports at the top
import { useAppDispatch } from "~/shared/store/hooks"
import { fetchRoomById } from "~/features/hostel/rooms/store/roomsSlice"

interface RoomDetailsModalProps {
  open: boolean
  onClose: () => void
  room: Room | null
  onEditRoom?: (room: Room) => void
  onDeleteRoom?: (room: Room) => void
  onAddBed?: (room: Room) => void
  onEditBed?: (bed: BedType) => void
  onDeleteBed?: (bed: BedType) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "success"
    case "Occupied":
      return "primary"
    case "Maintenance":
      return "warning"
    case "Reserved":
      return "info"
    default:
      return "default"
  }
}

const getBedStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "success"
    case "Occupied":
      return "error"
    case "Maintenance":
      return "warning"
    default:
      return "default"
  }
}

// Update the component to include refresh functionality
const RoomDetailsModal = memo(
  ({ open, onClose, room, onEditRoom, onDeleteRoom, onAddBed, onEditBed, onDeleteBed }: RoomDetailsModalProps) => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const [bedMenuAnchor, setBedMenuAnchor] = useState<null | HTMLElement>(null)
    const [selectedBed, setSelectedBed] = useState<BedType | null>(null)
    const [currentRoom, setCurrentRoom] = useState<Room | null>(room)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Update current room when prop changes
    useEffect(() => {
      setCurrentRoom(room)
    }, [room])

    // Refresh room data when modal opens or refresh is triggered
    useEffect(() => {
      if (open && room?.id) {
        const refreshRoomData = async () => {
          try {
            const updatedRoom = await dispatch(fetchRoomById(room.id)).unwrap()
            setCurrentRoom(updatedRoom)
          } catch (error) {
            console.error("Failed to refresh room data:", error)
          }
        }
        refreshRoomData()
      }
    }, [open, room?.id, dispatch, refreshTrigger])

    // Function to trigger refresh (can be called after bed operations)
    const triggerRefresh = () => {
      setRefreshTrigger((prev) => prev + 1)
    }

    // Expose refresh function for bed operations
    useEffect(() => {
      if (open && room) {
        // Add a small delay to ensure any pending operations complete
        const timer = setTimeout(() => {
          triggerRefresh()
        }, 500)
        return () => clearTimeout(timer)
      }
    }, [open])

    if (!currentRoom) return null

    const occupiedBeds = currentRoom.beds.filter((bed) => bed.status === "Occupied").length
    const availableBeds = currentRoom.beds.filter((bed) => bed.status === "Available").length
    const maintenanceBeds = currentRoom.beds.filter((bed) => bed.status === "Maintenance").length

    const handleBedMenuOpen = (event: React.MouseEvent<HTMLElement>, bed: BedType) => {
      event.stopPropagation()
      setSelectedBed(bed)
      setBedMenuAnchor(event.currentTarget)
    }

    const handleBedMenuClose = () => {
      setBedMenuAnchor(null)
      setSelectedBed(null)
    }

    const handleEditBed = () => {
      if (selectedBed && onEditBed) {
        onEditBed(selectedBed)
        // Trigger refresh after a delay to allow for state updates
        setTimeout(() => {
          triggerRefresh()
        }, 1000)
      }
      handleBedMenuClose()
    }

    const handleDeleteBed = () => {
      if (selectedBed && onDeleteBed) {
        onDeleteBed(selectedBed)
        // Trigger refresh after a delay to allow for state updates
        setTimeout(() => {
          triggerRefresh()
        }, 1000)
      }
      handleBedMenuClose()
    }

    const handleAddBed = () => {
      if (onAddBed && currentRoom) {
        onAddBed(currentRoom)
        // Trigger refresh after a delay to allow for state updates
        setTimeout(() => {
          triggerRefresh()
        }, 1000)
      }
    }

    // Update the bed management table section with enhanced student information
    const renderBedManagementTable = () => (
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bed Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Student Details</TableCell>
              <TableCell>Academic Info</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRoom.beds.map((bed) => (
              <TableRow key={bed.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Bed fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight={500}>
                      {bed.bedNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={bed.status} color={getBedStatusColor(bed.status) as any} size="small" />
                </TableCell>
                <TableCell>
                  {bed.student ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Person fontSize="small" color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {bed.student.firstName} {bed.student.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {bed.student.registrationNumber}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {bed.student ? (
                    <Box>
                      <Typography variant="body2">
                        Class 9 A {/* This would come from actual student data */}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Science Section
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {bed.student ? (
                    <Box>
                      <Typography variant="body2">
                        +880171111111 {/* This would come from actual student data */}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        student@email.com
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      -
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {bed.description || "-"}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleBedMenuOpen(e, bed)}
                    sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )

    // Rest of the component remains the same, but update the bed management section
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth key={currentRoom?.id}>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={600}>
              Room {currentRoom.roomNumber} Details
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Room Header Information */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 60, height: 60 }}>
                      <Home fontSize="large" />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        Room {currentRoom.roomNumber}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        {currentRoom.roomType} • {currentRoom.floor}, {currentRoom.building}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={currentRoom.status}
                          color={getStatusColor(currentRoom.status) as any}
                          size="small"
                        />
                        <Chip
                          icon={<People fontSize="small" />}
                          label={`Capacity: ${currentRoom.capacity}`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<Bed fontSize="small" />}
                          label={`${currentRoom.beds.length} beds`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {currentRoom.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      {currentRoom.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Room Statistics */}
            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <Bed sx={{ fontSize: 24, color: "success.main" }} />
                    <Typography variant="h4" color="success.main" fontWeight={600}>
                      {availableBeds}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Available Beds
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <People sx={{ fontSize: 24, color: "error.main" }} />
                    <Typography variant="h4" color="error.main" fontWeight={600}>
                      {occupiedBeds}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Occupied Beds
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 4" } }}>
              <Card variant="outlined">
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                    <Edit sx={{ fontSize: 24, color: "warning.main" }} />
                    <Typography variant="h4" color="warning.main" fontWeight={600}>
                      {maintenanceBeds}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Under Maintenance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Updated Bed Management Section */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Bed Management
                    </Typography>
                    {onAddBed && (
                      <Button variant="contained" startIcon={<Add />} onClick={handleAddBed} size="small">
                        Add Bed
                      </Button>
                    )}
                  </Box>
                  <Divider sx={{ mb: 2 }} />

                  {currentRoom.beds.length > 0 ? (
                    renderBedManagementTable()
                  ) : (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        No beds have been added to this room yet. Click "Add Bed" to get started.
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Room Information Details */}
            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Room Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Room Number
                      </Typography>
                      <Typography variant="body1">{currentRoom.roomNumber}</Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Room Type
                      </Typography>
                      <Typography variant="body1">{currentRoom.roomType}</Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Floor
                      </Typography>
                      <Typography variant="body1">{currentRoom.floor}</Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Building
                      </Typography>
                      <Typography variant="body1">{currentRoom.building}</Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Capacity
                      </Typography>
                      <Typography variant="body1">{currentRoom.capacity} students</Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip label={currentRoom.status} color={getStatusColor(currentRoom.status) as any} size="small" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Occupancy Information */}
            <Grid sx={{ gridColumn: { xs: "span 12", md: "span 6" } }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Occupancy Details
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={2}>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Beds
                      </Typography>
                      <Typography variant="body1">{currentRoom.beds.length}</Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Occupancy Rate
                      </Typography>
                      <Typography variant="body1">
                        {currentRoom.beds.length > 0 ? Math.round((occupiedBeds / currentRoom.beds.length) * 100) : 0}%
                      </Typography>
                    </Grid>
                    <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body1">{new Date(currentRoom.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                    {currentRoom.updatedAt && (
                      <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                        <Typography variant="body2" color="text.secondary">
                          Last Updated
                        </Typography>
                        <Typography variant="body1">{new Date(currentRoom.updatedAt).toLocaleDateString()}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {onEditRoom && (
              <Button variant="outlined" onClick={() => onEditRoom(currentRoom)}>
                Edit Room
              </Button>
            )}

            {onDeleteRoom && (
              <Button variant="outlined" color="error" onClick={() => onDeleteRoom(currentRoom)}>
                Delete Room
              </Button>
            )}

            <Button onClick={onClose}>Close</Button>
          </Box>
        </DialogActions>

        {/* Bed Actions Menu */}
        <Menu anchorEl={bedMenuAnchor} open={Boolean(bedMenuAnchor)} onClose={handleBedMenuClose}>
          <MenuItem onClick={handleEditBed}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Bed</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteBed} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>Delete Bed</ListItemText>
          </MenuItem>
        </Menu>
      </Dialog>
    )
  },
)

RoomDetailsModal.displayName = "RoomDetailsModal"

export { RoomDetailsModal }
