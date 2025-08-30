import { useState, memo } from "react"
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Grid,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material"
import { FilterList, ExpandMore, ExpandLess, Clear } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import type { StudentFilters, Guardian, AcademicClass } from "~/features/hostel/students/types"

interface StudentFiltersProps {
  filters: StudentFilters
  onFiltersChange: (filters: StudentFilters) => void
  onClearFilters: () => void
  guardians: Guardian[]
  academicClasses: AcademicClass[]
}

const genderOptions = ["Male", "Female", "Other"]
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const roomStatusOptions = [
  { value: "assigned", label: "Hostel Assigned" },
  { value: "unassigned", label: "No Hostel" },
]

const StudentFiltersComponent = memo(
  ({ filters, onFiltersChange, onClearFilters, guardians, academicClasses }: StudentFiltersProps) => {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)

    const handleFilterChange = (key: keyof StudentFilters, value: string) => {
      onFiltersChange({
        ...filters,
        [key]: value || undefined,
      })
    }

    const hasActiveFilters = Object.values(filters).some((value) => value && value.length > 0)

    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterList color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Filters
            </Typography>
            {hasActiveFilters && (
              <Button size="small" startIcon={<Clear />} onClick={onClearFilters} sx={{ ml: 2 }}>
                Clear All
              </Button>
            )}
          </Box>
          <IconButton onClick={() => setExpanded(!expanded)}>{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search students..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            size="small"
          />
        </Box>

        <Collapse in={expanded}>
          <Grid container spacing={2}>
            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={filters.gender || ""}
                  label="Gender"
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                >
                  <MenuItem value="">All Genders</MenuItem>
                  {genderOptions.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Blood Group</InputLabel>
                <Select
                  value={filters.bloodGroup || ""}
                  label="Blood Group"
                  onChange={(e) => handleFilterChange("bloodGroup", e.target.value)}
                >
                  <MenuItem value="">All Blood Groups</MenuItem>
                  {bloodGroupOptions.map((bloodGroup) => (
                    <MenuItem key={bloodGroup} value={bloodGroup}>
                      {bloodGroup}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Academic Class</InputLabel>
                <Select
                  value={filters.academicClass || ""}
                  label="Academic Class"
                  onChange={(e) => handleFilterChange("academicClass", e.target.value)}
                >
                  <MenuItem value="">All Classes</MenuItem>
                  {academicClasses.map((academicClass) => (
                    <MenuItem key={academicClass.id} value={academicClass.id}>
                      {academicClass.name} {academicClass.section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Hostel Status</InputLabel>
                <Select
                  value={filters.roomStatus || ""}
                  label="Hostel Status"
                  onChange={(e) => handleFilterChange("roomStatus", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {roomStatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Guardian</InputLabel>
                <Select
                  value={filters.guardian || ""}
                  label="Guardian"
                  onChange={(e) => handleFilterChange("guardian", e.target.value)}
                >
                  <MenuItem value="">All Guardians</MenuItem>
                  {guardians.map((guardian) => (
                    <MenuItem key={guardian.id} value={guardian.id}>
                      {guardian.firstName} {guardian.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>
    )
  },
)

StudentFiltersComponent.displayName = "StudentFiltersComponent"

export { StudentFiltersComponent as StudentFilters }
