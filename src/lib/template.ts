import { EventWithForm } from "@type/event";
import { Event, FormField } from "@type";
import { v4 as uuid } from "uuid";

export const eventWithFormTemplate = (): EventWithForm => ({
  ...eventTemplate(),
  formFields: [],
});

export const eventTemplate = (): Event => ({
  id: uuid(),
  name: "",
  description: "",
  location: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  startDate: new Date(),
  endDate: new Date(),
  regist: new Date(),
  profileURL: null,
  price: 100,
  stripeAccountId: null,
  resultUrl: null,
});

// Form field template factory
export const formFieldTemplate = (
  formId: string,
  fieldOrder: number,
  type: string = "shortanswer"
): FormField => ({
  id: uuid(),
  formId: formId,
  fieldOrder: fieldOrder,
  choices: [],
  description: null,
  header: "",
  placeholder: null,
  required: false,
  type: type,
});
