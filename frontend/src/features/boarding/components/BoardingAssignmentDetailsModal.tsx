import React, { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Close,
  Person,
  Restaurant,
  CalendarToday,
  MonetizationOn,
  Receipt,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getStatusColor } from '~/shared/utils/colors';
import type { BoardingAssignment } from '../types/boardingAssignmentType';

interface BoardingAssignmentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  assignment?: BoardingAssignment | null;
}

/**
 * Boarding Assignment Details Modal Component
 * Displays detailed information about a boarding assignment
 */
const BoardingAssignmentDetailsModal = memo(({ open, onClose, assignment }: BoardingAssignmentDetailsModalProps) => {
  const { t } = useTranslation();

  if (!assignment) return null;

  /**
   * Get user type color
   */
  const getUserTypeColor = (userType: string): 'primary' | 'secondary' | 'success' | 'default' => {
    switch (userType) {
      case 'student':
        return 'primary';
      case 'teacher':
        return 'secondary';
      case 'staff':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Boarding Assignment Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Header Section */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Avatar
                    src={assignment.user?.photoUrl}
                    sx={{ width: 80, height: 80 }}
                  >
                    <Person sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {assignment.user?.firstName} {assignment.user?.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={assignment.userType}
                        color={getUserTypeColor(assignment.userType)}
                        variant="outlined"
                      />
                      <Chip
                        label={assignment.status}
                        color={getStatusColor(assignment.status)}
                        variant="outlined"
                      />
                    </Box>
                    {assignment.user?.email && (
                      <Typography variant="body2" color="text.secondary">
                        {assignment.user.email}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" color="primary" fontWeight={700}>
                      ৳{assignment.finalPrice.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Final Price
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Package Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Restaurant sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Package Information
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Meal Package"
                      secondary={assignment.fullDayMealPackage?.name || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Package Type"
                      secondary={assignment.fullDayMealPackage?.packageTypeName || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Package Name"
                      secondary={assignment.fullDayMealPackage?.packageName || 'Not specified'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Assignment Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <CalendarToday sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Assignment Details
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Assigned Date"
                      secondary={new Date(assignment.assignedDate).toLocaleDateString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Assigned By"
                      secondary={assignment.assignedBy}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Created Date"
                      secondary={new Date(assignment.createdAt).toLocaleDateString()}
                    />
                  </ListItem>
                  {assignment.updatedAt && (
                    <ListItem>
                      <ListItemText
                        primary="Last Updated"
                        secondary={new Date(assignment.updatedAt).toLocaleDateString()}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Price Breakdown */}
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Price Breakdown
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="h6" color="text.secondary">
                        Original Price
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        ৳{assignment.originalPrice.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="h6" color="warning.main">
                        Discount
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {assignment.discountPercentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ৳{assignment.discountAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                      <Typography variant="h6" color="success.main">
                        Final Price
                      </Typography>
                      <Typography variant="h5" fontWeight={600} color="success.main">
                        ৳{assignment.finalPrice.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Typography variant="h6" color="info.main">
                        Savings
                      </Typography>
                      <Typography variant="h5" fontWeight={600} color="info.main">
                        ৳{assignment.discountAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Notes */}
          {assignment.notes && (
            <Grid size={{ xs: 12 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body2">
                    {assignment.notes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

BoardingAssignmentDetailsModal.displayName = 'BoardingAssignmentDetailsModal';

export { BoardingAssignmentDetailsModal };