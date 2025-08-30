import z from "zod";
import { StatusEnum } from "~/shared/schemas/shareSchemas"


// 🟩 boardingMealTypeSchema
// Validates Meal Type input — like Breakfast, Lunch, Dinner
export const boardingMealTypeSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  status: StatusEnum,
});

// 🟩 boardingPackageTypeSchema
// Validates types of packages — e.g. Regular, Premium
export const boardingPackageTypeSchema = z.object({
  name: z.string().min(2).max(50),
  status: StatusEnum,
});

// 🟩 boardingMenuCategorySchema
// Top-level food categories — e.g. Main Course, Sides
export const boardingMenuCategorySchema = z.object({
  name: z.string().min(2).max(50),
  status: StatusEnum,
});

// 🟩 boardingSubMenuCategorySchema
// Sub-categories under a MenuCategory — e.g. Curry, Breads
export const boardingSubMenuCategorySchema = z.object({
  name: z.string().min(2).max(50),
  status: StatusEnum,
  menuCategoryId: z.string()
    .min(2, "At least 2 characters")
    .max(50, "Out of range Max 50 characters")
  ,
});

// 🟩 boardingMenuItemSchema
// Validates actual food items — e.g. Chicken Curry, Rice
export const boardingMenuItemSchema = z.object({
  name: z.string().min(2).max(100),
  status: StatusEnum,
  subMenuCategoryIds: z
    .array(z.string())
    .min(1, "At least one sub-category is required")
});

// 🟩 boardingPackageSchema
// Validates a full meal package — e.g. “Premium Veg Plan”
export const boardingPackageSchema = z.object({
  name: z.string().min(2).max(100),
  status: StatusEnum,
  // mealTypeId: z.string()
  //   .min(2, "At least 2 characters")
  //   .max(50, "Out of range Max 50 characters")
  // ,
  packageTypeId: z.string()
    .min(2, "At least 2 characters")
    .max(50, "Out of range Max 50 characters")
  ,
});


export const boardingPackageMenuItemSchema = z.object({
  packageId: z.string().min(1, "Package is required"),
  menuItemId: z.string().min(1, "Menu item is required"),
  mealTypeId: z.string().min(1, "Meal type is required"),
  quantity: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
  note: z.string().max(255).optional(),
  status: StatusEnum,
});

// 🟩 fullDayMealPackageSchema
// Validates a full day meal package with meal selections
export const fullDayMealPackageSchema = z.object({
  name: z.string().min(2).max(100),
  status: StatusEnum,
  packageTypeId: z.string().min(1, "Package type is required"),
  packageId: z.string().min(1, "Package is required"),
  price: z.number().min(0, "Price must be positive"),
  note: z.string().max(255).optional(),
  meals: z.array(z.object({
    mealTypeId: z.string().min(1, "Meal type is required"),
    menuItemId: z.string().min(1, "Menu item is required"),
  })).min(1, "At least one meal is required").max(10, "Maximum 10 meals allowed"),
});

// 🟩 boardingPackageChangeHistorySchema
// Logs history when a student's package is changed
export const boardingPackageChangeHistorySchema = z.object({
  studentId: z.string()
    .min(2, "At least 2 characters")
    .max(50, "Out of range Max 50 characters")
  ,
  oldPackageId: z.string()
    .min(2, "At least 2 characters")
    .max(50, "Out of range Max 50 characters")
  ,
  newPackageId: z.string()
    .min(2, "At least 2 characters")
    .max(50, "Out of range Max 50 characters")
  ,
  changedBy: z.string()
    .min(2, "At least 2 characters")
    .max(50, "Out of range Max 50 characters")
  ,
  reason: z
    .string()
    .min(3, "Reason must be at least 3 characters")
    .max(255)
    .optional(),
});


export type BoardingMealTypeFormData = z.infer<typeof boardingMealTypeSchema>;
export type BoardingPackageTypeFormData = z.infer<typeof boardingPackageTypeSchema>;
export type BoardingMenuCategoryFormData = z.infer<typeof boardingMenuCategorySchema>;
export type BoardingSubMenuCategoryFormData = z.infer<typeof boardingSubMenuCategorySchema>;
export type BoardingMenuItemFormData = z.infer<typeof boardingMenuItemSchema>;
export type BoardingPackageFormData = z.infer<typeof boardingPackageSchema>;
export type BoardingPackageMenuItemFormData = z.infer<typeof boardingPackageMenuItemSchema>;
export type BoardingPackageChangeHistoryFormData = z.infer<typeof boardingPackageChangeHistorySchema>;



export type FullDayMealPackageFormData = z.infer<typeof fullDayMealPackageSchema>;