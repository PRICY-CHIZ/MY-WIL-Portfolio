import Dashboard from "@/components/Dashboard";
import { requireUser } from "@/lib/require-user";
import { Role } from "@prisma/client";
export default async function ManagerPage() {
  const user = await requireUser([Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER]);
  return <Dashboard role={user.role} name={user.name} email={user.email} />;
}
