"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { carModels, lapTimes, trackLayouts, tracks, user as userTable } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

async function requireAdmin() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session?.user?.id) {
    return null;
  }

  const [adminUser] = await db
    .select({
      id: userTable.id,
      name: userTable.name,
      email: userTable.email,
      isAdmin: userTable.isAdmin,
    })
    .from(userTable)
    .where(eq(userTable.id, session.user.id))
    .limit(1);

  if (!adminUser?.isAdmin) {
    return null;
  }

  return adminUser;
}

export async function getAdminLapTimes() {
  try {
    const adminUser = await requireAdmin();
    if (!adminUser) {
      return { success: false, error: "Unauthorized" };
    }

    const lapTimesData = await db
      .select({
        id: lapTimes.id,
        timeMs: lapTimes.timeMs,
        drivenAt: lapTimes.drivenAt,
        status: lapTimes.status,
        proofUrl: lapTimes.proofUrl,
        user: {
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
        },
        trackLayout: {
          id: trackLayouts.id,
          name: trackLayouts.name,
        },
        track: {
          id: tracks.id,
          name: tracks.name,
          slug: tracks.slug,
        },
        carModel: {
          id: carModels.id,
          make: carModels.make,
          model: carModels.model,
          trim: carModels.trim,
        },
      })
      .from(lapTimes)
      .innerJoin(userTable, eq(lapTimes.userId, userTable.id))
      .innerJoin(trackLayouts, eq(lapTimes.trackLayoutId, trackLayouts.id))
      .innerJoin(tracks, eq(trackLayouts.trackId, tracks.id))
      .innerJoin(carModels, eq(lapTimes.carModelId, carModels.id))
      .orderBy(desc(lapTimes.drivenAt));

    return { success: true, lapTimes: lapTimesData };
  } catch (error) {
    console.error("Error fetching admin lap times:", error);
    return { success: false, error: "Failed to fetch lap times" };
  }
}
