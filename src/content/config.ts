import { defineCollection, z } from "astro:content";

const settings = defineCollection({
  type: "data",
  schema: z.object({
    hero_title: z.string(),
    hero_subtitle: z.string(),
    hero_tagline: z.string().optional().default(""),
    instagram_handle: z.string(),
    instagram_url: z.string().url().optional(),
    og_title: z.string(),
    og_description: z.string(),
  }),
});

const links = defineCollection({
  type: "data",
  schema: z.object({
    order: z.number(),
    label: z.string(),
    url: z.string().url(),
    thumbnail: z.string(),
    badge: z.string().optional(),
  }),
});

export const collections = { settings, links };
