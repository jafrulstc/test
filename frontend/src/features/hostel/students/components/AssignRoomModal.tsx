import type React from "react"
import { Modal, Button, Typography, Box } from "@mui/material"
import { Grid } from "@mui/material"

interface AssignRoomModalProps {
  open: boolean
  onClose: () => void
  room: any
}

const AssignRoomModal: React.FC<AssignRoomModalProps> = ({ open, onClose, room }) => {
  const { totalBeds, occupiedBeds, capacity } = room

  const calculateOccupancyPercentage = () => {
    return (occupiedBeds / capacity) * 100
  }

  const getOccupancyColor = () => {
    const occupancyPercentage = calculateOccupancyPercentage()
    if (occupancyPercentage <= 30) {
      return "green"
    } else if (occupancyPercentage <= 70) {
      return "orange"
    } else {
      return "red"
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Assign Room
        </Typography>
        <Grid container spacing={2}>
          <Grid sx={{ gridColumn: { xs: "span 12" } }}>
            <Typography variant="body1">Room ID: {room.id}</Typography>
          </Grid>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Typography variant="body1">Total Beds: {totalBeds}</Typography>
          </Grid>
          <Grid sx={{ gridColumn: { xs: "span 6" } }}>
            <Typography variant="body1" sx={{ color: getOccupancyColor() }}>
              Occupancy: {occupiedBeds}/{capacity}
            </Typography>
          </Grid>
          <Grid sx={{ gridColumn: { xs: "span 12" } }}>
            <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
              Close
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default AssignRoomModal
