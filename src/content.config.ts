import { defineCollection, z } from "astro:content";
import { notionLoader } from "notion-astro-loader";
import {
  notionPageSchema,
  transformedPropertySchema,
} from "notion-astro-loader/schemas";

const blog = defineCollection({
  loader: notionLoader({
    auth: import.meta.env.ASTRO_NOTION_TOKEN,
    database_id: import.meta.env.ASTRO_NOTION_DB_ID,

    filter: {
      property: "status",
      status: { equals: "Published" },
    },
  }),

  schema: notionPageSchema({
    properties: z.object({
      Name: transformedPropertySchema.title,
      "Published Date": transformedPropertySchema.date.optional(),
      updatedDate: transformedPropertySchema.date.optional(),
      heroImage: transformedPropertySchema.multi_select.optional(),
      preview: transformedPropertySchema.multi_select.optional(),
      category: transformedPropertySchema.select.optional(),
      tags: transformedPropertySchema.multi_select.optional(),
      published: transformedPropertySchema.checkbox.optional(),
    }),
  }),
});

export const collections = { blog };
