"use server";

import { db } from "@/lib/db/drizzle";
import { tracks } from "@/lib/db/schema";

export async function getTracks() {
  try {
    const allTracks = await db
      .select()
      .from(tracks);
    
    return allTracks;
  } catch (error) {
    // handle error
  }
}