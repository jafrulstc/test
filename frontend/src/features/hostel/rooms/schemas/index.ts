import { z } from 'zod';
import { ROOM_CONSTANTS, BED_CONSTANTS, VALIDATION_CONSTANTS } from '~/app/constants';

/**
 * Room creation validation schema
 */
export const createRoomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number is required')
    .max(10, 'Room number must be less than 10 characters'),
  floor: z
    .string()
    .min(1, 'Floor is required')
    .max(20, 'Floor must be less than 20 characters'),
  building: z
    .string()
    .min(1, 'Building is required')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.SHORT, 'Building must be less than 50 characters'),
  capacity: z
    .number()
    .min(ROOM_CONSTANTS.MIN_CAPACITY, `Capacity must be at least ${ROOM_CONSTANTS.MIN_CAPACITY}`)
    .max(ROOM_CONSTANTS.MAX_CAPACITY, `Capacity cannot exceed ${ROOM_CONSTANTS.MAX_CAPACITY}`),
  roomType: z
    .string()
    .min(1, 'Room type is required')
    .max(30, 'Room type must be less than 30 characters'),
  description: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, 'Description must be less than 500 characters')
    .optional(),
});

/**
 * Room update validation schema
 */
export const updateRoomSchema = z.object({
  floor: z
    .string()
    .min(1, 'Floor is required')
    .max(20, 'Floor must be less than 20 characters')
    .optional(),
  building: z
    .string()
    .min(1, 'Building is required')
    .max(VALIDATION_CONSTANTS.MAX_STRING_LENGTH.SHORT, 'Building must be less than 50 characters')
    .optional(),
  capacity: z
    .number()
    .min(ROOM_CONSTANTS.MIN_CAPACITY, `Capacity must be at least ${ROOM_CONSTANTS.MIN_CAPACITY}`)
    .max(ROOM_CONSTANTS.MAX_CAPACITY, `Capacity cannot exceed ${ROOM_CONSTANTS.MAX_CAPACITY}`)
    .optional(),
  roomType: z
    .string()
    .min(1, 'Room type is required')
    .max(30, 'Room type must be less than 30 characters')
    .optional(),
  status: z.enum(ROOM_CONSTANTS.STATUS_OPTIONS).optional(),
  description: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, 'Description must be less than 500 characters')
    .optional(),
});

/**
 * Bed creation validation schema
 */
export const createBedSchema = z.object({
  bedNumber: z
    .string()
    .min(1, 'Bed number is required')
    .max(10, 'Bed number must be less than 10 characters'),
  description: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, 'Description must be less than 500 characters')
    .optional(),
  roomId: z.string().min(1, 'Invalid room ID'),
});

/**
 * Bed update validation schema
 */
export const updateBedSchema = z.object({
  status: z.enum(BED_CONSTANTS.STATUS_OPTIONS).optional(),
  description: z
    .string()
    .max(VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH, 'Description must be less than 500 characters')
    .optional(),
});

// Export inferred types
export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
export type UpdateRoomFormData = z.infer<typeof updateRoomSchema>;
export type CreateBedFormData = z.infer<typeof createBedSchema>;
export type UpdateBedFormData = z.infer<typeof updateBedSchema>;