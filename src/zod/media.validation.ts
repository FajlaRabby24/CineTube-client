import { z } from "zod";

export const MediaTypeEnum = z.enum([
  "MOVIE",
  "SERIES",
  "TRAILER",
  "EPISODE",
  "SHORT",
  "FUNNY",
  "SPORT",
  "MOTIVATIONAL",
  "EDUCATIONAL",
  "OTHER",
]);
export const AgeRatingEnum = z.enum([
  "G",
  "PG",
  "PG_13",
  "R",
  "NC_17",
  "TV_Y",
  "TV_14",
  "TV_MA",
]);
export const PricingTypeEnum = z.enum(["FREE", "PREMIUM"]);
export const ContentStatusEnum = z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]);
export const GenreEnum = z.enum([
  "ACTION",
  "ADVENTURE",
  "ANIMATION",
  "COMEDY",
  "CRIME",
  "DOCUMENTARY",
  "DRAMA",
  "FANTASY",
  "HORROR",
  "MYSTERY",
  "ROMANCE",
  "SCI_FI",
  "THRILLER",
  "WESTERN",
  "FAMILY",
  "MUSICAL",
  "BIOGRAPHY",
  "SPORT",
  "WAR",
  "HISTORY",
]);

export const createMediaZodSchema = z.object({
  title: z.string().min(1, "Title is required"),
  synopsis: z.string().min(1, "Synopsis is required"),
  type: MediaTypeEnum,
  releaseYear: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear() + 5),
  ageRating: AgeRatingEnum,
  duration: z.coerce
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute"),
  youtubeStreamUrl: z.string().url("Must be a valid YouTube URL"),
  language: z.string().optional(),
  country: z.string().optional(),
  pricingType: PricingTypeEnum,
  status: ContentStatusEnum.optional(),
  isFeatured: z.boolean().optional(),
  isEditorsPick: z.boolean().optional(),
  isTrending: z.boolean().optional(),
  genres: z.array(GenreEnum).min(1, "At least one genre is required"),
  tags: z.array(z.string()).optional(),
});

export const updateMediaZodSchema = createMediaZodSchema.partial();
export type CreateMediaInput = z.infer<typeof createMediaZodSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaZodSchema>;
