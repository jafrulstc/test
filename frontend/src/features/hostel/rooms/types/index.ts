import type { BaseEntity } from '~/shared/types/common';

/**
 * Room entity interface
 */
export interface Room extends BaseEntity {
  roomNumber: string;
  floor: string;
  building: string;
  capacity: number;
  roomType: string;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  description?: string;
  beds: Bed[];
}

/**
 * Bed entity interface
 */
export interface Bed extends BaseEntity {
  bedNumber: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  description?: string;
  roomId: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    registrationNumber: string;
    academicClass?: {
      name: string;
      section: string;
      academicYear: string;
    };
    contactNumber?: string;
    email?: string;
    bloodGroup?: string;
    guardian?: {
      firstName: string;
      lastName: string;
      relationship: string;
      contactNumber: string;
    };
  };
}

/**
 * Create Room DTO
 */
export interface CreateRoomDto {
  roomNumber: string;
  floor: string;
  building: string;
  capacity: number;
  roomType: string;
  description?: string;
}

/**
 * Update Room DTO
 */
export interface UpdateRoomDto {
  floor?: string;
  building?: string;
  capacity?: number;
  roomType?: string;
  status?: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  description?: string;
}

/**
 * Create Bed DTO
 */
export interface CreateBedDto {
  bedNumber: string;
  description?: string;
  roomId: string;
}

/**
 * Update Bed DTO
 */
export interface UpdateBedDto {
  status?: 'Available' | 'Occupied' | 'Maintenance';
  description?: string;
}

/**
 * Room filters interface
 */
export interface RoomFilters {
  search?: string;
  status?: string;
  roomType?: string;
  floor?: string;
  building?: string;
}

/**
 * Pagination state for rooms
 */
export interface RoomsPaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}