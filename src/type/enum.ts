import { FormFieldTypeSchema } from "@lorium/prisma-zod";

export const FieldTypeEnum = FormFieldTypeSchema.enum;
export type FieldType = (typeof FieldTypeEnum)[keyof typeof FieldTypeEnum];
