import { StatusesObject } from "../types/common";

export const STATUSES = ['ACTIVE', 'INACTIVE','ARCHIVE'] as const;


// ডায়নামিক অবজেক্ট তৈরি
export const STATUSES_OBJECT = Object.fromEntries(
  STATUSES.map(status => [status, status])
) as StatusesObject;