"use server";

import { httpClient } from "@/lib/axios/httpClient";

export interface IMediaResponse {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  type: string;
  releaseYear: number;
  ageRating: string;
  duration: number | null;
  totalSeasons: number | null;
  totalEpisodes: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  youtubeStreamUrl: string | null;
  imdbId: string | null;
  language: string;
  country: string | null;
  pricingType: string;
  status: string;
  averageRating: number;
  totalReviews: number;
  totalViews: number;
  isFeatured: boolean;
  isEditorsPick: boolean;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAllMedia(queryString: string) {
  try {
    const url = `/media${queryString ? `?${queryString}` : ""}`;
    const res = await httpClient.get<IMediaResponse[]>(url);
    console.log(res, "media service");
    return res ?? null;
  } catch (error) {
    console.error("Error fetching media:", error);
    return null;
  }
}

export async function getMediaBySlug(slug: string) {
  try {
    const url = `/media/${slug}`;
    const res = await httpClient.get<{ data: IMediaResponse }>(url);
    return res.data ?? null;
  } catch (error) {
    console.error("Error fetching media by slug:", error);
    return null;
  }
}
