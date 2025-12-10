import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.NullTypes.DbNull;
  if (v === 'JsonNull') return Prisma.NullTypes.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','updatedAt','role','title','name','profileUrl']);

export const EventScalarFieldEnumSchema = z.enum(['id','name','description','location','createdAt','updatedAt','startDate','endDate','regist','profileURL','price','stripeAccountId','resultUrl']);

export const OrganizerAssignScalarFieldEnumSchema = z.enum(['userId','eventId']);

export const FormScalarFieldEnumSchema = z.enum(['id','eventId']);

export const FormFieldScalarFieldEnumSchema = z.enum(['id','formId','fieldOrder','choices','description','header','placeholder','required','type']);

export const ResScalarFieldEnumSchema = z.enum(['id','eventId','formId','userId','paymentIntent','paymentStatus','paymentId','submittedAt']);

export const ResFieldScalarFieldEnumSchema = z.enum(['id','formFieldId','resId','textField','choiceField','fileField','dateField','selectField']);

export const TicketConfigScalarFieldEnumSchema = z.enum(['id','eventId','infoLabel','venueLabel','infoFields','venueFields']);

export const VenueTypeScalarFieldEnumSchema = z.enum(['id','label','isUnit','subUnitLabel','eventId']);

export const VenueNodeScalarFieldEnumSchema = z.enum(['id','name','typeId','eventId','parentId','capacity']);

export const VenueAssignScalarFieldEnumSchema = z.enum(['id','userId','eventId','subUnitIndex','venueNodeId']);

export const ResultColumnScalarFieldEnumSchema = z.enum(['id','label','order','eventId','fileMap']);

export const ResultDataScalarFieldEnumSchema = z.enum(['id','userId','resultColumnId','value']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const RoleSchema = z.enum(['HOST','REGISTRANT']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const PaymentStatusSchema = z.enum(['PENDING','PAID','FAILED']);

export type PaymentStatusType = `${z.infer<typeof PaymentStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.uuid(),
  email: z.string(),
  updatedAt: z.coerce.date(),
  title: z.string().nullable(),
  name: z.string().nullable(),
  profileUrl: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  organizer: OrganizerAssignWithRelations[];
  res: ResWithRelations[];
  venueAssign: VenueAssignWithRelations[];
  resultData: ResultDataWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  organizer: z.lazy(() => OrganizerAssignWithRelationsSchema).array(),
  res: z.lazy(() => ResWithRelationsSchema).array(),
  venueAssign: z.lazy(() => VenueAssignWithRelationsSchema).array(),
  resultData: z.lazy(() => ResultDataWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// EVENT SCHEMA
/////////////////////////////////////////

export const EventSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().nullable(),
  resultUrl: z.string().nullable(),
})

export type Event = z.infer<typeof EventSchema>

// EVENT RELATION SCHEMA
//------------------------------------------------------

export type EventRelations = {
  form?: FormWithRelations | null;
  organizer: OrganizerAssignWithRelations[];
  res: ResWithRelations[];
  ticketConfig?: TicketConfigWithRelations | null;
  venueAssign: VenueAssignWithRelations[];
  venueNodes: VenueNodeWithRelations[];
  venueTypes: VenueTypeWithRelations[];
  resultColumns: ResultColumnWithRelations[];
};

export type EventWithRelations = z.infer<typeof EventSchema> & EventRelations

export const EventWithRelationsSchema: z.ZodType<EventWithRelations> = EventSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema).nullable(),
  organizer: z.lazy(() => OrganizerAssignWithRelationsSchema).array(),
  res: z.lazy(() => ResWithRelationsSchema).array(),
  ticketConfig: z.lazy(() => TicketConfigWithRelationsSchema).nullable(),
  venueAssign: z.lazy(() => VenueAssignWithRelationsSchema).array(),
  venueNodes: z.lazy(() => VenueNodeWithRelationsSchema).array(),
  venueTypes: z.lazy(() => VenueTypeWithRelationsSchema).array(),
  resultColumns: z.lazy(() => ResultColumnWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ORGANIZER ASSIGN SCHEMA
/////////////////////////////////////////

export const OrganizerAssignSchema = z.object({
  userId: z.string(),
  eventId: z.string(),
})

export type OrganizerAssign = z.infer<typeof OrganizerAssignSchema>

// ORGANIZER ASSIGN RELATION SCHEMA
//------------------------------------------------------

export type OrganizerAssignRelations = {
  event: EventWithRelations;
  user: UserWithRelations;
};

export type OrganizerAssignWithRelations = z.infer<typeof OrganizerAssignSchema> & OrganizerAssignRelations

export const OrganizerAssignWithRelationsSchema: z.ZodType<OrganizerAssignWithRelations> = OrganizerAssignSchema.merge(z.object({
  event: z.lazy(() => EventWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// FORM SCHEMA
/////////////////////////////////////////

export const FormSchema = z.object({
  id: z.uuid(),
  eventId: z.string(),
})

export type Form = z.infer<typeof FormSchema>

// FORM RELATION SCHEMA
//------------------------------------------------------

export type FormRelations = {
  event: EventWithRelations;
  fields: FormFieldWithRelations[];
  res: ResWithRelations[];
};

export type FormWithRelations = z.infer<typeof FormSchema> & FormRelations

export const FormWithRelationsSchema: z.ZodType<FormWithRelations> = FormSchema.merge(z.object({
  event: z.lazy(() => EventWithRelationsSchema),
  fields: z.lazy(() => FormFieldWithRelationsSchema).array(),
  res: z.lazy(() => ResWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// FORM FIELD SCHEMA
/////////////////////////////////////////

export const FormFieldSchema = z.object({
  id: z.uuid(),
  formId: z.string(),
  fieldOrder: z.number().int(),
  choices: z.string().array(),
  description: z.string().nullable(),
  header: z.string(),
  placeholder: z.string().nullable(),
  required: z.boolean(),
  type: z.string(),
})

export type FormField = z.infer<typeof FormFieldSchema>

// FORM FIELD RELATION SCHEMA
//------------------------------------------------------

export type FormFieldRelations = {
  form: FormWithRelations;
  resFields: ResFieldWithRelations[];
};

export type FormFieldWithRelations = z.infer<typeof FormFieldSchema> & FormFieldRelations

export const FormFieldWithRelationsSchema: z.ZodType<FormFieldWithRelations> = FormFieldSchema.merge(z.object({
  form: z.lazy(() => FormWithRelationsSchema),
  resFields: z.lazy(() => ResFieldWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// RES SCHEMA
/////////////////////////////////////////

export const ResSchema = z.object({
  paymentStatus: PaymentStatusSchema,
  id: z.uuid(),
  eventId: z.string(),
  formId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().nullable(),
  paymentId: z.string().nullable(),
  submittedAt: z.coerce.date(),
})

export type Res = z.infer<typeof ResSchema>

// RES RELATION SCHEMA
//------------------------------------------------------

export type ResRelations = {
  event: EventWithRelations;
  form: FormWithRelations;
  user: UserWithRelations;
  resFields: ResFieldWithRelations[];
};

export type ResWithRelations = z.infer<typeof ResSchema> & ResRelations

export const ResWithRelationsSchema: z.ZodType<ResWithRelations> = ResSchema.merge(z.object({
  event: z.lazy(() => EventWithRelationsSchema),
  form: z.lazy(() => FormWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
  resFields: z.lazy(() => ResFieldWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// RES FIELD SCHEMA
/////////////////////////////////////////

export const ResFieldSchema = z.object({
  id: z.uuid(),
  formFieldId: z.string(),
  resId: z.string(),
  textField: z.string().nullable(),
  choiceField: z.number().int().array(),
  fileField: z.string().nullable(),
  dateField: z.coerce.date().nullable(),
  selectField: z.number().int().nullable(),
})

export type ResField = z.infer<typeof ResFieldSchema>

// RES FIELD RELATION SCHEMA
//------------------------------------------------------

export type ResFieldRelations = {
  formField: FormFieldWithRelations;
  formRes: ResWithRelations;
};

export type ResFieldWithRelations = z.infer<typeof ResFieldSchema> & ResFieldRelations

export const ResFieldWithRelationsSchema: z.ZodType<ResFieldWithRelations> = ResFieldSchema.merge(z.object({
  formField: z.lazy(() => FormFieldWithRelationsSchema),
  formRes: z.lazy(() => ResWithRelationsSchema),
}))

/////////////////////////////////////////
// TICKET CONFIG SCHEMA
/////////////////////////////////////////

export const TicketConfigSchema = z.object({
  id: z.uuid(),
  eventId: z.string(),
  infoLabel: z.string(),
  venueLabel: z.string(),
  infoFields: JsonValueSchema.array(),
  venueFields: JsonValueSchema.array(),
})

export type TicketConfig = z.infer<typeof TicketConfigSchema>

// TICKET CONFIG RELATION SCHEMA
//------------------------------------------------------

export type TicketConfigRelations = {
  event: EventWithRelations;
};

export type TicketConfigWithRelations = z.infer<typeof TicketConfigSchema> & TicketConfigRelations

export const TicketConfigWithRelationsSchema: z.ZodType<TicketConfigWithRelations> = TicketConfigSchema.merge(z.object({
  event: z.lazy(() => EventWithRelationsSchema),
}))

/////////////////////////////////////////
// VENUE TYPE SCHEMA
/////////////////////////////////////////

export const VenueTypeSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  isUnit: z.boolean(),
  subUnitLabel: z.string().nullable(),
  eventId: z.string(),
})

export type VenueType = z.infer<typeof VenueTypeSchema>

// VENUE TYPE RELATION SCHEMA
//------------------------------------------------------

export type VenueTypeRelations = {
  venues: VenueNodeWithRelations[];
  event: EventWithRelations;
};

export type VenueTypeWithRelations = z.infer<typeof VenueTypeSchema> & VenueTypeRelations

export const VenueTypeWithRelationsSchema: z.ZodType<VenueTypeWithRelations> = VenueTypeSchema.merge(z.object({
  venues: z.lazy(() => VenueNodeWithRelationsSchema).array(),
  event: z.lazy(() => EventWithRelationsSchema),
}))

/////////////////////////////////////////
// VENUE NODE SCHEMA
/////////////////////////////////////////

export const VenueNodeSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  typeId: z.string(),
  eventId: z.string(),
  parentId: z.string().nullable(),
  capacity: z.number().int().nullable(),
})

export type VenueNode = z.infer<typeof VenueNodeSchema>

// VENUE NODE RELATION SCHEMA
//------------------------------------------------------

export type VenueNodeRelations = {
  assignments: VenueAssignWithRelations[];
  event: EventWithRelations;
  parent?: VenueNodeWithRelations | null;
  children: VenueNodeWithRelations[];
  type: VenueTypeWithRelations;
};

export type VenueNodeWithRelations = z.infer<typeof VenueNodeSchema> & VenueNodeRelations

export const VenueNodeWithRelationsSchema: z.ZodType<VenueNodeWithRelations> = VenueNodeSchema.merge(z.object({
  assignments: z.lazy(() => VenueAssignWithRelationsSchema).array(),
  event: z.lazy(() => EventWithRelationsSchema),
  parent: z.lazy(() => VenueNodeWithRelationsSchema).nullable(),
  children: z.lazy(() => VenueNodeWithRelationsSchema).array(),
  type: z.lazy(() => VenueTypeWithRelationsSchema),
}))

/////////////////////////////////////////
// VENUE ASSIGN SCHEMA
/////////////////////////////////////////

export const VenueAssignSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  eventId: z.string(),
  subUnitIndex: z.number().int().nullable(),
  venueNodeId: z.string(),
})

export type VenueAssign = z.infer<typeof VenueAssignSchema>

// VENUE ASSIGN RELATION SCHEMA
//------------------------------------------------------

export type VenueAssignRelations = {
  event: EventWithRelations;
  user: UserWithRelations;
  venueNode: VenueNodeWithRelations;
};

export type VenueAssignWithRelations = z.infer<typeof VenueAssignSchema> & VenueAssignRelations

export const VenueAssignWithRelationsSchema: z.ZodType<VenueAssignWithRelations> = VenueAssignSchema.merge(z.object({
  event: z.lazy(() => EventWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
  venueNode: z.lazy(() => VenueNodeWithRelationsSchema),
}))

/////////////////////////////////////////
// RESULT COLUMN SCHEMA
/////////////////////////////////////////

export const ResultColumnSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  order: z.number().int(),
  eventId: z.string(),
  fileMap: z.string().nullable(),
})

export type ResultColumn = z.infer<typeof ResultColumnSchema>

// RESULT COLUMN RELATION SCHEMA
//------------------------------------------------------

export type ResultColumnRelations = {
  event: EventWithRelations;
  resultData: ResultDataWithRelations[];
};

export type ResultColumnWithRelations = z.infer<typeof ResultColumnSchema> & ResultColumnRelations

export const ResultColumnWithRelationsSchema: z.ZodType<ResultColumnWithRelations> = ResultColumnSchema.merge(z.object({
  event: z.lazy(() => EventWithRelationsSchema),
  resultData: z.lazy(() => ResultDataWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// RESULT DATA SCHEMA
/////////////////////////////////////////

export const ResultDataSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  resultColumnId: z.string(),
  value: z.string(),
})

export type ResultData = z.infer<typeof ResultDataSchema>

// RESULT DATA RELATION SCHEMA
//------------------------------------------------------

export type ResultDataRelations = {
  resultColumn: ResultColumnWithRelations;
  user: UserWithRelations;
};

export type ResultDataWithRelations = z.infer<typeof ResultDataSchema> & ResultDataRelations

export const ResultDataWithRelationsSchema: z.ZodType<ResultDataWithRelations> = ResultDataSchema.merge(z.object({
  resultColumn: z.lazy(() => ResultColumnWithRelationsSchema),
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  organizer: z.union([z.boolean(),z.lazy(() => OrganizerAssignFindManyArgsSchema)]).optional(),
  res: z.union([z.boolean(),z.lazy(() => ResFindManyArgsSchema)]).optional(),
  venueAssign: z.union([z.boolean(),z.lazy(() => VenueAssignFindManyArgsSchema)]).optional(),
  resultData: z.union([z.boolean(),z.lazy(() => ResultDataFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  organizer: z.boolean().optional(),
  res: z.boolean().optional(),
  venueAssign: z.boolean().optional(),
  resultData: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  role: z.boolean().optional(),
  title: z.boolean().optional(),
  name: z.boolean().optional(),
  profileUrl: z.boolean().optional(),
  organizer: z.union([z.boolean(),z.lazy(() => OrganizerAssignFindManyArgsSchema)]).optional(),
  res: z.union([z.boolean(),z.lazy(() => ResFindManyArgsSchema)]).optional(),
  venueAssign: z.union([z.boolean(),z.lazy(() => VenueAssignFindManyArgsSchema)]).optional(),
  resultData: z.union([z.boolean(),z.lazy(() => ResultDataFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// EVENT
//------------------------------------------------------

export const EventIncludeSchema: z.ZodType<Prisma.EventInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  organizer: z.union([z.boolean(),z.lazy(() => OrganizerAssignFindManyArgsSchema)]).optional(),
  res: z.union([z.boolean(),z.lazy(() => ResFindManyArgsSchema)]).optional(),
  ticketConfig: z.union([z.boolean(),z.lazy(() => TicketConfigArgsSchema)]).optional(),
  venueAssign: z.union([z.boolean(),z.lazy(() => VenueAssignFindManyArgsSchema)]).optional(),
  venueNodes: z.union([z.boolean(),z.lazy(() => VenueNodeFindManyArgsSchema)]).optional(),
  venueTypes: z.union([z.boolean(),z.lazy(() => VenueTypeFindManyArgsSchema)]).optional(),
  resultColumns: z.union([z.boolean(),z.lazy(() => ResultColumnFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EventCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const EventArgsSchema: z.ZodType<Prisma.EventDefaultArgs> = z.object({
  select: z.lazy(() => EventSelectSchema).optional(),
  include: z.lazy(() => EventIncludeSchema).optional(),
}).strict();

export const EventCountOutputTypeArgsSchema: z.ZodType<Prisma.EventCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => EventCountOutputTypeSelectSchema).nullish(),
}).strict();

export const EventCountOutputTypeSelectSchema: z.ZodType<Prisma.EventCountOutputTypeSelect> = z.object({
  organizer: z.boolean().optional(),
  res: z.boolean().optional(),
  venueAssign: z.boolean().optional(),
  venueNodes: z.boolean().optional(),
  venueTypes: z.boolean().optional(),
  resultColumns: z.boolean().optional(),
}).strict();

export const EventSelectSchema: z.ZodType<Prisma.EventSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  location: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  startDate: z.boolean().optional(),
  endDate: z.boolean().optional(),
  regist: z.boolean().optional(),
  profileURL: z.boolean().optional(),
  price: z.boolean().optional(),
  stripeAccountId: z.boolean().optional(),
  resultUrl: z.boolean().optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  organizer: z.union([z.boolean(),z.lazy(() => OrganizerAssignFindManyArgsSchema)]).optional(),
  res: z.union([z.boolean(),z.lazy(() => ResFindManyArgsSchema)]).optional(),
  ticketConfig: z.union([z.boolean(),z.lazy(() => TicketConfigArgsSchema)]).optional(),
  venueAssign: z.union([z.boolean(),z.lazy(() => VenueAssignFindManyArgsSchema)]).optional(),
  venueNodes: z.union([z.boolean(),z.lazy(() => VenueNodeFindManyArgsSchema)]).optional(),
  venueTypes: z.union([z.boolean(),z.lazy(() => VenueTypeFindManyArgsSchema)]).optional(),
  resultColumns: z.union([z.boolean(),z.lazy(() => ResultColumnFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => EventCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORGANIZER ASSIGN
//------------------------------------------------------

export const OrganizerAssignIncludeSchema: z.ZodType<Prisma.OrganizerAssignInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const OrganizerAssignArgsSchema: z.ZodType<Prisma.OrganizerAssignDefaultArgs> = z.object({
  select: z.lazy(() => OrganizerAssignSelectSchema).optional(),
  include: z.lazy(() => OrganizerAssignIncludeSchema).optional(),
}).strict();

export const OrganizerAssignSelectSchema: z.ZodType<Prisma.OrganizerAssignSelect> = z.object({
  userId: z.boolean().optional(),
  eventId: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// FORM
//------------------------------------------------------

export const FormIncludeSchema: z.ZodType<Prisma.FormInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  fields: z.union([z.boolean(),z.lazy(() => FormFieldFindManyArgsSchema)]).optional(),
  res: z.union([z.boolean(),z.lazy(() => ResFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const FormArgsSchema: z.ZodType<Prisma.FormDefaultArgs> = z.object({
  select: z.lazy(() => FormSelectSchema).optional(),
  include: z.lazy(() => FormIncludeSchema).optional(),
}).strict();

export const FormCountOutputTypeArgsSchema: z.ZodType<Prisma.FormCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FormCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FormCountOutputTypeSelectSchema: z.ZodType<Prisma.FormCountOutputTypeSelect> = z.object({
  fields: z.boolean().optional(),
  res: z.boolean().optional(),
}).strict();

export const FormSelectSchema: z.ZodType<Prisma.FormSelect> = z.object({
  id: z.boolean().optional(),
  eventId: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  fields: z.union([z.boolean(),z.lazy(() => FormFieldFindManyArgsSchema)]).optional(),
  res: z.union([z.boolean(),z.lazy(() => ResFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FORM FIELD
//------------------------------------------------------

export const FormFieldIncludeSchema: z.ZodType<Prisma.FormFieldInclude> = z.object({
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  resFields: z.union([z.boolean(),z.lazy(() => ResFieldFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormFieldCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const FormFieldArgsSchema: z.ZodType<Prisma.FormFieldDefaultArgs> = z.object({
  select: z.lazy(() => FormFieldSelectSchema).optional(),
  include: z.lazy(() => FormFieldIncludeSchema).optional(),
}).strict();

export const FormFieldCountOutputTypeArgsSchema: z.ZodType<Prisma.FormFieldCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => FormFieldCountOutputTypeSelectSchema).nullish(),
}).strict();

export const FormFieldCountOutputTypeSelectSchema: z.ZodType<Prisma.FormFieldCountOutputTypeSelect> = z.object({
  resFields: z.boolean().optional(),
}).strict();

export const FormFieldSelectSchema: z.ZodType<Prisma.FormFieldSelect> = z.object({
  id: z.boolean().optional(),
  formId: z.boolean().optional(),
  fieldOrder: z.boolean().optional(),
  choices: z.boolean().optional(),
  description: z.boolean().optional(),
  header: z.boolean().optional(),
  placeholder: z.boolean().optional(),
  required: z.boolean().optional(),
  type: z.boolean().optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  resFields: z.union([z.boolean(),z.lazy(() => ResFieldFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => FormFieldCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RES
//------------------------------------------------------

export const ResIncludeSchema: z.ZodType<Prisma.ResInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  resFields: z.union([z.boolean(),z.lazy(() => ResFieldFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ResArgsSchema: z.ZodType<Prisma.ResDefaultArgs> = z.object({
  select: z.lazy(() => ResSelectSchema).optional(),
  include: z.lazy(() => ResIncludeSchema).optional(),
}).strict();

export const ResCountOutputTypeArgsSchema: z.ZodType<Prisma.ResCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ResCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ResCountOutputTypeSelectSchema: z.ZodType<Prisma.ResCountOutputTypeSelect> = z.object({
  resFields: z.boolean().optional(),
}).strict();

export const ResSelectSchema: z.ZodType<Prisma.ResSelect> = z.object({
  id: z.boolean().optional(),
  eventId: z.boolean().optional(),
  formId: z.boolean().optional(),
  userId: z.boolean().optional(),
  paymentIntent: z.boolean().optional(),
  paymentStatus: z.boolean().optional(),
  paymentId: z.boolean().optional(),
  submittedAt: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  form: z.union([z.boolean(),z.lazy(() => FormArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  resFields: z.union([z.boolean(),z.lazy(() => ResFieldFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RES FIELD
//------------------------------------------------------

export const ResFieldIncludeSchema: z.ZodType<Prisma.ResFieldInclude> = z.object({
  formField: z.union([z.boolean(),z.lazy(() => FormFieldArgsSchema)]).optional(),
  formRes: z.union([z.boolean(),z.lazy(() => ResArgsSchema)]).optional(),
}).strict();

export const ResFieldArgsSchema: z.ZodType<Prisma.ResFieldDefaultArgs> = z.object({
  select: z.lazy(() => ResFieldSelectSchema).optional(),
  include: z.lazy(() => ResFieldIncludeSchema).optional(),
}).strict();

export const ResFieldSelectSchema: z.ZodType<Prisma.ResFieldSelect> = z.object({
  id: z.boolean().optional(),
  formFieldId: z.boolean().optional(),
  resId: z.boolean().optional(),
  textField: z.boolean().optional(),
  choiceField: z.boolean().optional(),
  fileField: z.boolean().optional(),
  dateField: z.boolean().optional(),
  selectField: z.boolean().optional(),
  formField: z.union([z.boolean(),z.lazy(() => FormFieldArgsSchema)]).optional(),
  formRes: z.union([z.boolean(),z.lazy(() => ResArgsSchema)]).optional(),
}).strict()

// TICKET CONFIG
//------------------------------------------------------

export const TicketConfigIncludeSchema: z.ZodType<Prisma.TicketConfigInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict();

export const TicketConfigArgsSchema: z.ZodType<Prisma.TicketConfigDefaultArgs> = z.object({
  select: z.lazy(() => TicketConfigSelectSchema).optional(),
  include: z.lazy(() => TicketConfigIncludeSchema).optional(),
}).strict();

export const TicketConfigSelectSchema: z.ZodType<Prisma.TicketConfigSelect> = z.object({
  id: z.boolean().optional(),
  eventId: z.boolean().optional(),
  infoLabel: z.boolean().optional(),
  venueLabel: z.boolean().optional(),
  infoFields: z.boolean().optional(),
  venueFields: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
}).strict()

// VENUE TYPE
//------------------------------------------------------

export const VenueTypeIncludeSchema: z.ZodType<Prisma.VenueTypeInclude> = z.object({
  venues: z.union([z.boolean(),z.lazy(() => VenueNodeFindManyArgsSchema)]).optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VenueTypeCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const VenueTypeArgsSchema: z.ZodType<Prisma.VenueTypeDefaultArgs> = z.object({
  select: z.lazy(() => VenueTypeSelectSchema).optional(),
  include: z.lazy(() => VenueTypeIncludeSchema).optional(),
}).strict();

export const VenueTypeCountOutputTypeArgsSchema: z.ZodType<Prisma.VenueTypeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => VenueTypeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const VenueTypeCountOutputTypeSelectSchema: z.ZodType<Prisma.VenueTypeCountOutputTypeSelect> = z.object({
  venues: z.boolean().optional(),
}).strict();

export const VenueTypeSelectSchema: z.ZodType<Prisma.VenueTypeSelect> = z.object({
  id: z.boolean().optional(),
  label: z.boolean().optional(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.boolean().optional(),
  eventId: z.boolean().optional(),
  venues: z.union([z.boolean(),z.lazy(() => VenueNodeFindManyArgsSchema)]).optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VenueTypeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VENUE NODE
//------------------------------------------------------

export const VenueNodeIncludeSchema: z.ZodType<Prisma.VenueNodeInclude> = z.object({
  assignments: z.union([z.boolean(),z.lazy(() => VenueAssignFindManyArgsSchema)]).optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  parent: z.union([z.boolean(),z.lazy(() => VenueNodeArgsSchema)]).optional(),
  children: z.union([z.boolean(),z.lazy(() => VenueNodeFindManyArgsSchema)]).optional(),
  type: z.union([z.boolean(),z.lazy(() => VenueTypeArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VenueNodeCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const VenueNodeArgsSchema: z.ZodType<Prisma.VenueNodeDefaultArgs> = z.object({
  select: z.lazy(() => VenueNodeSelectSchema).optional(),
  include: z.lazy(() => VenueNodeIncludeSchema).optional(),
}).strict();

export const VenueNodeCountOutputTypeArgsSchema: z.ZodType<Prisma.VenueNodeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => VenueNodeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const VenueNodeCountOutputTypeSelectSchema: z.ZodType<Prisma.VenueNodeCountOutputTypeSelect> = z.object({
  assignments: z.boolean().optional(),
  children: z.boolean().optional(),
}).strict();

export const VenueNodeSelectSchema: z.ZodType<Prisma.VenueNodeSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  typeId: z.boolean().optional(),
  eventId: z.boolean().optional(),
  parentId: z.boolean().optional(),
  capacity: z.boolean().optional(),
  assignments: z.union([z.boolean(),z.lazy(() => VenueAssignFindManyArgsSchema)]).optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  parent: z.union([z.boolean(),z.lazy(() => VenueNodeArgsSchema)]).optional(),
  children: z.union([z.boolean(),z.lazy(() => VenueNodeFindManyArgsSchema)]).optional(),
  type: z.union([z.boolean(),z.lazy(() => VenueTypeArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VenueNodeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VENUE ASSIGN
//------------------------------------------------------

export const VenueAssignIncludeSchema: z.ZodType<Prisma.VenueAssignInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  venueNode: z.union([z.boolean(),z.lazy(() => VenueNodeArgsSchema)]).optional(),
}).strict();

export const VenueAssignArgsSchema: z.ZodType<Prisma.VenueAssignDefaultArgs> = z.object({
  select: z.lazy(() => VenueAssignSelectSchema).optional(),
  include: z.lazy(() => VenueAssignIncludeSchema).optional(),
}).strict();

export const VenueAssignSelectSchema: z.ZodType<Prisma.VenueAssignSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  eventId: z.boolean().optional(),
  subUnitIndex: z.boolean().optional(),
  venueNodeId: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  venueNode: z.union([z.boolean(),z.lazy(() => VenueNodeArgsSchema)]).optional(),
}).strict()

// RESULT COLUMN
//------------------------------------------------------

export const ResultColumnIncludeSchema: z.ZodType<Prisma.ResultColumnInclude> = z.object({
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  resultData: z.union([z.boolean(),z.lazy(() => ResultDataFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResultColumnCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ResultColumnArgsSchema: z.ZodType<Prisma.ResultColumnDefaultArgs> = z.object({
  select: z.lazy(() => ResultColumnSelectSchema).optional(),
  include: z.lazy(() => ResultColumnIncludeSchema).optional(),
}).strict();

export const ResultColumnCountOutputTypeArgsSchema: z.ZodType<Prisma.ResultColumnCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ResultColumnCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ResultColumnCountOutputTypeSelectSchema: z.ZodType<Prisma.ResultColumnCountOutputTypeSelect> = z.object({
  resultData: z.boolean().optional(),
}).strict();

export const ResultColumnSelectSchema: z.ZodType<Prisma.ResultColumnSelect> = z.object({
  id: z.boolean().optional(),
  label: z.boolean().optional(),
  order: z.boolean().optional(),
  eventId: z.boolean().optional(),
  fileMap: z.boolean().optional(),
  event: z.union([z.boolean(),z.lazy(() => EventArgsSchema)]).optional(),
  resultData: z.union([z.boolean(),z.lazy(() => ResultDataFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ResultColumnCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RESULT DATA
//------------------------------------------------------

export const ResultDataIncludeSchema: z.ZodType<Prisma.ResultDataInclude> = z.object({
  resultColumn: z.union([z.boolean(),z.lazy(() => ResultColumnArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const ResultDataArgsSchema: z.ZodType<Prisma.ResultDataDefaultArgs> = z.object({
  select: z.lazy(() => ResultDataSelectSchema).optional(),
  include: z.lazy(() => ResultDataIncludeSchema).optional(),
}).strict();

export const ResultDataSelectSchema: z.ZodType<Prisma.ResultDataSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  resultColumnId: z.boolean().optional(),
  value: z.boolean().optional(),
  resultColumn: z.union([z.boolean(),z.lazy(() => ResultColumnArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  profileUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignListRelationFilterSchema).optional(),
  res: z.lazy(() => ResListRelationFilterSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignListRelationFilterSchema).optional(),
  resultData: z.lazy(() => ResultDataListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  profileUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  organizer: z.lazy(() => OrganizerAssignOrderByRelationAggregateInputSchema).optional(),
  res: z.lazy(() => ResOrderByRelationAggregateInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignOrderByRelationAggregateInputSchema).optional(),
  resultData: z.lazy(() => ResultDataOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  title: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  profileUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignListRelationFilterSchema).optional(),
  res: z.lazy(() => ResListRelationFilterSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignListRelationFilterSchema).optional(),
  resultData: z.lazy(() => ResultDataListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  title: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  profileUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  title: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  profileUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const EventWhereInputSchema: z.ZodType<Prisma.EventWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => EventWhereInputSchema), z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema), z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  regist: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  profileURL: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  stripeAccountId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  resultUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  form: z.union([ z.lazy(() => FormNullableScalarRelationFilterSchema), z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignListRelationFilterSchema).optional(),
  res: z.lazy(() => ResListRelationFilterSchema).optional(),
  ticketConfig: z.union([ z.lazy(() => TicketConfigNullableScalarRelationFilterSchema), z.lazy(() => TicketConfigWhereInputSchema) ]).optional().nullable(),
  venueAssign: z.lazy(() => VenueAssignListRelationFilterSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeListRelationFilterSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeListRelationFilterSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnListRelationFilterSchema).optional(),
});

export const EventOrderByWithRelationInputSchema: z.ZodType<Prisma.EventOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  regist: z.lazy(() => SortOrderSchema).optional(),
  profileURL: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  stripeAccountId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  resultUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignOrderByRelationAggregateInputSchema).optional(),
  res: z.lazy(() => ResOrderByRelationAggregateInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigOrderByWithRelationInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignOrderByRelationAggregateInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeOrderByRelationAggregateInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeOrderByRelationAggregateInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnOrderByRelationAggregateInputSchema).optional(),
});

export const EventWhereUniqueInputSchema: z.ZodType<Prisma.EventWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => EventWhereInputSchema), z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventWhereInputSchema), z.lazy(() => EventWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  regist: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  profileURL: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  stripeAccountId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  resultUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  form: z.union([ z.lazy(() => FormNullableScalarRelationFilterSchema), z.lazy(() => FormWhereInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignListRelationFilterSchema).optional(),
  res: z.lazy(() => ResListRelationFilterSchema).optional(),
  ticketConfig: z.union([ z.lazy(() => TicketConfigNullableScalarRelationFilterSchema), z.lazy(() => TicketConfigWhereInputSchema) ]).optional().nullable(),
  venueAssign: z.lazy(() => VenueAssignListRelationFilterSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeListRelationFilterSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeListRelationFilterSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnListRelationFilterSchema).optional(),
}));

export const EventOrderByWithAggregationInputSchema: z.ZodType<Prisma.EventOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  regist: z.lazy(() => SortOrderSchema).optional(),
  profileURL: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  stripeAccountId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  resultUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => EventCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => EventAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => EventMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => EventMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => EventSumOrderByAggregateInputSchema).optional(),
});

export const EventScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.EventScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema), z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => EventScalarWhereWithAggregatesInputSchema), z.lazy(() => EventScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  location: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  startDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  endDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  regist: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  profileURL: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  price: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  stripeAccountId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  resultUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const OrganizerAssignWhereInputSchema: z.ZodType<Prisma.OrganizerAssignWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrganizerAssignWhereInputSchema), z.lazy(() => OrganizerAssignWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizerAssignWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizerAssignWhereInputSchema), z.lazy(() => OrganizerAssignWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const OrganizerAssignOrderByWithRelationInputSchema: z.ZodType<Prisma.OrganizerAssignOrderByWithRelationInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const OrganizerAssignWhereUniqueInputSchema: z.ZodType<Prisma.OrganizerAssignWhereUniqueInput> = z.object({
  userId_eventId: z.lazy(() => OrganizerAssignUserIdEventIdCompoundUniqueInputSchema),
})
.and(z.strictObject({
  userId_eventId: z.lazy(() => OrganizerAssignUserIdEventIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => OrganizerAssignWhereInputSchema), z.lazy(() => OrganizerAssignWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizerAssignWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizerAssignWhereInputSchema), z.lazy(() => OrganizerAssignWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const OrganizerAssignOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrganizerAssignOrderByWithAggregationInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrganizerAssignCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrganizerAssignMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrganizerAssignMinOrderByAggregateInputSchema).optional(),
});

export const OrganizerAssignScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrganizerAssignScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrganizerAssignScalarWhereWithAggregatesInputSchema), z.lazy(() => OrganizerAssignScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizerAssignScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizerAssignScalarWhereWithAggregatesInputSchema), z.lazy(() => OrganizerAssignScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const FormWhereInputSchema: z.ZodType<Prisma.FormWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FormWhereInputSchema), z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema), z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  fields: z.lazy(() => FormFieldListRelationFilterSchema).optional(),
  res: z.lazy(() => ResListRelationFilterSchema).optional(),
});

export const FormOrderByWithRelationInputSchema: z.ZodType<Prisma.FormOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
  fields: z.lazy(() => FormFieldOrderByRelationAggregateInputSchema).optional(),
  res: z.lazy(() => ResOrderByRelationAggregateInputSchema).optional(),
});

export const FormWhereUniqueInputSchema: z.ZodType<Prisma.FormWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    eventId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    eventId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string().optional(),
  AND: z.union([ z.lazy(() => FormWhereInputSchema), z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormWhereInputSchema), z.lazy(() => FormWhereInputSchema).array() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  fields: z.lazy(() => FormFieldListRelationFilterSchema).optional(),
  res: z.lazy(() => ResListRelationFilterSchema).optional(),
}));

export const FormOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FormCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FormMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FormMinOrderByAggregateInputSchema).optional(),
});

export const FormScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FormScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FormScalarWhereWithAggregatesInputSchema), z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormScalarWhereWithAggregatesInputSchema), z.lazy(() => FormScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const FormFieldWhereInputSchema: z.ZodType<Prisma.FormFieldWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FormFieldWhereInputSchema), z.lazy(() => FormFieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormFieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormFieldWhereInputSchema), z.lazy(() => FormFieldWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fieldOrder: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  choices: z.lazy(() => StringNullableListFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  header: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  placeholder: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  required: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  form: z.union([ z.lazy(() => FormScalarRelationFilterSchema), z.lazy(() => FormWhereInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldListRelationFilterSchema).optional(),
});

export const FormFieldOrderByWithRelationInputSchema: z.ZodType<Prisma.FormFieldOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  fieldOrder: z.lazy(() => SortOrderSchema).optional(),
  choices: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  header: z.lazy(() => SortOrderSchema).optional(),
  placeholder: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  resFields: z.lazy(() => ResFieldOrderByRelationAggregateInputSchema).optional(),
});

export const FormFieldWhereUniqueInputSchema: z.ZodType<Prisma.FormFieldWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => FormFieldWhereInputSchema), z.lazy(() => FormFieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormFieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormFieldWhereInputSchema), z.lazy(() => FormFieldWhereInputSchema).array() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fieldOrder: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  choices: z.lazy(() => StringNullableListFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  header: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  placeholder: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  required: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  form: z.union([ z.lazy(() => FormScalarRelationFilterSchema), z.lazy(() => FormWhereInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldListRelationFilterSchema).optional(),
}));

export const FormFieldOrderByWithAggregationInputSchema: z.ZodType<Prisma.FormFieldOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  fieldOrder: z.lazy(() => SortOrderSchema).optional(),
  choices: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  header: z.lazy(() => SortOrderSchema).optional(),
  placeholder: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FormFieldCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => FormFieldAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FormFieldMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FormFieldMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => FormFieldSumOrderByAggregateInputSchema).optional(),
});

export const FormFieldScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FormFieldScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FormFieldScalarWhereWithAggregatesInputSchema), z.lazy(() => FormFieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormFieldScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormFieldScalarWhereWithAggregatesInputSchema), z.lazy(() => FormFieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  fieldOrder: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  choices: z.lazy(() => StringNullableListFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  header: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  placeholder: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  required: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ResWhereInputSchema: z.ZodType<Prisma.ResWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResWhereInputSchema), z.lazy(() => ResWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResWhereInputSchema), z.lazy(() => ResWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  paymentIntent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema), z.lazy(() => PaymentStatusSchema) ]).optional(),
  paymentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  submittedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  form: z.union([ z.lazy(() => FormScalarRelationFilterSchema), z.lazy(() => FormWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldListRelationFilterSchema).optional(),
});

export const ResOrderByWithRelationInputSchema: z.ZodType<Prisma.ResOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  paymentIntent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  paymentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
  form: z.lazy(() => FormOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  resFields: z.lazy(() => ResFieldOrderByRelationAggregateInputSchema).optional(),
});

export const ResWhereUniqueInputSchema: z.ZodType<Prisma.ResWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    paymentIntent: z.string(),
    paymentId: z.string(),
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
    paymentIntent: z.string(),
    paymentId: z.string(),
  }),
  z.object({
    id: z.uuid(),
    paymentIntent: z.string(),
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
    paymentIntent: z.string(),
  }),
  z.object({
    id: z.uuid(),
    paymentId: z.string(),
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
    paymentId: z.string(),
  }),
  z.object({
    id: z.uuid(),
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    paymentIntent: z.string(),
    paymentId: z.string(),
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    paymentIntent: z.string(),
    paymentId: z.string(),
  }),
  z.object({
    paymentIntent: z.string(),
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    paymentIntent: z.string(),
  }),
  z.object({
    paymentId: z.string(),
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    paymentId: z.string(),
  }),
  z.object({
    userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  paymentIntent: z.string().optional(),
  paymentId: z.string().optional(),
  userId_eventId: z.lazy(() => ResUserIdEventIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ResWhereInputSchema), z.lazy(() => ResWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResWhereInputSchema), z.lazy(() => ResWhereInputSchema).array() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  paymentStatus: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema), z.lazy(() => PaymentStatusSchema) ]).optional(),
  submittedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  form: z.union([ z.lazy(() => FormScalarRelationFilterSchema), z.lazy(() => FormWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldListRelationFilterSchema).optional(),
}));

export const ResOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  paymentIntent: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  paymentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ResCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResMinOrderByAggregateInputSchema).optional(),
});

export const ResScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResScalarWhereWithAggregatesInputSchema), z.lazy(() => ResScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResScalarWhereWithAggregatesInputSchema), z.lazy(() => ResScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  paymentIntent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => EnumPaymentStatusWithAggregatesFilterSchema), z.lazy(() => PaymentStatusSchema) ]).optional(),
  paymentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  submittedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const ResFieldWhereInputSchema: z.ZodType<Prisma.ResFieldWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResFieldWhereInputSchema), z.lazy(() => ResFieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResFieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResFieldWhereInputSchema), z.lazy(() => ResFieldWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  formFieldId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  textField: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  choiceField: z.lazy(() => IntNullableListFilterSchema).optional(),
  fileField: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  dateField: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  selectField: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  formField: z.union([ z.lazy(() => FormFieldScalarRelationFilterSchema), z.lazy(() => FormFieldWhereInputSchema) ]).optional(),
  formRes: z.union([ z.lazy(() => ResScalarRelationFilterSchema), z.lazy(() => ResWhereInputSchema) ]).optional(),
});

export const ResFieldOrderByWithRelationInputSchema: z.ZodType<Prisma.ResFieldOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formFieldId: z.lazy(() => SortOrderSchema).optional(),
  resId: z.lazy(() => SortOrderSchema).optional(),
  textField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  choiceField: z.lazy(() => SortOrderSchema).optional(),
  fileField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  selectField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  formField: z.lazy(() => FormFieldOrderByWithRelationInputSchema).optional(),
  formRes: z.lazy(() => ResOrderByWithRelationInputSchema).optional(),
});

export const ResFieldWhereUniqueInputSchema: z.ZodType<Prisma.ResFieldWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => ResFieldWhereInputSchema), z.lazy(() => ResFieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResFieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResFieldWhereInputSchema), z.lazy(() => ResFieldWhereInputSchema).array() ]).optional(),
  formFieldId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  textField: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  choiceField: z.lazy(() => IntNullableListFilterSchema).optional(),
  fileField: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  dateField: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  selectField: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  formField: z.union([ z.lazy(() => FormFieldScalarRelationFilterSchema), z.lazy(() => FormFieldWhereInputSchema) ]).optional(),
  formRes: z.union([ z.lazy(() => ResScalarRelationFilterSchema), z.lazy(() => ResWhereInputSchema) ]).optional(),
}));

export const ResFieldOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResFieldOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formFieldId: z.lazy(() => SortOrderSchema).optional(),
  resId: z.lazy(() => SortOrderSchema).optional(),
  textField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  choiceField: z.lazy(() => SortOrderSchema).optional(),
  fileField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  dateField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  selectField: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ResFieldCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ResFieldAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResFieldMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResFieldMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ResFieldSumOrderByAggregateInputSchema).optional(),
});

export const ResFieldScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResFieldScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResFieldScalarWhereWithAggregatesInputSchema), z.lazy(() => ResFieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResFieldScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResFieldScalarWhereWithAggregatesInputSchema), z.lazy(() => ResFieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  formFieldId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  resId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  textField: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  choiceField: z.lazy(() => IntNullableListFilterSchema).optional(),
  fileField: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  dateField: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  selectField: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const TicketConfigWhereInputSchema: z.ZodType<Prisma.TicketConfigWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TicketConfigWhereInputSchema), z.lazy(() => TicketConfigWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketConfigWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketConfigWhereInputSchema), z.lazy(() => TicketConfigWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  infoLabel: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  venueLabel: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  infoFields: z.lazy(() => JsonNullableListFilterSchema).optional(),
  venueFields: z.lazy(() => JsonNullableListFilterSchema).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
});

export const TicketConfigOrderByWithRelationInputSchema: z.ZodType<Prisma.TicketConfigOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  infoLabel: z.lazy(() => SortOrderSchema).optional(),
  venueLabel: z.lazy(() => SortOrderSchema).optional(),
  infoFields: z.lazy(() => SortOrderSchema).optional(),
  venueFields: z.lazy(() => SortOrderSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
});

export const TicketConfigWhereUniqueInputSchema: z.ZodType<Prisma.TicketConfigWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    eventId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    eventId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string().optional(),
  AND: z.union([ z.lazy(() => TicketConfigWhereInputSchema), z.lazy(() => TicketConfigWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketConfigWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketConfigWhereInputSchema), z.lazy(() => TicketConfigWhereInputSchema).array() ]).optional(),
  infoLabel: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  venueLabel: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  infoFields: z.lazy(() => JsonNullableListFilterSchema).optional(),
  venueFields: z.lazy(() => JsonNullableListFilterSchema).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
}));

export const TicketConfigOrderByWithAggregationInputSchema: z.ZodType<Prisma.TicketConfigOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  infoLabel: z.lazy(() => SortOrderSchema).optional(),
  venueLabel: z.lazy(() => SortOrderSchema).optional(),
  infoFields: z.lazy(() => SortOrderSchema).optional(),
  venueFields: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TicketConfigCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TicketConfigMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TicketConfigMinOrderByAggregateInputSchema).optional(),
});

export const TicketConfigScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TicketConfigScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TicketConfigScalarWhereWithAggregatesInputSchema), z.lazy(() => TicketConfigScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TicketConfigScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TicketConfigScalarWhereWithAggregatesInputSchema), z.lazy(() => TicketConfigScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  infoLabel: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  venueLabel: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  infoFields: z.lazy(() => JsonNullableListFilterSchema).optional(),
  venueFields: z.lazy(() => JsonNullableListFilterSchema).optional(),
});

export const VenueTypeWhereInputSchema: z.ZodType<Prisma.VenueTypeWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueTypeWhereInputSchema), z.lazy(() => VenueTypeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueTypeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueTypeWhereInputSchema), z.lazy(() => VenueTypeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isUnit: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  subUnitLabel: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  venues: z.lazy(() => VenueNodeListRelationFilterSchema).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
});

export const VenueTypeOrderByWithRelationInputSchema: z.ZodType<Prisma.VenueTypeOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  isUnit: z.lazy(() => SortOrderSchema).optional(),
  subUnitLabel: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  venues: z.lazy(() => VenueNodeOrderByRelationAggregateInputSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
});

export const VenueTypeWhereUniqueInputSchema: z.ZodType<Prisma.VenueTypeWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => VenueTypeWhereInputSchema), z.lazy(() => VenueTypeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueTypeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueTypeWhereInputSchema), z.lazy(() => VenueTypeWhereInputSchema).array() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isUnit: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  subUnitLabel: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  venues: z.lazy(() => VenueNodeListRelationFilterSchema).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
}));

export const VenueTypeOrderByWithAggregationInputSchema: z.ZodType<Prisma.VenueTypeOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  isUnit: z.lazy(() => SortOrderSchema).optional(),
  subUnitLabel: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VenueTypeCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VenueTypeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VenueTypeMinOrderByAggregateInputSchema).optional(),
});

export const VenueTypeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VenueTypeScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueTypeScalarWhereWithAggregatesInputSchema), z.lazy(() => VenueTypeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueTypeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueTypeScalarWhereWithAggregatesInputSchema), z.lazy(() => VenueTypeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  label: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  isUnit: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  subUnitLabel: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const VenueNodeWhereInputSchema: z.ZodType<Prisma.VenueNodeWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueNodeWhereInputSchema), z.lazy(() => VenueNodeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueNodeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueNodeWhereInputSchema), z.lazy(() => VenueNodeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  typeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  capacity: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignListRelationFilterSchema).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  parent: z.union([ z.lazy(() => VenueNodeNullableScalarRelationFilterSchema), z.lazy(() => VenueNodeWhereInputSchema) ]).optional().nullable(),
  children: z.lazy(() => VenueNodeListRelationFilterSchema).optional(),
  type: z.union([ z.lazy(() => VenueTypeScalarRelationFilterSchema), z.lazy(() => VenueTypeWhereInputSchema) ]).optional(),
});

export const VenueNodeOrderByWithRelationInputSchema: z.ZodType<Prisma.VenueNodeOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  typeId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  capacity: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  assignments: z.lazy(() => VenueAssignOrderByRelationAggregateInputSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
  parent: z.lazy(() => VenueNodeOrderByWithRelationInputSchema).optional(),
  children: z.lazy(() => VenueNodeOrderByRelationAggregateInputSchema).optional(),
  type: z.lazy(() => VenueTypeOrderByWithRelationInputSchema).optional(),
});

export const VenueNodeWhereUniqueInputSchema: z.ZodType<Prisma.VenueNodeWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => VenueNodeWhereInputSchema), z.lazy(() => VenueNodeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueNodeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueNodeWhereInputSchema), z.lazy(() => VenueNodeWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  typeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  capacity: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignListRelationFilterSchema).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  parent: z.union([ z.lazy(() => VenueNodeNullableScalarRelationFilterSchema), z.lazy(() => VenueNodeWhereInputSchema) ]).optional().nullable(),
  children: z.lazy(() => VenueNodeListRelationFilterSchema).optional(),
  type: z.union([ z.lazy(() => VenueTypeScalarRelationFilterSchema), z.lazy(() => VenueTypeWhereInputSchema) ]).optional(),
}));

export const VenueNodeOrderByWithAggregationInputSchema: z.ZodType<Prisma.VenueNodeOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  typeId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  capacity: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => VenueNodeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => VenueNodeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VenueNodeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VenueNodeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => VenueNodeSumOrderByAggregateInputSchema).optional(),
});

export const VenueNodeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VenueNodeScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueNodeScalarWhereWithAggregatesInputSchema), z.lazy(() => VenueNodeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueNodeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueNodeScalarWhereWithAggregatesInputSchema), z.lazy(() => VenueNodeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  typeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  capacity: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const VenueAssignWhereInputSchema: z.ZodType<Prisma.VenueAssignWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueAssignWhereInputSchema), z.lazy(() => VenueAssignWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueAssignWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueAssignWhereInputSchema), z.lazy(() => VenueAssignWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  subUnitIndex: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  venueNodeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  venueNode: z.union([ z.lazy(() => VenueNodeScalarRelationFilterSchema), z.lazy(() => VenueNodeWhereInputSchema) ]).optional(),
});

export const VenueAssignOrderByWithRelationInputSchema: z.ZodType<Prisma.VenueAssignOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  subUnitIndex: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  venueNodeId: z.lazy(() => SortOrderSchema).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  venueNode: z.lazy(() => VenueNodeOrderByWithRelationInputSchema).optional(),
});

export const VenueAssignWhereUniqueInputSchema: z.ZodType<Prisma.VenueAssignWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    userId_eventId: z.lazy(() => VenueAssignUserIdEventIdCompoundUniqueInputSchema),
    venueNodeId_subUnitIndex: z.lazy(() => VenueAssignVenueNodeIdSubUnitIndexCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
    userId_eventId: z.lazy(() => VenueAssignUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
    venueNodeId_subUnitIndex: z.lazy(() => VenueAssignVenueNodeIdSubUnitIndexCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    userId_eventId: z.lazy(() => VenueAssignUserIdEventIdCompoundUniqueInputSchema),
    venueNodeId_subUnitIndex: z.lazy(() => VenueAssignVenueNodeIdSubUnitIndexCompoundUniqueInputSchema),
  }),
  z.object({
    userId_eventId: z.lazy(() => VenueAssignUserIdEventIdCompoundUniqueInputSchema),
  }),
  z.object({
    venueNodeId_subUnitIndex: z.lazy(() => VenueAssignVenueNodeIdSubUnitIndexCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  userId_eventId: z.lazy(() => VenueAssignUserIdEventIdCompoundUniqueInputSchema).optional(),
  venueNodeId_subUnitIndex: z.lazy(() => VenueAssignVenueNodeIdSubUnitIndexCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => VenueAssignWhereInputSchema), z.lazy(() => VenueAssignWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueAssignWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueAssignWhereInputSchema), z.lazy(() => VenueAssignWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  subUnitIndex: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  venueNodeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  venueNode: z.union([ z.lazy(() => VenueNodeScalarRelationFilterSchema), z.lazy(() => VenueNodeWhereInputSchema) ]).optional(),
}));

export const VenueAssignOrderByWithAggregationInputSchema: z.ZodType<Prisma.VenueAssignOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  subUnitIndex: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  venueNodeId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VenueAssignCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => VenueAssignAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VenueAssignMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VenueAssignMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => VenueAssignSumOrderByAggregateInputSchema).optional(),
});

export const VenueAssignScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VenueAssignScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueAssignScalarWhereWithAggregatesInputSchema), z.lazy(() => VenueAssignScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueAssignScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueAssignScalarWhereWithAggregatesInputSchema), z.lazy(() => VenueAssignScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  subUnitIndex: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  venueNodeId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ResultColumnWhereInputSchema: z.ZodType<Prisma.ResultColumnWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResultColumnWhereInputSchema), z.lazy(() => ResultColumnWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultColumnWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultColumnWhereInputSchema), z.lazy(() => ResultColumnWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fileMap: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  resultData: z.lazy(() => ResultDataListRelationFilterSchema).optional(),
});

export const ResultColumnOrderByWithRelationInputSchema: z.ZodType<Prisma.ResultColumnOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  fileMap: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  event: z.lazy(() => EventOrderByWithRelationInputSchema).optional(),
  resultData: z.lazy(() => ResultDataOrderByRelationAggregateInputSchema).optional(),
});

export const ResultColumnWhereUniqueInputSchema: z.ZodType<Prisma.ResultColumnWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => ResultColumnWhereInputSchema), z.lazy(() => ResultColumnWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultColumnWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultColumnWhereInputSchema), z.lazy(() => ResultColumnWhereInputSchema).array() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fileMap: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  event: z.union([ z.lazy(() => EventScalarRelationFilterSchema), z.lazy(() => EventWhereInputSchema) ]).optional(),
  resultData: z.lazy(() => ResultDataListRelationFilterSchema).optional(),
}));

export const ResultColumnOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResultColumnOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  fileMap: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ResultColumnCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ResultColumnAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResultColumnMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResultColumnMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ResultColumnSumOrderByAggregateInputSchema).optional(),
});

export const ResultColumnScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResultColumnScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResultColumnScalarWhereWithAggregatesInputSchema), z.lazy(() => ResultColumnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultColumnScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultColumnScalarWhereWithAggregatesInputSchema), z.lazy(() => ResultColumnScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  label: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  eventId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  fileMap: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const ResultDataWhereInputSchema: z.ZodType<Prisma.ResultDataWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResultDataWhereInputSchema), z.lazy(() => ResultDataWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultDataWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultDataWhereInputSchema), z.lazy(() => ResultDataWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resultColumnId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resultColumn: z.union([ z.lazy(() => ResultColumnScalarRelationFilterSchema), z.lazy(() => ResultColumnWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const ResultDataOrderByWithRelationInputSchema: z.ZodType<Prisma.ResultDataOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  resultColumnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  resultColumn: z.lazy(() => ResultColumnOrderByWithRelationInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const ResultDataWhereUniqueInputSchema: z.ZodType<Prisma.ResultDataWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    userId_resultColumnId: z.lazy(() => ResultDataUserIdResultColumnIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    userId_resultColumnId: z.lazy(() => ResultDataUserIdResultColumnIdCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.uuid().optional(),
  userId_resultColumnId: z.lazy(() => ResultDataUserIdResultColumnIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ResultDataWhereInputSchema), z.lazy(() => ResultDataWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultDataWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultDataWhereInputSchema), z.lazy(() => ResultDataWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resultColumnId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resultColumn: z.union([ z.lazy(() => ResultColumnScalarRelationFilterSchema), z.lazy(() => ResultColumnWhereInputSchema) ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const ResultDataOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResultDataOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  resultColumnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ResultDataCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResultDataMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResultDataMinOrderByAggregateInputSchema).optional(),
});

export const ResultDataScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResultDataScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResultDataScalarWhereWithAggregatesInputSchema), z.lazy(() => ResultDataScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultDataScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultDataScalarWhereWithAggregatesInputSchema), z.lazy(() => ResultDataScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  resultColumnId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutUserInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutUserNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const EventCreateInputSchema: z.ZodType<Prisma.EventCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateInputSchema: z.ZodType<Prisma.EventUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUpdateInputSchema: z.ZodType<Prisma.EventUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateInputSchema: z.ZodType<Prisma.EventUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventCreateManyInputSchema: z.ZodType<Prisma.EventCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
});

export const EventUpdateManyMutationInputSchema: z.ZodType<Prisma.EventUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const EventUncheckedUpdateManyInputSchema: z.ZodType<Prisma.EventUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const OrganizerAssignCreateInputSchema: z.ZodType<Prisma.OrganizerAssignCreateInput> = z.strictObject({
  event: z.lazy(() => EventCreateNestedOneWithoutOrganizerInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizerInputSchema),
});

export const OrganizerAssignUncheckedCreateInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedCreateInput> = z.strictObject({
  userId: z.string(),
  eventId: z.string(),
});

export const OrganizerAssignUpdateInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateInput> = z.strictObject({
  event: z.lazy(() => EventUpdateOneRequiredWithoutOrganizerNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizerNestedInputSchema).optional(),
});

export const OrganizerAssignUncheckedUpdateInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateInput> = z.strictObject({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrganizerAssignCreateManyInputSchema: z.ZodType<Prisma.OrganizerAssignCreateManyInput> = z.strictObject({
  userId: z.string(),
  eventId: z.string(),
});

export const OrganizerAssignUpdateManyMutationInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateManyMutationInput> = z.strictObject({
});

export const OrganizerAssignUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateManyInput> = z.strictObject({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FormCreateInputSchema: z.ZodType<Prisma.FormCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutFormInputSchema),
  fields: z.lazy(() => FormFieldCreateNestedManyWithoutFormInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormUncheckedCreateInputSchema: z.ZodType<Prisma.FormUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  fields: z.lazy(() => FormFieldUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormUpdateInputSchema: z.ZodType<Prisma.FormUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutFormNestedInputSchema).optional(),
  fields: z.lazy(() => FormFieldUpdateManyWithoutFormNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const FormUncheckedUpdateInputSchema: z.ZodType<Prisma.FormUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fields: z.lazy(() => FormFieldUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const FormCreateManyInputSchema: z.ZodType<Prisma.FormCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
});

export const FormUpdateManyMutationInputSchema: z.ZodType<Prisma.FormUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FormUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FormFieldCreateInputSchema: z.ZodType<Prisma.FormFieldCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
  form: z.lazy(() => FormCreateNestedOneWithoutFieldsInputSchema),
  resFields: z.lazy(() => ResFieldCreateNestedManyWithoutFormFieldInputSchema).optional(),
});

export const FormFieldUncheckedCreateInputSchema: z.ZodType<Prisma.FormFieldUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  formId: z.string(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
  resFields: z.lazy(() => ResFieldUncheckedCreateNestedManyWithoutFormFieldInputSchema).optional(),
});

export const FormFieldUpdateInputSchema: z.ZodType<Prisma.FormFieldUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutFieldsNestedInputSchema).optional(),
  resFields: z.lazy(() => ResFieldUpdateManyWithoutFormFieldNestedInputSchema).optional(),
});

export const FormFieldUncheckedUpdateInputSchema: z.ZodType<Prisma.FormFieldUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormFieldNestedInputSchema).optional(),
});

export const FormFieldCreateManyInputSchema: z.ZodType<Prisma.FormFieldCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  formId: z.string(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
});

export const FormFieldUpdateManyMutationInputSchema: z.ZodType<Prisma.FormFieldUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const FormFieldUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FormFieldUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResCreateInputSchema: z.ZodType<Prisma.ResCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutResInputSchema),
  form: z.lazy(() => FormCreateNestedOneWithoutResInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutResInputSchema),
  resFields: z.lazy(() => ResFieldCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResUncheckedCreateInputSchema: z.ZodType<Prisma.ResUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  formId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  resFields: z.lazy(() => ResFieldUncheckedCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResUpdateInputSchema: z.ZodType<Prisma.ResUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  resFields: z.lazy(() => ResFieldUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateInputSchema: z.ZodType<Prisma.ResUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResCreateManyInputSchema: z.ZodType<Prisma.ResCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  formId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
});

export const ResUpdateManyMutationInputSchema: z.ZodType<Prisma.ResUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResFieldCreateInputSchema: z.ZodType<Prisma.ResFieldCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
  formField: z.lazy(() => FormFieldCreateNestedOneWithoutResFieldsInputSchema),
  formRes: z.lazy(() => ResCreateNestedOneWithoutResFieldsInputSchema),
});

export const ResFieldUncheckedCreateInputSchema: z.ZodType<Prisma.ResFieldUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  formFieldId: z.string(),
  resId: z.string(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
});

export const ResFieldUpdateInputSchema: z.ZodType<Prisma.ResFieldUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formField: z.lazy(() => FormFieldUpdateOneRequiredWithoutResFieldsNestedInputSchema).optional(),
  formRes: z.lazy(() => ResUpdateOneRequiredWithoutResFieldsNestedInputSchema).optional(),
});

export const ResFieldUncheckedUpdateInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResFieldCreateManyInputSchema: z.ZodType<Prisma.ResFieldCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  formFieldId: z.string(),
  resId: z.string(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
});

export const ResFieldUpdateManyMutationInputSchema: z.ZodType<Prisma.ResFieldUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResFieldUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const TicketConfigCreateInputSchema: z.ZodType<Prisma.TicketConfigCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  infoLabel: z.string(),
  venueLabel: z.string(),
  infoFields: z.union([ z.lazy(() => TicketConfigCreateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigCreatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutTicketConfigInputSchema),
});

export const TicketConfigUncheckedCreateInputSchema: z.ZodType<Prisma.TicketConfigUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  infoLabel: z.string(),
  venueLabel: z.string(),
  infoFields: z.union([ z.lazy(() => TicketConfigCreateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigCreatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigUpdateInputSchema: z.ZodType<Prisma.TicketConfigUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  venueLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoFields: z.union([ z.lazy(() => TicketConfigUpdateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigUpdatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutTicketConfigNestedInputSchema).optional(),
});

export const TicketConfigUncheckedUpdateInputSchema: z.ZodType<Prisma.TicketConfigUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  venueLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoFields: z.union([ z.lazy(() => TicketConfigUpdateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigUpdatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigCreateManyInputSchema: z.ZodType<Prisma.TicketConfigCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  infoLabel: z.string(),
  venueLabel: z.string(),
  infoFields: z.union([ z.lazy(() => TicketConfigCreateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigCreatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigUpdateManyMutationInputSchema: z.ZodType<Prisma.TicketConfigUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  venueLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoFields: z.union([ z.lazy(() => TicketConfigUpdateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigUpdatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TicketConfigUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  venueLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoFields: z.union([ z.lazy(() => TicketConfigUpdateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigUpdatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const VenueTypeCreateInputSchema: z.ZodType<Prisma.VenueTypeCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
  venues: z.lazy(() => VenueNodeCreateNestedManyWithoutTypeInputSchema).optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueTypesInputSchema),
});

export const VenueTypeUncheckedCreateInputSchema: z.ZodType<Prisma.VenueTypeUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
  eventId: z.string(),
  venues: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutTypeInputSchema).optional(),
});

export const VenueTypeUpdateInputSchema: z.ZodType<Prisma.VenueTypeUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venues: z.lazy(() => VenueNodeUpdateManyWithoutTypeNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueTypesNestedInputSchema).optional(),
});

export const VenueTypeUncheckedUpdateInputSchema: z.ZodType<Prisma.VenueTypeUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  venues: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutTypeNestedInputSchema).optional(),
});

export const VenueTypeCreateManyInputSchema: z.ZodType<Prisma.VenueTypeCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
  eventId: z.string(),
});

export const VenueTypeUpdateManyMutationInputSchema: z.ZodType<Prisma.VenueTypeUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueTypeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VenueTypeUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VenueNodeCreateInputSchema: z.ZodType<Prisma.VenueNodeCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueNodesInputSchema),
  parent: z.lazy(() => VenueNodeCreateNestedOneWithoutChildrenInputSchema).optional(),
  children: z.lazy(() => VenueNodeCreateNestedManyWithoutParentInputSchema).optional(),
  type: z.lazy(() => VenueTypeCreateNestedOneWithoutVenuesInputSchema),
});

export const VenueNodeUncheckedCreateInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  eventId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
});

export const VenueNodeUpdateInputSchema: z.ZodType<Prisma.VenueNodeUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueNodesNestedInputSchema).optional(),
  parent: z.lazy(() => VenueNodeUpdateOneWithoutChildrenNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUpdateManyWithoutParentNestedInputSchema).optional(),
  type: z.lazy(() => VenueTypeUpdateOneRequiredWithoutVenuesNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
});

export const VenueNodeCreateManyInputSchema: z.ZodType<Prisma.VenueNodeCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  eventId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
});

export const VenueNodeUpdateManyMutationInputSchema: z.ZodType<Prisma.VenueNodeUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueNodeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueAssignCreateInputSchema: z.ZodType<Prisma.VenueAssignCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  subUnitIndex: z.number().int().optional().nullable(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueAssignInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutVenueAssignInputSchema),
  venueNode: z.lazy(() => VenueNodeCreateNestedOneWithoutAssignmentsInputSchema),
});

export const VenueAssignUncheckedCreateInputSchema: z.ZodType<Prisma.VenueAssignUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  eventId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
  venueNodeId: z.string(),
});

export const VenueAssignUpdateInputSchema: z.ZodType<Prisma.VenueAssignUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueAssignNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutVenueAssignNestedInputSchema).optional(),
  venueNode: z.lazy(() => VenueNodeUpdateOneRequiredWithoutAssignmentsNestedInputSchema).optional(),
});

export const VenueAssignUncheckedUpdateInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venueNodeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VenueAssignCreateManyInputSchema: z.ZodType<Prisma.VenueAssignCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  eventId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
  venueNodeId: z.string(),
});

export const VenueAssignUpdateManyMutationInputSchema: z.ZodType<Prisma.VenueAssignUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueAssignUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venueNodeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResultColumnCreateInputSchema: z.ZodType<Prisma.ResultColumnCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  fileMap: z.string().optional().nullable(),
  event: z.lazy(() => EventCreateNestedOneWithoutResultColumnsInputSchema),
  resultData: z.lazy(() => ResultDataCreateNestedManyWithoutResultColumnInputSchema).optional(),
});

export const ResultColumnUncheckedCreateInputSchema: z.ZodType<Prisma.ResultColumnUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  eventId: z.string(),
  fileMap: z.string().optional().nullable(),
  resultData: z.lazy(() => ResultDataUncheckedCreateNestedManyWithoutResultColumnInputSchema).optional(),
});

export const ResultColumnUpdateInputSchema: z.ZodType<Prisma.ResultColumnUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutResultColumnsNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUpdateManyWithoutResultColumnNestedInputSchema).optional(),
});

export const ResultColumnUncheckedUpdateInputSchema: z.ZodType<Prisma.ResultColumnUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultData: z.lazy(() => ResultDataUncheckedUpdateManyWithoutResultColumnNestedInputSchema).optional(),
});

export const ResultColumnCreateManyInputSchema: z.ZodType<Prisma.ResultColumnCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  eventId: z.string(),
  fileMap: z.string().optional().nullable(),
});

export const ResultColumnUpdateManyMutationInputSchema: z.ZodType<Prisma.ResultColumnUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResultColumnUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResultColumnUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResultDataCreateInputSchema: z.ZodType<Prisma.ResultDataCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  value: z.string(),
  resultColumn: z.lazy(() => ResultColumnCreateNestedOneWithoutResultDataInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutResultDataInputSchema),
});

export const ResultDataUncheckedCreateInputSchema: z.ZodType<Prisma.ResultDataUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  resultColumnId: z.string(),
  value: z.string(),
});

export const ResultDataUpdateInputSchema: z.ZodType<Prisma.ResultDataUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resultColumn: z.lazy(() => ResultColumnUpdateOneRequiredWithoutResultDataNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutResultDataNestedInputSchema).optional(),
});

export const ResultDataUncheckedUpdateInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resultColumnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResultDataCreateManyInputSchema: z.ZodType<Prisma.ResultDataCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  resultColumnId: z.string(),
  value: z.string(),
});

export const ResultDataUpdateManyMutationInputSchema: z.ZodType<Prisma.ResultDataUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResultDataUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resultColumnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const OrganizerAssignListRelationFilterSchema: z.ZodType<Prisma.OrganizerAssignListRelationFilter> = z.strictObject({
  every: z.lazy(() => OrganizerAssignWhereInputSchema).optional(),
  some: z.lazy(() => OrganizerAssignWhereInputSchema).optional(),
  none: z.lazy(() => OrganizerAssignWhereInputSchema).optional(),
});

export const ResListRelationFilterSchema: z.ZodType<Prisma.ResListRelationFilter> = z.strictObject({
  every: z.lazy(() => ResWhereInputSchema).optional(),
  some: z.lazy(() => ResWhereInputSchema).optional(),
  none: z.lazy(() => ResWhereInputSchema).optional(),
});

export const VenueAssignListRelationFilterSchema: z.ZodType<Prisma.VenueAssignListRelationFilter> = z.strictObject({
  every: z.lazy(() => VenueAssignWhereInputSchema).optional(),
  some: z.lazy(() => VenueAssignWhereInputSchema).optional(),
  none: z.lazy(() => VenueAssignWhereInputSchema).optional(),
});

export const ResultDataListRelationFilterSchema: z.ZodType<Prisma.ResultDataListRelationFilter> = z.strictObject({
  every: z.lazy(() => ResultDataWhereInputSchema).optional(),
  some: z.lazy(() => ResultDataWhereInputSchema).optional(),
  none: z.lazy(() => ResultDataWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const OrganizerAssignOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrganizerAssignOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ResOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueAssignOrderByRelationAggregateInputSchema: z.ZodType<Prisma.VenueAssignOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultDataOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResultDataOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  profileUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const FormNullableScalarRelationFilterSchema: z.ZodType<Prisma.FormNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => FormWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => FormWhereInputSchema).optional().nullable(),
});

export const TicketConfigNullableScalarRelationFilterSchema: z.ZodType<Prisma.TicketConfigNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => TicketConfigWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TicketConfigWhereInputSchema).optional().nullable(),
});

export const VenueNodeListRelationFilterSchema: z.ZodType<Prisma.VenueNodeListRelationFilter> = z.strictObject({
  every: z.lazy(() => VenueNodeWhereInputSchema).optional(),
  some: z.lazy(() => VenueNodeWhereInputSchema).optional(),
  none: z.lazy(() => VenueNodeWhereInputSchema).optional(),
});

export const VenueTypeListRelationFilterSchema: z.ZodType<Prisma.VenueTypeListRelationFilter> = z.strictObject({
  every: z.lazy(() => VenueTypeWhereInputSchema).optional(),
  some: z.lazy(() => VenueTypeWhereInputSchema).optional(),
  none: z.lazy(() => VenueTypeWhereInputSchema).optional(),
});

export const ResultColumnListRelationFilterSchema: z.ZodType<Prisma.ResultColumnListRelationFilter> = z.strictObject({
  every: z.lazy(() => ResultColumnWhereInputSchema).optional(),
  some: z.lazy(() => ResultColumnWhereInputSchema).optional(),
  none: z.lazy(() => ResultColumnWhereInputSchema).optional(),
});

export const VenueNodeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.VenueNodeOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueTypeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.VenueTypeOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultColumnOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResultColumnOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const EventCountOrderByAggregateInputSchema: z.ZodType<Prisma.EventCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  regist: z.lazy(() => SortOrderSchema).optional(),
  profileURL: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  stripeAccountId: z.lazy(() => SortOrderSchema).optional(),
  resultUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const EventAvgOrderByAggregateInputSchema: z.ZodType<Prisma.EventAvgOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const EventMaxOrderByAggregateInputSchema: z.ZodType<Prisma.EventMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  regist: z.lazy(() => SortOrderSchema).optional(),
  profileURL: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  stripeAccountId: z.lazy(() => SortOrderSchema).optional(),
  resultUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const EventMinOrderByAggregateInputSchema: z.ZodType<Prisma.EventMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  location: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  startDate: z.lazy(() => SortOrderSchema).optional(),
  endDate: z.lazy(() => SortOrderSchema).optional(),
  regist: z.lazy(() => SortOrderSchema).optional(),
  profileURL: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  stripeAccountId: z.lazy(() => SortOrderSchema).optional(),
  resultUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const EventSumOrderByAggregateInputSchema: z.ZodType<Prisma.EventSumOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const EventScalarRelationFilterSchema: z.ZodType<Prisma.EventScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => EventWhereInputSchema).optional(),
  isNot: z.lazy(() => EventWhereInputSchema).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const OrganizerAssignUserIdEventIdCompoundUniqueInputSchema: z.ZodType<Prisma.OrganizerAssignUserIdEventIdCompoundUniqueInput> = z.strictObject({
  userId: z.string(),
  eventId: z.string(),
});

export const OrganizerAssignCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizerAssignCountOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrganizerAssignMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizerAssignMaxOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrganizerAssignMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrganizerAssignMinOrderByAggregateInput> = z.strictObject({
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const FormFieldListRelationFilterSchema: z.ZodType<Prisma.FormFieldListRelationFilter> = z.strictObject({
  every: z.lazy(() => FormFieldWhereInputSchema).optional(),
  some: z.lazy(() => FormFieldWhereInputSchema).optional(),
  none: z.lazy(() => FormFieldWhereInputSchema).optional(),
});

export const FormFieldOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FormFieldOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const FormCountOrderByAggregateInputSchema: z.ZodType<Prisma.FormCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const FormMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const FormMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.strictObject({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const FormScalarRelationFilterSchema: z.ZodType<Prisma.FormScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => FormWhereInputSchema).optional(),
  isNot: z.lazy(() => FormWhereInputSchema).optional(),
});

export const ResFieldListRelationFilterSchema: z.ZodType<Prisma.ResFieldListRelationFilter> = z.strictObject({
  every: z.lazy(() => ResFieldWhereInputSchema).optional(),
  some: z.lazy(() => ResFieldWhereInputSchema).optional(),
  none: z.lazy(() => ResFieldWhereInputSchema).optional(),
});

export const ResFieldOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResFieldOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const FormFieldCountOrderByAggregateInputSchema: z.ZodType<Prisma.FormFieldCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  fieldOrder: z.lazy(() => SortOrderSchema).optional(),
  choices: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  header: z.lazy(() => SortOrderSchema).optional(),
  placeholder: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
});

export const FormFieldAvgOrderByAggregateInputSchema: z.ZodType<Prisma.FormFieldAvgOrderByAggregateInput> = z.strictObject({
  fieldOrder: z.lazy(() => SortOrderSchema).optional(),
});

export const FormFieldMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FormFieldMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  fieldOrder: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  header: z.lazy(() => SortOrderSchema).optional(),
  placeholder: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
});

export const FormFieldMinOrderByAggregateInputSchema: z.ZodType<Prisma.FormFieldMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  fieldOrder: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  header: z.lazy(() => SortOrderSchema).optional(),
  placeholder: z.lazy(() => SortOrderSchema).optional(),
  required: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
});

export const FormFieldSumOrderByAggregateInputSchema: z.ZodType<Prisma.FormFieldSumOrderByAggregateInput> = z.strictObject({
  fieldOrder: z.lazy(() => SortOrderSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const EnumPaymentStatusFilterSchema: z.ZodType<Prisma.EnumPaymentStatusFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusFilterSchema) ]).optional(),
});

export const ResUserIdEventIdCompoundUniqueInputSchema: z.ZodType<Prisma.ResUserIdEventIdCompoundUniqueInput> = z.strictObject({
  userId: z.string(),
  eventId: z.string(),
});

export const ResCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  paymentIntent: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  paymentId: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ResMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  paymentIntent: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  paymentId: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const ResMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  formId: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  paymentIntent: z.lazy(() => SortOrderSchema).optional(),
  paymentStatus: z.lazy(() => SortOrderSchema).optional(),
  paymentId: z.lazy(() => SortOrderSchema).optional(),
  submittedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumPaymentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
});

export const IntNullableListFilterSchema: z.ZodType<Prisma.IntNullableListFilter> = z.strictObject({
  equals: z.number().array().optional().nullable(),
  has: z.number().optional().nullable(),
  hasEvery: z.number().array().optional(),
  hasSome: z.number().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const FormFieldScalarRelationFilterSchema: z.ZodType<Prisma.FormFieldScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => FormFieldWhereInputSchema).optional(),
  isNot: z.lazy(() => FormFieldWhereInputSchema).optional(),
});

export const ResScalarRelationFilterSchema: z.ZodType<Prisma.ResScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ResWhereInputSchema).optional(),
  isNot: z.lazy(() => ResWhereInputSchema).optional(),
});

export const ResFieldCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResFieldCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formFieldId: z.lazy(() => SortOrderSchema).optional(),
  resId: z.lazy(() => SortOrderSchema).optional(),
  textField: z.lazy(() => SortOrderSchema).optional(),
  choiceField: z.lazy(() => SortOrderSchema).optional(),
  fileField: z.lazy(() => SortOrderSchema).optional(),
  dateField: z.lazy(() => SortOrderSchema).optional(),
  selectField: z.lazy(() => SortOrderSchema).optional(),
});

export const ResFieldAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ResFieldAvgOrderByAggregateInput> = z.strictObject({
  choiceField: z.lazy(() => SortOrderSchema).optional(),
  selectField: z.lazy(() => SortOrderSchema).optional(),
});

export const ResFieldMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResFieldMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formFieldId: z.lazy(() => SortOrderSchema).optional(),
  resId: z.lazy(() => SortOrderSchema).optional(),
  textField: z.lazy(() => SortOrderSchema).optional(),
  fileField: z.lazy(() => SortOrderSchema).optional(),
  dateField: z.lazy(() => SortOrderSchema).optional(),
  selectField: z.lazy(() => SortOrderSchema).optional(),
});

export const ResFieldMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResFieldMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  formFieldId: z.lazy(() => SortOrderSchema).optional(),
  resId: z.lazy(() => SortOrderSchema).optional(),
  textField: z.lazy(() => SortOrderSchema).optional(),
  fileField: z.lazy(() => SortOrderSchema).optional(),
  dateField: z.lazy(() => SortOrderSchema).optional(),
  selectField: z.lazy(() => SortOrderSchema).optional(),
});

export const ResFieldSumOrderByAggregateInputSchema: z.ZodType<Prisma.ResFieldSumOrderByAggregateInput> = z.strictObject({
  choiceField: z.lazy(() => SortOrderSchema).optional(),
  selectField: z.lazy(() => SortOrderSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const JsonNullableListFilterSchema: z.ZodType<Prisma.JsonNullableListFilter> = z.strictObject({
  equals: InputJsonValueSchema.array().optional().nullable(),
  has: InputJsonValueSchema.optional().nullable(),
  hasEvery: InputJsonValueSchema.array().optional(),
  hasSome: InputJsonValueSchema.array().optional(),
  isEmpty: z.boolean().optional(),
});

export const TicketConfigCountOrderByAggregateInputSchema: z.ZodType<Prisma.TicketConfigCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  infoLabel: z.lazy(() => SortOrderSchema).optional(),
  venueLabel: z.lazy(() => SortOrderSchema).optional(),
  infoFields: z.lazy(() => SortOrderSchema).optional(),
  venueFields: z.lazy(() => SortOrderSchema).optional(),
});

export const TicketConfigMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TicketConfigMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  infoLabel: z.lazy(() => SortOrderSchema).optional(),
  venueLabel: z.lazy(() => SortOrderSchema).optional(),
});

export const TicketConfigMinOrderByAggregateInputSchema: z.ZodType<Prisma.TicketConfigMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  infoLabel: z.lazy(() => SortOrderSchema).optional(),
  venueLabel: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueTypeCountOrderByAggregateInputSchema: z.ZodType<Prisma.VenueTypeCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  isUnit: z.lazy(() => SortOrderSchema).optional(),
  subUnitLabel: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueTypeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VenueTypeMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  isUnit: z.lazy(() => SortOrderSchema).optional(),
  subUnitLabel: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueTypeMinOrderByAggregateInputSchema: z.ZodType<Prisma.VenueTypeMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  isUnit: z.lazy(() => SortOrderSchema).optional(),
  subUnitLabel: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueNodeNullableScalarRelationFilterSchema: z.ZodType<Prisma.VenueNodeNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => VenueNodeWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => VenueNodeWhereInputSchema).optional().nullable(),
});

export const VenueTypeScalarRelationFilterSchema: z.ZodType<Prisma.VenueTypeScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => VenueTypeWhereInputSchema).optional(),
  isNot: z.lazy(() => VenueTypeWhereInputSchema).optional(),
});

export const VenueNodeCountOrderByAggregateInputSchema: z.ZodType<Prisma.VenueNodeCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  typeId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  capacity: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueNodeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.VenueNodeAvgOrderByAggregateInput> = z.strictObject({
  capacity: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueNodeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VenueNodeMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  typeId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  capacity: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueNodeMinOrderByAggregateInputSchema: z.ZodType<Prisma.VenueNodeMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  typeId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
  capacity: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueNodeSumOrderByAggregateInputSchema: z.ZodType<Prisma.VenueNodeSumOrderByAggregateInput> = z.strictObject({
  capacity: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueNodeScalarRelationFilterSchema: z.ZodType<Prisma.VenueNodeScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => VenueNodeWhereInputSchema).optional(),
  isNot: z.lazy(() => VenueNodeWhereInputSchema).optional(),
});

export const VenueAssignUserIdEventIdCompoundUniqueInputSchema: z.ZodType<Prisma.VenueAssignUserIdEventIdCompoundUniqueInput> = z.strictObject({
  userId: z.string(),
  eventId: z.string(),
});

export const VenueAssignVenueNodeIdSubUnitIndexCompoundUniqueInputSchema: z.ZodType<Prisma.VenueAssignVenueNodeIdSubUnitIndexCompoundUniqueInput> = z.strictObject({
  venueNodeId: z.string(),
  subUnitIndex: z.number(),
});

export const VenueAssignCountOrderByAggregateInputSchema: z.ZodType<Prisma.VenueAssignCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  subUnitIndex: z.lazy(() => SortOrderSchema).optional(),
  venueNodeId: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueAssignAvgOrderByAggregateInputSchema: z.ZodType<Prisma.VenueAssignAvgOrderByAggregateInput> = z.strictObject({
  subUnitIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueAssignMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VenueAssignMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  subUnitIndex: z.lazy(() => SortOrderSchema).optional(),
  venueNodeId: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueAssignMinOrderByAggregateInputSchema: z.ZodType<Prisma.VenueAssignMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  subUnitIndex: z.lazy(() => SortOrderSchema).optional(),
  venueNodeId: z.lazy(() => SortOrderSchema).optional(),
});

export const VenueAssignSumOrderByAggregateInputSchema: z.ZodType<Prisma.VenueAssignSumOrderByAggregateInput> = z.strictObject({
  subUnitIndex: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultColumnCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResultColumnCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  fileMap: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultColumnAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ResultColumnAvgOrderByAggregateInput> = z.strictObject({
  order: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultColumnMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResultColumnMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  fileMap: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultColumnMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResultColumnMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  label: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  eventId: z.lazy(() => SortOrderSchema).optional(),
  fileMap: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultColumnSumOrderByAggregateInputSchema: z.ZodType<Prisma.ResultColumnSumOrderByAggregateInput> = z.strictObject({
  order: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultColumnScalarRelationFilterSchema: z.ZodType<Prisma.ResultColumnScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ResultColumnWhereInputSchema).optional(),
  isNot: z.lazy(() => ResultColumnWhereInputSchema).optional(),
});

export const ResultDataUserIdResultColumnIdCompoundUniqueInputSchema: z.ZodType<Prisma.ResultDataUserIdResultColumnIdCompoundUniqueInput> = z.strictObject({
  userId: z.string(),
  resultColumnId: z.string(),
});

export const ResultDataCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResultDataCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  resultColumnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultDataMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResultDataMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  resultColumnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
});

export const ResultDataMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResultDataMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  resultColumnId: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
});

export const OrganizerAssignCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const ResCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ResCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutUserInputSchema), z.lazy(() => ResCreateWithoutUserInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueAssignCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutUserInputSchema), z.lazy(() => VenueAssignCreateWithoutUserInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const ResultDataCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ResultDataCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutUserInputSchema), z.lazy(() => ResultDataCreateWithoutUserInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
});

export const OrganizerAssignUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const ResUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ResUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutUserInputSchema), z.lazy(() => ResCreateWithoutUserInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueAssignUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutUserInputSchema), z.lazy(() => VenueAssignCreateWithoutUserInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const ResultDataUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutUserInputSchema), z.lazy(() => ResultDataCreateWithoutUserInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => RoleSchema).optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const OrganizerAssignUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizerAssignScalarWhereInputSchema), z.lazy(() => OrganizerAssignScalarWhereInputSchema).array() ]).optional(),
});

export const ResUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ResUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutUserInputSchema), z.lazy(() => ResCreateWithoutUserInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ResUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
});

export const VenueAssignUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.VenueAssignUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutUserInputSchema), z.lazy(() => VenueAssignCreateWithoutUserInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueAssignUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => VenueAssignUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
});

export const ResultDataUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ResultDataUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutUserInputSchema), z.lazy(() => ResultDataCreateWithoutUserInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultDataUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ResultDataUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultDataScalarWhereInputSchema), z.lazy(() => ResultDataScalarWhereInputSchema).array() ]).optional(),
});

export const OrganizerAssignUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizerAssignScalarWhereInputSchema), z.lazy(() => OrganizerAssignScalarWhereInputSchema).array() ]).optional(),
});

export const ResUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ResUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutUserInputSchema), z.lazy(() => ResCreateWithoutUserInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ResUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
});

export const VenueAssignUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutUserInputSchema), z.lazy(() => VenueAssignCreateWithoutUserInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueAssignUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => VenueAssignUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
});

export const ResultDataUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutUserInputSchema), z.lazy(() => ResultDataCreateWithoutUserInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultDataUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ResultDataUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultDataScalarWhereInputSchema), z.lazy(() => ResultDataScalarWhereInputSchema).array() ]).optional(),
});

export const FormCreateNestedOneWithoutEventInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutEventInputSchema), z.lazy(() => FormUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutEventInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
});

export const OrganizerAssignCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const ResCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ResCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutEventInputSchema), z.lazy(() => ResCreateWithoutEventInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
});

export const TicketConfigCreateNestedOneWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigCreateNestedOneWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => TicketConfigCreateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketConfigCreateOrConnectWithoutEventInputSchema).optional(),
  connect: z.lazy(() => TicketConfigWhereUniqueInputSchema).optional(),
});

export const VenueAssignCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutEventInputSchema), z.lazy(() => VenueAssignCreateWithoutEventInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueNodeCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutEventInputSchema), z.lazy(() => VenueNodeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueTypeCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutEventInputSchema), z.lazy(() => VenueTypeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueTypeCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
});

export const ResultColumnCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutEventInputSchema), z.lazy(() => ResultColumnCreateWithoutEventInputSchema).array(), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultColumnCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
});

export const FormUncheckedCreateNestedOneWithoutEventInputSchema: z.ZodType<Prisma.FormUncheckedCreateNestedOneWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutEventInputSchema), z.lazy(() => FormUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutEventInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
});

export const OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const ResUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ResUncheckedCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutEventInputSchema), z.lazy(() => ResCreateWithoutEventInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
});

export const TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigUncheckedCreateNestedOneWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => TicketConfigCreateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketConfigCreateOrConnectWithoutEventInputSchema).optional(),
  connect: z.lazy(() => TicketConfigWhereUniqueInputSchema).optional(),
});

export const VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUncheckedCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutEventInputSchema), z.lazy(() => VenueAssignCreateWithoutEventInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutEventInputSchema), z.lazy(() => VenueNodeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUncheckedCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutEventInputSchema), z.lazy(() => VenueTypeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueTypeCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
});

export const ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUncheckedCreateNestedManyWithoutEventInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutEventInputSchema), z.lazy(() => ResultColumnCreateWithoutEventInputSchema).array(), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultColumnCreateManyEventInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const FormUpdateOneWithoutEventNestedInputSchema: z.ZodType<Prisma.FormUpdateOneWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutEventInputSchema), z.lazy(() => FormUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutEventInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutEventInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutEventInputSchema), z.lazy(() => FormUpdateWithoutEventInputSchema), z.lazy(() => FormUncheckedUpdateWithoutEventInputSchema) ]).optional(),
});

export const OrganizerAssignUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizerAssignScalarWhereInputSchema), z.lazy(() => OrganizerAssignScalarWhereInputSchema).array() ]).optional(),
});

export const ResUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ResUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutEventInputSchema), z.lazy(() => ResCreateWithoutEventInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => ResUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
});

export const TicketConfigUpdateOneWithoutEventNestedInputSchema: z.ZodType<Prisma.TicketConfigUpdateOneWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TicketConfigCreateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketConfigCreateOrConnectWithoutEventInputSchema).optional(),
  upsert: z.lazy(() => TicketConfigUpsertWithoutEventInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TicketConfigWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TicketConfigWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TicketConfigWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TicketConfigUpdateToOneWithWhereWithoutEventInputSchema), z.lazy(() => TicketConfigUpdateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedUpdateWithoutEventInputSchema) ]).optional(),
});

export const VenueAssignUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.VenueAssignUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutEventInputSchema), z.lazy(() => VenueAssignCreateWithoutEventInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueAssignUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => VenueAssignUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
});

export const VenueNodeUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.VenueNodeUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutEventInputSchema), z.lazy(() => VenueNodeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueNodeUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => VenueNodeUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
});

export const VenueTypeUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.VenueTypeUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutEventInputSchema), z.lazy(() => VenueTypeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueTypeUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueTypeUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueTypeCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueTypeUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueTypeUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueTypeUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => VenueTypeUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueTypeScalarWhereInputSchema), z.lazy(() => VenueTypeScalarWhereInputSchema).array() ]).optional(),
});

export const ResultColumnUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ResultColumnUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutEventInputSchema), z.lazy(() => ResultColumnCreateWithoutEventInputSchema).array(), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultColumnUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResultColumnUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultColumnCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultColumnUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResultColumnUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultColumnUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => ResultColumnUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultColumnScalarWhereInputSchema), z.lazy(() => ResultColumnScalarWhereInputSchema).array() ]).optional(),
});

export const FormUncheckedUpdateOneWithoutEventNestedInputSchema: z.ZodType<Prisma.FormUncheckedUpdateOneWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutEventInputSchema), z.lazy(() => FormUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutEventInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutEventInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => FormWhereInputSchema) ]).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutEventInputSchema), z.lazy(() => FormUpdateWithoutEventInputSchema), z.lazy(() => FormUncheckedUpdateWithoutEventInputSchema) ]).optional(),
});

export const OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema).array(), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => OrganizerAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => OrganizerAssignUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrganizerAssignCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrganizerAssignWhereUniqueInputSchema), z.lazy(() => OrganizerAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => OrganizerAssignUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => OrganizerAssignUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrganizerAssignScalarWhereInputSchema), z.lazy(() => OrganizerAssignScalarWhereInputSchema).array() ]).optional(),
});

export const ResUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ResUncheckedUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutEventInputSchema), z.lazy(() => ResCreateWithoutEventInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => ResUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
});

export const TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema: z.ZodType<Prisma.TicketConfigUncheckedUpdateOneWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TicketConfigCreateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedCreateWithoutEventInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TicketConfigCreateOrConnectWithoutEventInputSchema).optional(),
  upsert: z.lazy(() => TicketConfigUpsertWithoutEventInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TicketConfigWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TicketConfigWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TicketConfigWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TicketConfigUpdateToOneWithWhereWithoutEventInputSchema), z.lazy(() => TicketConfigUpdateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedUpdateWithoutEventInputSchema) ]).optional(),
});

export const VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutEventInputSchema), z.lazy(() => VenueAssignCreateWithoutEventInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueAssignUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => VenueAssignUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
});

export const VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutEventInputSchema), z.lazy(() => VenueNodeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueNodeUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => VenueNodeUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
});

export const VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.VenueTypeUncheckedUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutEventInputSchema), z.lazy(() => VenueTypeCreateWithoutEventInputSchema).array(), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema), z.lazy(() => VenueTypeCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueTypeUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueTypeUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueTypeCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueTypeWhereUniqueInputSchema), z.lazy(() => VenueTypeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueTypeUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => VenueTypeUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueTypeUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => VenueTypeUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueTypeScalarWhereInputSchema), z.lazy(() => VenueTypeScalarWhereInputSchema).array() ]).optional(),
});

export const ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema: z.ZodType<Prisma.ResultColumnUncheckedUpdateManyWithoutEventNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutEventInputSchema), z.lazy(() => ResultColumnCreateWithoutEventInputSchema).array(), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema), z.lazy(() => ResultColumnCreateOrConnectWithoutEventInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultColumnUpsertWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResultColumnUpsertWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultColumnCreateManyEventInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultColumnWhereUniqueInputSchema), z.lazy(() => ResultColumnWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultColumnUpdateWithWhereUniqueWithoutEventInputSchema), z.lazy(() => ResultColumnUpdateWithWhereUniqueWithoutEventInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultColumnUpdateManyWithWhereWithoutEventInputSchema), z.lazy(() => ResultColumnUpdateManyWithWhereWithoutEventInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultColumnScalarWhereInputSchema), z.lazy(() => ResultColumnScalarWhereInputSchema).array() ]).optional(),
});

export const EventCreateNestedOneWithoutOrganizerInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutOrganizerInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutOrganizerInputSchema), z.lazy(() => EventUncheckedCreateWithoutOrganizerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutOrganizerInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const UserCreateNestedOneWithoutOrganizerInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrganizerInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizerInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrganizerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizerInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const EventUpdateOneRequiredWithoutOrganizerNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutOrganizerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutOrganizerInputSchema), z.lazy(() => EventUncheckedCreateWithoutOrganizerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutOrganizerInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutOrganizerInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutOrganizerInputSchema), z.lazy(() => EventUpdateWithoutOrganizerInputSchema), z.lazy(() => EventUncheckedUpdateWithoutOrganizerInputSchema) ]).optional(),
});

export const UserUpdateOneRequiredWithoutOrganizerNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrganizerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizerInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrganizerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrganizerInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrganizerInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrganizerInputSchema), z.lazy(() => UserUpdateWithoutOrganizerInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOrganizerInputSchema) ]).optional(),
});

export const EventCreateNestedOneWithoutFormInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutFormInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutFormInputSchema), z.lazy(() => EventUncheckedCreateWithoutFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutFormInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const FormFieldCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.FormFieldCreateNestedManyWithoutFormInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormFieldCreateWithoutFormInputSchema), z.lazy(() => FormFieldCreateWithoutFormInputSchema).array(), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema), z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormFieldCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
});

export const ResCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.ResCreateNestedManyWithoutFormInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutFormInputSchema), z.lazy(() => ResCreateWithoutFormInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutFormInputSchema), z.lazy(() => ResCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
});

export const FormFieldUncheckedCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUncheckedCreateNestedManyWithoutFormInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormFieldCreateWithoutFormInputSchema), z.lazy(() => FormFieldCreateWithoutFormInputSchema).array(), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema), z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormFieldCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
});

export const ResUncheckedCreateNestedManyWithoutFormInputSchema: z.ZodType<Prisma.ResUncheckedCreateNestedManyWithoutFormInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutFormInputSchema), z.lazy(() => ResCreateWithoutFormInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutFormInputSchema), z.lazy(() => ResCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyFormInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
});

export const EventUpdateOneRequiredWithoutFormNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutFormNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutFormInputSchema), z.lazy(() => EventUncheckedCreateWithoutFormInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutFormInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutFormInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutFormInputSchema), z.lazy(() => EventUpdateWithoutFormInputSchema), z.lazy(() => EventUncheckedUpdateWithoutFormInputSchema) ]).optional(),
});

export const FormFieldUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.FormFieldUpdateManyWithoutFormNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormFieldCreateWithoutFormInputSchema), z.lazy(() => FormFieldCreateWithoutFormInputSchema).array(), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema), z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormFieldUpsertWithWhereUniqueWithoutFormInputSchema), z.lazy(() => FormFieldUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormFieldCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormFieldUpdateWithWhereUniqueWithoutFormInputSchema), z.lazy(() => FormFieldUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormFieldUpdateManyWithWhereWithoutFormInputSchema), z.lazy(() => FormFieldUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormFieldScalarWhereInputSchema), z.lazy(() => FormFieldScalarWhereInputSchema).array() ]).optional(),
});

export const ResUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.ResUpdateManyWithoutFormNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutFormInputSchema), z.lazy(() => ResCreateWithoutFormInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutFormInputSchema), z.lazy(() => ResCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResUpsertWithWhereUniqueWithoutFormInputSchema), z.lazy(() => ResUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResUpdateWithWhereUniqueWithoutFormInputSchema), z.lazy(() => ResUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResUpdateManyWithWhereWithoutFormInputSchema), z.lazy(() => ResUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
});

export const FormFieldUncheckedUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.FormFieldUncheckedUpdateManyWithoutFormNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormFieldCreateWithoutFormInputSchema), z.lazy(() => FormFieldCreateWithoutFormInputSchema).array(), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema), z.lazy(() => FormFieldCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FormFieldUpsertWithWhereUniqueWithoutFormInputSchema), z.lazy(() => FormFieldUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FormFieldCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FormFieldWhereUniqueInputSchema), z.lazy(() => FormFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FormFieldUpdateWithWhereUniqueWithoutFormInputSchema), z.lazy(() => FormFieldUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FormFieldUpdateManyWithWhereWithoutFormInputSchema), z.lazy(() => FormFieldUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FormFieldScalarWhereInputSchema), z.lazy(() => FormFieldScalarWhereInputSchema).array() ]).optional(),
});

export const ResUncheckedUpdateManyWithoutFormNestedInputSchema: z.ZodType<Prisma.ResUncheckedUpdateManyWithoutFormNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutFormInputSchema), z.lazy(() => ResCreateWithoutFormInputSchema).array(), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResCreateOrConnectWithoutFormInputSchema), z.lazy(() => ResCreateOrConnectWithoutFormInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResUpsertWithWhereUniqueWithoutFormInputSchema), z.lazy(() => ResUpsertWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResCreateManyFormInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResWhereUniqueInputSchema), z.lazy(() => ResWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResUpdateWithWhereUniqueWithoutFormInputSchema), z.lazy(() => ResUpdateWithWhereUniqueWithoutFormInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResUpdateManyWithWhereWithoutFormInputSchema), z.lazy(() => ResUpdateManyWithWhereWithoutFormInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
});

export const FormFieldCreatechoicesInputSchema: z.ZodType<Prisma.FormFieldCreatechoicesInput> = z.strictObject({
  set: z.string().array(),
});

export const FormCreateNestedOneWithoutFieldsInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutFieldsInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutFieldsInputSchema), z.lazy(() => FormUncheckedCreateWithoutFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFieldsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
});

export const ResFieldCreateNestedManyWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldCreateNestedManyWithoutFormFieldInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormFieldInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
});

export const ResFieldUncheckedCreateNestedManyWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUncheckedCreateNestedManyWithoutFormFieldInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormFieldInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
});

export const FormFieldUpdatechoicesInputSchema: z.ZodType<Prisma.FormFieldUpdatechoicesInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const FormUpdateOneRequiredWithoutFieldsNestedInputSchema: z.ZodType<Prisma.FormUpdateOneRequiredWithoutFieldsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutFieldsInputSchema), z.lazy(() => FormUncheckedCreateWithoutFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutFieldsInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutFieldsInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutFieldsInputSchema), z.lazy(() => FormUpdateWithoutFieldsInputSchema), z.lazy(() => FormUncheckedUpdateWithoutFieldsInputSchema) ]).optional(),
});

export const ResFieldUpdateManyWithoutFormFieldNestedInputSchema: z.ZodType<Prisma.ResFieldUpdateManyWithoutFormFieldNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormFieldInputSchema), z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormFieldInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormFieldInputSchema), z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormFieldInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormFieldInputSchema), z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormFieldInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResFieldScalarWhereInputSchema), z.lazy(() => ResFieldScalarWhereInputSchema).array() ]).optional(),
});

export const ResFieldUncheckedUpdateManyWithoutFormFieldNestedInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateManyWithoutFormFieldNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormFieldInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormFieldInputSchema), z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormFieldInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormFieldInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormFieldInputSchema), z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormFieldInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormFieldInputSchema), z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormFieldInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResFieldScalarWhereInputSchema), z.lazy(() => ResFieldScalarWhereInputSchema).array() ]).optional(),
});

export const EventCreateNestedOneWithoutResInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutResInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutResInputSchema), z.lazy(() => EventUncheckedCreateWithoutResInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutResInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const FormCreateNestedOneWithoutResInputSchema: z.ZodType<Prisma.FormCreateNestedOneWithoutResInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutResInputSchema), z.lazy(() => FormUncheckedCreateWithoutResInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutResInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
});

export const UserCreateNestedOneWithoutResInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutResInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutResInputSchema), z.lazy(() => UserUncheckedCreateWithoutResInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutResInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const ResFieldCreateNestedManyWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldCreateNestedManyWithoutFormResInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormResInputSchema), z.lazy(() => ResFieldCreateWithoutFormResInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormResInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
});

export const ResFieldUncheckedCreateNestedManyWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUncheckedCreateNestedManyWithoutFormResInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormResInputSchema), z.lazy(() => ResFieldCreateWithoutFormResInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormResInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
});

export const EnumPaymentStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPaymentStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => PaymentStatusSchema).optional(),
});

export const EventUpdateOneRequiredWithoutResNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutResNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutResInputSchema), z.lazy(() => EventUncheckedCreateWithoutResInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutResInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutResInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutResInputSchema), z.lazy(() => EventUpdateWithoutResInputSchema), z.lazy(() => EventUncheckedUpdateWithoutResInputSchema) ]).optional(),
});

export const FormUpdateOneRequiredWithoutResNestedInputSchema: z.ZodType<Prisma.FormUpdateOneRequiredWithoutResNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormCreateWithoutResInputSchema), z.lazy(() => FormUncheckedCreateWithoutResInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormCreateOrConnectWithoutResInputSchema).optional(),
  upsert: z.lazy(() => FormUpsertWithoutResInputSchema).optional(),
  connect: z.lazy(() => FormWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormUpdateToOneWithWhereWithoutResInputSchema), z.lazy(() => FormUpdateWithoutResInputSchema), z.lazy(() => FormUncheckedUpdateWithoutResInputSchema) ]).optional(),
});

export const UserUpdateOneRequiredWithoutResNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutResNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutResInputSchema), z.lazy(() => UserUncheckedCreateWithoutResInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutResInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutResInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutResInputSchema), z.lazy(() => UserUpdateWithoutResInputSchema), z.lazy(() => UserUncheckedUpdateWithoutResInputSchema) ]).optional(),
});

export const ResFieldUpdateManyWithoutFormResNestedInputSchema: z.ZodType<Prisma.ResFieldUpdateManyWithoutFormResNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormResInputSchema), z.lazy(() => ResFieldCreateWithoutFormResInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormResInputSchema), z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormResInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormResInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormResInputSchema), z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormResInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormResInputSchema), z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormResInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResFieldScalarWhereInputSchema), z.lazy(() => ResFieldScalarWhereInputSchema).array() ]).optional(),
});

export const ResFieldUncheckedUpdateManyWithoutFormResNestedInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateManyWithoutFormResNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormResInputSchema), z.lazy(() => ResFieldCreateWithoutFormResInputSchema).array(), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema), z.lazy(() => ResFieldCreateOrConnectWithoutFormResInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormResInputSchema), z.lazy(() => ResFieldUpsertWithWhereUniqueWithoutFormResInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResFieldCreateManyFormResInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResFieldWhereUniqueInputSchema), z.lazy(() => ResFieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormResInputSchema), z.lazy(() => ResFieldUpdateWithWhereUniqueWithoutFormResInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormResInputSchema), z.lazy(() => ResFieldUpdateManyWithWhereWithoutFormResInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResFieldScalarWhereInputSchema), z.lazy(() => ResFieldScalarWhereInputSchema).array() ]).optional(),
});

export const ResFieldCreatechoiceFieldInputSchema: z.ZodType<Prisma.ResFieldCreatechoiceFieldInput> = z.strictObject({
  set: z.number().array(),
});

export const FormFieldCreateNestedOneWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldCreateNestedOneWithoutResFieldsInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormFieldCreateWithoutResFieldsInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutResFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormFieldCreateOrConnectWithoutResFieldsInputSchema).optional(),
  connect: z.lazy(() => FormFieldWhereUniqueInputSchema).optional(),
});

export const ResCreateNestedOneWithoutResFieldsInputSchema: z.ZodType<Prisma.ResCreateNestedOneWithoutResFieldsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutResFieldsInputSchema), z.lazy(() => ResUncheckedCreateWithoutResFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResCreateOrConnectWithoutResFieldsInputSchema).optional(),
  connect: z.lazy(() => ResWhereUniqueInputSchema).optional(),
});

export const ResFieldUpdatechoiceFieldInputSchema: z.ZodType<Prisma.ResFieldUpdatechoiceFieldInput> = z.strictObject({
  set: z.number().array().optional(),
  push: z.union([ z.number(),z.number().array() ]).optional(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const FormFieldUpdateOneRequiredWithoutResFieldsNestedInputSchema: z.ZodType<Prisma.FormFieldUpdateOneRequiredWithoutResFieldsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => FormFieldCreateWithoutResFieldsInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutResFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => FormFieldCreateOrConnectWithoutResFieldsInputSchema).optional(),
  upsert: z.lazy(() => FormFieldUpsertWithoutResFieldsInputSchema).optional(),
  connect: z.lazy(() => FormFieldWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => FormFieldUpdateToOneWithWhereWithoutResFieldsInputSchema), z.lazy(() => FormFieldUpdateWithoutResFieldsInputSchema), z.lazy(() => FormFieldUncheckedUpdateWithoutResFieldsInputSchema) ]).optional(),
});

export const ResUpdateOneRequiredWithoutResFieldsNestedInputSchema: z.ZodType<Prisma.ResUpdateOneRequiredWithoutResFieldsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResCreateWithoutResFieldsInputSchema), z.lazy(() => ResUncheckedCreateWithoutResFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResCreateOrConnectWithoutResFieldsInputSchema).optional(),
  upsert: z.lazy(() => ResUpsertWithoutResFieldsInputSchema).optional(),
  connect: z.lazy(() => ResWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResUpdateToOneWithWhereWithoutResFieldsInputSchema), z.lazy(() => ResUpdateWithoutResFieldsInputSchema), z.lazy(() => ResUncheckedUpdateWithoutResFieldsInputSchema) ]).optional(),
});

export const TicketConfigCreateinfoFieldsInputSchema: z.ZodType<Prisma.TicketConfigCreateinfoFieldsInput> = z.strictObject({
  set: InputJsonValueSchema.array(),
});

export const TicketConfigCreatevenueFieldsInputSchema: z.ZodType<Prisma.TicketConfigCreatevenueFieldsInput> = z.strictObject({
  set: InputJsonValueSchema.array(),
});

export const EventCreateNestedOneWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutTicketConfigInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutTicketConfigInputSchema), z.lazy(() => EventUncheckedCreateWithoutTicketConfigInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutTicketConfigInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const TicketConfigUpdateinfoFieldsInputSchema: z.ZodType<Prisma.TicketConfigUpdateinfoFieldsInput> = z.strictObject({
  set: InputJsonValueSchema.array().optional(),
  push: z.union([ InputJsonValueSchema,InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigUpdatevenueFieldsInputSchema: z.ZodType<Prisma.TicketConfigUpdatevenueFieldsInput> = z.strictObject({
  set: InputJsonValueSchema.array().optional(),
  push: z.union([ InputJsonValueSchema,InputJsonValueSchema.array() ]).optional(),
});

export const EventUpdateOneRequiredWithoutTicketConfigNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutTicketConfigNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutTicketConfigInputSchema), z.lazy(() => EventUncheckedCreateWithoutTicketConfigInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutTicketConfigInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutTicketConfigInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutTicketConfigInputSchema), z.lazy(() => EventUpdateWithoutTicketConfigInputSchema), z.lazy(() => EventUncheckedUpdateWithoutTicketConfigInputSchema) ]).optional(),
});

export const VenueNodeCreateNestedManyWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeCreateNestedManyWithoutTypeInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateWithoutTypeInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
});

export const EventCreateNestedOneWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutVenueTypesInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutVenueTypesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueTypesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutVenueTypesInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const VenueNodeUncheckedCreateNestedManyWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateNestedManyWithoutTypeInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateWithoutTypeInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyTypeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueNodeUpdateManyWithoutTypeNestedInputSchema: z.ZodType<Prisma.VenueNodeUpdateManyWithoutTypeNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateWithoutTypeInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutTypeInputSchema), z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutTypeInputSchema), z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueNodeUpdateManyWithWhereWithoutTypeInputSchema), z.lazy(() => VenueNodeUpdateManyWithWhereWithoutTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
});

export const EventUpdateOneRequiredWithoutVenueTypesNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutVenueTypesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutVenueTypesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueTypesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutVenueTypesInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutVenueTypesInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutVenueTypesInputSchema), z.lazy(() => EventUpdateWithoutVenueTypesInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueTypesInputSchema) ]).optional(),
});

export const VenueNodeUncheckedUpdateManyWithoutTypeNestedInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateManyWithoutTypeNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateWithoutTypeInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutTypeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutTypeInputSchema), z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutTypeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyTypeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutTypeInputSchema), z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutTypeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueNodeUpdateManyWithWhereWithoutTypeInputSchema), z.lazy(() => VenueNodeUpdateManyWithWhereWithoutTypeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
});

export const VenueAssignCreateNestedManyWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignCreateNestedManyWithoutVenueNodeInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyVenueNodeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const EventCreateNestedOneWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutVenueNodesInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutVenueNodesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueNodesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutVenueNodesInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const VenueNodeCreateNestedOneWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeCreateNestedOneWithoutChildrenInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutChildrenInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutChildrenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VenueNodeCreateOrConnectWithoutChildrenInputSchema).optional(),
  connect: z.lazy(() => VenueNodeWhereUniqueInputSchema).optional(),
});

export const VenueNodeCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeCreateNestedManyWithoutParentInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutParentInputSchema), z.lazy(() => VenueNodeCreateWithoutParentInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueTypeCreateNestedOneWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeCreateNestedOneWithoutVenuesInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutVenuesInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutVenuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VenueTypeCreateOrConnectWithoutVenuesInputSchema).optional(),
  connect: z.lazy(() => VenueTypeWhereUniqueInputSchema).optional(),
});

export const VenueAssignUncheckedCreateNestedManyWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUncheckedCreateNestedManyWithoutVenueNodeInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyVenueNodeInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueNodeUncheckedCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateNestedManyWithoutParentInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutParentInputSchema), z.lazy(() => VenueNodeCreateWithoutParentInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
});

export const VenueAssignUpdateManyWithoutVenueNodeNestedInputSchema: z.ZodType<Prisma.VenueAssignUpdateManyWithoutVenueNodeNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutVenueNodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyVenueNodeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutVenueNodeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueAssignUpdateManyWithWhereWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUpdateManyWithWhereWithoutVenueNodeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
});

export const EventUpdateOneRequiredWithoutVenueNodesNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutVenueNodesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutVenueNodesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueNodesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutVenueNodesInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutVenueNodesInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutVenueNodesInputSchema), z.lazy(() => EventUpdateWithoutVenueNodesInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueNodesInputSchema) ]).optional(),
});

export const VenueNodeUpdateOneWithoutChildrenNestedInputSchema: z.ZodType<Prisma.VenueNodeUpdateOneWithoutChildrenNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutChildrenInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutChildrenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VenueNodeCreateOrConnectWithoutChildrenInputSchema).optional(),
  upsert: z.lazy(() => VenueNodeUpsertWithoutChildrenInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => VenueNodeWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => VenueNodeWhereInputSchema) ]).optional(),
  connect: z.lazy(() => VenueNodeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateToOneWithWhereWithoutChildrenInputSchema), z.lazy(() => VenueNodeUpdateWithoutChildrenInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutChildrenInputSchema) ]).optional(),
});

export const VenueNodeUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.VenueNodeUpdateManyWithoutParentNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutParentInputSchema), z.lazy(() => VenueNodeCreateWithoutParentInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutParentInputSchema), z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutParentInputSchema), z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueNodeUpdateManyWithWhereWithoutParentInputSchema), z.lazy(() => VenueNodeUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
});

export const VenueTypeUpdateOneRequiredWithoutVenuesNestedInputSchema: z.ZodType<Prisma.VenueTypeUpdateOneRequiredWithoutVenuesNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutVenuesInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutVenuesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VenueTypeCreateOrConnectWithoutVenuesInputSchema).optional(),
  upsert: z.lazy(() => VenueTypeUpsertWithoutVenuesInputSchema).optional(),
  connect: z.lazy(() => VenueTypeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => VenueTypeUpdateToOneWithWhereWithoutVenuesInputSchema), z.lazy(() => VenueTypeUpdateWithoutVenuesInputSchema), z.lazy(() => VenueTypeUncheckedUpdateWithoutVenuesInputSchema) ]).optional(),
});

export const VenueAssignUncheckedUpdateManyWithoutVenueNodeNestedInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateManyWithoutVenueNodeNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema).array(), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignCreateOrConnectWithoutVenueNodeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUpsertWithWhereUniqueWithoutVenueNodeInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueAssignCreateManyVenueNodeInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueAssignWhereUniqueInputSchema), z.lazy(() => VenueAssignWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUpdateWithWhereUniqueWithoutVenueNodeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueAssignUpdateManyWithWhereWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUpdateManyWithWhereWithoutVenueNodeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
});

export const VenueNodeUncheckedUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateManyWithoutParentNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutParentInputSchema), z.lazy(() => VenueNodeCreateWithoutParentInputSchema).array(), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema), z.lazy(() => VenueNodeCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutParentInputSchema), z.lazy(() => VenueNodeUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VenueNodeCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VenueNodeWhereUniqueInputSchema), z.lazy(() => VenueNodeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutParentInputSchema), z.lazy(() => VenueNodeUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VenueNodeUpdateManyWithWhereWithoutParentInputSchema), z.lazy(() => VenueNodeUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
});

export const EventCreateNestedOneWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutVenueAssignInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutVenueAssignInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueAssignInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutVenueAssignInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const UserCreateNestedOneWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutVenueAssignInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutVenueAssignInputSchema), z.lazy(() => UserUncheckedCreateWithoutVenueAssignInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutVenueAssignInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const VenueNodeCreateNestedOneWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeCreateNestedOneWithoutAssignmentsInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutAssignmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VenueNodeCreateOrConnectWithoutAssignmentsInputSchema).optional(),
  connect: z.lazy(() => VenueNodeWhereUniqueInputSchema).optional(),
});

export const EventUpdateOneRequiredWithoutVenueAssignNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutVenueAssignNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutVenueAssignInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueAssignInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutVenueAssignInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutVenueAssignInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutVenueAssignInputSchema), z.lazy(() => EventUpdateWithoutVenueAssignInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueAssignInputSchema) ]).optional(),
});

export const UserUpdateOneRequiredWithoutVenueAssignNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutVenueAssignNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutVenueAssignInputSchema), z.lazy(() => UserUncheckedCreateWithoutVenueAssignInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutVenueAssignInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutVenueAssignInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutVenueAssignInputSchema), z.lazy(() => UserUpdateWithoutVenueAssignInputSchema), z.lazy(() => UserUncheckedUpdateWithoutVenueAssignInputSchema) ]).optional(),
});

export const VenueNodeUpdateOneRequiredWithoutAssignmentsNestedInputSchema: z.ZodType<Prisma.VenueNodeUpdateOneRequiredWithoutAssignmentsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutAssignmentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VenueNodeCreateOrConnectWithoutAssignmentsInputSchema).optional(),
  upsert: z.lazy(() => VenueNodeUpsertWithoutAssignmentsInputSchema).optional(),
  connect: z.lazy(() => VenueNodeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => VenueNodeUpdateToOneWithWhereWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUpdateWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutAssignmentsInputSchema) ]).optional(),
});

export const EventCreateNestedOneWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventCreateNestedOneWithoutResultColumnsInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutResultColumnsInputSchema), z.lazy(() => EventUncheckedCreateWithoutResultColumnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutResultColumnsInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
});

export const ResultDataCreateNestedManyWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataCreateNestedManyWithoutResultColumnInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyResultColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
});

export const ResultDataUncheckedCreateNestedManyWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUncheckedCreateNestedManyWithoutResultColumnInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyResultColumnInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
});

export const EventUpdateOneRequiredWithoutResultColumnsNestedInputSchema: z.ZodType<Prisma.EventUpdateOneRequiredWithoutResultColumnsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => EventCreateWithoutResultColumnsInputSchema), z.lazy(() => EventUncheckedCreateWithoutResultColumnsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => EventCreateOrConnectWithoutResultColumnsInputSchema).optional(),
  upsert: z.lazy(() => EventUpsertWithoutResultColumnsInputSchema).optional(),
  connect: z.lazy(() => EventWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => EventUpdateToOneWithWhereWithoutResultColumnsInputSchema), z.lazy(() => EventUpdateWithoutResultColumnsInputSchema), z.lazy(() => EventUncheckedUpdateWithoutResultColumnsInputSchema) ]).optional(),
});

export const ResultDataUpdateManyWithoutResultColumnNestedInputSchema: z.ZodType<Prisma.ResultDataUpdateManyWithoutResultColumnNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutResultColumnInputSchema), z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutResultColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyResultColumnInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutResultColumnInputSchema), z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutResultColumnInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultDataUpdateManyWithWhereWithoutResultColumnInputSchema), z.lazy(() => ResultDataUpdateManyWithWhereWithoutResultColumnInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultDataScalarWhereInputSchema), z.lazy(() => ResultDataScalarWhereInputSchema).array() ]).optional(),
});

export const ResultDataUncheckedUpdateManyWithoutResultColumnNestedInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateManyWithoutResultColumnNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema).array(), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema), z.lazy(() => ResultDataCreateOrConnectWithoutResultColumnInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutResultColumnInputSchema), z.lazy(() => ResultDataUpsertWithWhereUniqueWithoutResultColumnInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ResultDataCreateManyResultColumnInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultDataWhereUniqueInputSchema), z.lazy(() => ResultDataWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutResultColumnInputSchema), z.lazy(() => ResultDataUpdateWithWhereUniqueWithoutResultColumnInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultDataUpdateManyWithWhereWithoutResultColumnInputSchema), z.lazy(() => ResultDataUpdateManyWithWhereWithoutResultColumnInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultDataScalarWhereInputSchema), z.lazy(() => ResultDataScalarWhereInputSchema).array() ]).optional(),
});

export const ResultColumnCreateNestedOneWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnCreateNestedOneWithoutResultDataInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutResultDataInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutResultDataInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResultColumnCreateOrConnectWithoutResultDataInputSchema).optional(),
  connect: z.lazy(() => ResultColumnWhereUniqueInputSchema).optional(),
});

export const UserCreateNestedOneWithoutResultDataInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutResultDataInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutResultDataInputSchema), z.lazy(() => UserUncheckedCreateWithoutResultDataInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutResultDataInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const ResultColumnUpdateOneRequiredWithoutResultDataNestedInputSchema: z.ZodType<Prisma.ResultColumnUpdateOneRequiredWithoutResultDataNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutResultDataInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutResultDataInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ResultColumnCreateOrConnectWithoutResultDataInputSchema).optional(),
  upsert: z.lazy(() => ResultColumnUpsertWithoutResultDataInputSchema).optional(),
  connect: z.lazy(() => ResultColumnWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ResultColumnUpdateToOneWithWhereWithoutResultDataInputSchema), z.lazy(() => ResultColumnUpdateWithoutResultDataInputSchema), z.lazy(() => ResultColumnUncheckedUpdateWithoutResultDataInputSchema) ]).optional(),
});

export const UserUpdateOneRequiredWithoutResultDataNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutResultDataNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutResultDataInputSchema), z.lazy(() => UserUncheckedCreateWithoutResultDataInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutResultDataInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutResultDataInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutResultDataInputSchema), z.lazy(() => UserUpdateWithoutResultDataInputSchema), z.lazy(() => UserUncheckedUpdateWithoutResultDataInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedEnumPaymentStatusFilterSchema: z.ZodType<Prisma.NestedEnumPaymentStatusFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusFilterSchema) ]).optional(),
});

export const NestedEnumPaymentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const OrganizerAssignCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignCreateWithoutUserInput> = z.strictObject({
  event: z.lazy(() => EventCreateNestedOneWithoutOrganizerInputSchema),
});

export const OrganizerAssignUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedCreateWithoutUserInput> = z.strictObject({
  eventId: z.string(),
});

export const OrganizerAssignCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema) ]),
});

export const OrganizerAssignCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.OrganizerAssignCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrganizerAssignCreateManyUserInputSchema), z.lazy(() => OrganizerAssignCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ResCreateWithoutUserInputSchema: z.ZodType<Prisma.ResCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutResInputSchema),
  form: z.lazy(() => FormCreateNestedOneWithoutResInputSchema),
  resFields: z.lazy(() => ResFieldCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ResUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  formId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  resFields: z.lazy(() => ResFieldUncheckedCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ResCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResCreateWithoutUserInputSchema), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema) ]),
});

export const ResCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ResCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResCreateManyUserInputSchema), z.lazy(() => ResCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const VenueAssignCreateWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  subUnitIndex: z.number().int().optional().nullable(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueAssignInputSchema),
  venueNode: z.lazy(() => VenueNodeCreateNestedOneWithoutAssignmentsInputSchema),
});

export const VenueAssignUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
  venueNodeId: z.string(),
});

export const VenueAssignCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema) ]),
});

export const VenueAssignCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.VenueAssignCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => VenueAssignCreateManyUserInputSchema), z.lazy(() => VenueAssignCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ResultDataCreateWithoutUserInputSchema: z.ZodType<Prisma.ResultDataCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  value: z.string(),
  resultColumn: z.lazy(() => ResultColumnCreateNestedOneWithoutResultDataInputSchema),
});

export const ResultDataUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.uuid().optional(),
  resultColumnId: z.string(),
  value: z.string(),
});

export const ResultDataCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ResultDataCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResultDataWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResultDataCreateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema) ]),
});

export const ResultDataCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ResultDataCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResultDataCreateManyUserInputSchema), z.lazy(() => ResultDataCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const OrganizerAssignUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizerAssignUpdateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutUserInputSchema) ]),
});

export const OrganizerAssignUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizerAssignUpdateWithoutUserInputSchema), z.lazy(() => OrganizerAssignUncheckedUpdateWithoutUserInputSchema) ]),
});

export const OrganizerAssignUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizerAssignUpdateManyMutationInputSchema), z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const OrganizerAssignScalarWhereInputSchema: z.ZodType<Prisma.OrganizerAssignScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrganizerAssignScalarWhereInputSchema), z.lazy(() => OrganizerAssignScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrganizerAssignScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrganizerAssignScalarWhereInputSchema), z.lazy(() => OrganizerAssignScalarWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const ResUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ResUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResUpdateWithoutUserInputSchema), z.lazy(() => ResUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ResCreateWithoutUserInputSchema), z.lazy(() => ResUncheckedCreateWithoutUserInputSchema) ]),
});

export const ResUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ResUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResUpdateWithoutUserInputSchema), z.lazy(() => ResUncheckedUpdateWithoutUserInputSchema) ]),
});

export const ResUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ResUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResUpdateManyMutationInputSchema), z.lazy(() => ResUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const ResScalarWhereInputSchema: z.ZodType<Prisma.ResScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResScalarWhereInputSchema), z.lazy(() => ResScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  paymentIntent: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema), z.lazy(() => PaymentStatusSchema) ]).optional(),
  paymentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  submittedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const VenueAssignUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutUserInputSchema) ]),
});

export const VenueAssignUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VenueAssignUpdateWithoutUserInputSchema), z.lazy(() => VenueAssignUncheckedUpdateWithoutUserInputSchema) ]),
});

export const VenueAssignUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => VenueAssignScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VenueAssignUpdateManyMutationInputSchema), z.lazy(() => VenueAssignUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const VenueAssignScalarWhereInputSchema: z.ZodType<Prisma.VenueAssignScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueAssignScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueAssignScalarWhereInputSchema), z.lazy(() => VenueAssignScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  subUnitIndex: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  venueNodeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const ResultDataUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResultDataWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResultDataUpdateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ResultDataCreateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutUserInputSchema) ]),
});

export const ResultDataUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResultDataWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResultDataUpdateWithoutUserInputSchema), z.lazy(() => ResultDataUncheckedUpdateWithoutUserInputSchema) ]),
});

export const ResultDataUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => ResultDataScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResultDataUpdateManyMutationInputSchema), z.lazy(() => ResultDataUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const ResultDataScalarWhereInputSchema: z.ZodType<Prisma.ResultDataScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResultDataScalarWhereInputSchema), z.lazy(() => ResultDataScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultDataScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultDataScalarWhereInputSchema), z.lazy(() => ResultDataScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resultColumnId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const FormCreateWithoutEventInputSchema: z.ZodType<Prisma.FormCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  fields: z.lazy(() => FormFieldCreateNestedManyWithoutFormInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  fields: z.lazy(() => FormFieldUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutEventInputSchema), z.lazy(() => FormUncheckedCreateWithoutEventInputSchema) ]),
});

export const OrganizerAssignCreateWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignCreateWithoutEventInput> = z.strictObject({
  user: z.lazy(() => UserCreateNestedOneWithoutOrganizerInputSchema),
});

export const OrganizerAssignUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedCreateWithoutEventInput> = z.strictObject({
  userId: z.string(),
});

export const OrganizerAssignCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema) ]),
});

export const OrganizerAssignCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.OrganizerAssignCreateManyEventInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrganizerAssignCreateManyEventInputSchema), z.lazy(() => OrganizerAssignCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ResCreateWithoutEventInputSchema: z.ZodType<Prisma.ResCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  form: z.lazy(() => FormCreateNestedOneWithoutResInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutResInputSchema),
  resFields: z.lazy(() => ResFieldCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.ResUncheckedCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  formId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  resFields: z.lazy(() => ResFieldUncheckedCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.ResCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResCreateWithoutEventInputSchema), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema) ]),
});

export const ResCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.ResCreateManyEventInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResCreateManyEventInputSchema), z.lazy(() => ResCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const TicketConfigCreateWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  infoLabel: z.string(),
  venueLabel: z.string(),
  infoFields: z.union([ z.lazy(() => TicketConfigCreateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigCreatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigUncheckedCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  infoLabel: z.string(),
  venueLabel: z.string(),
  infoFields: z.union([ z.lazy(() => TicketConfigCreateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigCreatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => TicketConfigWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TicketConfigCreateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedCreateWithoutEventInputSchema) ]),
});

export const VenueAssignCreateWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  subUnitIndex: z.number().int().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutVenueAssignInputSchema),
  venueNode: z.lazy(() => VenueNodeCreateNestedOneWithoutAssignmentsInputSchema),
});

export const VenueAssignUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUncheckedCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
  venueNodeId: z.string(),
});

export const VenueAssignCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema) ]),
});

export const VenueAssignCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.VenueAssignCreateManyEventInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => VenueAssignCreateManyEventInputSchema), z.lazy(() => VenueAssignCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const VenueNodeCreateWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  parent: z.lazy(() => VenueNodeCreateNestedOneWithoutChildrenInputSchema).optional(),
  children: z.lazy(() => VenueNodeCreateNestedManyWithoutParentInputSchema).optional(),
  type: z.lazy(() => VenueTypeCreateNestedOneWithoutVenuesInputSchema),
});

export const VenueNodeUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
});

export const VenueNodeCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema) ]),
});

export const VenueNodeCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.VenueNodeCreateManyEventInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => VenueNodeCreateManyEventInputSchema), z.lazy(() => VenueNodeCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const VenueTypeCreateWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
  venues: z.lazy(() => VenueNodeCreateNestedManyWithoutTypeInputSchema).optional(),
});

export const VenueTypeUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUncheckedCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
  venues: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutTypeInputSchema).optional(),
});

export const VenueTypeCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueTypeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema) ]),
});

export const VenueTypeCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.VenueTypeCreateManyEventInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => VenueTypeCreateManyEventInputSchema), z.lazy(() => VenueTypeCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ResultColumnCreateWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  fileMap: z.string().optional().nullable(),
  resultData: z.lazy(() => ResultDataCreateNestedManyWithoutResultColumnInputSchema).optional(),
});

export const ResultColumnUncheckedCreateWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUncheckedCreateWithoutEventInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  fileMap: z.string().optional().nullable(),
  resultData: z.lazy(() => ResultDataUncheckedCreateNestedManyWithoutResultColumnInputSchema).optional(),
});

export const ResultColumnCreateOrConnectWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnCreateOrConnectWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResultColumnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema) ]),
});

export const ResultColumnCreateManyEventInputEnvelopeSchema: z.ZodType<Prisma.ResultColumnCreateManyEventInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResultColumnCreateManyEventInputSchema), z.lazy(() => ResultColumnCreateManyEventInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const FormUpsertWithoutEventInputSchema: z.ZodType<Prisma.FormUpsertWithoutEventInput> = z.strictObject({
  update: z.union([ z.lazy(() => FormUpdateWithoutEventInputSchema), z.lazy(() => FormUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutEventInputSchema), z.lazy(() => FormUncheckedCreateWithoutEventInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional(),
});

export const FormUpdateToOneWithWhereWithoutEventInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutEventInputSchema), z.lazy(() => FormUncheckedUpdateWithoutEventInputSchema) ]),
});

export const FormUpdateWithoutEventInputSchema: z.ZodType<Prisma.FormUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fields: z.lazy(() => FormFieldUpdateManyWithoutFormNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const FormUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fields: z.lazy(() => FormFieldUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const OrganizerAssignUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUpsertWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrganizerAssignUpdateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => OrganizerAssignCreateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedCreateWithoutEventInputSchema) ]),
});

export const OrganizerAssignUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrganizerAssignUpdateWithoutEventInputSchema), z.lazy(() => OrganizerAssignUncheckedUpdateWithoutEventInputSchema) ]),
});

export const OrganizerAssignUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateManyWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => OrganizerAssignScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrganizerAssignUpdateManyMutationInputSchema), z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventInputSchema) ]),
});

export const ResUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ResUpsertWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResUpdateWithoutEventInputSchema), z.lazy(() => ResUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => ResCreateWithoutEventInputSchema), z.lazy(() => ResUncheckedCreateWithoutEventInputSchema) ]),
});

export const ResUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ResUpdateWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResUpdateWithoutEventInputSchema), z.lazy(() => ResUncheckedUpdateWithoutEventInputSchema) ]),
});

export const ResUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.ResUpdateManyWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResUpdateManyMutationInputSchema), z.lazy(() => ResUncheckedUpdateManyWithoutEventInputSchema) ]),
});

export const TicketConfigUpsertWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigUpsertWithoutEventInput> = z.strictObject({
  update: z.union([ z.lazy(() => TicketConfigUpdateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => TicketConfigCreateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedCreateWithoutEventInputSchema) ]),
  where: z.lazy(() => TicketConfigWhereInputSchema).optional(),
});

export const TicketConfigUpdateToOneWithWhereWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigUpdateToOneWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => TicketConfigWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TicketConfigUpdateWithoutEventInputSchema), z.lazy(() => TicketConfigUncheckedUpdateWithoutEventInputSchema) ]),
});

export const TicketConfigUpdateWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  venueLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoFields: z.union([ z.lazy(() => TicketConfigUpdateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigUpdatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const TicketConfigUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.TicketConfigUncheckedUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  venueLabel: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  infoFields: z.union([ z.lazy(() => TicketConfigUpdateinfoFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
  venueFields: z.union([ z.lazy(() => TicketConfigUpdatevenueFieldsInputSchema), InputJsonValueSchema.array() ]).optional(),
});

export const VenueAssignUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUpsertWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutEventInputSchema) ]),
});

export const VenueAssignUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUpdateWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VenueAssignUpdateWithoutEventInputSchema), z.lazy(() => VenueAssignUncheckedUpdateWithoutEventInputSchema) ]),
});

export const VenueAssignUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUpdateManyWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueAssignScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VenueAssignUpdateManyMutationInputSchema), z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventInputSchema) ]),
});

export const VenueNodeUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUpsertWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutEventInputSchema) ]),
});

export const VenueNodeUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VenueNodeUpdateWithoutEventInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutEventInputSchema) ]),
});

export const VenueNodeUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUpdateManyWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueNodeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VenueNodeUpdateManyMutationInputSchema), z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventInputSchema) ]),
});

export const VenueNodeScalarWhereInputSchema: z.ZodType<Prisma.VenueNodeScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueNodeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueNodeScalarWhereInputSchema), z.lazy(() => VenueNodeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  typeId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  capacity: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const VenueTypeUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUpsertWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueTypeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VenueTypeUpdateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutEventInputSchema) ]),
});

export const VenueTypeUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUpdateWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueTypeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VenueTypeUpdateWithoutEventInputSchema), z.lazy(() => VenueTypeUncheckedUpdateWithoutEventInputSchema) ]),
});

export const VenueTypeUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUpdateManyWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => VenueTypeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VenueTypeUpdateManyMutationInputSchema), z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventInputSchema) ]),
});

export const VenueTypeScalarWhereInputSchema: z.ZodType<Prisma.VenueTypeScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => VenueTypeScalarWhereInputSchema), z.lazy(() => VenueTypeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VenueTypeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VenueTypeScalarWhereInputSchema), z.lazy(() => VenueTypeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isUnit: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  subUnitLabel: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const ResultColumnUpsertWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUpsertWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResultColumnWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResultColumnUpdateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedUpdateWithoutEventInputSchema) ]),
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutEventInputSchema) ]),
});

export const ResultColumnUpdateWithWhereUniqueWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUpdateWithWhereUniqueWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResultColumnWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResultColumnUpdateWithoutEventInputSchema), z.lazy(() => ResultColumnUncheckedUpdateWithoutEventInputSchema) ]),
});

export const ResultColumnUpdateManyWithWhereWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUpdateManyWithWhereWithoutEventInput> = z.strictObject({
  where: z.lazy(() => ResultColumnScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResultColumnUpdateManyMutationInputSchema), z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventInputSchema) ]),
});

export const ResultColumnScalarWhereInputSchema: z.ZodType<Prisma.ResultColumnScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResultColumnScalarWhereInputSchema), z.lazy(() => ResultColumnScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultColumnScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultColumnScalarWhereInputSchema), z.lazy(() => ResultColumnScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  label: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  eventId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fileMap: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const EventCreateWithoutOrganizerInputSchema: z.ZodType<Prisma.EventCreateWithoutOrganizerInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutOrganizerInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutOrganizerInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutOrganizerInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutOrganizerInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutOrganizerInputSchema), z.lazy(() => EventUncheckedCreateWithoutOrganizerInputSchema) ]),
});

export const UserCreateWithoutOrganizerInputSchema: z.ZodType<Prisma.UserCreateWithoutOrganizerInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  res: z.lazy(() => ResCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutOrganizerInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrganizerInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutOrganizerInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrganizerInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizerInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrganizerInputSchema) ]),
});

export const EventUpsertWithoutOrganizerInputSchema: z.ZodType<Prisma.EventUpsertWithoutOrganizerInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutOrganizerInputSchema), z.lazy(() => EventUncheckedUpdateWithoutOrganizerInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutOrganizerInputSchema), z.lazy(() => EventUncheckedCreateWithoutOrganizerInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutOrganizerInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutOrganizerInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutOrganizerInputSchema), z.lazy(() => EventUncheckedUpdateWithoutOrganizerInputSchema) ]),
});

export const EventUpdateWithoutOrganizerInputSchema: z.ZodType<Prisma.EventUpdateWithoutOrganizerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutOrganizerInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutOrganizerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const UserUpsertWithoutOrganizerInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrganizerInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrganizerInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOrganizerInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrganizerInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrganizerInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutOrganizerInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrganizerInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrganizerInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOrganizerInputSchema) ]),
});

export const UserUpdateWithoutOrganizerInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrganizerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  res: z.lazy(() => ResUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutOrganizerInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrganizerInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const EventCreateWithoutFormInputSchema: z.ZodType<Prisma.EventCreateWithoutFormInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutFormInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutFormInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutFormInputSchema), z.lazy(() => EventUncheckedCreateWithoutFormInputSchema) ]),
});

export const FormFieldCreateWithoutFormInputSchema: z.ZodType<Prisma.FormFieldCreateWithoutFormInput> = z.strictObject({
  id: z.uuid().optional(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
  resFields: z.lazy(() => ResFieldCreateNestedManyWithoutFormFieldInputSchema).optional(),
});

export const FormFieldUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUncheckedCreateWithoutFormInput> = z.strictObject({
  id: z.uuid().optional(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
  resFields: z.lazy(() => ResFieldUncheckedCreateNestedManyWithoutFormFieldInputSchema).optional(),
});

export const FormFieldCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.FormFieldCreateOrConnectWithoutFormInput> = z.strictObject({
  where: z.lazy(() => FormFieldWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormFieldCreateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema) ]),
});

export const FormFieldCreateManyFormInputEnvelopeSchema: z.ZodType<Prisma.FormFieldCreateManyFormInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => FormFieldCreateManyFormInputSchema), z.lazy(() => FormFieldCreateManyFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ResCreateWithoutFormInputSchema: z.ZodType<Prisma.ResCreateWithoutFormInput> = z.strictObject({
  id: z.uuid().optional(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutResInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutResInputSchema),
  resFields: z.lazy(() => ResFieldCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResUncheckedCreateWithoutFormInputSchema: z.ZodType<Prisma.ResUncheckedCreateWithoutFormInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  resFields: z.lazy(() => ResFieldUncheckedCreateNestedManyWithoutFormResInputSchema).optional(),
});

export const ResCreateOrConnectWithoutFormInputSchema: z.ZodType<Prisma.ResCreateOrConnectWithoutFormInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResCreateWithoutFormInputSchema), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema) ]),
});

export const ResCreateManyFormInputEnvelopeSchema: z.ZodType<Prisma.ResCreateManyFormInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResCreateManyFormInputSchema), z.lazy(() => ResCreateManyFormInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const EventUpsertWithoutFormInputSchema: z.ZodType<Prisma.EventUpsertWithoutFormInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutFormInputSchema), z.lazy(() => EventUncheckedUpdateWithoutFormInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutFormInputSchema), z.lazy(() => EventUncheckedCreateWithoutFormInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutFormInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutFormInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutFormInputSchema), z.lazy(() => EventUncheckedUpdateWithoutFormInputSchema) ]),
});

export const EventUpdateWithoutFormInputSchema: z.ZodType<Prisma.EventUpdateWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const FormFieldUpsertWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUpsertWithWhereUniqueWithoutFormInput> = z.strictObject({
  where: z.lazy(() => FormFieldWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FormFieldUpdateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedUpdateWithoutFormInputSchema) ]),
  create: z.union([ z.lazy(() => FormFieldCreateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutFormInputSchema) ]),
});

export const FormFieldUpdateWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUpdateWithWhereUniqueWithoutFormInput> = z.strictObject({
  where: z.lazy(() => FormFieldWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FormFieldUpdateWithoutFormInputSchema), z.lazy(() => FormFieldUncheckedUpdateWithoutFormInputSchema) ]),
});

export const FormFieldUpdateManyWithWhereWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUpdateManyWithWhereWithoutFormInput> = z.strictObject({
  where: z.lazy(() => FormFieldScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FormFieldUpdateManyMutationInputSchema), z.lazy(() => FormFieldUncheckedUpdateManyWithoutFormInputSchema) ]),
});

export const FormFieldScalarWhereInputSchema: z.ZodType<Prisma.FormFieldScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => FormFieldScalarWhereInputSchema), z.lazy(() => FormFieldScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FormFieldScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FormFieldScalarWhereInputSchema), z.lazy(() => FormFieldScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  formId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fieldOrder: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  choices: z.lazy(() => StringNullableListFilterSchema).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  header: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  placeholder: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  required: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const ResUpsertWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.ResUpsertWithWhereUniqueWithoutFormInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResUpdateWithoutFormInputSchema), z.lazy(() => ResUncheckedUpdateWithoutFormInputSchema) ]),
  create: z.union([ z.lazy(() => ResCreateWithoutFormInputSchema), z.lazy(() => ResUncheckedCreateWithoutFormInputSchema) ]),
});

export const ResUpdateWithWhereUniqueWithoutFormInputSchema: z.ZodType<Prisma.ResUpdateWithWhereUniqueWithoutFormInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResUpdateWithoutFormInputSchema), z.lazy(() => ResUncheckedUpdateWithoutFormInputSchema) ]),
});

export const ResUpdateManyWithWhereWithoutFormInputSchema: z.ZodType<Prisma.ResUpdateManyWithWhereWithoutFormInput> = z.strictObject({
  where: z.lazy(() => ResScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResUpdateManyMutationInputSchema), z.lazy(() => ResUncheckedUpdateManyWithoutFormInputSchema) ]),
});

export const FormCreateWithoutFieldsInputSchema: z.ZodType<Prisma.FormCreateWithoutFieldsInput> = z.strictObject({
  id: z.uuid().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutFormInputSchema),
  res: z.lazy(() => ResCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormUncheckedCreateWithoutFieldsInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutFieldsInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormCreateOrConnectWithoutFieldsInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutFieldsInput> = z.strictObject({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutFieldsInputSchema), z.lazy(() => FormUncheckedCreateWithoutFieldsInputSchema) ]),
});

export const ResFieldCreateWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldCreateWithoutFormFieldInput> = z.strictObject({
  id: z.uuid().optional(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
  formRes: z.lazy(() => ResCreateNestedOneWithoutResFieldsInputSchema),
});

export const ResFieldUncheckedCreateWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUncheckedCreateWithoutFormFieldInput> = z.strictObject({
  id: z.uuid().optional(),
  resId: z.string(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
});

export const ResFieldCreateOrConnectWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldCreateOrConnectWithoutFormFieldInput> = z.strictObject({
  where: z.lazy(() => ResFieldWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema) ]),
});

export const ResFieldCreateManyFormFieldInputEnvelopeSchema: z.ZodType<Prisma.ResFieldCreateManyFormFieldInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResFieldCreateManyFormFieldInputSchema), z.lazy(() => ResFieldCreateManyFormFieldInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const FormUpsertWithoutFieldsInputSchema: z.ZodType<Prisma.FormUpsertWithoutFieldsInput> = z.strictObject({
  update: z.union([ z.lazy(() => FormUpdateWithoutFieldsInputSchema), z.lazy(() => FormUncheckedUpdateWithoutFieldsInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutFieldsInputSchema), z.lazy(() => FormUncheckedCreateWithoutFieldsInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional(),
});

export const FormUpdateToOneWithWhereWithoutFieldsInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutFieldsInput> = z.strictObject({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutFieldsInputSchema), z.lazy(() => FormUncheckedUpdateWithoutFieldsInputSchema) ]),
});

export const FormUpdateWithoutFieldsInputSchema: z.ZodType<Prisma.FormUpdateWithoutFieldsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutFormNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const FormUncheckedUpdateWithoutFieldsInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutFieldsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const ResFieldUpsertWithWhereUniqueWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUpsertWithWhereUniqueWithoutFormFieldInput> = z.strictObject({
  where: z.lazy(() => ResFieldWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResFieldUpdateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedUpdateWithoutFormFieldInputSchema) ]),
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormFieldInputSchema) ]),
});

export const ResFieldUpdateWithWhereUniqueWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUpdateWithWhereUniqueWithoutFormFieldInput> = z.strictObject({
  where: z.lazy(() => ResFieldWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResFieldUpdateWithoutFormFieldInputSchema), z.lazy(() => ResFieldUncheckedUpdateWithoutFormFieldInputSchema) ]),
});

export const ResFieldUpdateManyWithWhereWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUpdateManyWithWhereWithoutFormFieldInput> = z.strictObject({
  where: z.lazy(() => ResFieldScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResFieldUpdateManyMutationInputSchema), z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormFieldInputSchema) ]),
});

export const ResFieldScalarWhereInputSchema: z.ZodType<Prisma.ResFieldScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ResFieldScalarWhereInputSchema), z.lazy(() => ResFieldScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResFieldScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResFieldScalarWhereInputSchema), z.lazy(() => ResFieldScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  formFieldId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  resId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  textField: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  choiceField: z.lazy(() => IntNullableListFilterSchema).optional(),
  fileField: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  dateField: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  selectField: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const EventCreateWithoutResInputSchema: z.ZodType<Prisma.EventCreateWithoutResInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutResInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutResInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutResInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutResInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutResInputSchema), z.lazy(() => EventUncheckedCreateWithoutResInputSchema) ]),
});

export const FormCreateWithoutResInputSchema: z.ZodType<Prisma.FormCreateWithoutResInput> = z.strictObject({
  id: z.uuid().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutFormInputSchema),
  fields: z.lazy(() => FormFieldCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormUncheckedCreateWithoutResInputSchema: z.ZodType<Prisma.FormUncheckedCreateWithoutResInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  fields: z.lazy(() => FormFieldUncheckedCreateNestedManyWithoutFormInputSchema).optional(),
});

export const FormCreateOrConnectWithoutResInputSchema: z.ZodType<Prisma.FormCreateOrConnectWithoutResInput> = z.strictObject({
  where: z.lazy(() => FormWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormCreateWithoutResInputSchema), z.lazy(() => FormUncheckedCreateWithoutResInputSchema) ]),
});

export const UserCreateWithoutResInputSchema: z.ZodType<Prisma.UserCreateWithoutResInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutResInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutResInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutResInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutResInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutResInputSchema), z.lazy(() => UserUncheckedCreateWithoutResInputSchema) ]),
});

export const ResFieldCreateWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldCreateWithoutFormResInput> = z.strictObject({
  id: z.uuid().optional(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
  formField: z.lazy(() => FormFieldCreateNestedOneWithoutResFieldsInputSchema),
});

export const ResFieldUncheckedCreateWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUncheckedCreateWithoutFormResInput> = z.strictObject({
  id: z.uuid().optional(),
  formFieldId: z.string(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
});

export const ResFieldCreateOrConnectWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldCreateOrConnectWithoutFormResInput> = z.strictObject({
  where: z.lazy(() => ResFieldWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema) ]),
});

export const ResFieldCreateManyFormResInputEnvelopeSchema: z.ZodType<Prisma.ResFieldCreateManyFormResInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResFieldCreateManyFormResInputSchema), z.lazy(() => ResFieldCreateManyFormResInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const EventUpsertWithoutResInputSchema: z.ZodType<Prisma.EventUpsertWithoutResInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutResInputSchema), z.lazy(() => EventUncheckedUpdateWithoutResInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutResInputSchema), z.lazy(() => EventUncheckedCreateWithoutResInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutResInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutResInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutResInputSchema), z.lazy(() => EventUncheckedUpdateWithoutResInputSchema) ]),
});

export const EventUpdateWithoutResInputSchema: z.ZodType<Prisma.EventUpdateWithoutResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutResInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const FormUpsertWithoutResInputSchema: z.ZodType<Prisma.FormUpsertWithoutResInput> = z.strictObject({
  update: z.union([ z.lazy(() => FormUpdateWithoutResInputSchema), z.lazy(() => FormUncheckedUpdateWithoutResInputSchema) ]),
  create: z.union([ z.lazy(() => FormCreateWithoutResInputSchema), z.lazy(() => FormUncheckedCreateWithoutResInputSchema) ]),
  where: z.lazy(() => FormWhereInputSchema).optional(),
});

export const FormUpdateToOneWithWhereWithoutResInputSchema: z.ZodType<Prisma.FormUpdateToOneWithWhereWithoutResInput> = z.strictObject({
  where: z.lazy(() => FormWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormUpdateWithoutResInputSchema), z.lazy(() => FormUncheckedUpdateWithoutResInputSchema) ]),
});

export const FormUpdateWithoutResInputSchema: z.ZodType<Prisma.FormUpdateWithoutResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutFormNestedInputSchema).optional(),
  fields: z.lazy(() => FormFieldUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const FormUncheckedUpdateWithoutResInputSchema: z.ZodType<Prisma.FormUncheckedUpdateWithoutResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fields: z.lazy(() => FormFieldUncheckedUpdateManyWithoutFormNestedInputSchema).optional(),
});

export const UserUpsertWithoutResInputSchema: z.ZodType<Prisma.UserUpsertWithoutResInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutResInputSchema), z.lazy(() => UserUncheckedUpdateWithoutResInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutResInputSchema), z.lazy(() => UserUncheckedCreateWithoutResInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutResInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutResInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutResInputSchema), z.lazy(() => UserUncheckedUpdateWithoutResInputSchema) ]),
});

export const UserUpdateWithoutResInputSchema: z.ZodType<Prisma.UserUpdateWithoutResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutResInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const ResFieldUpsertWithWhereUniqueWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUpsertWithWhereUniqueWithoutFormResInput> = z.strictObject({
  where: z.lazy(() => ResFieldWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResFieldUpdateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedUpdateWithoutFormResInputSchema) ]),
  create: z.union([ z.lazy(() => ResFieldCreateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedCreateWithoutFormResInputSchema) ]),
});

export const ResFieldUpdateWithWhereUniqueWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUpdateWithWhereUniqueWithoutFormResInput> = z.strictObject({
  where: z.lazy(() => ResFieldWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResFieldUpdateWithoutFormResInputSchema), z.lazy(() => ResFieldUncheckedUpdateWithoutFormResInputSchema) ]),
});

export const ResFieldUpdateManyWithWhereWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUpdateManyWithWhereWithoutFormResInput> = z.strictObject({
  where: z.lazy(() => ResFieldScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResFieldUpdateManyMutationInputSchema), z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormResInputSchema) ]),
});

export const FormFieldCreateWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldCreateWithoutResFieldsInput> = z.strictObject({
  id: z.uuid().optional(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
  form: z.lazy(() => FormCreateNestedOneWithoutFieldsInputSchema),
});

export const FormFieldUncheckedCreateWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldUncheckedCreateWithoutResFieldsInput> = z.strictObject({
  id: z.uuid().optional(),
  formId: z.string(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
});

export const FormFieldCreateOrConnectWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldCreateOrConnectWithoutResFieldsInput> = z.strictObject({
  where: z.lazy(() => FormFieldWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FormFieldCreateWithoutResFieldsInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutResFieldsInputSchema) ]),
});

export const ResCreateWithoutResFieldsInputSchema: z.ZodType<Prisma.ResCreateWithoutResFieldsInput> = z.strictObject({
  id: z.uuid().optional(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutResInputSchema),
  form: z.lazy(() => FormCreateNestedOneWithoutResInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutResInputSchema),
});

export const ResUncheckedCreateWithoutResFieldsInputSchema: z.ZodType<Prisma.ResUncheckedCreateWithoutResFieldsInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  formId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
});

export const ResCreateOrConnectWithoutResFieldsInputSchema: z.ZodType<Prisma.ResCreateOrConnectWithoutResFieldsInput> = z.strictObject({
  where: z.lazy(() => ResWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResCreateWithoutResFieldsInputSchema), z.lazy(() => ResUncheckedCreateWithoutResFieldsInputSchema) ]),
});

export const FormFieldUpsertWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldUpsertWithoutResFieldsInput> = z.strictObject({
  update: z.union([ z.lazy(() => FormFieldUpdateWithoutResFieldsInputSchema), z.lazy(() => FormFieldUncheckedUpdateWithoutResFieldsInputSchema) ]),
  create: z.union([ z.lazy(() => FormFieldCreateWithoutResFieldsInputSchema), z.lazy(() => FormFieldUncheckedCreateWithoutResFieldsInputSchema) ]),
  where: z.lazy(() => FormFieldWhereInputSchema).optional(),
});

export const FormFieldUpdateToOneWithWhereWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldUpdateToOneWithWhereWithoutResFieldsInput> = z.strictObject({
  where: z.lazy(() => FormFieldWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => FormFieldUpdateWithoutResFieldsInputSchema), z.lazy(() => FormFieldUncheckedUpdateWithoutResFieldsInputSchema) ]),
});

export const FormFieldUpdateWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldUpdateWithoutResFieldsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutFieldsNestedInputSchema).optional(),
});

export const FormFieldUncheckedUpdateWithoutResFieldsInputSchema: z.ZodType<Prisma.FormFieldUncheckedUpdateWithoutResFieldsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResUpsertWithoutResFieldsInputSchema: z.ZodType<Prisma.ResUpsertWithoutResFieldsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ResUpdateWithoutResFieldsInputSchema), z.lazy(() => ResUncheckedUpdateWithoutResFieldsInputSchema) ]),
  create: z.union([ z.lazy(() => ResCreateWithoutResFieldsInputSchema), z.lazy(() => ResUncheckedCreateWithoutResFieldsInputSchema) ]),
  where: z.lazy(() => ResWhereInputSchema).optional(),
});

export const ResUpdateToOneWithWhereWithoutResFieldsInputSchema: z.ZodType<Prisma.ResUpdateToOneWithWhereWithoutResFieldsInput> = z.strictObject({
  where: z.lazy(() => ResWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResUpdateWithoutResFieldsInputSchema), z.lazy(() => ResUncheckedUpdateWithoutResFieldsInputSchema) ]),
});

export const ResUpdateWithoutResFieldsInputSchema: z.ZodType<Prisma.ResUpdateWithoutResFieldsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateWithoutResFieldsInputSchema: z.ZodType<Prisma.ResUncheckedUpdateWithoutResFieldsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const EventCreateWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventCreateWithoutTicketConfigInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutTicketConfigInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutTicketConfigInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutTicketConfigInputSchema), z.lazy(() => EventUncheckedCreateWithoutTicketConfigInputSchema) ]),
});

export const EventUpsertWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventUpsertWithoutTicketConfigInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutTicketConfigInputSchema), z.lazy(() => EventUncheckedUpdateWithoutTicketConfigInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutTicketConfigInputSchema), z.lazy(() => EventUncheckedCreateWithoutTicketConfigInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutTicketConfigInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutTicketConfigInputSchema), z.lazy(() => EventUncheckedUpdateWithoutTicketConfigInputSchema) ]),
});

export const EventUpdateWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventUpdateWithoutTicketConfigInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutTicketConfigInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutTicketConfigInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const VenueNodeCreateWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeCreateWithoutTypeInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueNodesInputSchema),
  parent: z.lazy(() => VenueNodeCreateNestedOneWithoutChildrenInputSchema).optional(),
  children: z.lazy(() => VenueNodeCreateNestedManyWithoutParentInputSchema).optional(),
});

export const VenueNodeUncheckedCreateWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateWithoutTypeInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  eventId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
});

export const VenueNodeCreateOrConnectWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeCreateOrConnectWithoutTypeInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema) ]),
});

export const VenueNodeCreateManyTypeInputEnvelopeSchema: z.ZodType<Prisma.VenueNodeCreateManyTypeInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => VenueNodeCreateManyTypeInputSchema), z.lazy(() => VenueNodeCreateManyTypeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const EventCreateWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventCreateWithoutVenueTypesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutVenueTypesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutVenueTypesInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutVenueTypesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueTypesInputSchema) ]),
});

export const VenueNodeUpsertWithWhereUniqueWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUpsertWithWhereUniqueWithoutTypeInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutTypeInputSchema) ]),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutTypeInputSchema) ]),
});

export const VenueNodeUpdateWithWhereUniqueWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithWhereUniqueWithoutTypeInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VenueNodeUpdateWithoutTypeInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutTypeInputSchema) ]),
});

export const VenueNodeUpdateManyWithWhereWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUpdateManyWithWhereWithoutTypeInput> = z.strictObject({
  where: z.lazy(() => VenueNodeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VenueNodeUpdateManyMutationInputSchema), z.lazy(() => VenueNodeUncheckedUpdateManyWithoutTypeInputSchema) ]),
});

export const EventUpsertWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventUpsertWithoutVenueTypesInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutVenueTypesInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueTypesInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutVenueTypesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueTypesInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutVenueTypesInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutVenueTypesInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueTypesInputSchema) ]),
});

export const EventUpdateWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventUpdateWithoutVenueTypesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutVenueTypesInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutVenueTypesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const VenueAssignCreateWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignCreateWithoutVenueNodeInput> = z.strictObject({
  id: z.uuid().optional(),
  subUnitIndex: z.number().int().optional().nullable(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueAssignInputSchema),
  user: z.lazy(() => UserCreateNestedOneWithoutVenueAssignInputSchema),
});

export const VenueAssignUncheckedCreateWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUncheckedCreateWithoutVenueNodeInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  eventId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
});

export const VenueAssignCreateOrConnectWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignCreateOrConnectWithoutVenueNodeInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema) ]),
});

export const VenueAssignCreateManyVenueNodeInputEnvelopeSchema: z.ZodType<Prisma.VenueAssignCreateManyVenueNodeInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => VenueAssignCreateManyVenueNodeInputSchema), z.lazy(() => VenueAssignCreateManyVenueNodeInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const EventCreateWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventCreateWithoutVenueNodesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutVenueNodesInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutVenueNodesInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutVenueNodesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueNodesInputSchema) ]),
});

export const VenueNodeCreateWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeCreateWithoutChildrenInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueNodesInputSchema),
  parent: z.lazy(() => VenueNodeCreateNestedOneWithoutChildrenInputSchema).optional(),
  type: z.lazy(() => VenueTypeCreateNestedOneWithoutVenuesInputSchema),
});

export const VenueNodeUncheckedCreateWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateWithoutChildrenInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  eventId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutVenueNodeInputSchema).optional(),
});

export const VenueNodeCreateOrConnectWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeCreateOrConnectWithoutChildrenInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutChildrenInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutChildrenInputSchema) ]),
});

export const VenueNodeCreateWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeCreateWithoutParentInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueNodesInputSchema),
  children: z.lazy(() => VenueNodeCreateNestedManyWithoutParentInputSchema).optional(),
  type: z.lazy(() => VenueTypeCreateNestedOneWithoutVenuesInputSchema),
});

export const VenueNodeUncheckedCreateWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateWithoutParentInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  eventId: z.string(),
  capacity: z.number().int().optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutVenueNodeInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
});

export const VenueNodeCreateOrConnectWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeCreateOrConnectWithoutParentInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema) ]),
});

export const VenueNodeCreateManyParentInputEnvelopeSchema: z.ZodType<Prisma.VenueNodeCreateManyParentInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => VenueNodeCreateManyParentInputSchema), z.lazy(() => VenueNodeCreateManyParentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const VenueTypeCreateWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeCreateWithoutVenuesInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueTypesInputSchema),
});

export const VenueTypeUncheckedCreateWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeUncheckedCreateWithoutVenuesInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
  eventId: z.string(),
});

export const VenueTypeCreateOrConnectWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeCreateOrConnectWithoutVenuesInput> = z.strictObject({
  where: z.lazy(() => VenueTypeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutVenuesInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutVenuesInputSchema) ]),
});

export const VenueAssignUpsertWithWhereUniqueWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUpsertWithWhereUniqueWithoutVenueNodeInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VenueAssignUpdateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedUpdateWithoutVenueNodeInputSchema) ]),
  create: z.union([ z.lazy(() => VenueAssignCreateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedCreateWithoutVenueNodeInputSchema) ]),
});

export const VenueAssignUpdateWithWhereUniqueWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUpdateWithWhereUniqueWithoutVenueNodeInput> = z.strictObject({
  where: z.lazy(() => VenueAssignWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VenueAssignUpdateWithoutVenueNodeInputSchema), z.lazy(() => VenueAssignUncheckedUpdateWithoutVenueNodeInputSchema) ]),
});

export const VenueAssignUpdateManyWithWhereWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUpdateManyWithWhereWithoutVenueNodeInput> = z.strictObject({
  where: z.lazy(() => VenueAssignScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VenueAssignUpdateManyMutationInputSchema), z.lazy(() => VenueAssignUncheckedUpdateManyWithoutVenueNodeInputSchema) ]),
});

export const EventUpsertWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventUpsertWithoutVenueNodesInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutVenueNodesInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueNodesInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutVenueNodesInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueNodesInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutVenueNodesInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutVenueNodesInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueNodesInputSchema) ]),
});

export const EventUpdateWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventUpdateWithoutVenueNodesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutVenueNodesInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutVenueNodesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const VenueNodeUpsertWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeUpsertWithoutChildrenInput> = z.strictObject({
  update: z.union([ z.lazy(() => VenueNodeUpdateWithoutChildrenInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutChildrenInputSchema) ]),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutChildrenInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutChildrenInputSchema) ]),
  where: z.lazy(() => VenueNodeWhereInputSchema).optional(),
});

export const VenueNodeUpdateToOneWithWhereWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeUpdateToOneWithWhereWithoutChildrenInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => VenueNodeUpdateWithoutChildrenInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutChildrenInputSchema) ]),
});

export const VenueNodeUpdateWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithoutChildrenInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueNodesNestedInputSchema).optional(),
  parent: z.lazy(() => VenueNodeUpdateOneWithoutChildrenNestedInputSchema).optional(),
  type: z.lazy(() => VenueTypeUpdateOneRequiredWithoutVenuesNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateWithoutChildrenInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateWithoutChildrenInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
});

export const VenueNodeUpsertWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUpsertWithWhereUniqueWithoutParentInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VenueNodeUpdateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutParentInputSchema) ]),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutParentInputSchema) ]),
});

export const VenueNodeUpdateWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithWhereUniqueWithoutParentInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VenueNodeUpdateWithoutParentInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutParentInputSchema) ]),
});

export const VenueNodeUpdateManyWithWhereWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUpdateManyWithWhereWithoutParentInput> = z.strictObject({
  where: z.lazy(() => VenueNodeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VenueNodeUpdateManyMutationInputSchema), z.lazy(() => VenueNodeUncheckedUpdateManyWithoutParentInputSchema) ]),
});

export const VenueTypeUpsertWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeUpsertWithoutVenuesInput> = z.strictObject({
  update: z.union([ z.lazy(() => VenueTypeUpdateWithoutVenuesInputSchema), z.lazy(() => VenueTypeUncheckedUpdateWithoutVenuesInputSchema) ]),
  create: z.union([ z.lazy(() => VenueTypeCreateWithoutVenuesInputSchema), z.lazy(() => VenueTypeUncheckedCreateWithoutVenuesInputSchema) ]),
  where: z.lazy(() => VenueTypeWhereInputSchema).optional(),
});

export const VenueTypeUpdateToOneWithWhereWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeUpdateToOneWithWhereWithoutVenuesInput> = z.strictObject({
  where: z.lazy(() => VenueTypeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => VenueTypeUpdateWithoutVenuesInputSchema), z.lazy(() => VenueTypeUncheckedUpdateWithoutVenuesInputSchema) ]),
});

export const VenueTypeUpdateWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeUpdateWithoutVenuesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueTypesNestedInputSchema).optional(),
});

export const VenueTypeUncheckedUpdateWithoutVenuesInputSchema: z.ZodType<Prisma.VenueTypeUncheckedUpdateWithoutVenuesInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const EventCreateWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventCreateWithoutVenueAssignInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutVenueAssignInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutVenueAssignInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutVenueAssignInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueAssignInputSchema) ]),
});

export const UserCreateWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserCreateWithoutVenueAssignInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutUserInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutVenueAssignInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutVenueAssignInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutVenueAssignInputSchema), z.lazy(() => UserUncheckedCreateWithoutVenueAssignInputSchema) ]),
});

export const VenueNodeCreateWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeCreateWithoutAssignmentsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  capacity: z.number().int().optional().nullable(),
  event: z.lazy(() => EventCreateNestedOneWithoutVenueNodesInputSchema),
  parent: z.lazy(() => VenueNodeCreateNestedOneWithoutChildrenInputSchema).optional(),
  children: z.lazy(() => VenueNodeCreateNestedManyWithoutParentInputSchema).optional(),
  type: z.lazy(() => VenueTypeCreateNestedOneWithoutVenuesInputSchema),
});

export const VenueNodeUncheckedCreateWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeUncheckedCreateWithoutAssignmentsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  eventId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
  children: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
});

export const VenueNodeCreateOrConnectWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeCreateOrConnectWithoutAssignmentsInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutAssignmentsInputSchema) ]),
});

export const EventUpsertWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventUpsertWithoutVenueAssignInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutVenueAssignInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueAssignInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutVenueAssignInputSchema), z.lazy(() => EventUncheckedCreateWithoutVenueAssignInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutVenueAssignInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutVenueAssignInputSchema), z.lazy(() => EventUncheckedUpdateWithoutVenueAssignInputSchema) ]),
});

export const EventUpdateWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventUpdateWithoutVenueAssignInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutVenueAssignInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutVenueAssignInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  resultColumns: z.lazy(() => ResultColumnUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const UserUpsertWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserUpsertWithoutVenueAssignInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutVenueAssignInputSchema), z.lazy(() => UserUncheckedUpdateWithoutVenueAssignInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutVenueAssignInputSchema), z.lazy(() => UserUncheckedCreateWithoutVenueAssignInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutVenueAssignInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutVenueAssignInputSchema), z.lazy(() => UserUncheckedUpdateWithoutVenueAssignInputSchema) ]),
});

export const UserUpdateWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserUpdateWithoutVenueAssignInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutUserNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutVenueAssignInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutVenueAssignInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  resultData: z.lazy(() => ResultDataUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const VenueNodeUpsertWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeUpsertWithoutAssignmentsInput> = z.strictObject({
  update: z.union([ z.lazy(() => VenueNodeUpdateWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutAssignmentsInputSchema) ]),
  create: z.union([ z.lazy(() => VenueNodeCreateWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUncheckedCreateWithoutAssignmentsInputSchema) ]),
  where: z.lazy(() => VenueNodeWhereInputSchema).optional(),
});

export const VenueNodeUpdateToOneWithWhereWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeUpdateToOneWithWhereWithoutAssignmentsInput> = z.strictObject({
  where: z.lazy(() => VenueNodeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => VenueNodeUpdateWithoutAssignmentsInputSchema), z.lazy(() => VenueNodeUncheckedUpdateWithoutAssignmentsInputSchema) ]),
});

export const VenueNodeUpdateWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithoutAssignmentsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueNodesNestedInputSchema).optional(),
  parent: z.lazy(() => VenueNodeUpdateOneWithoutChildrenNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUpdateManyWithoutParentNestedInputSchema).optional(),
  type: z.lazy(() => VenueTypeUpdateOneRequiredWithoutVenuesNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateWithoutAssignmentsInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateWithoutAssignmentsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  children: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
});

export const EventCreateWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventCreateWithoutResultColumnsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventUncheckedCreateWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventUncheckedCreateWithoutResultColumnsInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  regist: z.coerce.date(),
  profileURL: z.string().optional().nullable(),
  price: z.number().int(),
  stripeAccountId: z.string().optional().nullable(),
  resultUrl: z.string().optional().nullable(),
  form: z.lazy(() => FormUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedCreateNestedOneWithoutEventInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedCreateNestedManyWithoutEventInputSchema).optional(),
});

export const EventCreateOrConnectWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventCreateOrConnectWithoutResultColumnsInput> = z.strictObject({
  where: z.lazy(() => EventWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => EventCreateWithoutResultColumnsInputSchema), z.lazy(() => EventUncheckedCreateWithoutResultColumnsInputSchema) ]),
});

export const ResultDataCreateWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataCreateWithoutResultColumnInput> = z.strictObject({
  id: z.uuid().optional(),
  value: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutResultDataInputSchema),
});

export const ResultDataUncheckedCreateWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUncheckedCreateWithoutResultColumnInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  value: z.string(),
});

export const ResultDataCreateOrConnectWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataCreateOrConnectWithoutResultColumnInput> = z.strictObject({
  where: z.lazy(() => ResultDataWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema) ]),
});

export const ResultDataCreateManyResultColumnInputEnvelopeSchema: z.ZodType<Prisma.ResultDataCreateManyResultColumnInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ResultDataCreateManyResultColumnInputSchema), z.lazy(() => ResultDataCreateManyResultColumnInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const EventUpsertWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventUpsertWithoutResultColumnsInput> = z.strictObject({
  update: z.union([ z.lazy(() => EventUpdateWithoutResultColumnsInputSchema), z.lazy(() => EventUncheckedUpdateWithoutResultColumnsInputSchema) ]),
  create: z.union([ z.lazy(() => EventCreateWithoutResultColumnsInputSchema), z.lazy(() => EventUncheckedCreateWithoutResultColumnsInputSchema) ]),
  where: z.lazy(() => EventWhereInputSchema).optional(),
});

export const EventUpdateToOneWithWhereWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventUpdateToOneWithWhereWithoutResultColumnsInput> = z.strictObject({
  where: z.lazy(() => EventWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => EventUpdateWithoutResultColumnsInputSchema), z.lazy(() => EventUncheckedUpdateWithoutResultColumnsInputSchema) ]),
});

export const EventUpdateWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventUpdateWithoutResultColumnsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const EventUncheckedUpdateWithoutResultColumnsInputSchema: z.ZodType<Prisma.EventUncheckedUpdateWithoutResultColumnsInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  location: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  startDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  regist: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profileURL: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  price: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  stripeAccountId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  form: z.lazy(() => FormUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  ticketConfig: z.lazy(() => TicketConfigUncheckedUpdateOneWithoutEventNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueNodes: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
  venueTypes: z.lazy(() => VenueTypeUncheckedUpdateManyWithoutEventNestedInputSchema).optional(),
});

export const ResultDataUpsertWithWhereUniqueWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUpsertWithWhereUniqueWithoutResultColumnInput> = z.strictObject({
  where: z.lazy(() => ResultDataWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResultDataUpdateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedUpdateWithoutResultColumnInputSchema) ]),
  create: z.union([ z.lazy(() => ResultDataCreateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedCreateWithoutResultColumnInputSchema) ]),
});

export const ResultDataUpdateWithWhereUniqueWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUpdateWithWhereUniqueWithoutResultColumnInput> = z.strictObject({
  where: z.lazy(() => ResultDataWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResultDataUpdateWithoutResultColumnInputSchema), z.lazy(() => ResultDataUncheckedUpdateWithoutResultColumnInputSchema) ]),
});

export const ResultDataUpdateManyWithWhereWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUpdateManyWithWhereWithoutResultColumnInput> = z.strictObject({
  where: z.lazy(() => ResultDataScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResultDataUpdateManyMutationInputSchema), z.lazy(() => ResultDataUncheckedUpdateManyWithoutResultColumnInputSchema) ]),
});

export const ResultColumnCreateWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnCreateWithoutResultDataInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  fileMap: z.string().optional().nullable(),
  event: z.lazy(() => EventCreateNestedOneWithoutResultColumnsInputSchema),
});

export const ResultColumnUncheckedCreateWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnUncheckedCreateWithoutResultDataInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  eventId: z.string(),
  fileMap: z.string().optional().nullable(),
});

export const ResultColumnCreateOrConnectWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnCreateOrConnectWithoutResultDataInput> = z.strictObject({
  where: z.lazy(() => ResultColumnWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutResultDataInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutResultDataInputSchema) ]),
});

export const UserCreateWithoutResultDataInputSchema: z.ZodType<Prisma.UserCreateWithoutResultDataInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignCreateNestedManyWithoutUserInputSchema).optional(),
  res: z.lazy(() => ResCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutResultDataInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutResultDataInput> = z.strictObject({
  id: z.uuid().optional(),
  email: z.string(),
  updatedAt: z.coerce.date().optional(),
  role: z.lazy(() => RoleSchema).optional(),
  title: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  profileUrl: z.string().optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  res: z.lazy(() => ResUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutResultDataInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutResultDataInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutResultDataInputSchema), z.lazy(() => UserUncheckedCreateWithoutResultDataInputSchema) ]),
});

export const ResultColumnUpsertWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnUpsertWithoutResultDataInput> = z.strictObject({
  update: z.union([ z.lazy(() => ResultColumnUpdateWithoutResultDataInputSchema), z.lazy(() => ResultColumnUncheckedUpdateWithoutResultDataInputSchema) ]),
  create: z.union([ z.lazy(() => ResultColumnCreateWithoutResultDataInputSchema), z.lazy(() => ResultColumnUncheckedCreateWithoutResultDataInputSchema) ]),
  where: z.lazy(() => ResultColumnWhereInputSchema).optional(),
});

export const ResultColumnUpdateToOneWithWhereWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnUpdateToOneWithWhereWithoutResultDataInput> = z.strictObject({
  where: z.lazy(() => ResultColumnWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ResultColumnUpdateWithoutResultDataInputSchema), z.lazy(() => ResultColumnUncheckedUpdateWithoutResultDataInputSchema) ]),
});

export const ResultColumnUpdateWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnUpdateWithoutResultDataInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutResultColumnsNestedInputSchema).optional(),
});

export const ResultColumnUncheckedUpdateWithoutResultDataInputSchema: z.ZodType<Prisma.ResultColumnUncheckedUpdateWithoutResultDataInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserUpsertWithoutResultDataInputSchema: z.ZodType<Prisma.UserUpsertWithoutResultDataInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutResultDataInputSchema), z.lazy(() => UserUncheckedUpdateWithoutResultDataInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutResultDataInputSchema), z.lazy(() => UserUncheckedCreateWithoutResultDataInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutResultDataInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutResultDataInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutResultDataInputSchema), z.lazy(() => UserUncheckedUpdateWithoutResultDataInputSchema) ]),
});

export const UserUpdateWithoutResultDataInputSchema: z.ZodType<Prisma.UserUpdateWithoutResultDataInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUpdateManyWithoutUserNestedInputSchema).optional(),
  res: z.lazy(() => ResUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutResultDataInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutResultDataInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  profileUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  organizer: z.lazy(() => OrganizerAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  res: z.lazy(() => ResUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  venueAssign: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const OrganizerAssignCreateManyUserInputSchema: z.ZodType<Prisma.OrganizerAssignCreateManyUserInput> = z.strictObject({
  eventId: z.string(),
});

export const ResCreateManyUserInputSchema: z.ZodType<Prisma.ResCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  formId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
});

export const VenueAssignCreateManyUserInputSchema: z.ZodType<Prisma.VenueAssignCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
  venueNodeId: z.string(),
});

export const ResultDataCreateManyUserInputSchema: z.ZodType<Prisma.ResultDataCreateManyUserInput> = z.strictObject({
  id: z.uuid().optional(),
  resultColumnId: z.string(),
  value: z.string(),
});

export const OrganizerAssignUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateWithoutUserInput> = z.strictObject({
  event: z.lazy(() => EventUpdateOneRequiredWithoutOrganizerNestedInputSchema).optional(),
});

export const OrganizerAssignUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateWithoutUserInput> = z.strictObject({
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrganizerAssignUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResUpdateWithoutUserInputSchema: z.ZodType<Prisma.ResUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  resFields: z.lazy(() => ResFieldUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ResUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ResUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VenueAssignUpdateWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueAssignNestedInputSchema).optional(),
  venueNode: z.lazy(() => VenueNodeUpdateOneRequiredWithoutAssignmentsNestedInputSchema).optional(),
});

export const VenueAssignUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venueNodeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VenueAssignUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venueNodeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResultDataUpdateWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resultColumn: z.lazy(() => ResultColumnUpdateOneRequiredWithoutResultDataNestedInputSchema).optional(),
});

export const ResultDataUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resultColumnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResultDataUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resultColumnId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrganizerAssignCreateManyEventInputSchema: z.ZodType<Prisma.OrganizerAssignCreateManyEventInput> = z.strictObject({
  userId: z.string(),
});

export const ResCreateManyEventInputSchema: z.ZodType<Prisma.ResCreateManyEventInput> = z.strictObject({
  id: z.uuid().optional(),
  formId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
});

export const VenueAssignCreateManyEventInputSchema: z.ZodType<Prisma.VenueAssignCreateManyEventInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
  venueNodeId: z.string(),
});

export const VenueNodeCreateManyEventInputSchema: z.ZodType<Prisma.VenueNodeCreateManyEventInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
});

export const VenueTypeCreateManyEventInputSchema: z.ZodType<Prisma.VenueTypeCreateManyEventInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  isUnit: z.boolean().optional(),
  subUnitLabel: z.string().optional().nullable(),
});

export const ResultColumnCreateManyEventInputSchema: z.ZodType<Prisma.ResultColumnCreateManyEventInput> = z.strictObject({
  id: z.uuid().optional(),
  label: z.string(),
  order: z.number().int(),
  fileMap: z.string().optional().nullable(),
});

export const OrganizerAssignUpdateWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUpdateWithoutEventInput> = z.strictObject({
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrganizerNestedInputSchema).optional(),
});

export const OrganizerAssignUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateWithoutEventInput> = z.strictObject({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrganizerAssignUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.OrganizerAssignUncheckedUpdateManyWithoutEventInput> = z.strictObject({
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResUpdateWithoutEventInputSchema: z.ZodType<Prisma.ResUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  form: z.lazy(() => FormUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  resFields: z.lazy(() => ResFieldUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.ResUncheckedUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.ResUncheckedUpdateManyWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VenueAssignUpdateWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutVenueAssignNestedInputSchema).optional(),
  venueNode: z.lazy(() => VenueNodeUpdateOneRequiredWithoutAssignmentsNestedInputSchema).optional(),
});

export const VenueAssignUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venueNodeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VenueAssignUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateManyWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venueNodeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const VenueNodeUpdateWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  parent: z.lazy(() => VenueNodeUpdateOneWithoutChildrenNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUpdateManyWithoutParentNestedInputSchema).optional(),
  type: z.lazy(() => VenueTypeUpdateOneRequiredWithoutVenuesNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateManyWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueTypeUpdateWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venues: z.lazy(() => VenueNodeUpdateManyWithoutTypeNestedInputSchema).optional(),
});

export const VenueTypeUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUncheckedUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  venues: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutTypeNestedInputSchema).optional(),
});

export const VenueTypeUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.VenueTypeUncheckedUpdateManyWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isUnit: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitLabel: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResultColumnUpdateWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultData: z.lazy(() => ResultDataUpdateManyWithoutResultColumnNestedInputSchema).optional(),
});

export const ResultColumnUncheckedUpdateWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUncheckedUpdateWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  resultData: z.lazy(() => ResultDataUncheckedUpdateManyWithoutResultColumnNestedInputSchema).optional(),
});

export const ResultColumnUncheckedUpdateManyWithoutEventInputSchema: z.ZodType<Prisma.ResultColumnUncheckedUpdateManyWithoutEventInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  label: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  fileMap: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const FormFieldCreateManyFormInputSchema: z.ZodType<Prisma.FormFieldCreateManyFormInput> = z.strictObject({
  id: z.uuid().optional(),
  fieldOrder: z.number().int(),
  choices: z.union([ z.lazy(() => FormFieldCreatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.string().optional().nullable(),
  header: z.string(),
  placeholder: z.string().optional().nullable(),
  required: z.boolean().optional(),
  type: z.string(),
});

export const ResCreateManyFormInputSchema: z.ZodType<Prisma.ResCreateManyFormInput> = z.strictObject({
  id: z.uuid().optional(),
  eventId: z.string(),
  userId: z.string(),
  paymentIntent: z.string().optional().nullable(),
  paymentStatus: z.lazy(() => PaymentStatusSchema),
  paymentId: z.string().optional().nullable(),
  submittedAt: z.coerce.date().optional(),
});

export const FormFieldUpdateWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUpdateWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldUpdateManyWithoutFormFieldNestedInputSchema).optional(),
});

export const FormFieldUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUncheckedUpdateWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormFieldNestedInputSchema).optional(),
});

export const FormFieldUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.FormFieldUncheckedUpdateManyWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldOrder: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  choices: z.union([ z.lazy(() => FormFieldUpdatechoicesInputSchema), z.string().array() ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  header: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  placeholder: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  required: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResUpdateWithoutFormInputSchema: z.ZodType<Prisma.ResUpdateWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutResNestedInputSchema).optional(),
  resFields: z.lazy(() => ResFieldUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateWithoutFormInputSchema: z.ZodType<Prisma.ResUncheckedUpdateWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  resFields: z.lazy(() => ResFieldUncheckedUpdateManyWithoutFormResNestedInputSchema).optional(),
});

export const ResUncheckedUpdateManyWithoutFormInputSchema: z.ZodType<Prisma.ResUncheckedUpdateManyWithoutFormInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  paymentIntent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  paymentStatus: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  paymentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  submittedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResFieldCreateManyFormFieldInputSchema: z.ZodType<Prisma.ResFieldCreateManyFormFieldInput> = z.strictObject({
  id: z.uuid().optional(),
  resId: z.string(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
});

export const ResFieldUpdateWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUpdateWithoutFormFieldInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formRes: z.lazy(() => ResUpdateOneRequiredWithoutResFieldsNestedInputSchema).optional(),
});

export const ResFieldUncheckedUpdateWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateWithoutFormFieldInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResFieldUncheckedUpdateManyWithoutFormFieldInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateManyWithoutFormFieldInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  resId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResFieldCreateManyFormResInputSchema: z.ZodType<Prisma.ResFieldCreateManyFormResInput> = z.strictObject({
  id: z.uuid().optional(),
  formFieldId: z.string(),
  textField: z.string().optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldCreatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.string().optional().nullable(),
  dateField: z.coerce.date().optional().nullable(),
  selectField: z.number().int().optional().nullable(),
});

export const ResFieldUpdateWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUpdateWithoutFormResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  formField: z.lazy(() => FormFieldUpdateOneRequiredWithoutResFieldsNestedInputSchema).optional(),
});

export const ResFieldUncheckedUpdateWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateWithoutFormResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResFieldUncheckedUpdateManyWithoutFormResInputSchema: z.ZodType<Prisma.ResFieldUncheckedUpdateManyWithoutFormResInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  formFieldId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  textField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  choiceField: z.union([ z.lazy(() => ResFieldUpdatechoiceFieldInputSchema), z.number().int().array() ]).optional(),
  fileField: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  dateField: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  selectField: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueNodeCreateManyTypeInputSchema: z.ZodType<Prisma.VenueNodeCreateManyTypeInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  eventId: z.string(),
  parentId: z.string().optional().nullable(),
  capacity: z.number().int().optional().nullable(),
});

export const VenueNodeUpdateWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithoutTypeInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueNodesNestedInputSchema).optional(),
  parent: z.lazy(() => VenueNodeUpdateOneWithoutChildrenNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUpdateManyWithoutParentNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateWithoutTypeInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateManyWithoutTypeInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateManyWithoutTypeInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueAssignCreateManyVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignCreateManyVenueNodeInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  eventId: z.string(),
  subUnitIndex: z.number().int().optional().nullable(),
});

export const VenueNodeCreateManyParentInputSchema: z.ZodType<Prisma.VenueNodeCreateManyParentInput> = z.strictObject({
  id: z.uuid().optional(),
  name: z.string(),
  typeId: z.string(),
  eventId: z.string(),
  capacity: z.number().int().optional().nullable(),
});

export const VenueAssignUpdateWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUpdateWithoutVenueNodeInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueAssignNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutVenueAssignNestedInputSchema).optional(),
});

export const VenueAssignUncheckedUpdateWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateWithoutVenueNodeInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueAssignUncheckedUpdateManyWithoutVenueNodeInputSchema: z.ZodType<Prisma.VenueAssignUncheckedUpdateManyWithoutVenueNodeInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  subUnitIndex: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const VenueNodeUpdateWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUpdateWithoutParentInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  event: z.lazy(() => EventUpdateOneRequiredWithoutVenueNodesNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUpdateManyWithoutParentNestedInputSchema).optional(),
  type: z.lazy(() => VenueTypeUpdateOneRequiredWithoutVenuesNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateWithoutParentInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  assignments: z.lazy(() => VenueAssignUncheckedUpdateManyWithoutVenueNodeNestedInputSchema).optional(),
  children: z.lazy(() => VenueNodeUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
});

export const VenueNodeUncheckedUpdateManyWithoutParentInputSchema: z.ZodType<Prisma.VenueNodeUncheckedUpdateManyWithoutParentInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  typeId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  eventId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  capacity: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ResultDataCreateManyResultColumnInputSchema: z.ZodType<Prisma.ResultDataCreateManyResultColumnInput> = z.strictObject({
  id: z.uuid().optional(),
  userId: z.string(),
  value: z.string(),
});

export const ResultDataUpdateWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUpdateWithoutResultColumnInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutResultDataNestedInputSchema).optional(),
});

export const ResultDataUncheckedUpdateWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateWithoutResultColumnInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ResultDataUncheckedUpdateManyWithoutResultColumnInputSchema: z.ZodType<Prisma.ResultDataUncheckedUpdateManyWithoutResultColumnInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const EventFindFirstArgsSchema: z.ZodType<Prisma.EventFindFirstArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(), 
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(), EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema, EventScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const EventFindFirstOrThrowArgsSchema: z.ZodType<Prisma.EventFindFirstOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(), 
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(), EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema, EventScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const EventFindManyArgsSchema: z.ZodType<Prisma.EventFindManyArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereInputSchema.optional(), 
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(), EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ EventScalarFieldEnumSchema, EventScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const EventAggregateArgsSchema: z.ZodType<Prisma.EventAggregateArgs> = z.object({
  where: EventWhereInputSchema.optional(), 
  orderBy: z.union([ EventOrderByWithRelationInputSchema.array(), EventOrderByWithRelationInputSchema ]).optional(),
  cursor: EventWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const EventGroupByArgsSchema: z.ZodType<Prisma.EventGroupByArgs> = z.object({
  where: EventWhereInputSchema.optional(), 
  orderBy: z.union([ EventOrderByWithAggregationInputSchema.array(), EventOrderByWithAggregationInputSchema ]).optional(),
  by: EventScalarFieldEnumSchema.array(), 
  having: EventScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const EventFindUniqueArgsSchema: z.ZodType<Prisma.EventFindUniqueArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema, 
}).strict();

export const EventFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.EventFindUniqueOrThrowArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema, 
}).strict();

export const OrganizerAssignFindFirstArgsSchema: z.ZodType<Prisma.OrganizerAssignFindFirstArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  where: OrganizerAssignWhereInputSchema.optional(), 
  orderBy: z.union([ OrganizerAssignOrderByWithRelationInputSchema.array(), OrganizerAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizerAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizerAssignScalarFieldEnumSchema, OrganizerAssignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrganizerAssignFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrganizerAssignFindFirstOrThrowArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  where: OrganizerAssignWhereInputSchema.optional(), 
  orderBy: z.union([ OrganizerAssignOrderByWithRelationInputSchema.array(), OrganizerAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizerAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizerAssignScalarFieldEnumSchema, OrganizerAssignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrganizerAssignFindManyArgsSchema: z.ZodType<Prisma.OrganizerAssignFindManyArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  where: OrganizerAssignWhereInputSchema.optional(), 
  orderBy: z.union([ OrganizerAssignOrderByWithRelationInputSchema.array(), OrganizerAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizerAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrganizerAssignScalarFieldEnumSchema, OrganizerAssignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrganizerAssignAggregateArgsSchema: z.ZodType<Prisma.OrganizerAssignAggregateArgs> = z.object({
  where: OrganizerAssignWhereInputSchema.optional(), 
  orderBy: z.union([ OrganizerAssignOrderByWithRelationInputSchema.array(), OrganizerAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: OrganizerAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrganizerAssignGroupByArgsSchema: z.ZodType<Prisma.OrganizerAssignGroupByArgs> = z.object({
  where: OrganizerAssignWhereInputSchema.optional(), 
  orderBy: z.union([ OrganizerAssignOrderByWithAggregationInputSchema.array(), OrganizerAssignOrderByWithAggregationInputSchema ]).optional(),
  by: OrganizerAssignScalarFieldEnumSchema.array(), 
  having: OrganizerAssignScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrganizerAssignFindUniqueArgsSchema: z.ZodType<Prisma.OrganizerAssignFindUniqueArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  where: OrganizerAssignWhereUniqueInputSchema, 
}).strict();

export const OrganizerAssignFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrganizerAssignFindUniqueOrThrowArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  where: OrganizerAssignWhereUniqueInputSchema, 
}).strict();

export const FormFindFirstArgsSchema: z.ZodType<Prisma.FormFindFirstArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereInputSchema.optional(), 
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(), FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormScalarFieldEnumSchema, FormScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FormFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FormFindFirstOrThrowArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereInputSchema.optional(), 
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(), FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormScalarFieldEnumSchema, FormScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FormFindManyArgsSchema: z.ZodType<Prisma.FormFindManyArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereInputSchema.optional(), 
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(), FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormScalarFieldEnumSchema, FormScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FormAggregateArgsSchema: z.ZodType<Prisma.FormAggregateArgs> = z.object({
  where: FormWhereInputSchema.optional(), 
  orderBy: z.union([ FormOrderByWithRelationInputSchema.array(), FormOrderByWithRelationInputSchema ]).optional(),
  cursor: FormWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FormGroupByArgsSchema: z.ZodType<Prisma.FormGroupByArgs> = z.object({
  where: FormWhereInputSchema.optional(), 
  orderBy: z.union([ FormOrderByWithAggregationInputSchema.array(), FormOrderByWithAggregationInputSchema ]).optional(),
  by: FormScalarFieldEnumSchema.array(), 
  having: FormScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FormFindUniqueArgsSchema: z.ZodType<Prisma.FormFindUniqueArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema, 
}).strict();

export const FormFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FormFindUniqueOrThrowArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema, 
}).strict();

export const FormFieldFindFirstArgsSchema: z.ZodType<Prisma.FormFieldFindFirstArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  where: FormFieldWhereInputSchema.optional(), 
  orderBy: z.union([ FormFieldOrderByWithRelationInputSchema.array(), FormFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FormFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormFieldScalarFieldEnumSchema, FormFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FormFieldFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FormFieldFindFirstOrThrowArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  where: FormFieldWhereInputSchema.optional(), 
  orderBy: z.union([ FormFieldOrderByWithRelationInputSchema.array(), FormFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FormFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormFieldScalarFieldEnumSchema, FormFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FormFieldFindManyArgsSchema: z.ZodType<Prisma.FormFieldFindManyArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  where: FormFieldWhereInputSchema.optional(), 
  orderBy: z.union([ FormFieldOrderByWithRelationInputSchema.array(), FormFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FormFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FormFieldScalarFieldEnumSchema, FormFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const FormFieldAggregateArgsSchema: z.ZodType<Prisma.FormFieldAggregateArgs> = z.object({
  where: FormFieldWhereInputSchema.optional(), 
  orderBy: z.union([ FormFieldOrderByWithRelationInputSchema.array(), FormFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FormFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FormFieldGroupByArgsSchema: z.ZodType<Prisma.FormFieldGroupByArgs> = z.object({
  where: FormFieldWhereInputSchema.optional(), 
  orderBy: z.union([ FormFieldOrderByWithAggregationInputSchema.array(), FormFieldOrderByWithAggregationInputSchema ]).optional(),
  by: FormFieldScalarFieldEnumSchema.array(), 
  having: FormFieldScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const FormFieldFindUniqueArgsSchema: z.ZodType<Prisma.FormFieldFindUniqueArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  where: FormFieldWhereUniqueInputSchema, 
}).strict();

export const FormFieldFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FormFieldFindUniqueOrThrowArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  where: FormFieldWhereUniqueInputSchema, 
}).strict();

export const ResFindFirstArgsSchema: z.ZodType<Prisma.ResFindFirstArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  where: ResWhereInputSchema.optional(), 
  orderBy: z.union([ ResOrderByWithRelationInputSchema.array(), ResOrderByWithRelationInputSchema ]).optional(),
  cursor: ResWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResScalarFieldEnumSchema, ResScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResFindFirstOrThrowArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  where: ResWhereInputSchema.optional(), 
  orderBy: z.union([ ResOrderByWithRelationInputSchema.array(), ResOrderByWithRelationInputSchema ]).optional(),
  cursor: ResWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResScalarFieldEnumSchema, ResScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResFindManyArgsSchema: z.ZodType<Prisma.ResFindManyArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  where: ResWhereInputSchema.optional(), 
  orderBy: z.union([ ResOrderByWithRelationInputSchema.array(), ResOrderByWithRelationInputSchema ]).optional(),
  cursor: ResWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResScalarFieldEnumSchema, ResScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResAggregateArgsSchema: z.ZodType<Prisma.ResAggregateArgs> = z.object({
  where: ResWhereInputSchema.optional(), 
  orderBy: z.union([ ResOrderByWithRelationInputSchema.array(), ResOrderByWithRelationInputSchema ]).optional(),
  cursor: ResWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResGroupByArgsSchema: z.ZodType<Prisma.ResGroupByArgs> = z.object({
  where: ResWhereInputSchema.optional(), 
  orderBy: z.union([ ResOrderByWithAggregationInputSchema.array(), ResOrderByWithAggregationInputSchema ]).optional(),
  by: ResScalarFieldEnumSchema.array(), 
  having: ResScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResFindUniqueArgsSchema: z.ZodType<Prisma.ResFindUniqueArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  where: ResWhereUniqueInputSchema, 
}).strict();

export const ResFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResFindUniqueOrThrowArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  where: ResWhereUniqueInputSchema, 
}).strict();

export const ResFieldFindFirstArgsSchema: z.ZodType<Prisma.ResFieldFindFirstArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  where: ResFieldWhereInputSchema.optional(), 
  orderBy: z.union([ ResFieldOrderByWithRelationInputSchema.array(), ResFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ResFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResFieldScalarFieldEnumSchema, ResFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResFieldFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResFieldFindFirstOrThrowArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  where: ResFieldWhereInputSchema.optional(), 
  orderBy: z.union([ ResFieldOrderByWithRelationInputSchema.array(), ResFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ResFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResFieldScalarFieldEnumSchema, ResFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResFieldFindManyArgsSchema: z.ZodType<Prisma.ResFieldFindManyArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  where: ResFieldWhereInputSchema.optional(), 
  orderBy: z.union([ ResFieldOrderByWithRelationInputSchema.array(), ResFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ResFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResFieldScalarFieldEnumSchema, ResFieldScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResFieldAggregateArgsSchema: z.ZodType<Prisma.ResFieldAggregateArgs> = z.object({
  where: ResFieldWhereInputSchema.optional(), 
  orderBy: z.union([ ResFieldOrderByWithRelationInputSchema.array(), ResFieldOrderByWithRelationInputSchema ]).optional(),
  cursor: ResFieldWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResFieldGroupByArgsSchema: z.ZodType<Prisma.ResFieldGroupByArgs> = z.object({
  where: ResFieldWhereInputSchema.optional(), 
  orderBy: z.union([ ResFieldOrderByWithAggregationInputSchema.array(), ResFieldOrderByWithAggregationInputSchema ]).optional(),
  by: ResFieldScalarFieldEnumSchema.array(), 
  having: ResFieldScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResFieldFindUniqueArgsSchema: z.ZodType<Prisma.ResFieldFindUniqueArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  where: ResFieldWhereUniqueInputSchema, 
}).strict();

export const ResFieldFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResFieldFindUniqueOrThrowArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  where: ResFieldWhereUniqueInputSchema, 
}).strict();

export const TicketConfigFindFirstArgsSchema: z.ZodType<Prisma.TicketConfigFindFirstArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  where: TicketConfigWhereInputSchema.optional(), 
  orderBy: z.union([ TicketConfigOrderByWithRelationInputSchema.array(), TicketConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketConfigWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketConfigScalarFieldEnumSchema, TicketConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TicketConfigFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TicketConfigFindFirstOrThrowArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  where: TicketConfigWhereInputSchema.optional(), 
  orderBy: z.union([ TicketConfigOrderByWithRelationInputSchema.array(), TicketConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketConfigWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketConfigScalarFieldEnumSchema, TicketConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TicketConfigFindManyArgsSchema: z.ZodType<Prisma.TicketConfigFindManyArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  where: TicketConfigWhereInputSchema.optional(), 
  orderBy: z.union([ TicketConfigOrderByWithRelationInputSchema.array(), TicketConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketConfigWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TicketConfigScalarFieldEnumSchema, TicketConfigScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TicketConfigAggregateArgsSchema: z.ZodType<Prisma.TicketConfigAggregateArgs> = z.object({
  where: TicketConfigWhereInputSchema.optional(), 
  orderBy: z.union([ TicketConfigOrderByWithRelationInputSchema.array(), TicketConfigOrderByWithRelationInputSchema ]).optional(),
  cursor: TicketConfigWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const TicketConfigGroupByArgsSchema: z.ZodType<Prisma.TicketConfigGroupByArgs> = z.object({
  where: TicketConfigWhereInputSchema.optional(), 
  orderBy: z.union([ TicketConfigOrderByWithAggregationInputSchema.array(), TicketConfigOrderByWithAggregationInputSchema ]).optional(),
  by: TicketConfigScalarFieldEnumSchema.array(), 
  having: TicketConfigScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const TicketConfigFindUniqueArgsSchema: z.ZodType<Prisma.TicketConfigFindUniqueArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  where: TicketConfigWhereUniqueInputSchema, 
}).strict();

export const TicketConfigFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TicketConfigFindUniqueOrThrowArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  where: TicketConfigWhereUniqueInputSchema, 
}).strict();

export const VenueTypeFindFirstArgsSchema: z.ZodType<Prisma.VenueTypeFindFirstArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  where: VenueTypeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueTypeOrderByWithRelationInputSchema.array(), VenueTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueTypeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueTypeScalarFieldEnumSchema, VenueTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueTypeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VenueTypeFindFirstOrThrowArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  where: VenueTypeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueTypeOrderByWithRelationInputSchema.array(), VenueTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueTypeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueTypeScalarFieldEnumSchema, VenueTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueTypeFindManyArgsSchema: z.ZodType<Prisma.VenueTypeFindManyArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  where: VenueTypeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueTypeOrderByWithRelationInputSchema.array(), VenueTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueTypeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueTypeScalarFieldEnumSchema, VenueTypeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueTypeAggregateArgsSchema: z.ZodType<Prisma.VenueTypeAggregateArgs> = z.object({
  where: VenueTypeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueTypeOrderByWithRelationInputSchema.array(), VenueTypeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueTypeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VenueTypeGroupByArgsSchema: z.ZodType<Prisma.VenueTypeGroupByArgs> = z.object({
  where: VenueTypeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueTypeOrderByWithAggregationInputSchema.array(), VenueTypeOrderByWithAggregationInputSchema ]).optional(),
  by: VenueTypeScalarFieldEnumSchema.array(), 
  having: VenueTypeScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VenueTypeFindUniqueArgsSchema: z.ZodType<Prisma.VenueTypeFindUniqueArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  where: VenueTypeWhereUniqueInputSchema, 
}).strict();

export const VenueTypeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VenueTypeFindUniqueOrThrowArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  where: VenueTypeWhereUniqueInputSchema, 
}).strict();

export const VenueNodeFindFirstArgsSchema: z.ZodType<Prisma.VenueNodeFindFirstArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  where: VenueNodeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueNodeOrderByWithRelationInputSchema.array(), VenueNodeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueNodeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueNodeScalarFieldEnumSchema, VenueNodeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueNodeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VenueNodeFindFirstOrThrowArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  where: VenueNodeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueNodeOrderByWithRelationInputSchema.array(), VenueNodeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueNodeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueNodeScalarFieldEnumSchema, VenueNodeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueNodeFindManyArgsSchema: z.ZodType<Prisma.VenueNodeFindManyArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  where: VenueNodeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueNodeOrderByWithRelationInputSchema.array(), VenueNodeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueNodeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueNodeScalarFieldEnumSchema, VenueNodeScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueNodeAggregateArgsSchema: z.ZodType<Prisma.VenueNodeAggregateArgs> = z.object({
  where: VenueNodeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueNodeOrderByWithRelationInputSchema.array(), VenueNodeOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueNodeWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VenueNodeGroupByArgsSchema: z.ZodType<Prisma.VenueNodeGroupByArgs> = z.object({
  where: VenueNodeWhereInputSchema.optional(), 
  orderBy: z.union([ VenueNodeOrderByWithAggregationInputSchema.array(), VenueNodeOrderByWithAggregationInputSchema ]).optional(),
  by: VenueNodeScalarFieldEnumSchema.array(), 
  having: VenueNodeScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VenueNodeFindUniqueArgsSchema: z.ZodType<Prisma.VenueNodeFindUniqueArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  where: VenueNodeWhereUniqueInputSchema, 
}).strict();

export const VenueNodeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VenueNodeFindUniqueOrThrowArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  where: VenueNodeWhereUniqueInputSchema, 
}).strict();

export const VenueAssignFindFirstArgsSchema: z.ZodType<Prisma.VenueAssignFindFirstArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  where: VenueAssignWhereInputSchema.optional(), 
  orderBy: z.union([ VenueAssignOrderByWithRelationInputSchema.array(), VenueAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueAssignScalarFieldEnumSchema, VenueAssignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueAssignFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VenueAssignFindFirstOrThrowArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  where: VenueAssignWhereInputSchema.optional(), 
  orderBy: z.union([ VenueAssignOrderByWithRelationInputSchema.array(), VenueAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueAssignScalarFieldEnumSchema, VenueAssignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueAssignFindManyArgsSchema: z.ZodType<Prisma.VenueAssignFindManyArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  where: VenueAssignWhereInputSchema.optional(), 
  orderBy: z.union([ VenueAssignOrderByWithRelationInputSchema.array(), VenueAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VenueAssignScalarFieldEnumSchema, VenueAssignScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const VenueAssignAggregateArgsSchema: z.ZodType<Prisma.VenueAssignAggregateArgs> = z.object({
  where: VenueAssignWhereInputSchema.optional(), 
  orderBy: z.union([ VenueAssignOrderByWithRelationInputSchema.array(), VenueAssignOrderByWithRelationInputSchema ]).optional(),
  cursor: VenueAssignWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VenueAssignGroupByArgsSchema: z.ZodType<Prisma.VenueAssignGroupByArgs> = z.object({
  where: VenueAssignWhereInputSchema.optional(), 
  orderBy: z.union([ VenueAssignOrderByWithAggregationInputSchema.array(), VenueAssignOrderByWithAggregationInputSchema ]).optional(),
  by: VenueAssignScalarFieldEnumSchema.array(), 
  having: VenueAssignScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const VenueAssignFindUniqueArgsSchema: z.ZodType<Prisma.VenueAssignFindUniqueArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  where: VenueAssignWhereUniqueInputSchema, 
}).strict();

export const VenueAssignFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VenueAssignFindUniqueOrThrowArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  where: VenueAssignWhereUniqueInputSchema, 
}).strict();

export const ResultColumnFindFirstArgsSchema: z.ZodType<Prisma.ResultColumnFindFirstArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  where: ResultColumnWhereInputSchema.optional(), 
  orderBy: z.union([ ResultColumnOrderByWithRelationInputSchema.array(), ResultColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultColumnWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultColumnScalarFieldEnumSchema, ResultColumnScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResultColumnFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResultColumnFindFirstOrThrowArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  where: ResultColumnWhereInputSchema.optional(), 
  orderBy: z.union([ ResultColumnOrderByWithRelationInputSchema.array(), ResultColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultColumnWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultColumnScalarFieldEnumSchema, ResultColumnScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResultColumnFindManyArgsSchema: z.ZodType<Prisma.ResultColumnFindManyArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  where: ResultColumnWhereInputSchema.optional(), 
  orderBy: z.union([ ResultColumnOrderByWithRelationInputSchema.array(), ResultColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultColumnWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultColumnScalarFieldEnumSchema, ResultColumnScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResultColumnAggregateArgsSchema: z.ZodType<Prisma.ResultColumnAggregateArgs> = z.object({
  where: ResultColumnWhereInputSchema.optional(), 
  orderBy: z.union([ ResultColumnOrderByWithRelationInputSchema.array(), ResultColumnOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultColumnWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResultColumnGroupByArgsSchema: z.ZodType<Prisma.ResultColumnGroupByArgs> = z.object({
  where: ResultColumnWhereInputSchema.optional(), 
  orderBy: z.union([ ResultColumnOrderByWithAggregationInputSchema.array(), ResultColumnOrderByWithAggregationInputSchema ]).optional(),
  by: ResultColumnScalarFieldEnumSchema.array(), 
  having: ResultColumnScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResultColumnFindUniqueArgsSchema: z.ZodType<Prisma.ResultColumnFindUniqueArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  where: ResultColumnWhereUniqueInputSchema, 
}).strict();

export const ResultColumnFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResultColumnFindUniqueOrThrowArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  where: ResultColumnWhereUniqueInputSchema, 
}).strict();

export const ResultDataFindFirstArgsSchema: z.ZodType<Prisma.ResultDataFindFirstArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  where: ResultDataWhereInputSchema.optional(), 
  orderBy: z.union([ ResultDataOrderByWithRelationInputSchema.array(), ResultDataOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultDataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultDataScalarFieldEnumSchema, ResultDataScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResultDataFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResultDataFindFirstOrThrowArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  where: ResultDataWhereInputSchema.optional(), 
  orderBy: z.union([ ResultDataOrderByWithRelationInputSchema.array(), ResultDataOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultDataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultDataScalarFieldEnumSchema, ResultDataScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResultDataFindManyArgsSchema: z.ZodType<Prisma.ResultDataFindManyArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  where: ResultDataWhereInputSchema.optional(), 
  orderBy: z.union([ ResultDataOrderByWithRelationInputSchema.array(), ResultDataOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultDataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultDataScalarFieldEnumSchema, ResultDataScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ResultDataAggregateArgsSchema: z.ZodType<Prisma.ResultDataAggregateArgs> = z.object({
  where: ResultDataWhereInputSchema.optional(), 
  orderBy: z.union([ ResultDataOrderByWithRelationInputSchema.array(), ResultDataOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultDataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResultDataGroupByArgsSchema: z.ZodType<Prisma.ResultDataGroupByArgs> = z.object({
  where: ResultDataWhereInputSchema.optional(), 
  orderBy: z.union([ ResultDataOrderByWithAggregationInputSchema.array(), ResultDataOrderByWithAggregationInputSchema ]).optional(),
  by: ResultDataScalarFieldEnumSchema.array(), 
  having: ResultDataScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ResultDataFindUniqueArgsSchema: z.ZodType<Prisma.ResultDataFindUniqueArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  where: ResultDataWhereUniqueInputSchema, 
}).strict();

export const ResultDataFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResultDataFindUniqueOrThrowArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  where: ResultDataWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const EventCreateArgsSchema: z.ZodType<Prisma.EventCreateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventCreateInputSchema, EventUncheckedCreateInputSchema ]),
}).strict();

export const EventUpsertArgsSchema: z.ZodType<Prisma.EventUpsertArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema, 
  create: z.union([ EventCreateInputSchema, EventUncheckedCreateInputSchema ]),
  update: z.union([ EventUpdateInputSchema, EventUncheckedUpdateInputSchema ]),
}).strict();

export const EventCreateManyArgsSchema: z.ZodType<Prisma.EventCreateManyArgs> = z.object({
  data: z.union([ EventCreateManyInputSchema, EventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const EventCreateManyAndReturnArgsSchema: z.ZodType<Prisma.EventCreateManyAndReturnArgs> = z.object({
  data: z.union([ EventCreateManyInputSchema, EventCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const EventDeleteArgsSchema: z.ZodType<Prisma.EventDeleteArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  where: EventWhereUniqueInputSchema, 
}).strict();

export const EventUpdateArgsSchema: z.ZodType<Prisma.EventUpdateArgs> = z.object({
  select: EventSelectSchema.optional(),
  include: EventIncludeSchema.optional(),
  data: z.union([ EventUpdateInputSchema, EventUncheckedUpdateInputSchema ]),
  where: EventWhereUniqueInputSchema, 
}).strict();

export const EventUpdateManyArgsSchema: z.ZodType<Prisma.EventUpdateManyArgs> = z.object({
  data: z.union([ EventUpdateManyMutationInputSchema, EventUncheckedUpdateManyInputSchema ]),
  where: EventWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const EventUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.EventUpdateManyAndReturnArgs> = z.object({
  data: z.union([ EventUpdateManyMutationInputSchema, EventUncheckedUpdateManyInputSchema ]),
  where: EventWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const EventDeleteManyArgsSchema: z.ZodType<Prisma.EventDeleteManyArgs> = z.object({
  where: EventWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrganizerAssignCreateArgsSchema: z.ZodType<Prisma.OrganizerAssignCreateArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  data: z.union([ OrganizerAssignCreateInputSchema, OrganizerAssignUncheckedCreateInputSchema ]),
}).strict();

export const OrganizerAssignUpsertArgsSchema: z.ZodType<Prisma.OrganizerAssignUpsertArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  where: OrganizerAssignWhereUniqueInputSchema, 
  create: z.union([ OrganizerAssignCreateInputSchema, OrganizerAssignUncheckedCreateInputSchema ]),
  update: z.union([ OrganizerAssignUpdateInputSchema, OrganizerAssignUncheckedUpdateInputSchema ]),
}).strict();

export const OrganizerAssignCreateManyArgsSchema: z.ZodType<Prisma.OrganizerAssignCreateManyArgs> = z.object({
  data: z.union([ OrganizerAssignCreateManyInputSchema, OrganizerAssignCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrganizerAssignCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizerAssignCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizerAssignCreateManyInputSchema, OrganizerAssignCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrganizerAssignDeleteArgsSchema: z.ZodType<Prisma.OrganizerAssignDeleteArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  where: OrganizerAssignWhereUniqueInputSchema, 
}).strict();

export const OrganizerAssignUpdateArgsSchema: z.ZodType<Prisma.OrganizerAssignUpdateArgs> = z.object({
  select: OrganizerAssignSelectSchema.optional(),
  include: OrganizerAssignIncludeSchema.optional(),
  data: z.union([ OrganizerAssignUpdateInputSchema, OrganizerAssignUncheckedUpdateInputSchema ]),
  where: OrganizerAssignWhereUniqueInputSchema, 
}).strict();

export const OrganizerAssignUpdateManyArgsSchema: z.ZodType<Prisma.OrganizerAssignUpdateManyArgs> = z.object({
  data: z.union([ OrganizerAssignUpdateManyMutationInputSchema, OrganizerAssignUncheckedUpdateManyInputSchema ]),
  where: OrganizerAssignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrganizerAssignUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrganizerAssignUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrganizerAssignUpdateManyMutationInputSchema, OrganizerAssignUncheckedUpdateManyInputSchema ]),
  where: OrganizerAssignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrganizerAssignDeleteManyArgsSchema: z.ZodType<Prisma.OrganizerAssignDeleteManyArgs> = z.object({
  where: OrganizerAssignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FormCreateArgsSchema: z.ZodType<Prisma.FormCreateArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  data: z.union([ FormCreateInputSchema, FormUncheckedCreateInputSchema ]),
}).strict();

export const FormUpsertArgsSchema: z.ZodType<Prisma.FormUpsertArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema, 
  create: z.union([ FormCreateInputSchema, FormUncheckedCreateInputSchema ]),
  update: z.union([ FormUpdateInputSchema, FormUncheckedUpdateInputSchema ]),
}).strict();

export const FormCreateManyArgsSchema: z.ZodType<Prisma.FormCreateManyArgs> = z.object({
  data: z.union([ FormCreateManyInputSchema, FormCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FormCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FormCreateManyAndReturnArgs> = z.object({
  data: z.union([ FormCreateManyInputSchema, FormCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FormDeleteArgsSchema: z.ZodType<Prisma.FormDeleteArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  where: FormWhereUniqueInputSchema, 
}).strict();

export const FormUpdateArgsSchema: z.ZodType<Prisma.FormUpdateArgs> = z.object({
  select: FormSelectSchema.optional(),
  include: FormIncludeSchema.optional(),
  data: z.union([ FormUpdateInputSchema, FormUncheckedUpdateInputSchema ]),
  where: FormWhereUniqueInputSchema, 
}).strict();

export const FormUpdateManyArgsSchema: z.ZodType<Prisma.FormUpdateManyArgs> = z.object({
  data: z.union([ FormUpdateManyMutationInputSchema, FormUncheckedUpdateManyInputSchema ]),
  where: FormWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FormUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FormUpdateManyAndReturnArgs> = z.object({
  data: z.union([ FormUpdateManyMutationInputSchema, FormUncheckedUpdateManyInputSchema ]),
  where: FormWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FormDeleteManyArgsSchema: z.ZodType<Prisma.FormDeleteManyArgs> = z.object({
  where: FormWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FormFieldCreateArgsSchema: z.ZodType<Prisma.FormFieldCreateArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  data: z.union([ FormFieldCreateInputSchema, FormFieldUncheckedCreateInputSchema ]),
}).strict();

export const FormFieldUpsertArgsSchema: z.ZodType<Prisma.FormFieldUpsertArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  where: FormFieldWhereUniqueInputSchema, 
  create: z.union([ FormFieldCreateInputSchema, FormFieldUncheckedCreateInputSchema ]),
  update: z.union([ FormFieldUpdateInputSchema, FormFieldUncheckedUpdateInputSchema ]),
}).strict();

export const FormFieldCreateManyArgsSchema: z.ZodType<Prisma.FormFieldCreateManyArgs> = z.object({
  data: z.union([ FormFieldCreateManyInputSchema, FormFieldCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FormFieldCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FormFieldCreateManyAndReturnArgs> = z.object({
  data: z.union([ FormFieldCreateManyInputSchema, FormFieldCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const FormFieldDeleteArgsSchema: z.ZodType<Prisma.FormFieldDeleteArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  where: FormFieldWhereUniqueInputSchema, 
}).strict();

export const FormFieldUpdateArgsSchema: z.ZodType<Prisma.FormFieldUpdateArgs> = z.object({
  select: FormFieldSelectSchema.optional(),
  include: FormFieldIncludeSchema.optional(),
  data: z.union([ FormFieldUpdateInputSchema, FormFieldUncheckedUpdateInputSchema ]),
  where: FormFieldWhereUniqueInputSchema, 
}).strict();

export const FormFieldUpdateManyArgsSchema: z.ZodType<Prisma.FormFieldUpdateManyArgs> = z.object({
  data: z.union([ FormFieldUpdateManyMutationInputSchema, FormFieldUncheckedUpdateManyInputSchema ]),
  where: FormFieldWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FormFieldUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FormFieldUpdateManyAndReturnArgs> = z.object({
  data: z.union([ FormFieldUpdateManyMutationInputSchema, FormFieldUncheckedUpdateManyInputSchema ]),
  where: FormFieldWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const FormFieldDeleteManyArgsSchema: z.ZodType<Prisma.FormFieldDeleteManyArgs> = z.object({
  where: FormFieldWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResCreateArgsSchema: z.ZodType<Prisma.ResCreateArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  data: z.union([ ResCreateInputSchema, ResUncheckedCreateInputSchema ]),
}).strict();

export const ResUpsertArgsSchema: z.ZodType<Prisma.ResUpsertArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  where: ResWhereUniqueInputSchema, 
  create: z.union([ ResCreateInputSchema, ResUncheckedCreateInputSchema ]),
  update: z.union([ ResUpdateInputSchema, ResUncheckedUpdateInputSchema ]),
}).strict();

export const ResCreateManyArgsSchema: z.ZodType<Prisma.ResCreateManyArgs> = z.object({
  data: z.union([ ResCreateManyInputSchema, ResCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ResCreateManyAndReturnArgs> = z.object({
  data: z.union([ ResCreateManyInputSchema, ResCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResDeleteArgsSchema: z.ZodType<Prisma.ResDeleteArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  where: ResWhereUniqueInputSchema, 
}).strict();

export const ResUpdateArgsSchema: z.ZodType<Prisma.ResUpdateArgs> = z.object({
  select: ResSelectSchema.optional(),
  include: ResIncludeSchema.optional(),
  data: z.union([ ResUpdateInputSchema, ResUncheckedUpdateInputSchema ]),
  where: ResWhereUniqueInputSchema, 
}).strict();

export const ResUpdateManyArgsSchema: z.ZodType<Prisma.ResUpdateManyArgs> = z.object({
  data: z.union([ ResUpdateManyMutationInputSchema, ResUncheckedUpdateManyInputSchema ]),
  where: ResWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ResUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ResUpdateManyMutationInputSchema, ResUncheckedUpdateManyInputSchema ]),
  where: ResWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResDeleteManyArgsSchema: z.ZodType<Prisma.ResDeleteManyArgs> = z.object({
  where: ResWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResFieldCreateArgsSchema: z.ZodType<Prisma.ResFieldCreateArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  data: z.union([ ResFieldCreateInputSchema, ResFieldUncheckedCreateInputSchema ]),
}).strict();

export const ResFieldUpsertArgsSchema: z.ZodType<Prisma.ResFieldUpsertArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  where: ResFieldWhereUniqueInputSchema, 
  create: z.union([ ResFieldCreateInputSchema, ResFieldUncheckedCreateInputSchema ]),
  update: z.union([ ResFieldUpdateInputSchema, ResFieldUncheckedUpdateInputSchema ]),
}).strict();

export const ResFieldCreateManyArgsSchema: z.ZodType<Prisma.ResFieldCreateManyArgs> = z.object({
  data: z.union([ ResFieldCreateManyInputSchema, ResFieldCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResFieldCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ResFieldCreateManyAndReturnArgs> = z.object({
  data: z.union([ ResFieldCreateManyInputSchema, ResFieldCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResFieldDeleteArgsSchema: z.ZodType<Prisma.ResFieldDeleteArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  where: ResFieldWhereUniqueInputSchema, 
}).strict();

export const ResFieldUpdateArgsSchema: z.ZodType<Prisma.ResFieldUpdateArgs> = z.object({
  select: ResFieldSelectSchema.optional(),
  include: ResFieldIncludeSchema.optional(),
  data: z.union([ ResFieldUpdateInputSchema, ResFieldUncheckedUpdateInputSchema ]),
  where: ResFieldWhereUniqueInputSchema, 
}).strict();

export const ResFieldUpdateManyArgsSchema: z.ZodType<Prisma.ResFieldUpdateManyArgs> = z.object({
  data: z.union([ ResFieldUpdateManyMutationInputSchema, ResFieldUncheckedUpdateManyInputSchema ]),
  where: ResFieldWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResFieldUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ResFieldUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ResFieldUpdateManyMutationInputSchema, ResFieldUncheckedUpdateManyInputSchema ]),
  where: ResFieldWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResFieldDeleteManyArgsSchema: z.ZodType<Prisma.ResFieldDeleteManyArgs> = z.object({
  where: ResFieldWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TicketConfigCreateArgsSchema: z.ZodType<Prisma.TicketConfigCreateArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  data: z.union([ TicketConfigCreateInputSchema, TicketConfigUncheckedCreateInputSchema ]),
}).strict();

export const TicketConfigUpsertArgsSchema: z.ZodType<Prisma.TicketConfigUpsertArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  where: TicketConfigWhereUniqueInputSchema, 
  create: z.union([ TicketConfigCreateInputSchema, TicketConfigUncheckedCreateInputSchema ]),
  update: z.union([ TicketConfigUpdateInputSchema, TicketConfigUncheckedUpdateInputSchema ]),
}).strict();

export const TicketConfigCreateManyArgsSchema: z.ZodType<Prisma.TicketConfigCreateManyArgs> = z.object({
  data: z.union([ TicketConfigCreateManyInputSchema, TicketConfigCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const TicketConfigCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TicketConfigCreateManyAndReturnArgs> = z.object({
  data: z.union([ TicketConfigCreateManyInputSchema, TicketConfigCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const TicketConfigDeleteArgsSchema: z.ZodType<Prisma.TicketConfigDeleteArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  where: TicketConfigWhereUniqueInputSchema, 
}).strict();

export const TicketConfigUpdateArgsSchema: z.ZodType<Prisma.TicketConfigUpdateArgs> = z.object({
  select: TicketConfigSelectSchema.optional(),
  include: TicketConfigIncludeSchema.optional(),
  data: z.union([ TicketConfigUpdateInputSchema, TicketConfigUncheckedUpdateInputSchema ]),
  where: TicketConfigWhereUniqueInputSchema, 
}).strict();

export const TicketConfigUpdateManyArgsSchema: z.ZodType<Prisma.TicketConfigUpdateManyArgs> = z.object({
  data: z.union([ TicketConfigUpdateManyMutationInputSchema, TicketConfigUncheckedUpdateManyInputSchema ]),
  where: TicketConfigWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TicketConfigUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TicketConfigUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TicketConfigUpdateManyMutationInputSchema, TicketConfigUncheckedUpdateManyInputSchema ]),
  where: TicketConfigWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TicketConfigDeleteManyArgsSchema: z.ZodType<Prisma.TicketConfigDeleteManyArgs> = z.object({
  where: TicketConfigWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueTypeCreateArgsSchema: z.ZodType<Prisma.VenueTypeCreateArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  data: z.union([ VenueTypeCreateInputSchema, VenueTypeUncheckedCreateInputSchema ]),
}).strict();

export const VenueTypeUpsertArgsSchema: z.ZodType<Prisma.VenueTypeUpsertArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  where: VenueTypeWhereUniqueInputSchema, 
  create: z.union([ VenueTypeCreateInputSchema, VenueTypeUncheckedCreateInputSchema ]),
  update: z.union([ VenueTypeUpdateInputSchema, VenueTypeUncheckedUpdateInputSchema ]),
}).strict();

export const VenueTypeCreateManyArgsSchema: z.ZodType<Prisma.VenueTypeCreateManyArgs> = z.object({
  data: z.union([ VenueTypeCreateManyInputSchema, VenueTypeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VenueTypeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VenueTypeCreateManyAndReturnArgs> = z.object({
  data: z.union([ VenueTypeCreateManyInputSchema, VenueTypeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VenueTypeDeleteArgsSchema: z.ZodType<Prisma.VenueTypeDeleteArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  where: VenueTypeWhereUniqueInputSchema, 
}).strict();

export const VenueTypeUpdateArgsSchema: z.ZodType<Prisma.VenueTypeUpdateArgs> = z.object({
  select: VenueTypeSelectSchema.optional(),
  include: VenueTypeIncludeSchema.optional(),
  data: z.union([ VenueTypeUpdateInputSchema, VenueTypeUncheckedUpdateInputSchema ]),
  where: VenueTypeWhereUniqueInputSchema, 
}).strict();

export const VenueTypeUpdateManyArgsSchema: z.ZodType<Prisma.VenueTypeUpdateManyArgs> = z.object({
  data: z.union([ VenueTypeUpdateManyMutationInputSchema, VenueTypeUncheckedUpdateManyInputSchema ]),
  where: VenueTypeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueTypeUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VenueTypeUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VenueTypeUpdateManyMutationInputSchema, VenueTypeUncheckedUpdateManyInputSchema ]),
  where: VenueTypeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueTypeDeleteManyArgsSchema: z.ZodType<Prisma.VenueTypeDeleteManyArgs> = z.object({
  where: VenueTypeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueNodeCreateArgsSchema: z.ZodType<Prisma.VenueNodeCreateArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  data: z.union([ VenueNodeCreateInputSchema, VenueNodeUncheckedCreateInputSchema ]),
}).strict();

export const VenueNodeUpsertArgsSchema: z.ZodType<Prisma.VenueNodeUpsertArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  where: VenueNodeWhereUniqueInputSchema, 
  create: z.union([ VenueNodeCreateInputSchema, VenueNodeUncheckedCreateInputSchema ]),
  update: z.union([ VenueNodeUpdateInputSchema, VenueNodeUncheckedUpdateInputSchema ]),
}).strict();

export const VenueNodeCreateManyArgsSchema: z.ZodType<Prisma.VenueNodeCreateManyArgs> = z.object({
  data: z.union([ VenueNodeCreateManyInputSchema, VenueNodeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VenueNodeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VenueNodeCreateManyAndReturnArgs> = z.object({
  data: z.union([ VenueNodeCreateManyInputSchema, VenueNodeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VenueNodeDeleteArgsSchema: z.ZodType<Prisma.VenueNodeDeleteArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  where: VenueNodeWhereUniqueInputSchema, 
}).strict();

export const VenueNodeUpdateArgsSchema: z.ZodType<Prisma.VenueNodeUpdateArgs> = z.object({
  select: VenueNodeSelectSchema.optional(),
  include: VenueNodeIncludeSchema.optional(),
  data: z.union([ VenueNodeUpdateInputSchema, VenueNodeUncheckedUpdateInputSchema ]),
  where: VenueNodeWhereUniqueInputSchema, 
}).strict();

export const VenueNodeUpdateManyArgsSchema: z.ZodType<Prisma.VenueNodeUpdateManyArgs> = z.object({
  data: z.union([ VenueNodeUpdateManyMutationInputSchema, VenueNodeUncheckedUpdateManyInputSchema ]),
  where: VenueNodeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueNodeUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VenueNodeUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VenueNodeUpdateManyMutationInputSchema, VenueNodeUncheckedUpdateManyInputSchema ]),
  where: VenueNodeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueNodeDeleteManyArgsSchema: z.ZodType<Prisma.VenueNodeDeleteManyArgs> = z.object({
  where: VenueNodeWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueAssignCreateArgsSchema: z.ZodType<Prisma.VenueAssignCreateArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  data: z.union([ VenueAssignCreateInputSchema, VenueAssignUncheckedCreateInputSchema ]),
}).strict();

export const VenueAssignUpsertArgsSchema: z.ZodType<Prisma.VenueAssignUpsertArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  where: VenueAssignWhereUniqueInputSchema, 
  create: z.union([ VenueAssignCreateInputSchema, VenueAssignUncheckedCreateInputSchema ]),
  update: z.union([ VenueAssignUpdateInputSchema, VenueAssignUncheckedUpdateInputSchema ]),
}).strict();

export const VenueAssignCreateManyArgsSchema: z.ZodType<Prisma.VenueAssignCreateManyArgs> = z.object({
  data: z.union([ VenueAssignCreateManyInputSchema, VenueAssignCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VenueAssignCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VenueAssignCreateManyAndReturnArgs> = z.object({
  data: z.union([ VenueAssignCreateManyInputSchema, VenueAssignCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const VenueAssignDeleteArgsSchema: z.ZodType<Prisma.VenueAssignDeleteArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  where: VenueAssignWhereUniqueInputSchema, 
}).strict();

export const VenueAssignUpdateArgsSchema: z.ZodType<Prisma.VenueAssignUpdateArgs> = z.object({
  select: VenueAssignSelectSchema.optional(),
  include: VenueAssignIncludeSchema.optional(),
  data: z.union([ VenueAssignUpdateInputSchema, VenueAssignUncheckedUpdateInputSchema ]),
  where: VenueAssignWhereUniqueInputSchema, 
}).strict();

export const VenueAssignUpdateManyArgsSchema: z.ZodType<Prisma.VenueAssignUpdateManyArgs> = z.object({
  data: z.union([ VenueAssignUpdateManyMutationInputSchema, VenueAssignUncheckedUpdateManyInputSchema ]),
  where: VenueAssignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueAssignUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VenueAssignUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VenueAssignUpdateManyMutationInputSchema, VenueAssignUncheckedUpdateManyInputSchema ]),
  where: VenueAssignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const VenueAssignDeleteManyArgsSchema: z.ZodType<Prisma.VenueAssignDeleteManyArgs> = z.object({
  where: VenueAssignWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResultColumnCreateArgsSchema: z.ZodType<Prisma.ResultColumnCreateArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  data: z.union([ ResultColumnCreateInputSchema, ResultColumnUncheckedCreateInputSchema ]),
}).strict();

export const ResultColumnUpsertArgsSchema: z.ZodType<Prisma.ResultColumnUpsertArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  where: ResultColumnWhereUniqueInputSchema, 
  create: z.union([ ResultColumnCreateInputSchema, ResultColumnUncheckedCreateInputSchema ]),
  update: z.union([ ResultColumnUpdateInputSchema, ResultColumnUncheckedUpdateInputSchema ]),
}).strict();

export const ResultColumnCreateManyArgsSchema: z.ZodType<Prisma.ResultColumnCreateManyArgs> = z.object({
  data: z.union([ ResultColumnCreateManyInputSchema, ResultColumnCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResultColumnCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ResultColumnCreateManyAndReturnArgs> = z.object({
  data: z.union([ ResultColumnCreateManyInputSchema, ResultColumnCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResultColumnDeleteArgsSchema: z.ZodType<Prisma.ResultColumnDeleteArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  where: ResultColumnWhereUniqueInputSchema, 
}).strict();

export const ResultColumnUpdateArgsSchema: z.ZodType<Prisma.ResultColumnUpdateArgs> = z.object({
  select: ResultColumnSelectSchema.optional(),
  include: ResultColumnIncludeSchema.optional(),
  data: z.union([ ResultColumnUpdateInputSchema, ResultColumnUncheckedUpdateInputSchema ]),
  where: ResultColumnWhereUniqueInputSchema, 
}).strict();

export const ResultColumnUpdateManyArgsSchema: z.ZodType<Prisma.ResultColumnUpdateManyArgs> = z.object({
  data: z.union([ ResultColumnUpdateManyMutationInputSchema, ResultColumnUncheckedUpdateManyInputSchema ]),
  where: ResultColumnWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResultColumnUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ResultColumnUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ResultColumnUpdateManyMutationInputSchema, ResultColumnUncheckedUpdateManyInputSchema ]),
  where: ResultColumnWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResultColumnDeleteManyArgsSchema: z.ZodType<Prisma.ResultColumnDeleteManyArgs> = z.object({
  where: ResultColumnWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResultDataCreateArgsSchema: z.ZodType<Prisma.ResultDataCreateArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  data: z.union([ ResultDataCreateInputSchema, ResultDataUncheckedCreateInputSchema ]),
}).strict();

export const ResultDataUpsertArgsSchema: z.ZodType<Prisma.ResultDataUpsertArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  where: ResultDataWhereUniqueInputSchema, 
  create: z.union([ ResultDataCreateInputSchema, ResultDataUncheckedCreateInputSchema ]),
  update: z.union([ ResultDataUpdateInputSchema, ResultDataUncheckedUpdateInputSchema ]),
}).strict();

export const ResultDataCreateManyArgsSchema: z.ZodType<Prisma.ResultDataCreateManyArgs> = z.object({
  data: z.union([ ResultDataCreateManyInputSchema, ResultDataCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResultDataCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ResultDataCreateManyAndReturnArgs> = z.object({
  data: z.union([ ResultDataCreateManyInputSchema, ResultDataCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ResultDataDeleteArgsSchema: z.ZodType<Prisma.ResultDataDeleteArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  where: ResultDataWhereUniqueInputSchema, 
}).strict();

export const ResultDataUpdateArgsSchema: z.ZodType<Prisma.ResultDataUpdateArgs> = z.object({
  select: ResultDataSelectSchema.optional(),
  include: ResultDataIncludeSchema.optional(),
  data: z.union([ ResultDataUpdateInputSchema, ResultDataUncheckedUpdateInputSchema ]),
  where: ResultDataWhereUniqueInputSchema, 
}).strict();

export const ResultDataUpdateManyArgsSchema: z.ZodType<Prisma.ResultDataUpdateManyArgs> = z.object({
  data: z.union([ ResultDataUpdateManyMutationInputSchema, ResultDataUncheckedUpdateManyInputSchema ]),
  where: ResultDataWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResultDataUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ResultDataUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ResultDataUpdateManyMutationInputSchema, ResultDataUncheckedUpdateManyInputSchema ]),
  where: ResultDataWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ResultDataDeleteManyArgsSchema: z.ZodType<Prisma.ResultDataDeleteManyArgs> = z.object({
  where: ResultDataWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();