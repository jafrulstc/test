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
} from '~/features/boarding/core/types/masterBoardingType';
  BoardingMealPackages,
  BoardingMealPackageFilters,
  CreateBoardingMealPackageDto,
  UpdateBoardingMealPackageDto,
import { STATUSES_OBJECT } from '~/shared/constants/sharedConstants';

// const mockBoardingMealTypes: BoardingMealType[] = [
//   {
//     id: "f32a7c52-4536-4d8c-a7a2-12c37d9c3a11",
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     name: "সকালের নাস্তা",
//     status: "Active"
//   },
//   {
//     id: "64e8a2f9-9c10-4f79-90b4-d81acdc0ab01",
//     createdAt: new Date().toISOString(),
//     name: "দুপুরের খাবার",
//     status: "Active"
//   },
//   {
//     id: "bc9f7775-a7de-40b1-b0f2-347e904f6f88",
//     createdAt: new Date().toISOString(),
//     name: "রাতের খাবার",
//     status: "Inactive"
//   }
// ];

// const mockBoardingPackageTypes: BoardingPackageType[] = [
//   {
//     id: "a33a60aa-8c23-4c2e-8f34-f9e6b6bca211",
//     createdAt: new Date().toISOString(),
//     name: "বেসিক প্যাকেজ",
//     status: "Active"
//   },
//   {
//     id: "fefb3df7-46e0-4f5d-ae34-9e3c748d29f0",
//     createdAt: new Date().toISOString(),
//     name: "স্ট্যান্ডার্ড প্যাকেজ",
//     status: "Active"
//   },
//   {
//     id: "7c62b0f0-a3a0-4c5d-b877-d20f16f2c8f9",
//     createdAt: new Date().toISOString(),
//     name: "ডিলাক্স প্যাকেজ",
//     status: "Inactive"
//   }
// ];

// const mockBoardingMenuCategories: BoardingMenuCategory[] = [
//   {
//     id: "c1eb2ba3-477e-4897-81a9-dde9d61ba92f",
//     createdAt: new Date().toISOString(),
//     name: "ভাত",
//     status: "Active"
//   },
//   {
//     id: "ed7529f4-f2b5-47ef-870f-3c2a18580bfc",
//     createdAt: new Date().toISOString(),
//     name: "সবজি",
//     status: "Active"
//   },
//   {
//     id: "23d2dc5e-9a7b-4f61-a5a2-9af1e7904ad4",
//     createdAt: new Date().toISOString(),
//     name: "মাংস",
//     status: "Active"
//   }
// ];

// const mockBoardingSubMenuCategories: BoardingSubMenuCategory[] = [
//   {
//     id: "d1a5f216-3f29-4dab-a426-70f9d1f0d235",
//     createdAt: new Date().toISOString(),
//     name: "মুরগির মাংস",
//     status: "Active",
//     menuCategoryId: "23d2dc5e-9a7b-4f61-a5a2-9af1e7904ad4"
//   },
//   {
//     id: "82ef9b11-580b-4e33-b917-3fd0f7c08ea1",
//     createdAt: new Date().toISOString(),
//     name: "গরুর মাংস",
//     status: "Inactive",
//     menuCategoryId: "23d2dc5e-9a7b-4f61-a5a2-9af1e7904ad4"
//   },
//   {
//     id: "ac30394e-212f-4f5e-9a3c-b01253b3f514",
//     createdAt: new Date().toISOString(),
//     name: "আলুর তরকারি",
//     status: "Active",
//     menuCategoryId: "ed7529f4-f2b5-47ef-870f-3c2a18580bfc"
//   }
// ];

// const mockBoardingMenuItems: BoardingMenuItem[] = [
//   {
//     id: "af391a8e-7583-4370-8e54-9e97d9ea6d2f",
//     createdAt: new Date().toISOString(),
//     name: "রোস্ট",
//     status: "Active",
//     subMenuCategoryIds: ["d1a5f216-3f29-4dab-a426-70f9d1f0d235"]
//   },
//   {
//     id: "ec2501f5-336e-4df0-bf3a-fcdbfc1d98ab",
//     createdAt: new Date().toISOString(),
//     name: "ঝাল গরুর মাংস",
//     status: "Active",
//     subMenuCategoryIds: ["82ef9b11-580b-4e33-b917-3fd0f7c08ea1"]
//   },
//   {
//     id: "95c6b5e9-bf46-45d7-a4e8-c9c580b0e1c7",
//     createdAt: new Date().toISOString(),
//     name: "আলু ভাজি",
//     status: "Inactive",
//     subMenuCategoryIds: ["ac30394e-212f-4f5e-9a3c-b01253b3f514"]
//   }
// ];

// const mockBoardingPackages: BoardingPackage[] = [
//   {
//     id: "c1c09346-d9d3-48fc-b647-9f7289f1a7d2",
//     createdAt: new Date().toISOString(),
//     name: "স্টুডেন্ট প্যাকেজ",
//     status: "Active",
//     // mealTypeId: "f32a7c52-4536-4d8c-a7a2-12c37d9c3a11",
//     packageTypeId: "a33a60aa-8c23-4c2e-8f34-f9e6b6bca211"
//   },
//   {
//     id: "a0538d71-5db1-4fc5-a2d2-6d3624375c78",
//     createdAt: new Date().toISOString(),
//     name: "ডিলাক্স অফিসার প্যাকেজ",
//     status: "Inactive",
//     // mealTypeId: "64e8a2f9-9c10-4f79-90b4-d81acdc0ab01",
//     packageTypeId: "7c62b0f0-a3a0-4c5d-b877-d20f16f2c8f9"
//   }
// ];

// const mockBoardingPackageMenuItems: BoardingPackageMenuItem[] = [
//   {
//     id: "e8f54d4c-2e79-4f29-9675-8049c2cf6376",
//     createdAt: new Date().toISOString(),
//     packageId: "c1c09346-d9d3-48fc-b647-9f7289f1a7d2",
//     menuItemId: "af391a8e-7583-4370-8e54-9e97d9ea6d2f",
//     mealTypeId: '',
//   },
//   {
//     id: "ed376bc6-3c2e-45d1-b906-bc6ffb6b922b",
//     createdAt: new Date().toISOString(),
//     packageId: "a0538d71-5db1-4fc5-a2d2-6d3624375c78",
//     menuItemId: "95c6b5e9-bf46-45d7-a4e8-c9c580b0e1c7",
//     mealTypeId: '',
//   }
// ];


// 🔹 BoardingMealType

const dtest = 'sgdsd';

// const mockBoardingMealTypes: BoardingMealType[] = [
//   { id: 'mt1', name: 'Breakfast', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'mt2', name: 'Lunch', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'mt3', name: 'Dinner', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 BoardingPackageType
// const mockBoardingPackageTypes: BoardingPackageType[] = [
//   { id: 'pt1', name: 'Standard', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'pt2', name: 'Premium', status: STATUSES_OBJECT.INACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 BoardingMenuCategory
// const mockBoardingMenuCategories: BoardingMenuCategory[] = [
//   { id: 'cat1', name: 'Protein', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'cat2', name: 'Carbohydrate', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 BoardingSubMenuCategory
// const mockBoardingSubMenuCategories: BoardingSubMenuCategory[] = [
//   { id: 'sub1', name: 'Chicken', menuCategoryId: 'cat1', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'sub2', name: 'Rice', menuCategoryId: 'cat2', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 BoardingMenuItem
// const mockBoardingMenuItems: BoardingMenuItem[] = [
//   {
//     id: 'menu1',
//     name: 'Paratha',
//     status: STATUSES_OBJECT.ACTIVE,
//     subMenuCategoryIds: ['sub2'],
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'menu2',
//     name: 'Grilled Chicken',
//     status: STATUSES_OBJECT.ACTIVE,
//     subMenuCategoryIds: ['sub1'],
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'menu3',
//     name: 'Steamed Rice',
//     status: STATUSES_OBJECT.INACTIVE,
//     subMenuCategoryIds: ['sub2'],
//     createdAt: '',
//     updatedAt: '',
//   },
// ];

// // 🔹 BoardingPackage
// const mockBoardingPackages: BoardingPackage[] = [
//   {
//     id: 'pkg1',
//     name: 'Student Standard Package',
//     status: STATUSES_OBJECT.ACTIVE,
//     packageTypeId: 'pt1',
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'pkg2',
//     name: 'Student Premium Package',
//     status: STATUSES_OBJECT.INACTIVE,
//     packageTypeId: 'pt2',
//     createdAt: '',
//     updatedAt: '',
//   },
// ];

// // 🔹 BoardingPackageMenuItem
// const mockBoardingPackageMenuItems: BoardingPackageMenuItem[] = [
//   {
//     id: 'bpmi1',
//     packageId: 'pkg1',
//     menuItemId: 'menu1',
//     mealTypeId: 'mt1',
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi2',
//     packageId: 'pkg1',
//     menuItemId: 'menu2',
//     mealTypeId: 'mt2',
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi3',
//     packageId: 'pkg2',
//     menuItemId: 'menu3',
//     mealTypeId: 'mt3',
//     createdAt: '',
//     updatedAt: '',
//   },
// ];


const dgsd = 'sgsd';


// // 🔹 Meal Types (খাবার ধরণ)
// const mockBoardingMealTypes: BoardingMealType[] = [
//   { id: 'mt1', name: 'সকালের নাস্তা', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'mt2', name: 'দুপুরের খাবার', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'mt3', name: 'রাতের খাবার', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 Package Types (প্যাকেজ ধরণ)
// const mockBoardingPackageTypes: BoardingPackageType[] = [
//   { id: 'pt1', name: 'স্ট্যান্ডার্ড প্যাকেজ', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'pt2', name: 'প্রিমিয়াম প্যাকেজ', status: STATUSES_OBJECT.INACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 Menu Categories (মেনু বিভাগ)
// const mockBoardingMenuCategories: BoardingMenuCategory[] = [
//   { id: 'cat1', name: 'প্রোটিন', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'cat2', name: 'কার্বোহাইড্রেট', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'cat3', name: 'ভাত', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'cat4', name: 'মাংস', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'cat5', name: 'ডাল', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'cat6', name: 'সবজি', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 Sub Menu Categories (সাব-মেনু বিভাগ)
// const mockBoardingSubMenuCategories: BoardingSubMenuCategory[] = [
//   { id: 'sub1', name: 'মুরগি', menuCategoryId: 'cat4', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'sub2', name: 'সাদা ভাত', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'sub3', name: 'পোলাও', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'sub4', name: 'খিচুরি', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'sub5', name: 'মুশুরির ডাল', menuCategoryId: 'cat5', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
//   { id: 'sub6', name: 'মুগ ডাল', menuCategoryId: 'cat5', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
// ];

// // 🔹 Menu Items (মেনু আইটেম)
// const mockBoardingMenuItems: BoardingMenuItem[] = [
//   {
//     id: 'menu1',
//     name: 'পরোটা',
//     status: STATUSES_OBJECT.ACTIVE,
//     subMenuCategoryIds: ['sub2'],
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'menu2',
//     name: 'গ্রিল মুরগি',
//     status: STATUSES_OBJECT.ACTIVE,
//     subMenuCategoryIds: ['sub1'],
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'menu3',
//     name: 'সিদ্ধ ভাত',
//     status: STATUSES_OBJECT.INACTIVE,
//     subMenuCategoryIds: ['sub2'],
//     createdAt: '',
//     updatedAt: '',
//   },

//   {
//     id: 'menu4',
//     name: 'সাদা ভাত-মুরগি-ডাল প্লেট',
//     status: STATUSES_OBJECT.ACTIVE,
//     subMenuCategoryIds: ['sub1, sub2, sub5'],
//     createdAt: '',
//     updatedAt: '',
//   },

// ];

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

// 🔹 Boarding Package Menu Items (প্যাকেজ অনুযায়ী মেনু)
// const mockBoardingPackageMenuItems: BoardingPackageMenuItem[] = [
//   {
//     id: 'bpmi1',
//     packageId: 'pkg1',
//     menuItemId: 'menu1',
//     mealTypeId: 'mt1', // সকালের নাস্তা
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi2',
//     packageId: 'pkg1',
//     menuItemId: 'menu2',
//     mealTypeId: 'mt2', // দুপুরের খাবার
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi3',
//     packageId: 'pkg2',
//     menuItemId: 'menu3',
//     mealTypeId: 'mt3', // রাতের খাবার
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi4',
//     packageId: 'pkg1',
//     menuItemId: 'menu4',
//     mealTypeId: 'mt1', // সকালের নাস্তা
//     createdAt: '',
//     updatedAt: '',
//   },
// ];

// const mockBoardingPackageMenuItems: BoardingPackageMenuItem[] = [
//   {
//     id: 'bpmi1',
//     packageId: 'pkg1',
//     menuItemId: 'menu1',
//     mealTypeId: 'mt1',
//     quantity: 1,
//     price: 25,
//     note: 'সকাল ৮টার মধ্যে পরিবেশন',
//     status: STATUSES_OBJECT.ACTIVE,
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi2',
//     packageId: 'pkg1',
//     menuItemId: 'menu2',
//     mealTypeId: 'mt2',
//     quantity: 2,
//     price: 50,
//     note: 'মুরগি অতিরিক্ত সিদ্ধ না হয়',
//     status: STATUSES_OBJECT.ACTIVE,
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi3',
//     packageId: 'pkg2',
//     menuItemId: 'menu3',
//     mealTypeId: 'mt3',
//     quantity: 1,
//     price: 40,
//     note: '',
//     status: STATUSES_OBJECT.INACTIVE,
//     createdAt: '',
//     updatedAt: '',
//   },
//   {
//     id: 'bpmi4',
//     packageId: 'pkg1',
//     menuItemId: 'menu4',
//     mealTypeId: 'mt1',
//     quantity: 1,
//     price: 20,
//     note: 'ডিম দেওয়া যাবে না',
//     status: STATUSES_OBJECT.ACTIVE,
//     createdAt: '',
//     updatedAt: '',
//   },
// ];


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
  { id: 'cat3', name: 'চালজাতীয় খাবার', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'cat4', name: 'প্রোটিন/মাংস', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'cat5', name: 'ডাল ও লোবিয়া', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'cat6', name: 'সবজি ও ভাজি', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
];

// 🔹 Sample data for subcategories under each menu category
export const mockBoardingSubMenuCategories: BoardingSubMenuCategory[] = [
  { id: 'sub1', name: 'মুরগির ঝোল', menuCategoryId: 'cat4', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub2', name: 'সাদা ভাত', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub3', name: 'ঘি পোলাও', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
  { id: 'sub4', name: 'ডিম খিচুড়ি', menuCategoryId: 'cat3', status: STATUSES_OBJECT.ACTIVE, createdAt: '', updatedAt: '' },
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
    name: 'ডিম খিচুড়ি সেট',
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

// 🔹 Sample data for meal packages
export const mockBoardingMealPackages: BoardingMealPackage[] = [
  {
    id: 'mp1',
    name: 'স্টুডেন্ট ফুল ডে প্যাকেজ',
    status: STATUSES_OBJECT.ACTIVE,
    meals: [
      {
        id: 'fdm1',
        mealTypeId: 'mt1', // সকালের নাশতা
        packageId: 'pkg1', // ছাত্র স্ট্যান্ডার্ড প্যাকেজ
        menuItemId: 'menu3', // ডিম খিচুড়ি সেট
        quantity: 1,
        price: 30,
        status: STATUSES_OBJECT.ACTIVE,
        note: 'সকাল ৮টার মধ্যে পরিবেশন',
      },
      {
        id: 'fdm2',
        mealTypeId: 'mt2', // দুপুরের পুষ্টিকর খাবার
        packageId: 'pkg1', // ছাত্র স্ট্যান্ডার্ড প্যাকেজ
        menuItemId: 'menu1', // স্টুডেন্ট লাঞ্চ: মুরগি-ভাত-ডাল
        quantity: 1,
        price: 60,
        status: STATUSES_OBJECT.ACTIVE,
        note: 'দুপুর ১২টা থেকে ২টার মধ্যে',
      },
      {
        id: 'fdm3',
        mealTypeId: 'mt3', // রাতের হালকা খাবার
        packageId: 'pkg1', // ছাত্র স্ট্যান্ডার্ড প্যাকেজ
        menuItemId: 'menu4', // সাদা ভাত ও মুগ ডাল প্লেট
        quantity: 1,
        price: 40,
        status: STATUSES_OBJECT.ACTIVE,
        note: 'রাত ৮টার পর পরিবেশন',
      },
    ],
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'mp2',
    name: 'প্রিমিয়াম ডিনার প্যাকেজ',
    status: STATUSES_OBJECT.ACTIVE,
    meals: [
      {
        id: 'fdm4',
        mealTypeId: 'mt3', // রাতের হালকা খাবার
        packageId: 'pkg2', // ছাত্র প্রিমিয়াম প্যাকেজ
        menuItemId: 'menu2', // ঘি পোলাও ও মুরগির ঝোল
        quantity: 1,
        price: 80,
        status: STATUSES_OBJECT.ACTIVE,
        note: 'বিশেষ অনুষ্ঠানের জন্য',
      },
    ],
    createdAt: '',
    updatedAt: '',
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
  private boardingMealPackages = [...mockBoardingMealPackages];
  private mockIdCounter = 100;
  private mockMenuCategoryCounter = 100;
  private mockSubMenuCategoryCounter = 100;
  private mockMealTypeCounter = 100;
  private mockMenuItemCounter = 100;
  private mockPackageCounter = 100;
  private mockPackageMenuItemCounter = 100;
  private mockMealPackageCounter = 100;

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

  // Boarding Package Menu Item CRUD operations
  // async getBoardingPackageMenuItems(): Promise<BoardingPackageMenuItem[]> {
  //   await this.simulateDelay(300);
  //   return [...this.boardingPackageMenuItems];
  // }

  // async getBoardingPackageMenuItems(params: { page?: number; limit?: number; filters?: BoardingPackageMenuItemFilters } = {}): Promise<PaginatedResponse<BoardingPackageMenuItem>> {
  //   await this.simulateDelay(300);
  //   const { page = 1, limit = 10, filters = {} } = params;

  //   let filtered = [...mockBoardingPackageMenuItems];

  //   if (filters.packageId) {
  //     filtered = filtered.filter(item => item.packageId === filters.packageId);
  //   }
  //   if (filters.menuItemId) {
  //     filtered = filtered.filter(item => item.menuItemId === filters.menuItemId);
  //   }
  //   if (filters.mealTypeId) {
  //     filtered = filtered.filter(item => item.mealTypeId === filters.mealTypeId);
  //   }

  //   const total = filtered.length;
  //   const totalPages = Math.ceil(total / limit);
  //   const startIndex = (page - 1) * limit;
  //   const data = filtered.slice(startIndex, startIndex + limit);

  //   return { data, total, page, limit, totalPages }; // পেজিনেশন ডেটা সহ রিটার্ন করুন
  // }

  // async createBoardingPackageMenuItem(data: CreateBoardingPackageMenuItemDto): Promise<BoardingPackageMenuItem> {
  //   await this.simulateDelay();
  //   const newItem: BoardingPackageMenuItem = {
  //     id: `bpmi${this.mockPackageMenuItemCounter++}`,
  //     ...data,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   } as BoardingPackageMenuItem;
  //   this.boardingPackageMenuItems = [newItem, ...this.boardingPackageMenuItems];
  //   return newItem;
  // }


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
  async getBoardingMealPackages(params: { page?: number; limit?: number; filters?: BoardingMealPackageFilters } = {}): Promise<PaginatedResponse<BoardingMealPackage>> {
    await this.simulateDelay(300);
    const { page = 1, limit = 10, filters = {} } = params;

    let filtered = [...this.boardingMealPackages];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(search)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(pkg => pkg.status === filters.status);
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

  async createBoardingMealPackage(data: CreateBoardingMealPackageDto): Promise<BoardingMealPackage> {
    await this.simulateDelay();
    const newPackage: BoardingMealPackage = {
      id: `mp${this.mockMealPackageCounter++}`,
      name: data.name,
      status: data.status,
      meals: data.meals.map((meal, index) => ({
        id: `fdm${this.mockMealPackageCounter}_${index}`,
        ...meal,
      })),
      createdAt: new Date().toISOString(),
    };
    this.boardingMealPackages = [newPackage, ...this.boardingMealPackages];
    return newPackage;
  }

  async updateBoardingMealPackage(id: string, data: UpdateBoardingMealPackageDto): Promise<BoardingMealPackage> {
    await this.simulateDelay();
    const index = this.boardingMealPackages.findIndex(pkg => pkg.id === id);
    if (index === -1) throw new Error('Boarding meal package not found');

    const updatedPackage: BoardingMealPackage = {
      ...this.boardingMealPackages[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    // If meals are being updated, ensure they have proper IDs
    if (data.meals) {
      updatedPackage.meals = data.meals.map((meal, mealIndex) => ({
        id: meal.id || `fdm${id}_${mealIndex}`,
        mealTypeId: meal.mealTypeId!,
        packageId: meal.packageId!,
        menuItemId: meal.menuItemId!,
        quantity: meal.quantity!,
        price: meal.price!,
        status: meal.status!,
        note: meal.note,
      }));
    }

    this.boardingMealPackages[index] = updatedPackage;
    return updatedPackage;
  }

  async deleteBoardingMealPackage(id: string): Promise<void> {
    await this.simulateDelay();
    const initialLength = this.boardingMealPackages.length;
    this.boardingMealPackages = this.boardingMealPackages.filter(pkg => pkg.id !== id);
    if (this.boardingMealPackages.length === initialLength) {
      throw new Error('Boarding meal package not found');
    }
  }
}

export const masterBoardingApi = new MasterBoardingApiService();



