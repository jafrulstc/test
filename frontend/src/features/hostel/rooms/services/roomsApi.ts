import BaseApiService from '~/shared/services/api/baseApi';
import type { Room, Bed, CreateRoomDto, UpdateRoomDto, CreateBedDto, UpdateBedDto, RoomFilters } from '../types';
import type { PaginatedResponse } from '~/shared/types/common';

/**
 * Mock data for development
 */
const mockRooms: Room[] = [
  {
    id: '1',
    roomNumber: '101',
    floor: '1st Floor',
    building: 'Main Building',
    capacity: 4,
    roomType: 'Standard',
    status: 'Available',
    description: 'Standard room with 4 beds',
    beds: [
      {
        id: '1',
        bedNumber: '101-A',
        status: 'Available',
        roomId: '1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        bedNumber: '101-B',
        status: 'Occupied',
        roomId: '1',
        student: {
          id: 's1',
          firstName: 'Rashid',
          lastName: 'Hassan',
          registrationNumber: 'REG2024001',
        },
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    roomNumber: '102',
    floor: '1st Floor',
    building: 'Main Building',
    capacity: 2,
    roomType: 'Premium',
    status: 'Occupied',
    description: 'Premium room with 2 beds',
    beds: [
      {
        id: '3',
        bedNumber: '102-A',
        status: 'Occupied',
        roomId: '2',
        student: {
          id: 's5',
          firstName: 'Tariq',
          lastName: 'Rahman',
          registrationNumber: 'REG2024005',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        bedNumber: '102-B',
        status: 'Available',
        roomId: '2',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

let mockIdCounter = 5;

/**
 * Rooms API service class
 * Handles all room and bed related API operations
 */
class RoomsApiService extends BaseApiService {
  /**
   * Get paginated list of rooms with optional filters
   */
  async getRooms(params: { 
    page?: number; 
    limit?: number; 
    filters?: RoomFilters; 
  }): Promise<PaginatedResponse<Room>> {
    await this.simulateDelay();

    const { page = 1, limit = 10, filters = {} } = params;
    let filteredRooms = [...mockRooms];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.roomNumber.toLowerCase().includes(search) ||
          room.building.toLowerCase().includes(search) ||
          room.floor.toLowerCase().includes(search),
      );
    }

    if (filters.status) {
      filteredRooms = filteredRooms.filter((room) => room.status === filters.status);
    }

    if (filters.floor) {
      filteredRooms = filteredRooms.filter((room) => room.floor === filters.floor);
    }

    if (filters.building) {
      filteredRooms = filteredRooms.filter((room) => room.building === filters.building);
    }

    if (filters.roomType) {
      filteredRooms = filteredRooms.filter((room) => room.roomType === filters.roomType);
    }

    const total = filteredRooms.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredRooms.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get room by ID
   */
  async getRoomById(id: string): Promise<Room> {
    await this.simulateDelay(300);
    const room = mockRooms.find((r) => r.id === id);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  /**
   * Create new room
   */
  async createRoom(roomData: CreateRoomDto): Promise<Room> {
    await this.simulateDelay();
    const newRoom: Room = {
      id: String(mockIdCounter++),
      ...roomData,
      status: 'Available',
      beds: [],
      createdAt: new Date().toISOString(),
    };
    mockRooms.unshift(newRoom);
    return newRoom;
  }

  /**
   * Update existing room
   */
  async updateRoom(id: string, data: UpdateRoomDto): Promise<Room> {
    await this.simulateDelay();
    const roomIndex = mockRooms.findIndex((r) => r.id === id);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    mockRooms[roomIndex] = {
      ...mockRooms[roomIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return mockRooms[roomIndex];
  }

  /**
   * Delete room
   */
  async deleteRoom(id: string): Promise<void> {
    await this.simulateDelay();
    const roomIndex = mockRooms.findIndex((r) => r.id === id);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }
    mockRooms.splice(roomIndex, 1);
  }

  /**
   * Create new bed in room
   */
  async createBed(bedData: CreateBedDto): Promise<Bed> {
    await this.simulateDelay();
    const roomIndex = mockRooms.findIndex((r) => r.id === bedData.roomId);
    if (roomIndex === -1) {
      throw new Error('Room not found');
    }

    const newBed: Bed = {
      id: String(mockIdCounter++),
      bedNumber: bedData.bedNumber,
      status: 'Available',
      description: bedData.description,
      roomId: bedData.roomId,
      createdAt: new Date().toISOString(),
    };

    mockRooms[roomIndex] = {
      ...mockRooms[roomIndex],
      beds: [...mockRooms[roomIndex].beds, newBed],
    };

    return newBed;
  }

  /**
   * Update existing bed
   */
  async updateBed(id: string, data: UpdateBedDto): Promise<Bed> {
    await this.simulateDelay();

    for (let roomIndex = 0; roomIndex < mockRooms.length; roomIndex++) {
      const room = mockRooms[roomIndex];
      const bedIndex = room.beds.findIndex((b) => b.id === id);

      if (bedIndex !== -1) {
        const updatedBed = {
          ...room.beds[bedIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        const updatedBeds = [...room.beds];
        updatedBeds[bedIndex] = updatedBed;

        mockRooms[roomIndex] = {
          ...room,
          beds: updatedBeds,
        };

        return updatedBed;
      }
    }

    throw new Error('Bed not found');
  }

  /**
   * Delete bed
   */
  async deleteBed(id: string): Promise<void> {
    await this.simulateDelay();

    for (let roomIndex = 0; roomIndex < mockRooms.length; roomIndex++) {
      const room = mockRooms[roomIndex];
      const bedIndex = room.beds.findIndex((b) => b.id === id);

      if (bedIndex !== -1) {
        const updatedBeds = room.beds.filter((bed) => bed.id !== id);

        mockRooms[roomIndex] = {
          ...room,
          beds: updatedBeds,
        };

        return;
      }
    }

    throw new Error('Bed not found');
  }

  /**
   * Update bed occupancy when student is assigned/removed
   */
  async updateBedOccupancy(
    bedId: string,
    studentData?: {
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
    },
  ): Promise<Bed> {
    await this.simulateDelay(300);

    for (let roomIndex = 0; roomIndex < mockRooms.length; roomIndex++) {
      const room = mockRooms[roomIndex];
      const bedIndex = room.beds.findIndex((b) => b.id === bedId);

      if (bedIndex !== -1) {
        const updatedBed = {
          ...room.beds[bedIndex],
          status: studentData ? ('Occupied' as const) : ('Available' as const),
          student: studentData || undefined,
          updatedAt: new Date().toISOString(),
        } as Bed;

        const updatedBeds = [...room.beds];
        updatedBeds[bedIndex] = updatedBed;

        mockRooms[roomIndex] = {
          ...room,
          beds: updatedBeds,
        };

        return updatedBed;
      }
    }

    throw new Error('Bed not found');
  }
}

export const roomsApi = new RoomsApiService();