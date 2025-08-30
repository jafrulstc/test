// utils/getChangedFields.ts

// export function getChangedFields<T extends Record<string, any>>(original: T, updated: T): Partial<T> {
//   const diff: Partial<T> = {};

//   for (const key in updated) {
//     if (updated.hasOwnProperty(key)) {
//       const originalValue = original[key];
//       const updatedValue = updated[key];

//       // You can customize comparison if needed (e.g. for deep equality)
//       if (originalValue !== updatedValue) {
//         diff[key] = updatedValue;
//       }
//     }
//   }

//   return diff;
// }

export function getChangedFields<T extends Record<string, any>>(original: T, updated: T): Partial<T> {
  const diff: Partial<T> = {};

  for (const key in updated) {
    if (updated.hasOwnProperty(key)) {
      const originalValue = original[key];
      const updatedValue = updated[key];

      // Array comparison: Check if both are arrays
      if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
        // Sort the arrays to handle different orders, then stringify for comparison
        // This assumes the array contains primitive values (strings, numbers, etc.)
        const sortedOriginal = [...originalValue].sort();
        const sortedUpdated = [...updatedValue].sort();

        if (JSON.stringify(sortedOriginal) !== JSON.stringify(sortedUpdated)) {
          diff[key] = updatedValue;
        }
      }
      // Primitive or non-array object comparison
      else if (originalValue !== updatedValue) {
        diff[key] = updatedValue;
      }
    }
  }

  return diff;
}