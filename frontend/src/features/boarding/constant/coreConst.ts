/**
 * Boarding core module constants
 */

import { STATUSES_OBJECT } from "~/shared/constants/sharedConstants";


export type BoardingCoreStatusType = typeof STATUSES_OBJECT[keyof typeof STATUSES_OBJECT];

/** Status Color Mapping */
export const STATUS_COLOR_MAP = {
  [STATUSES_OBJECT.ACTIVE]: 'success',
  [STATUSES_OBJECT.INACTIVE]: 'warning',
} as const;