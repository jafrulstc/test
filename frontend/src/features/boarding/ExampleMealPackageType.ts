
export interface MealSelection {          // ➕ নতুন
  id: string;            // client‑side only
  mealTypeId: string;
  menuItemId: string;
}

// 🟩 Meal Package
export interface BoardingMealPackage extends BaseEntity {
  name: string;
  status: Status;

  /** একবারই বেছে নেওয়া যাবে */
  packageTypeId: string;                 
  packageId: string;                     
  price: number;                         
  note?: string;                         

  /** একাধিক Meal–Row */
  meals: MealSelection[];
}

// 🟩 Create DTOs for creating new entities
export interface CreateMealSelectionDto { // ➕
  mealTypeId: string;
  menuItemId: string;
}


export interface CreateBoardingMealPackageDto {
  name: string;
  status: Status;
  packageTypeId: string;
  packageId: string;
  price: number;
  note?: string;
  meals: CreateMealSelectionDto[];
}

// 🟩 Update DTOs for partial updates
export interface UpdateMealSelectionDto { // ➕
  mealTypeId?: string;
  menuItemId?: string;
}

// 🟩 Update DTOs for partial updates
export interface UpdateMealSelectionDto { // ➕
  mealTypeId?: string;
  menuItemId?: string;
}