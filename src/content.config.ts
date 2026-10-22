import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

const slugRegex = /^[a-z0-9-]+$/;

const resumes = defineCollection({
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/resumes",
  }),
  schema: z
    .object({
      profile: z
        .object({
          name: z.string(),
          tagline: z.string(),
          avatar: z
            .string()
            .regex(
              slugRegex,
              'Avatar must be a slug (lowercase, hyphenated, no path or extension), e.g. "morgan-hale"',
            ),
          avatarAlt: z.string().optional(),
          location: z.string().optional(),
        })
        .strict(),

      contact: z
        .object({
          email: z.string().email().optional(),
          phone: z.string().optional(),
          website: z.string().optional(),
          linkedin: z.string().optional(),
          github: z.string().optional(),
          stackOverflow: z.string().optional(),
        })
        .strict(),

      careerProfile: z
        .object({
          title: z.string(),
          summary: z.string(),
        })
        .strict(),

      experiences: z.array(
        z
          .object({
            role: z.string(),
            time: z.string(),
            company: z.string(),
            location: z.string().optional(),
            summary: z.string().optional(),
            bullets: z.array(z.string()).optional(),
          })
          .strict(),
      ),

      skills: z.array(
        z
          .object({
            title: z.string(),
            value: z.string(),
          })
          .strict(),
      ),

      education: z
        .array(
          z
            .object({
              degree: z.string().optional(),
              university: z.string(),
              time: z.string().optional(),
              details: z.string().optional(),
            })
            .strict(),
        )
        .optional(),

      projects: z
        .object({
          title: z.string(),
          intro: z.string().optional(),
          assignments: z.array(
            z
              .object({
                title: z.string(),
                link: z.string().url().optional(),
                tagline: z.string().optional(),
              })
              .strict(),
          ),
        })
        .strict()
        .optional(),

      publications: z
        .object({
          title: z.string(),
          intro: z.string().optional(),
          papers: z.array(
            z
              .object({
                title: z.string(),
                authors: z.string(),
                conference: z.string(),
              })
              .strict(),
          ),
        })
        .strict()
        .optional(),

      languages: z
        .array(
          z
            .object({
              idiom: z.string(),
              level: z.string(),
            })
            .strict(),
        )
        .optional(),

      interests: z
        .array(
          z
            .object({
              item: z.string(),
              link: z.string().url().optional(),
            })
            .strict(),
        )
        .optional(),

      display: z
        .object({
          educationInSidebar: z.boolean().default(true),
        })
        .strict()
        .default({ educationInSidebar: true }),
    })
    .strict(),
});

export const collections = { resumes };
