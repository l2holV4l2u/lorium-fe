import { Event, FormField } from "@type";

export type EventWithForm = Event & { formFields: FormField[] };
