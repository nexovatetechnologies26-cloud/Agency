// Role-based access control. Pure module — used on the server for enforcement
// and on the client only to decide what to show.

export const ROLES = [
  "super_admin",
  "admin",
  "sales_manager",
  "sales_rep",
  "project_manager",
  "developer",
  "designer",
  "marketing_manager",
  "support_agent",
  "customer",
] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales_manager: "Sales Manager",
  sales_rep: "Sales Representative",
  project_manager: "Project Manager",
  developer: "Developer",
  designer: "Designer",
  marketing_manager: "Marketing Manager",
  support_agent: "Support Agent",
  customer: "Customer",
};

export const PERMISSIONS = [
  "dashboard",
  "leads",
  "proposals",
  "orders",
  "finance",
  "packages",
  "content",
  "support",
  "bookings",
  "customers",
  "team",
  "ai",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ALL = new Set<Permission>(PERMISSIONS);

const GRANTS: Record<Role, ReadonlySet<Permission>> = {
  super_admin: ALL,
  admin: new Set(PERMISSIONS.filter((p) => p !== "team")),
  sales_manager: new Set(["dashboard", "leads", "proposals", "bookings", "customers", "ai"]),
  sales_rep: new Set(["dashboard", "leads", "proposals", "bookings", "ai"]),
  project_manager: new Set(["dashboard", "orders", "support", "customers"]),
  developer: new Set(["dashboard", "orders"]),
  designer: new Set(["dashboard", "orders"]),
  marketing_manager: new Set(["dashboard", "leads", "content", "ai"]),
  support_agent: new Set(["dashboard", "support", "customers"]),
  customer: new Set(),
};

export function can(role: Role | undefined | null, permission: Permission) {
  return Boolean(role && GRANTS[role]?.has(permission));
}

export function isStaff(role: Role | undefined | null) {
  return Boolean(role && role !== "customer");
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
