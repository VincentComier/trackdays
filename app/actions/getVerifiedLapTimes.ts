"use server";

import { db } from "@/lib/db/drizzle";
import { carModels, lapTimes, trackLayouts, tracks, user as userTable } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getVerifiedLapTimes() {
  try {
    const lapTimesData = await db
      .select({
        id: lapTimes.id,
        timeMs: lapTimes.timeMs,
        drivenAt: lapTimes.drivenAt,
        status: lapTimes.status,
        user: {
          id: userTable.id,
          name: userTable.name,
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
      .where(eq(lapTimes.status, "verified"))
      .orderBy(desc(lapTimes.drivenAt));

    return { success: true, lapTimes: lapTimesData };
  } catch (error) {
    console.error("Error fetching verified lap times:", error);
    return { success: false, error: "Failed to fetch lap times" };
  }
}
