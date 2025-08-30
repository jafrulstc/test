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
  createBedSchema,
  updateBedSchema,
  type CreateBedFormData,
  type UpdateBedFormData,
} from "~/features/hostel/rooms/schemas"
import type { Bed } from "~/features/hostel/rooms/types"

interface BedFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateBedFormData | UpdateBedFormData) => void
  bed?: Bed | null
  roomId: string
  roomNumber: string
  loading?: boolean
}

const statusOptions = ["Available", "Occupied", "Maintenance"]

// Create Form Component
const CreateBedForm = memo(
  ({
    onSubmit,
    onClose,
    roomId,
    loading,
  }: {
    onSubmit: (data: CreateBedFormData) => void
    onClose: () => void
    roomId: string
    loading: boolean
  }) => {
    const { t } = useTranslation()
    const firstFieldRef = useRef<HTMLInputElement>(null)

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<CreateBedFormData>({
      resolver: zodResolver(createBedSchema),
      defaultValues: {
        bedNumber: "",
        description: "",
        roomId,
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

    // Reset form when roomId changes
    useEffect(() => {
      reset({
        bedNumber: "",
        description: "",
        roomId,
      })
    }, [roomId, reset])

    const handleClose = () => {
      console.log("handle close work")
      reset()
      onClose()
    }

    const handleFormSubmit = async (data: CreateBedFormData) => {
      try {
        console.log("data founded : ", data)
        console.log("Form submission started for create bed")
        await onSubmit(data)
        console.log("Form submission completed successfully")
        reset()
      } catch (error) {
        console.error("Error in form submission:", error)
      }
    }

    const onFormSubmit = (data: CreateBedFormData) => {
      console.log("onFormSubmit called with data:", data)
      handleFormSubmit(data)
    }

    const onFormError = (errors: any) => {
      console.log("Form validation errors:", errors)
    }

    return (
      <form onSubmit={handleSubmit(onFormSubmit, onFormError)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="bedNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={firstFieldRef}
                    fullWidth
                    label="Bed Number"
                    error={!!errors.bedNumber}
                    helperText={errors.bedNumber?.message}
                    placeholder="e.g., 101-A, 101-B"
                    autoFocus
                  />
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
                    label="Description (Optional)"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    placeholder="Any special notes about this bed..."
                  />
                )}
              />
            </Grid>

            {/* Hidden field for roomId */}
            <input type="hidden" {...control.register("roomId")} value={roomId} />
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading || isSubmitting}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={loading || isSubmitting} sx={{ minWidth: 100 }}>
            {loading || isSubmitting ? t("common.loading") : t("common.add")}
          </Button>
        </DialogActions>
      </form>
    )
  },
)

CreateBedForm.displayName = "CreateBedForm"

// Update Form Component
const UpdateBedForm = memo(
  ({
    bed,
    onSubmit,
    onClose,
    loading,
  }: {
    bed: Bed
    onSubmit: (data: UpdateBedFormData) => void
    onClose: () => void
    loading: boolean
  }) => {
    const { t } = useTranslation()
    const firstFieldRef = useRef<HTMLInputElement>(null)

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<UpdateBedFormData>({
      resolver: zodResolver(updateBedSchema),
      defaultValues: {
        status: bed.status,
        description: bed.description || "",
      },
    })

    useEffect(() => {
      reset({
        status: bed.status,
        description: bed.description || "",
      })
    }, [bed, reset])

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
      console.log("handle close work")
      reset()
      onClose()
    }

    const handleFormSubmit = async (data: UpdateBedFormData) => {
      try {
        console.log("Update bed data:", data)
        await onSubmit(data)
        console.log("Update bed completed successfully")
      } catch (error) {
        console.error("Error in update bed submission:", error)
      }
    }

    const onFormSubmit = (data: UpdateBedFormData) => {
      console.log("onFormSubmit called for update with data:", data)
      handleFormSubmit(data)
    }

    const onFormError = (errors: any) => {
      console.log("Update form validation errors:", errors)
    }

    return (
      <form onSubmit={handleSubmit(onFormSubmit, onFormError)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Display bed number as read-only */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <TextField fullWidth label="Bed Number" value={bed.bedNumber} disabled variant="filled" />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status" inputRef={firstFieldRef} autoFocus>
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
                    label="Description (Optional)"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            {/* Show student info if bed is occupied */}
            {bed.status === "Occupied" && bed.student && (
              <Grid sx={{ gridColumn: { xs: "span 12" } }}>
                <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="info.dark" gutterBottom>
                    Current Occupant
                  </Typography>
                  <Typography variant="body2">
                    {bed.student.firstName} {bed.student.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Registration: {bed.student.registrationNumber}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading || isSubmitting}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="contained" disabled={loading || isSubmitting} sx={{ minWidth: 100 }}>
            {loading || isSubmitting ? t("common.loading") : t("common.save")}
          </Button>
        </DialogActions>
      </form>
    )
  },
)

UpdateBedForm.displayName = "UpdateBedForm"

// Main Modal Component
const BedFormModal = memo(
  ({ open, onClose, onSubmit, bed, roomId, roomNumber, loading = false }: BedFormModalProps) => {
    const { t } = useTranslation()
    const isEdit = Boolean(bed)

    console.log("BedFormModal props:", { open, bed, roomId, roomNumber, isEdit })

    const handleCreateSubmit = (data: CreateBedFormData) => {
      console.log("handleCreateSubmit called with:", data)
      onSubmit(data)
    }

    const handleUpdateSubmit = (data: UpdateBedFormData) => {
      console.log("handleUpdateSubmit called with:", data)
      onSubmit(data)
    }

    const handleModalClose = () => {
      console.log("Modal close requested")
      onClose()
    }

    // Don't render if roomId is empty for create mode
    if (!isEdit && !roomId) {
      console.log("Not rendering modal: roomId is empty for create mode")
      return null
    }

    return (
      <Dialog open={open} onClose={handleModalClose} maxWidth="sm" fullWidth disableRestoreFocus keepMounted={false}>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={600}>
              {isEdit ? `Edit Bed ${bed?.bedNumber}` : `Add Bed to Room ${roomNumber}`}
            </Typography>
            <IconButton onClick={handleModalClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        {isEdit && bed ? (
          <UpdateBedForm bed={bed} onSubmit={handleUpdateSubmit} onClose={handleModalClose} loading={loading} />
        ) : (
          <CreateBedForm onSubmit={handleCreateSubmit} onClose={handleModalClose} roomId={roomId} loading={loading} />
        )}
      </Dialog>
    )
  },
)

BedFormModal.displayName = "BedFormModal"

export { BedFormModal }
