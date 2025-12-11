import { User } from "@zod";

export interface HostUser extends User {
  role: "HOST";
}

export interface RegistrantUser extends User {
  role: "REGISTRANT";
}
