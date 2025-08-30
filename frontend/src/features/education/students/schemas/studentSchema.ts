import z from "zod";
import { StatusEnum } from "~/shared/schemas/shareSchemas";

export const minimalStudentSchema = z.object({
  personStudentId: z.string().min(1, 'Student person is required'),
  status: StatusEnum,
});

export type StudentFormIn = z.input<typeof minimalStudentSchema>;
export type StudentFormOut = z.output<typeof minimalStudentSchema>;