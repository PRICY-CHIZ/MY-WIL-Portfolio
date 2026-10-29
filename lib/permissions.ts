import { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "User",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  SUPER_ADMIN: "Full system control, role assignment, and administration of all accounts.",
  ADMIN: "Manage users and operational settings, excluding super-admin privileges.",
  MANAGER: "View team information and operational reports.",
  USER: "Access the standard user area and personal account.",
};

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ["View all dashboards", "Create and manage admins", "Assign every role", "Manage all users", "System-wide access"],
  ADMIN: ["View admin dashboard", "Manage regular users", "View user directory", "Cannot grant Super Admin"],
  MANAGER: ["View manager dashboard", "View team directory", "Read operational summaries"],
  USER: ["View personal dashboard", "View own profile", "Use standard features"],
};

export const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "purple",
  ADMIN: "blue",
  MANAGER: "green",
  USER: "orange",
};

export const ALL_ROLES = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.USER] as const;
