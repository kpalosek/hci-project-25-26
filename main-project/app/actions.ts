'use server';

import { getSearchData } from "@/lib/contentful";

export async function fetchGlobalSearchData() {
  const data = await getSearchData();
  return data;
}