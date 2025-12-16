import { Event, FormField } from "@lorium/prisma-zod";

export type EventWithForm = { event: Event } & { formFields: FormField[] };
