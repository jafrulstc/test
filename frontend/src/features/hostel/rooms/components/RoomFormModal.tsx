import { useEffect, memo, useRef } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
} from "@mui/material"
import { Close } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import {
  createRoomSchema,
  updateRoomSchema,
  type CreateRoomFormData,
  type UpdateRoomFormData,
} from "~/features/hostel/rooms/schemas"
import type { Room } from "~/features/hostel/rooms/types"

interface RoomFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateRoomFormData | UpdateRoomFormData) => void
  room?: Room | null
  loading?: boolean
}

const roomTypeOptions = ["Standard", "Premium", "Deluxe", "Suite"]
const floorOptions = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"]
const buildingOptions = ["Main Building", "North Wing", "South Wing", "East Block", "West Block"]
const statusOptions = ["Available", "Occupied", "Maintenance", "Reserved"]

// Create Form Component
const CreateRoomForm = memo(
  ({
    onSubmit,
    onClose,
    loading,
  }: {
    onSubmit: (data: CreateRoomFormData) => void
    onClose: () => void
    loading: boolean
  }) => {
    const { t } = useTranslation()
    const firstFieldRef = useRef<HTMLInputElement>(null)

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<CreateRoomFormData>({
      resolver: zodResolver(createRoomSchema),
      defaultValues: {
        roomNumber: "",
        floor: "",
        building: "",
        capacity: 1,
        roomType: "",
        description: "",
      },
    })

    // Focus first field when form opens
    useEffect(() => {
      if (firstFieldRef.current) {
        const timer = setTimeout(() => {
          firstFieldRef.current?.focus()
        }, 100)
        return () => clearTimeout(timer)
      }
    }, [])

    const handleClose = () => {
      reset()
      onClose()
    }

    const handleFormSubmit = async (data: CreateRoomFormData) => {
      await onSubmit(data)
      reset()
    }

    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="roomNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={firstFieldRef}
                    fullWidth
                    label={t("rooms.roomNumber")}
                    error={!!errors.roomNumber}
                    helperText={errors.roomNumber?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("rooms.capacity")}
                    type="number"
                    inputProps={{ min: 1, max: 20 }}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="floor"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.floor}>
                    <InputLabel>{t("rooms.floor")}</InputLabel>
                    <Select {...field} label={t("rooms.floor")}>
                      {floorOptions.map((floor) => (
                        <MenuItem key={floor} value={floor}>
                          {floor}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.floor && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.floor.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="building"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.building}>
                    <InputLabel>{t("rooms.building")}</InputLabel>
                    <Select {...field} label={t("rooms.building")}>
                      {buildingOptions.map((building) => (
                        <MenuItem key={building} value={building}>
                          {building}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.building && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.building.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="roomType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.roomType}>
                    <InputLabel>{t("rooms.roomType")}</InputLabel>
                    <Select {...field} label={t("rooms.roomType")}>
                      {roomTypeOptions.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.roomType && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.roomType.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("rooms.description")}
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 100 }}>
            {loading ? t("common.loading") : t("common.save")}
          </Button>
        </DialogActions>
      </form>
    )
  },
)

CreateRoomForm.displayName = "CreateRoomForm"

// Update Form Component
const UpdateRoomForm = memo(
  ({
    room,
    onSubmit,
    onClose,
    loading,
  }: {
    room: Room
    onSubmit: (data: UpdateRoomFormData) => void
    onClose: () => void
    loading: boolean
  }) => {
    const { t } = useTranslation()
    const firstFieldRef = useRef<HTMLInputElement>(null)

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<UpdateRoomFormData>({
      resolver: zodResolver(updateRoomSchema),
      defaultValues: {
        floor: room.floor,
        building: room.building,
        capacity: room.capacity,
        roomType: room.roomType,
        status: room.status,
        description: room.description || "",
      },
    })

    useEffect(() => {
      reset({
        floor: room.floor,
        building: room.building,
        capacity: room.capacity,
        roomType: room.roomType,
        status: room.status,
        description: room.description || "",
      })
    }, [room, reset])

    // Focus first field when form opens
    useEffect(() => {
      if (firstFieldRef.current) {
        const timer = setTimeout(() => {
          firstFieldRef.current?.focus()
        }, 100)
        return () => clearTimeout(timer)
      }
    }, [])

    const handleClose = () => {
      reset()
      onClose()
    }

    const handleFormSubmit = async (data: UpdateRoomFormData) => {
      await onSubmit(data)
    }

    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Display room number as read-only */}
            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <TextField fullWidth label={t("rooms.roomNumber")} value={room.roomNumber} disabled variant="filled" />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="capacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={firstFieldRef}
                    fullWidth
                    label={t("rooms.capacity")}
                    type="number"
                    inputProps={{ min: 1, max: 20 }}
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    autoFocus
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="floor"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.floor}>
                    <InputLabel>{t("rooms.floor")}</InputLabel>
                    <Select {...field} label={t("rooms.floor")}>
                      {floorOptions.map((floor) => (
                        <MenuItem key={floor} value={floor}>
                          {floor}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.floor && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.floor.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="building"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.building}>
                    <InputLabel>{t("rooms.building")}</InputLabel>
                    <Select {...field} label={t("rooms.building")}>
                      {buildingOptions.map((building) => (
                        <MenuItem key={building} value={building}>
                          {building}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.building && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.building.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="roomType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.roomType}>
                    <InputLabel>{t("rooms.roomType")}</InputLabel>
                    <Select {...field} label={t("rooms.roomType")}>
                      {roomTypeOptions.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.roomType && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.roomType.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>{t("rooms.status")}</InputLabel>
                    <Select {...field} label={t("rooms.status")}>
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("rooms.description")}
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 100 }}>
            {loading ? t("common.loading") : t("common.save")}
          </Button>
        </DialogActions>
      </form>
    )
  },
)

UpdateRoomForm.displayName = "UpdateRoomForm"

// Main Modal Component
const RoomFormModal = memo(({ open, onClose, onSubmit, room, loading = false }: RoomFormModalProps) => {
  const { t } = useTranslation()
  const isEdit = Boolean(room)

  const handleCreateSubmit = (data: CreateRoomFormData) => {
    onSubmit(data)
  }

  const handleUpdateSubmit = (data: UpdateRoomFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableRestoreFocus keepMounted={false}>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>
            {isEdit ? t("rooms.editRoom") : t("rooms.addRoom")}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      {isEdit && room ? (
        <UpdateRoomForm room={room} onSubmit={handleUpdateSubmit} onClose={onClose} loading={loading} />
      ) : (
        <CreateRoomForm onSubmit={handleCreateSubmit} onClose={onClose} loading={loading} />
      )}
    </Dialog>
  )
})

RoomFormModal.displayName = "RoomFormModal"

export { RoomFormModal }
