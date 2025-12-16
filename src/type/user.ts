import { User } from "@lorium/prisma-zod";

export interface HostUser extends User {
  role: "HOST";
}

export interface RegistrantUser extends User {
  role: "REGISTRANT";
}
