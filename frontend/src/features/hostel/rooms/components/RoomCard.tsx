import type React from "react"
import { useState, memo } from "react"
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
import { MoreVert, Edit, Delete, Bed, People, LocationOn, Home } from "@mui/icons-material"
import type { Room } from "~/features/hostel/rooms/types"

interface RoomCardProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (room: Room) => void
  onViewDetails: (room: Room) => void
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

const getOccupancyColor = (occupied: number, capacity: number) => {
  const percentage = (occupied / capacity) * 100
  if (percentage === 0) return "success"
  if (percentage < 50) return "info"
  if (percentage < 100) return "warning"
  return "error"
}

const RoomCard = memo(({ room, onEdit, onDelete, onViewDetails }: RoomCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit(room)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDelete(room)
    handleMenuClose()
  }

  const occupiedBeds = room.beds.filter((bed) => bed.status === "Occupied").length
  const availableBeds = room.beds.filter((bed) => bed.status === "Available").length

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
      onClick={() => onViewDetails(room)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
              <Home />
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight={600}>
                {room.roomNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {room.roomType}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip label={room.status} color={getStatusColor(room.status) as any} size="small" variant="filled" />
            <IconButton size="small" onClick={handleMenuOpen} sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {room.floor}
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Home sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {room.building}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <Bed sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography variant="h6" color="primary.main" fontWeight={600}>
                  {occupiedBeds}/{room.beds.length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Booked
              </Typography>
            </Box>
          </Grid>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <People
                  sx={{
                    fontSize: 18,
                    color:
                      getOccupancyColor(occupiedBeds, room.capacity) === "success"
                        ? "success.main"
                        : getOccupancyColor(occupiedBeds, room.capacity) === "error"
                          ? "error.main"
                          : "warning.main",
                  }}
                />
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color={
                    getOccupancyColor(occupiedBeds, room.capacity) === "success"
                      ? "success.main"
                      : getOccupancyColor(occupiedBeds, room.capacity) === "error"
                        ? "error.main"
                        : "warning.main"
                  }
                >
                  {occupiedBeds}/{room.capacity}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Occupied
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {availableBeds > 0 && (
          <Box sx={{ mt: 2 }}>
            <Chip
              label={`${availableBeds} bed${availableBeds > 1 ? "s" : ""} available`}
              color="success"
              variant="outlined"
              size="small"
              sx={{ fontSize: "0.75rem" }}
            />
          </Box>
        )}

        {room.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: "italic" }}>
            {room.description}
          </Typography>
        )}
      </CardContent>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Room</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          <ListItemText>Delete Room</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  )
})

RoomCard.displayName = "RoomCard"

export { RoomCard }
