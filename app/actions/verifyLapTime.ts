"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { lapTimes, user as userTable } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function verifyLapTime(formData: FormData): Promise<void> {
  const lapTimeId = String(formData.get("lapTimeId") || "").trim();

  if (!lapTimeId) {
    return;
  }

  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user?.id) {
      return;
    }

    const [adminUser] = await db
      .select({ id: userTable.id, isAdmin: userTable.isAdmin })
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .limit(1);

    if (!adminUser?.isAdmin) {
      return;
    }

    const [updated] = await db
      .update(lapTimes)
      .set({
        status: "verified",
        verifiedBy: adminUser.id,
        verifiedAt: new Date(),
      })
      .where(and(eq(lapTimes.id, lapTimeId), eq(lapTimes.status, "pending")))
      .returning({ id: lapTimes.id });

    if (!updated) {
      return;
    }

    revalidatePath("/admin");
    revalidatePath("/");

  } catch (error) {
    console.error("Error verifying lap time:", error);
  }
}
