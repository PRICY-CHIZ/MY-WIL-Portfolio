import Dashboard from "@/components/Dashboard";
import { requireUser } from "@/lib/require-user";
import { Role } from "@prisma/client";
export default async function AdminPage() {
  const user = await requireUser([Role.SUPER_ADMIN, Role.ADMIN]);
  return <Dashboard role={user.role} name={user.name} email={user.email} />;
}
