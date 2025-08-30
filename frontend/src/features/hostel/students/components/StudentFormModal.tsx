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
  createStudentSchema,
  updateStudentSchema,
  type CreateStudentFormData,
  type UpdateStudentFormData,
} from "~/features/hostel/students/schemas"
import type { StudentDetail, Guardian, AcademicClass } from "~/features/hostel/students/types"

interface StudentFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateStudentFormData | UpdateStudentFormData) => void
  student?: StudentDetail | null
  guardians: Guardian[]
  academicClasses: AcademicClass[]
  loading?: boolean
}

const genderOptions = ["Male", "Female", "Other"]
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

// Create Form Component
const CreateStudentForm = memo(
  ({
    onSubmit,
    onClose,
    guardians,
    academicClasses,
    loading,
  }: {
    onSubmit: (data: CreateStudentFormData) => void
    onClose: () => void
    guardians: Guardian[]
    academicClasses: AcademicClass[]
    loading: boolean
  }) => {
    const { t } = useTranslation()
    const firstFieldRef = useRef<HTMLInputElement>(null)

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<CreateStudentFormData>({
      resolver: zodResolver(createStudentSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        registrationNumber: "",
        dateOfBirth: "",
        gender: "",
        bloodGroup: "",
        contactNumber: "",
        email: "",
        address: "",
        emergencyContact: "",
        medicalConditions: "",
        photoUrl: "",
        guardianId: "",
        academicClassId: "",
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

    const handleFormSubmit = async (data: CreateStudentFormData) => {
      await onSubmit(data)
      reset()
    }

    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                Personal Information
              </Typography>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={firstFieldRef}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="registrationNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Registration Number"
                    error={!!errors.registrationNumber}
                    helperText={errors.registrationNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                    value={field.value ? field.value.split("T")[0] : ""}
                    onChange={(e) => {
                      const dateValue = e.target.value ? `${e.target.value}T00:00:00Z` : ""
                      field.onChange(dateValue)
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select {...field} label="Gender">
                      <MenuItem value="">Select Gender</MenuItem>
                      {genderOptions.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                          {gender}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Blood Group</InputLabel>
                    <Select {...field} label="Blood Group">
                      <MenuItem value="">Select Blood Group</MenuItem>
                      {bloodGroupOptions.map((bloodGroup) => (
                        <MenuItem key={bloodGroup} value={bloodGroup}>
                          {bloodGroup}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Contact Information */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Typography variant="h6" fontWeight={600} color="primary" gutterBottom sx={{ mt: 2 }}>
                Contact Information
              </Typography>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact Number"
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="emergencyContact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact"
                    error={!!errors.emergencyContact}
                    helperText={errors.emergencyContact?.message}
                  />
                )}
              />
            </Grid>

            {/* Academic Information */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Typography variant="h6" fontWeight={600} color="primary" gutterBottom sx={{ mt: 2 }}>
                Academic Information
              </Typography>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="guardianId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.guardianId}>
                    <InputLabel>Guardian</InputLabel>
                    <Select {...field} label="Guardian">
                      <MenuItem value="">Select Guardian</MenuItem>
                      {guardians.map((guardian) => (
                        <MenuItem key={guardian.id} value={guardian.id}>
                          {guardian.firstName} {guardian.lastName} ({guardian.relationship})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.guardianId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.guardianId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="academicClassId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.academicClassId}>
                    <InputLabel>Academic Class</InputLabel>
                    <Select {...field} label="Academic Class">
                      <MenuItem value="">Select Class</MenuItem>
                      {academicClasses.map((academicClass) => (
                        <MenuItem key={academicClass.id} value={academicClass.id}>
                          {academicClass.name} {academicClass.section} ({academicClass.academicYear})
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.academicClassId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.academicClassId.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Additional Information */}
            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Typography variant="h6" fontWeight={600} color="primary" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="medicalConditions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Medical Conditions"
                    multiline
                    rows={3}
                    error={!!errors.medicalConditions}
                    helperText={errors.medicalConditions?.message}
                    placeholder="Any medical conditions, allergies, or special requirements..."
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="photoUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Photo URL"
                    error={!!errors.photoUrl}
                    helperText={errors.photoUrl?.message}
                    placeholder="https://example.com/photo.jpg"
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

CreateStudentForm.displayName = "CreateStudentForm"

// Update Form Component
const UpdateStudentForm = memo(
  ({
    student,
    onSubmit,
    onClose,
    loading,
  }: {
    student: StudentDetail
    onSubmit: (data: UpdateStudentFormData) => void
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
    } = useForm<UpdateStudentFormData>({
      resolver: zodResolver(updateStudentSchema),
      defaultValues: {
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        contactNumber: student.contactNumber || "",
        email: student.email || "",
        address: student.address || "",
        emergencyContact: student.emergencyContact || "",
        medicalConditions: student.medicalConditions || "",
        photoUrl: student.photoUrl || "",
      },
    })

    useEffect(() => {
      reset({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        contactNumber: student.contactNumber || "",
        email: student.email || "",
        address: student.address || "",
        emergencyContact: student.emergencyContact || "",
        medicalConditions: student.medicalConditions || "",
        photoUrl: student.photoUrl || "",
      })
    }, [student, reset])

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

    const handleFormSubmit = async (data: UpdateStudentFormData) => {
      await onSubmit(data)
    }

    return (
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Read-only fields */}
            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <TextField
                fullWidth
                label="Registration Number"
                value={student.registrationNumber}
                disabled
                variant="filled"
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <TextField
                fullWidth
                label="Date of Birth"
                value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : ""}
                disabled
                variant="filled"
              />
            </Grid>

            {/* Editable fields */}
            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputRef={firstFieldRef}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    autoFocus
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="contactNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Contact Number"
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6" } }}>
              <Controller
                name="emergencyContact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact"
                    error={!!errors.emergencyContact}
                    helperText={errors.emergencyContact?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="medicalConditions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Medical Conditions"
                    multiline
                    rows={3}
                    error={!!errors.medicalConditions}
                    helperText={errors.medicalConditions?.message}
                  />
                )}
              />
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12" } }}>
              <Controller
                name="photoUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Photo URL"
                    error={!!errors.photoUrl}
                    helperText={errors.photoUrl?.message}
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

UpdateStudentForm.displayName = "UpdateStudentForm"

// Main Modal Component
const StudentFormModal = memo(
  ({ open, onClose, onSubmit, student, guardians, academicClasses, loading = false }: StudentFormModalProps) => {
    const { t } = useTranslation()
    const isEdit = Boolean(student)

    const handleCreateSubmit = (data: CreateStudentFormData) => {
      onSubmit(data)
    }

    const handleUpdateSubmit = (data: UpdateStudentFormData) => {
      onSubmit(data)
    }

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth disableRestoreFocus keepMounted={false}>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={600}>
              {isEdit ? "Edit Student" : "Add Student"}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        {isEdit && student ? (
          <UpdateStudentForm student={student} onSubmit={handleUpdateSubmit} onClose={onClose} loading={loading} />
        ) : (
          <CreateStudentForm
            onSubmit={handleCreateSubmit}
            onClose={onClose}
            guardians={guardians}
            academicClasses={academicClasses}
            loading={loading}
          />
        )}
      </Dialog>
    )
  },
)

StudentFormModal.displayName = "StudentFormModal"

export { StudentFormModal }
