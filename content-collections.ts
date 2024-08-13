import { defineCollection, defineConfig } from "@content-collections/core";

const posts = defineCollection({
    name: "posts",
    directory: "src/posts",
    include: "**/*.md",
    schema: (z) => ({
        id: z.number(),
        title: z.string(),
        href: z.string().url(),
        description: z.string(),
        date: z.string(),
        datetime: z.string(),
        category: z.object({
            title: z.string(),
            href: z.string().url(),
        }),
        author: z.object({
            name: z.string(),
            role: z.string(),
            href: z.string().url(),
            imageUrl: z.string().url(),
        }),
    }),
});

const postDetails = defineCollection({
    name: "details",
    directory: "src/postDetails",
    include: "**/*.md",
    schema: (z) => ({
        id: z.number(),
        title: z.string(),
        content: z.string(),
        date: z.string(),
        datetime: z.string(),
        category: z.object({
            title: z.string(),
            href: z.string().url(),
        }),
        author: z.object({
            name: z.string(),
            role: z.string(),
            href: z.string().url(),
            imageUrl: z.string().url(),
        }),
    }),
});

export default defineConfig({
    collections: [posts, postDetails],
});