import { useState, useEffect, memo } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material"
import { Close, Home } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { useAppDispatch, useAppSelector } from "~/shared/store/hooks"
import { fetchRooms, selectRooms, selectRoomsLoading } from "~/features/hostel/rooms/store/roomsSlice"
import { assignHostelSchema, type AssignHostelFormData } from "~/features/hostel/students/schemas"
import type { StudentDetail } from "~/features/hostel/students/types"
import type { Room } from "~/features/hostel/rooms/types"

interface AssignHostelModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AssignHostelFormData) => void
  student: StudentDetail | null
  loading?: boolean
}

const AssignHostelModal = memo(({ open, onClose, onSubmit, student, loading = false }: AssignHostelModalProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const rooms = useAppSelector(selectRooms)
  const roomsLoading = useAppSelector(selectRoomsLoading)

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [availableBeds, setAvailableBeds] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AssignHostelFormData>({
    resolver: zodResolver(assignHostelSchema),
    defaultValues: {
      roomId: "",
      bedId: "",
    },
  })

  const watchedRoomId = watch("roomId")

  // Fetch rooms when modal opens
  useEffect(() => {
    if (open) {
      dispatch(fetchRooms({ page: 1, limit: 100, filters: {} }))
    }
  }, [dispatch, open])

  // Update available beds when room selection changes
  useEffect(() => {
    if (watchedRoomId) {
      const room = rooms.find((r) => r.id === watchedRoomId)
      if (room) {
        setSelectedRoom(room)
        const available = room.beds.filter((bed) => bed.status === "Available")
        setAvailableBeds(available)
        // Reset bed selection when room changes
        setValue("bedId", "")
      }
    } else {
      setSelectedRoom(null)
      setAvailableBeds([])
    }
  }, [watchedRoomId, rooms, setValue])

  const handleClose = () => {
    reset()
    setSelectedRoom(null)
    setAvailableBeds([])
    onClose()
  }

  const handleFormSubmit = (data: AssignHostelFormData) => {
    onSubmit(data)
    handleClose()
  }

  // Filter rooms that have available beds
  const availableRooms = rooms.filter((room) => room.beds.some((bed) => bed.status === "Available"))

  if (!student) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>
            Assign Hostel to {student.firstName} {student.lastName}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          {roomsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Student Information */}
              <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Student Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                        <Typography variant="body2" color="text.secondary">
                          Registration Number
                        </Typography>
                        <Typography variant="body1">{student.registrationNumber}</Typography>
                      </Grid>
                      <Grid sx={{ gridColumn: { xs: "span 6" } }}>
                        <Typography variant="body2" color="text.secondary">
                          Academic Class
                        </Typography>
                        <Typography variant="body1">
                          {student.academicClass?.name} {student.academicClass?.section}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Room Selection */}
              <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                <Controller
                  name="roomId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.roomId}>
                      <InputLabel>Select Room</InputLabel>
                      <Select {...field} label="Select Room">
                        <MenuItem value="">Choose a room</MenuItem>
                        {availableRooms.map((room) => {
                          const availableBedsCount = room.beds.filter((bed) => bed.status === "Available").length
                          const occupiedBedsCount = room.beds.filter((bed) => bed.status === "Occupied").length

                          return (
                            <MenuItem key={room.id} value={room.id}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <Box>
                                  <Typography variant="body1">
                                    Room {room.roomNumber} - {room.roomType}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {room.floor}, {room.building}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <Chip
                                    size="small"
                                    label={`${availableBedsCount} available`}
                                    color="success"
                                    variant="outlined"
                                  />
                                  <Chip
                                    size="small"
                                    label={`${occupiedBedsCount}/${room.capacity} occupied`}
                                    color="info"
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            </MenuItem>
                          )
                        })}
                      </Select>
                      {errors.roomId && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                          {errors.roomId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Room Details */}
              {selectedRoom && (
                <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Home color="primary" />
                        <Typography variant="h6">Room {selectedRoom.roomNumber} Details</Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid sx={{ gridColumn: { xs: "span 4" } }}>
                          <Typography variant="body2" color="text.secondary">
                            Type
                          </Typography>
                          <Typography variant="body1">{selectedRoom.roomType}</Typography>
                        </Grid>
                        <Grid sx={{ gridColumn: { xs: "span 4" } }}>
                          <Typography variant="body2" color="text.secondary">
                            Capacity
                          </Typography>
                          <Typography variant="body1">{selectedRoom.capacity} students</Typography>
                        </Grid>
                        <Grid sx={{ gridColumn: { xs: "span 4" } }}>
                          <Typography variant="body2" color="text.secondary">
                            Available Beds
                          </Typography>
                          <Typography variant="body1">{availableBeds.length} beds</Typography>
                        </Grid>
                      </Grid>
                      {selectedRoom.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {selectedRoom.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Bed Selection */}
              {availableBeds.length > 0 && (
                <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                  <Controller
                    name="bedId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.bedId}>
                        <InputLabel>Select Bed</InputLabel>
                        <Select {...field} label="Select Bed">
                          <MenuItem value="">Choose a bed</MenuItem>
                          {availableBeds.map((bed) => (
                            <MenuItem key={bed.id} value={bed.id}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {/* Bed icon is removed here */}
                                <Typography variant="body1">Bed {bed.bedNumber}</Typography>
                                {bed.description && (
                                  <Typography variant="body2" color="text.secondary">
                                    - {bed.description}
                                  </Typography>
                                )}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.bedId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                            {errors.bedId.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* No available beds warning */}
              {selectedRoom && availableBeds.length === 0 && (
                <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                  <Alert severity="warning">
                    <Typography variant="body2">
                      No available beds in this room. All beds are currently occupied or under maintenance.
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {/* No available rooms warning */}
              {availableRooms.length === 0 && !roomsLoading && (
                <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      No rooms with available beds found. Please check room availability or add more rooms.
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !watchedRoomId || availableBeds.length === 0}
            sx={{ minWidth: 120 }}
          >
            {loading ? t("common.loading") : "Assign Hostel"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})

AssignHostelModal.displayName = "AssignHostelModal"

export { AssignHostelModal }
