import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { tools } from './data/tools';

const calculatorPaths = new Set(
  tools.filter((tool) => tool.type === 'calculadora').map((tool) => tool.href),
);

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    category: z.enum(['vivienda', 'finanzas-personales', 'fiscalidad']),
    tags: z.array(z.string().min(1)).min(1),
    author: z.string().min(1),
    draft: z.boolean().default(false),
    relatedTools: z.array(z.string()).default([]).superRefine((paths, context) => {
      paths.forEach((toolPath, index) => {
        if (!calculatorPaths.has(toolPath)) {
          context.addIssue({ code: z.ZodIssueCode.custom, message: `No existe una calculadora para ${toolPath}.`, path: [index] });
        }
      });
    }),
  }),
});

export const collections = { blog };
