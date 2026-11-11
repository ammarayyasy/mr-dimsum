import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { db } from "@/lib/sheets";
import { User, Role } from "@/types/db";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await db.findById<User>("Users", session.userId);
  if (!user || user.status === "inactive") {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const roles = await db.find<Role>("Roles", { id: user.role_id });
  const role = roles[0] || { name: session.roleName };

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      roleName: role.name,
      status: user.status,
    },
  });
}

