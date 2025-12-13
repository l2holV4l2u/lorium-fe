import { Event, FormField } from "@zod";

export type EventWithForm = Event & { formFields: FormField[] };
