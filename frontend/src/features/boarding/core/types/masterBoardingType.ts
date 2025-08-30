import { BaseEntity, Status } from "~/shared/types/common";

// 🟩 Types for Boarding Management System
export interface BoardingMealType extends BaseEntity {
  name: string;
  status: Status;
}

export interface BoardingPackageType extends BaseEntity {
  name: string;
  status: Status;
}

export interface BoardingMenuCategory extends BaseEntity {
  name: string;
  status: Status;
}

export interface BoardingSubMenuCategory extends BaseEntity {
  name: string;
  status: Status;
  menuCategoryId: string;
}

export interface BoardingMenuItem extends BaseEntity {
  name: string;
  status: Status;
  subMenuCategoryIds: string[];
}

export interface BoardingPackage extends BaseEntity {
  name: string;
  status: Status;
  // mealTypeId: string;
  packageTypeId: string;
}

// export interface BoardingPackageMenuItem extends BaseEntity {
//   packageId: string;
//   menuItemId: string;
//   mealTypeId: string;
// }

export interface BoardingPackageMenuItem extends BaseEntity {
  packageId: string;
  menuItemId: string;
  mealTypeId: string;

  quantity?: number;
  price?: number;
  note?: string;
  status: Status;
}




export interface BoardingPackageChangeHistory extends BaseEntity {
  studentId: string;
  oldPackageId: string;
  newPackageId: string;
  changedBy: string;
  reason?: string;
}


// 🟩 Create DTOs for creating new entities
export interface CreateBoardingMealTypeDto {
  name: string;
  status: Status;
}

export interface CreateBoardingPackageTypeDto {
  name: string;
  status: Status;
}

export interface CreateBoardingMenuCategoryDto {
  name: string;
  status: Status;
}

export interface CreateBoardingSubMenuCategoryDto {
  name: string;
  status: Status;
  menuCategoryId: string;
}

export interface CreateBoardingMenuItemDto {
  name: string;
  status: Status;
  subMenuCategoryIds: string[];
}

export interface CreateBoardingPackageDto {
  name: string;
  status: Status;
  // mealTypeId: string;
  packageTypeId: string;
}

// export interface CreateBoardingPackageMenuItemDto {
//   packageId: string;
//   menuItemId: string;
//   mealTypeId: string;
// }

export interface CreateBoardingPackageMenuItemDto {
  packageId: string;
  menuItemId: string;
  mealTypeId: string;
  quantity?: number;
  price?: number;
  note?: string;
  status: Status;
}


export interface CreateBoardingPackageChangeHistoryDto {
  studentId: string;
  oldPackageId: string;
  newPackageId: string;
  changedBy: string;
  reason?: string;
}


// 🟩 Update DTOs for partial updates
export interface UpdateBoardingMealTypeDto {
  name?: string;
  status?: Status;
}

export interface UpdateBoardingPackageTypeDto {
  name?: string;
  status?: Status;
}

export interface UpdateBoardingMenuCategoryDto {
  name?: string;
  status?: Status;
}

export interface UpdateBoardingSubMenuCategoryDto {
  name?: string;
  status?: Status;
  menuCategoryId?: string;
}

export interface UpdateBoardingMenuItemDto {
  name?: string;
  status?: Status;
  subMenuCategoryIds?: string[];
}

export interface UpdateBoardingPackageDto {
  name?: string;
  status?: Status;
  // mealTypeId?: string;
  packageTypeId?: string;
}

// export interface UpdateBoardingPackageMenuItemDto {
//   packageId?: string;
//   menuItemId?: string;
//   mealTypeId?: string;
// }

export interface UpdateBoardingPackageMenuItemDto {
  quantity?: number;
  price?: number;
  note?: string;
  status?: Status;
}


// 🟩 Filters for searching and listing
export interface BoardingPackageTypeFilters {
  search?: string;
  status?: string;
}

export interface BoardingMenuCategoryFilters {
  search?: string;
  status?: string;
}

export interface BoardingSubMenuCategoryFilters {
  search?: string;
  status?: string;
  menuCategoryId?: string;
}

export interface BoardingMealTypeFilters {
  search?: string;
  status?: string;
}

export interface BoardingMenuItemFilters {
  search?: string;
  status?: Status;
  subMenuCategoryIds?: string[];
}

export interface BoardingPackageFilters {
  search?: string;
  status?: Status;
  mealTypeId?: string;
  packageTypeId?: string;
}

export interface BoardingPackageMenuItemFilters {
  packageId?: string;
  menuItemId?: string;
  mealTypeId?: string;
  quantity?: number;
  price?: number;
  status?: Status;

}


// 🟩 Meal Package Types
export interface BoardingMealPackage extends BaseEntity {
  name: string;
  status: Status;
  meals: BoardingMealPackageItem[];
}

export interface BoardingMealPackageItem {
  id: string;
  mealTypeId: string;
  packageId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  status: Status;
  note?: string;
}

// 🟩 Create DTOs for Meal Package
export interface CreateBoardingMealPackageDto {
  name: string;
  status: Status;
  meals: Omit<BoardingMealPackageItem, 'id'>[];
}

// 🟩 Update DTOs for Meal Package
export interface UpdateBoardingMealPackageDto {
  name?: string;
  status?: Status;
  meals?: BoardingMealPackageItem[];
}

// 🟩 Filters for Meal Package
export interface BoardingMealPackageFilters {
  search?: string;
  status?: Status;
  mealTypeId?: string;
}

// 🟩 Meal Selection Types
export interface MealSelection {
  id: string;            // client-side only
  mealTypeId: string;
  menuItemId: string;
}

// 🟩 Full Day Meal Package
export interface FullDayMealPackage extends BaseEntity {
  name: string;
  status: Status;

  /** Package configuration */
  packageTypeId: string;
  packageId: string;
  price: number;
  note?: string;
  /** Multiple Meal Rows */
  meals: MealSelection[];
}

// 🟩 Create DTOs for Meal Selection
export interface CreateMealSelectionDto {
  mealTypeId: string;
  menuItemId: string;
}

// 🟩 Create DTOs for Full Day Meal Package
export interface CreateFullDayMealPackageDto {
  name: string;
  status: Status;
  packageTypeId: string;
  packageId: string;
  price: number;
  note?: string;
  meals: CreateMealSelectionDto[];
}

// 🟩 Update DTOs for Meal Selection
export interface UpdateMealSelectionDto {
  mealTypeId?: string;
  menuItemId?: string;
}

// 🟩 Update DTOs for Full Day Meal Package
export interface UpdateFullDayMealPackageDto {
  name?: string;
  status?: Status;
  packageTypeId?: string;
  packageId?: string;
  price?: number;
  note?: string;
  meals?: MealSelection[];
}

// 🟩 Filters for Full Day Meal Package
export interface FullDayMealPackageFilters {
  search?: string;
  status?: Status;
  packageTypeId?: string;
  packageId?: string;
  mealTypeId?: string;
}

// Boarding Meal Types, Boarding Package Types, Boarding Packages, Boarding Menu Categories, Boarding Sub Menu Categories, Boarding Menu, Boarding Package Menu একটা student সকাল, দুপুর, রাত, এই তিন বেলা খাবে তো সেটা কিভাবে করা যাবে?
