"use server";

import { db } from "@/lib/db";
import { favorites } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(airportIata: string, targetCitySlug: string, pathname: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) throw new Error("Unauthorized");

    const userId = session.user.id;

    const existing = await db.select().from(favorites).where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.airportIata, airportIata),
        eq(favorites.targetCitySlug, targetCitySlug)
      )
    );

    if (existing.length > 0) {
      await db.delete(favorites).where(eq(favorites.id, existing[0].id));
    } else {
      await db.insert(favorites).values({ userId, airportIata, targetCitySlug });
    }

    revalidatePath(pathname);
    return { success: true };
  } catch (error) {
    console.error("Favorite error:", error);
    return { success: false };
  }
}

export async function checkIfFavorited(airportIata: string, targetCitySlug: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return false;

    const existing = await db.select().from(favorites).where(
      and(
        eq(favorites.userId, session.user.id),
        eq(favorites.airportIata, airportIata),
        eq(favorites.targetCitySlug, targetCitySlug)
      )
    );

    return existing.length > 0;
  } catch (error) {
    return false;
  }
}

// Fetch pairs of { airportIata, targetCitySlug }
export async function getUserFavorites() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return []; 

    const userFavs = await db
      .select({ 
        airportIata: favorites.airportIata,
        targetCitySlug: favorites.targetCitySlug
      })
      .from(favorites)
      .where(eq(favorites.userId, session.user.id));

    return userFavs; 
  } catch (error) {
    console.error("Failed to fetch favorites", error);
    return [];
  }
}