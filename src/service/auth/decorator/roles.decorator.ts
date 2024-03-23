import { SetMetadata } from "@nestjs/common";
import { RolesEnum } from "shared-structures";

export const ROLES_KEY = "roles";
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
