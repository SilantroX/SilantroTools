// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const tools = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['generadores', 'imagenes', 'texto', 'seguridad', 'documentos', 'formateadores', 'conversores']),
    badge: z.string().optional(),
    isNew: z.boolean().default(false),
    publishedDate: z.string(),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ).optional(),
  }),
});

export const collections = { tools };
