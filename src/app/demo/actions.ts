"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_ROLE_COOKIE, type DemoRole } from "@/lib/demo";

export async function chooseDemoRole(role: DemoRole) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_ROLE_COOKIE, role, { path: "/" });
  redirect(role === "learner" ? "/espace" : "/admin");
}

export async function exitDemo() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ROLE_COOKIE);
  redirect("/demo");
}
