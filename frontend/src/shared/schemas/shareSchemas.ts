import { z } from "zod";
import { STATUSES } from "../constants/sharedConstants";

// export const StatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'ARCHIVE']);

// Zod schema derived from the array
export const StatusEnum = z.enum(STATUSES);
