import { Event, FormField, ResField, User } from "@type";

export function validateGenInfo(event: Event) {
  return (
    event.name &&
    event.description &&
    event.location &&
    event.startDate &&
    event.regist &&
    event.price >= 100
  );
}

export function validateFormFields(formFields: FormField[]) {
  return formFields.length > 0 && formFields.every(isFormFieldValid);
}

export function isFormFieldValid(field: FormField) {
  if (!field.header) return false;
  switch (field.type) {
    case "Section":
      if (!field.description) return false;
      break;
    case "Multiple Choice":
      if (!field.choices || field.choices.some((choice) => choice === ""))
        return false;
      break;
    case "Checkbox":
      if (!field.choices || field.choices.some((choice) => choice === ""))
        return false;
      break;
  }
  return true;
}

export function validateUser(user: User) {
  const userFields = [user.name];
  return userFields.every((field) => field);
}

export function validateResponse(
  formFields: FormField[],
  resFields: ResField[]
) {
  return resFields.every((field) => {
    const formField = formFields.find((f) => f.id == field.formFieldId);
    if (formField == undefined) return true;
    const type = formField.type;
    if (!formField.required) return true;
    if (type == "Short Answer" || type == "Long Answer") {
      return field.textField != null && field.textField != "";
    } else if (type == "Multiple Choice") {
      return field.selectField != null && field.selectField != -1;
    } else if (type == "Checkbox") {
      return formField.choices.length != 0;
    } else if (type == "File Upload") {
      return field.fileField != null;
    } else if (type == "Date Field") {
      return field.dateField != null;
    }
    return true;
  });
}
