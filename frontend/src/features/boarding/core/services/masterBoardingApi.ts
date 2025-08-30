import BaseApiService from '~/shared/services/api/baseApi';

import type { PaginatedResponse } from '~/shared/types/common';
import {
  BoardingPackageType,
  BoardingPackageTypeFilters,
  UpdateBoardingPackageTypeDto,
  CreateBoardingPackageTypeDto,
  BoardingMenuCategory,
  BoardingMenuCategoryFilters,
  CreateBoardingMenuCategoryDto,
  UpdateBoardingMenuCategoryDto,
  BoardingSubMenuCategory,
  BoardingSubMenuCategoryFilters,
  CreateBoardingSubMenuCategoryDto,
  UpdateBoardingSubMenuCategoryDto,
  BoardingMealType,
  BoardingMealTypeFilters,
  CreateBoardingMealTypeDto,
  UpdateBoardingMealTypeDto,
  BoardingMenuItem,
  BoardingMenuItemFilters,
  CreateBoardingMenuItemDto,
  UpdateBoardingMenuItemDto,
  BoardingPackage,
  BoardingPackageFilters,
  CreateBoardingPackageDto,
  UpdateBoardingPackageDto,
  BoardingPackageMenuItem,
  CreateBoardingPackageMenuItemDto,
  UpdateBoardingPackageMenuItemDto,
  BoardingPackageMenuItemFilters,
  FullDayMealPackage,
  FullDayMealPackageFilters,
  CreateFullDayMealPackageDto,
  UpdateFullDayMealPackageDto,

} from '~/features/boarding/core/types/masterBoardingType';
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

// // 🔹 Boarding Packages (বোর্ডিং প্যাকেজ)
const mockBoardingPackages: BoardingPackage[] = [
  {
    id: 'pkg1',
    name: 'ছাত্র স্ট্যান্ডার্ড প্যাকেজ',
    status: STATUSES_OBJECT.ACTIVE,
    packageTypeId: 'pt1',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'pkg2',
    name: 'ছাত্র প্রিমিয়াম প্যাকেজ',
    status: STATUSES_OBJECT.INACTIVE,
    packageTypeId: 'pt2',
    createdAt: '',
    updatedAt: '',
  },
];


// 🔹 Sample data for meal types
export const mockBoardingMealTypes: BoardingMealType[] = [
  { id: 'mt1', name: 'সকালের নাশতা', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'mt2', name: 'দুপুরের পুষ্টিকর খাবার', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'mt3', name: 'রাতের হালকা খাবার', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
];

// 🔹 Sample data for package types
export const mockBoardingPackageTypes: BoardingPackageType[] = [
  { id: 'pt1', name: 'স্ট্যান্ডার্ড প্যাকেজ', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'pt2', name: 'প্রিমিয়াম প্যাকেজ', status: STATUSES_OBJECT.INACTIVE, createdAt: '', updatedAt: '' },
];

// 🔹 Sample data for top-level menu categories
export const mockBoardingMenuCategories: BoardingMenuCategory[] = [
  { id: 'cat3', name: 'চালজাতীয় খাবার', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'cat4', name: 'প্রোটিন/মাংস', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'cat5', name: 'ডাল ও লোবিয়া', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'cat6', name: 'সবজি ও ভাজি', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
];

// 🔹 Sample data for subcategories under each menu category
export const mockBoardingSubMenuCategories: BoardingSubMenuCategory[] = [
  { id: 'sub1', name: 'মুরগির ঝোল', menuCategoryId: 'cat4', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub2', name: 'সাদা ভাত', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub3', name: 'ঘি পোলাও', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub4', name: 'ডিম খিচুড়ি', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub5', name: 'মুশুরির পাতলা ডাল', menuCategoryId: 'cat5', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub6', name: 'মুগ ডালের ভুনা', menuCategoryId: 'cat5', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
];

// 🔹 Sample menu item that combines multiple sub menu items into a dish
export const mockBoardingMenuItems: BoardingMenuItem[] = [
  {
    id: 'menu1',
    name: 'স্টুডেন্ট লাঞ্চ: মুরগি-ভাত-ডাল',
    status: STATUSES_OBJECT.ACTIVE,
    subMenuCategoryIds: ['sub1', 'sub2', 'sub6'],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'menu2',
    name: 'ঘি পোলাও ও মুরগির ঝোল',
    status: STATUSES_OBJECT.ACTIVE,
    subMenuCategoryIds: ['sub3', 'sub1'],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'menu3',
    name: 'ডিম খিচুড়ি সেট',
    status: STATUSES_OBJECT.ACTIVE,
    subMenuCategoryIds: ['sub4'],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'menu4',
    name: 'সাদা ভাত ও মুগ ডাল প্লেট',
    status: STATUSES_OBJECT.ACTIVE,
    subMenuCategoryIds: ['sub2', 'sub6'],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'menu5',
    name: 'মুরগির ঝোল ও পাতলা ডাল',
    status: STATUSES_OBJECT.ACTIVE,
    subMenuCategoryIds: ['sub1', 'sub5'],
    createdAt: '',
    updatedAt: '',
  },
];

// 🔹 Sample assignments of menu items to packages for specific meal types
export const mockBoardingPackageMenuItems: BoardingPackageMenuItem[] = [
  {
    id: 'bpmi1',
    packageId: 'pkg1',
    menuItemId: 'menu1',
    mealTypeId: 'mt1',
    quantity: 1,
    price: 25,
    note: 'Serve before 8 AM',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'bpmi2',
    packageId: 'pkg1',
    menuItemId: 'menu2',
    mealTypeId: 'mt2',
    quantity: 2,
    price: 50,
    note: 'Do not overcook the chicken',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'bpmi3',
    packageId: 'pkg2',
    menuItemId: 'menu3',
    mealTypeId: 'mt3',
    quantity: 1,
    price: 40,
    note: 'Currently unavailable',
    status: STATUSES_OBJECT.INACTIVE,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'bpmi4',
    packageId: 'pkg1',
    menuItemId: 'menu1',
    mealTypeId: 'mt1',
    quantity: 1,
    price: 20,
    note: 'No egg allowed in this plate',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'bpmi5',
    packageId: 'pkg2',
    menuItemId: 'menu4',
    mealTypeId: 'mt2',
    quantity: 1,
    price: 30,
    note: 'Serve with warm rice',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'bpmi6',
    packageId: 'pkg2',
    menuItemId: 'menu5',
    mealTypeId: 'mt3',
    quantity: 1,
    price: 35,
    note: 'Chicken gravy must be spicy',
    status: STATUSES_OBJECT.ACTIVE,
    createdAt: '',
    updatedAt: '',
  },
];


// 🔹 Sample data for full day meal packages
const mockFullDayMealPackages: FullDayMealPackage[] = [
  {
    id: 'fdmp1',
    name: 'Student Complete Day Package',
    status: STATUSES_OBJECT.ACTIVE,
    packageTypeId: 'pt1', // Standard Package
    packageId: 'pkg1', // Student Standard Package
    price: 150,
    note: 'Complete three meals for students',
    meals: [
      {
        id: 'ms1',
        mealTypeId: 'mt1', // Morning breakfast
        menuItemId: 'menu3', // Egg khichuri set
      },
      {
        id: 'ms2',
        mealTypeId: 'mt2', // Lunch
        menuItemId: 'menu1', // Student lunch: chicken-rice-dal
      },
      {
        id: 'ms3',
        mealTypeId: 'mt3', // Dinner
        menuItemId: 'menu4', // White rice and mung dal plate
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fdmp2',
    name: 'Premium Teacher Full Day Package',
    status: STATUSES_OBJECT.ACTIVE,
    packageTypeId: 'pt2', // Premium Package
    packageId: 'pkg2', // Student Premium Package
    price: 250,
    note: 'Premium meals for teacher and staff',
    meals: [
      {
        id: 'ms4',
        mealTypeId: 'mt1', // Morning breakfast
        menuItemId: 'menu2', // Ghee polao and chicken curry
      },
      {
        id: 'ms5',
        mealTypeId: 'mt2', // Lunch
        menuItemId: 'menu5', // Chicken curry and thin dal
      },
      {
        id: 'ms6',
        mealTypeId: 'mt3', // Dinner
        menuItemId: 'menu2', // Ghee polao and chicken curry
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];



/**
 * Boarding API service class
 */
class MasterBoardingApiService extends BaseApiService {
  private boardingPackageTypes = [...mockBoardingPackageTypes];
  private boardingMenuCategories = [...mockBoardingMenuCategories];
  private boardingSubMenuCategories = [...mockBoardingSubMenuCategories];
  private boardingMealTypes = [...mockBoardingMealTypes];
  private boardingMenuItems = [...mockBoardingMenuItems];
  private boardingPackages = [...mockBoardingPackages];
  private boardingPackageMenuItems = [...mockBoardingPackageMenuItems];
  private fullDayMealPackages = [...mockFullDayMealPackages];
  private mockIdCounter = 100;
  private mockMenuCategoryCounter = 100;
  private mockSubMenuCategoryCounter = 100;
  private mockMealTypeCounter = 100;
  private mockMenuItemCounter = 100;
  private mockPackageCounter = 100;
  private mockPackageMenuItemCounter = 100;
  private mockMealPackageCounter = 100;
  private mockFullDayMealPackageCounter = 100;

  // Boarding Package Type CRUD operations
  async getBoardingPackageTypes(params: { page?: number; limit?: number; filters?: BoardingPackageTypeFilters } = {}): Promise<PaginatedResponse<BoardingPackageType>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.boardingPackageTypes];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(type =>
        type.name.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(type => type.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBoardingPackageType(data: CreateBoardingPackageTypeDto): Promise<BoardingPackageType> {
    await this.simulateDelay();
    const newType: BoardingPackageType = {
      id: `bpt${this.mockIdCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.boardingPackageTypes = [newType, ...this.boardingPackageTypes];
    return newType;
  }

  async updateBoardingPackageType(id: string, data: UpdateBoardingPackageTypeDto): Promise<BoardingPackageType> {
    await this.simulateDelay();
    const index = this.boardingPackageTypes.findIndex(type => type.id === id);
    if (index === -1) throw new Error('Boarding package type not found');

    this.boardingPackageTypes[index] = { ...this.boardingPackageTypes[index], ...data, updatedAt: new Date().toISOString() };
    return this.boardingPackageTypes[index];
  }

  async deleteBoardingPackageType(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingPackageTypes.length;
    this.boardingPackageTypes = this.boardingPackageTypes.filter(type => type.id !== id);
    if (this.boardingPackageTypes.length === initialLength) {
      throw new Error('Boarding package type not found');
    }
  }

  // Boarding Menu Category CRUD operations
  async getBoardingMenuCategories(params: { page?: number; limit?: number; filters?: BoardingMenuCategoryFilters } = {}): Promise<PaginatedResponse<BoardingMenuCategory>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.boardingMenuCategories];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(category => category.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBoardingMenuCategory(data: CreateBoardingMenuCategoryDto): Promise<BoardingMenuCategory> {
    await this.simulateDelay();
    const newCategory: BoardingMenuCategory = {
      id: `bmc${this.mockMenuCategoryCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    } as BoardingMenuCategory;
    this.boardingMenuCategories = [newCategory, ...this.boardingMenuCategories];
    return newCategory;
  }

  async updateBoardingMenuCategory(id: string, data: UpdateBoardingMenuCategoryDto): Promise<BoardingMenuCategory> {
    await this.simulateDelay();
    const index = this.boardingMenuCategories.findIndex(category => category.id === id);
    if (index === -1) throw new Error('Boarding menu category not found');

    this.boardingMenuCategories[index] = { ...this.boardingMenuCategories[index], ...data, updatedAt: new Date().toISOString() } as BoardingMenuCategory;
    return this.boardingMenuCategories[index];
  }

  async deleteBoardingMenuCategory(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingMenuCategories.length;
    this.boardingMenuCategories = this.boardingMenuCategories.filter(category => category.id !== id);
    if (this.boardingMenuCategories.length === initialLength) {
      throw new Error('Boarding menu category not found');
    }
  }

  // Boarding Sub Menu Category CRUD operations
  async getBoardingSubMenuCategories(params: { page?: number; limit?: number; filters?: BoardingSubMenuCategoryFilters } = {}): Promise<PaginatedResponse<BoardingSubMenuCategory>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.boardingSubMenuCategories];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(category => category.status === filters.status);
    }

    if (filters.menuCategoryId) {
      filtered = filtered.filter(category => category.menuCategoryId === filters.menuCategoryId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBoardingSubMenuCategory(data: CreateBoardingSubMenuCategoryDto): Promise<BoardingSubMenuCategory> {
    await this.simulateDelay();
    const newCategory: BoardingSubMenuCategory = {
      id: `bsmc${this.mockSubMenuCategoryCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    } as BoardingSubMenuCategory;
    this.boardingSubMenuCategories = [newCategory, ...this.boardingSubMenuCategories];
    return newCategory;
  }

  async updateBoardingSubMenuCategory(id: string, data: UpdateBoardingSubMenuCategoryDto): Promise<BoardingSubMenuCategory> {
    await this.simulateDelay();
    const index = this.boardingSubMenuCategories.findIndex(category => category.id === id);
    if (index === -1) throw new Error('Boarding sub menu category not found');

    this.boardingSubMenuCategories[index] = { ...this.boardingSubMenuCategories[index], ...data, updatedAt: new Date().toISOString() } as BoardingSubMenuCategory;
    return this.boardingSubMenuCategories[index];
  }

  async deleteBoardingSubMenuCategory(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingSubMenuCategories.length;
    this.boardingSubMenuCategories = this.boardingSubMenuCategories.filter(category => category.id !== id);
    if (this.boardingSubMenuCategories.length === initialLength) {
      throw new Error('Boarding sub menu category not found');
    }
  }

  // Boarding Meal Type CRUD operations
  async getBoardingMealTypes(params: { page?: number; limit?: number; filters?: BoardingMealTypeFilters } = {}): Promise<PaginatedResponse<BoardingMealType>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.boardingMealTypes];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(type =>
        type.name.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(type => type.status === filters.status);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBoardingMealType(data: CreateBoardingMealTypeDto): Promise<BoardingMealType> {
    await this.simulateDelay();
    const newType: BoardingMealType = {
      id: `bmt${this.mockMealTypeCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    } as BoardingMealType;
    this.boardingMealTypes = [newType, ...this.boardingMealTypes];
    return newType;
  }

  async updateBoardingMealType(id: string, data: UpdateBoardingMealTypeDto): Promise<BoardingMealType> {
    await this.simulateDelay();
    const index = this.boardingMealTypes.findIndex(type => type.id === id);
    if (index === -1) throw new Error('Boarding meal type not found');

    this.boardingMealTypes[index] = { ...this.boardingMealTypes[index], ...data, updatedAt: new Date().toISOString() } as BoardingMealType;
    return this.boardingMealTypes[index];
  }

  async deleteBoardingMealType(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingMealTypes.length;
    this.boardingMealTypes = this.boardingMealTypes.filter(type => type.id !== id);
    if (this.boardingMealTypes.length === initialLength) {
      throw new Error('Boarding meal type not found');
    }
  }

  // Boarding Menu Item CRUD operations
  async getBoardingMenuItems(params: { page?: number; limit?: number; filters?: BoardingMenuItemFilters } = {}): Promise<PaginatedResponse<BoardingMenuItem>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.boardingMenuItems];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.subMenuCategoryIds && filters.subMenuCategoryIds.length > 0) {
      filtered = filtered.filter(item =>
        item.subMenuCategoryIds.some(id => filters.subMenuCategoryIds?.includes(id))
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBoardingMenuItem(data: CreateBoardingMenuItemDto): Promise<BoardingMenuItem> {
    await this.simulateDelay();
    const newItem: BoardingMenuItem = {
      id: `bmi${this.mockMenuItemCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    } as BoardingMenuItem;
    this.boardingMenuItems = [newItem, ...this.boardingMenuItems];
    return newItem;
  }

  async updateBoardingMenuItem(id: string, data: UpdateBoardingMenuItemDto): Promise<BoardingMenuItem> {
    await this.simulateDelay();
    const index = this.boardingMenuItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Boarding menu item not found');

    this.boardingMenuItems[index] = { ...this.boardingMenuItems[index], ...data, updatedAt: new Date().toISOString() } as BoardingMenuItem;
    return this.boardingMenuItems[index];
  }

  async deleteBoardingMenuItem(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingMenuItems.length;
    this.boardingMenuItems = this.boardingMenuItems.filter(item => item.id !== id);
    if (this.boardingMenuItems.length === initialLength) {
      throw new Error('Boarding menu item not found');
    }
  }

  // Boarding Package CRUD operations
  async getBoardingPackages(params: { page?: number; limit?: number; filters?: BoardingPackageFilters } = {}): Promise<PaginatedResponse<BoardingPackage>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.boardingPackages];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(pkg => pkg.status === filters.status);
    }

    // if (filters.mealTypeId) {
    //   filtered = filtered.filter(pkg => pkg.mealTypeId === filters.mealTypeId);
    // }

    if (filters.packageTypeId) {
      filtered = filtered.filter(pkg => pkg.packageTypeId === filters.packageTypeId);
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createBoardingPackage(data: CreateBoardingPackageDto): Promise<BoardingPackage> {
    await this.simulateDelay();
    const newPackage: BoardingPackage = {
      id: `bp${this.mockPackageCounter++}`,
      ...data,
      createdAt: new Date().toISOString(),
    } as BoardingPackage;
    this.boardingPackages = [newPackage, ...this.boardingPackages];
    return newPackage;
  }

  async updateBoardingPackage(id: string, data: UpdateBoardingPackageDto): Promise<BoardingPackage> {
    await this.simulateDelay();
    const index = this.boardingPackages.findIndex(pkg => pkg.id === id);
    if (index === -1) throw new Error('Boarding package not found');

    this.boardingPackages[index] = { ...this.boardingPackages[index], ...data, updatedAt: new Date().toISOString() } as BoardingPackage;
    return this.boardingPackages[index];
  }

  async deleteBoardingPackage(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingPackages.length;
    this.boardingPackages = this.boardingPackages.filter(pkg => pkg.id !== id);
    if (this.boardingPackages.length === initialLength) {
      throw new Error('Boarding package not found');
    }
  }


async getBoardingPackageMenuItems(params: { page?: number; limit?: number; filters?: BoardingPackageMenuItemFilters } = {}): Promise<PaginatedResponse<BoardingPackageMenuItem>> {
  await this.simulateDelay(300);
  const { page = 1, limit = 10, filters = {} } = params;

  let filtered = [...mockBoardingPackageMenuItems];

  if (filters.packageId) {
    filtered = filtered.filter(item => item.packageId === filters.packageId);
  }
  if (filters.menuItemId) {
    filtered = filtered.filter(item => item.menuItemId === filters.menuItemId);
  }
  if (filters.mealTypeId) {
    filtered = filtered.filter(item => item.mealTypeId === filters.mealTypeId);
  }
  if (filters.status) {
    filtered = filtered.filter(item => item.status === filters.status);
  }
  if (filters.quantity !== undefined) {
    filtered = filtered.filter(item => item.quantity === filters.quantity);
  }
  if (filters.price !== undefined) {
    filtered = filtered.filter(item => item.price === filters.price);
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  return { data, total, page, limit, totalPages };
}

async createBoardingPackageMenuItem(data: CreateBoardingPackageMenuItemDto): Promise<BoardingPackageMenuItem> {
  await this.simulateDelay();
  const newItem: BoardingPackageMenuItem = {
    id: `bpmi${this.mockPackageMenuItemCounter++}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  this.boardingPackageMenuItems = [newItem, ...this.boardingPackageMenuItems];
  return newItem;
}

async updateBoardingPackageMenuItem(id: string, data: UpdateBoardingPackageMenuItemDto): Promise<BoardingPackageMenuItem> {
  await this.simulateDelay();

  const index = this.boardingPackageMenuItems.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error('Boarding package menu item not found');
  }

  const currentItem = this.boardingPackageMenuItems[index];
  const updatedItem: BoardingPackageMenuItem = {
    ...currentItem,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  this.boardingPackageMenuItems[index] = updatedItem;
  return updatedItem;
}


  async deleteBoardingPackageMenuItem(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingPackageMenuItems.length;
    this.boardingPackageMenuItems = this.boardingPackageMenuItems.filter(item => item.id !== id);
    if (this.boardingPackageMenuItems.length === initialLength) {
      throw new Error('Boarding package menu item not found');
    }
  }

  // Boarding Meal Package CRUD operations


  // Full Day Meal Package CRUD operations
  async getFullDayMealPackages(params: { page?: number; limit?: number; filters?: FullDayMealPackageFilters } = {}): Promise<PaginatedResponse<FullDayMealPackage>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.fullDayMealPackages];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(search) ||
        pkg.note?.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(pkg => pkg.status === filters.status);
    }

    if (filters.packageTypeId) {
      filtered = filtered.filter(pkg => pkg.packageTypeId === filters.packageTypeId);
    }

    if (filters.packageId) {
      filtered = filtered.filter(pkg => pkg.packageId === filters.packageId);
    }

    if (filters.mealTypeId) {
      filtered = filtered.filter(pkg =>
        pkg.meals.some(meal => meal.mealTypeId === filters.mealTypeId)
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }

  async createFullDayMealPackage(data: CreateFullDayMealPackageDto): Promise<FullDayMealPackage> {
    await this.simulateDelay();
    const newPackage: FullDayMealPackage = {
      id: `fdmp${this.mockFullDayMealPackageCounter++}`,
      name: data.name,
      status: data.status,
      packageTypeId: data.packageTypeId,
      packageId: data.packageId,
      price: data.price,
      note: data.note,
      meals: data.meals.map((meal, index) => ({
        id: `ms${this.mockFullDayMealPackageCounter}_${index}`,
        mealTypeId: meal.mealTypeId,
        menuItemId: meal.menuItemId,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.fullDayMealPackages = [newPackage, ...this.fullDayMealPackages];
    return newPackage;
  }

  async updateFullDayMealPackage(id: string, data: UpdateFullDayMealPackageDto): Promise<FullDayMealPackage> {
    await this.simulateDelay();
    const index = this.fullDayMealPackages.findIndex(pkg => pkg.id === id);
    if (index === -1) throw new Error('Full day meal package not found');

    const updatedPackage: FullDayMealPackage = {
      ...this.fullDayMealPackages[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // If meals are being updated, ensure they have proper IDs
    if (data.meals) {
      updatedPackage.meals = data.meals.map((meal, mealIndex) => ({
        id: meal.id || `ms${id}_${mealIndex}`,
        mealTypeId: meal.mealTypeId,
        menuItemId: meal.menuItemId,
      }));
    }

    this.fullDayMealPackages[index] = updatedPackage;
    return updatedPackage;
  }

  async deleteFullDayMealPackage(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.fullDayMealPackages.length;
    this.fullDayMealPackages = this.fullDayMealPackages.filter(pkg => pkg.id !== id);
    if (this.fullDayMealPackages.length === initialLength) {
      throw new Error('Full day meal package not found');
    }
  }

  // Get all simple entities for dropdowns
  async getAllMasterBoardingEntities(): Promise<{
    packageTypes: BoardingPackageType[];
    packages: BoardingPackage[];
    fullDayMealPackages: FullDayMealPackage[];
    mealTypes: BoardingMealType[];
    menuCategories: BoardingMenuCategory[];
    subMenuCategories: BoardingSubMenuCategory[];
    menuItems: BoardingMenuItem[];
  }> {
    await this.simulateDelay(200);
    return {
      packageTypes: this.boardingPackageTypes,
      packages: this.boardingPackages,
      fullDayMealPackages: this.fullDayMealPackages,
      mealTypes: this.boardingMealTypes,
      menuCategories: this.boardingMenuCategories,
      subMenuCategories: this.boardingSubMenuCategories,
      menuItems: this.boardingMenuItems,
    };
  }
}

export const masterBoardingApi = new MasterBoardingApiService();