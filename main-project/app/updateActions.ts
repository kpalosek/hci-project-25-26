"use server";

import { db } from "@/lib/db";
import { update, user } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. DOHVAĆANJE UPDATEOVA ZA ODREĐENI AERODROM
export async function getUpdatesForAirport(airportCode: string) {
  try {
    const airportUpdates = await db
      .select({
        id: update.id,
        text: update.text,
        type: update.type,
        createdAt: update.createdAt,
        userId: update.userId,
        userName: user.name, 
      })
      .from(update)
      .leftJoin(user, eq(update.userId, user.id)) 
      .where(eq(update.airportCode, airportCode))
      .orderBy(desc(update.createdAt)); 

    return { success: true, data: airportUpdates };
  } catch (error) {
    console.error("Error when getting updates:", error);
    return { success: false, error: "Can't get updates." };
  }
}

// 2. OBJAVLJIVANJE NOVOG UPDATEA
export async function postAirportUpdate(text: string, type: string, airportCode: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(), 
    });

    if (!session?.user) {
      throw new Error("You have to be signed in to post an update.");
    }

    await db.insert(update).values({
      text,
      type,
      airportCode,
      userId: session.user.id,
    });

    revalidatePath(`/guide`); 

    return { success: true };
  } catch (error: any) {
    console.error("Error with update post:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}

export async function editAirportUpdate(id: string, text: string, type: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await db.update(update)
      .set({ text: text, type: type })
      .where(
        and(
          eq(update.id, id),
          eq(update.userId, session.user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Failed to edit update:", error);
    return { success: false, error: "Database error while editing." };
  }
}

export async function deleteAirportUpdate(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: false, error: "Unauthorized" };

    await db.delete(update)
      .where(
        and(
          eq(update.id, id),
          eq(update.userId, session.user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Failed to delete update:", error);
    return { success: false, error: "Database error while deleting." };
  }
}