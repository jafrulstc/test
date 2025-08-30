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
import type { RoomFilters } from "~/features/hostel/rooms/types"

interface RoomFiltersProps {
  filters: RoomFilters
  onFiltersChange: (filters: RoomFilters) => void
  onClearFilters: () => void
}

const statusOptions = ["Available", "Occupied", "Maintenance", "Reserved"]
const roomTypeOptions = ["Standard", "Premium", "Deluxe", "Suite"]
const floorOptions = ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"]
const buildingOptions = ["Main Building", "North Wing", "South Wing", "East Block", "West Block"]

const RoomFilterComponent = memo(({ filters, onFiltersChange, onClearFilters }: RoomFiltersProps) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)

  const handleFilterChange = (key: keyof RoomFilters, value: string) => {
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
          placeholder="Search rooms..."
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          size="small"
        />
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ""}
                label="Status"
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Room Type</InputLabel>
              <Select
                value={filters.roomType || ""}
                label="Room Type"
                onChange={(e) => handleFilterChange("roomType", e.target.value)}
              >
                <MenuItem value="">All Types</MenuItem>
                {roomTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Floor</InputLabel>
              <Select
                value={filters.floor || ""}
                label="Floor"
                onChange={(e) => handleFilterChange("floor", e.target.value)}
              >
                <MenuItem value="">All Floors</MenuItem>
                {floorOptions.map((floor) => (
                  <MenuItem key={floor} value={floor}>
                    {floor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid sx={{ gridColumn: { xs: "span 12", sm: "span 6", md: "span 3" } }}>
            <FormControl fullWidth size="small">
              <InputLabel>Building</InputLabel>
              <Select
                value={filters.building || ""}
                label="Building"
                onChange={(e) => handleFilterChange("building", e.target.value)}
              >
                <MenuItem value="">All Buildings</MenuItem>
                {buildingOptions.map((building) => (
                  <MenuItem key={building} value={building}>
                    {building}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  )
})

RoomFilterComponent.displayName = "RoomFilterComponent"

export { RoomFilterComponent }
