import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { buildResumeDocx, resumeDocxFilename } from "../../../lib/resume-docx";

export async function getStaticPaths() {
  const resumes = await getCollection("resumes");
  return resumes.map((entry) => ({
    params: { slug: entry.id },
    props: { resume: entry.data },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const resume = props.resume as Awaited<
    ReturnType<typeof getCollection<"resumes">>
  >[number]["data"];
  const buffer = await buildResumeDocx(resume);
  const filename = resumeDocxFilename(resume);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
};
