/**
 * Geography module constants
 * Note: GEOGRAPHY_ENTITY is already defined in src/app/constants/index.ts
 * This file can be used for geography-specific constants if needed in the future
 */

// Re-export from global constants for consistency
export { GEOGRAPHY_ENTITY, type GeographyEntityType } from '~/app/constants';

// Import for internal use
import { GEOGRAPHY_ENTITY } from '~/app/constants';

/** Geography Entity Display Names */
export const GEOGRAPHY_ENTITY_DISPLAY_NAMES = {
  [GEOGRAPHY_ENTITY.NATIONALITY]: 'Nationality',
  [GEOGRAPHY_ENTITY.DIVISION]: 'Division',
  [GEOGRAPHY_ENTITY.DISTRICT]: 'District',
  [GEOGRAPHY_ENTITY.SUB_DISTRICT]: 'Sub District',
  [GEOGRAPHY_ENTITY.POST_OFFICE]: 'Post Office',
  [GEOGRAPHY_ENTITY.VILLAGE]: 'Village',
} as const;