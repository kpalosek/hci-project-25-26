"use server";

import { db } from "@/lib/db";
import { update, user } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// 1. DOHVAĆANJE UPDATEOVA ZA ODREĐENI AERODROM
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
    // Provjera je li korisnik prijavljen (Sigurnost na serveru)
    const session = await auth.api.getSession({
      headers: await headers(), 
    });

    if (!session?.user) {
      throw new Error("You have to be signed in to post an update.");
    }

    // Spremanje u bazu
    await db.insert(update).values({
      text,
      type,
      airportCode,
      userId: session.user.id,
    });

    // Osvježi predmemoriju (cache) da se novi update odmah prikaže na UI-u!
    // Prilagodi ovu putanju ovisno o tome kako ti izgleda URL aerodroma
    revalidatePath(`/guide`); 

    return { success: true };
  } catch (error: any) {
    console.error("Error with update post:", error);
    return { success: false, error: error.message || "Something went wrong." };
  }
}

// import { update } from "@/db/schema"; // (Use whatever name you gave your table in schema.ts)

export async function editAirportUpdate(id: string, text: string, type: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { success: false, error: "Unauthorized" };

    // Update the record where the ID matches AND the user_id matches
    await db.update(update) // <-- Change 'update' if you named the import differently in your schema
      .set({ text: text, type: type })
      .where(
        and(
          eq(update.id, id),
          eq(update.userId, session.user.id) // Using your exact 'user_id' column
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

    // Delete the record where the ID matches AND the user_id matches
    await db.delete(update) // <-- Change 'update' if you named the import differently in your schema
      .where(
        and(
          eq(update.id, id),
          eq(update.userId, session.user.id) // Using your exact 'user_id' column
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Failed to delete update:", error);
    return { success: false, error: "Database error while deleting." };
  }
}