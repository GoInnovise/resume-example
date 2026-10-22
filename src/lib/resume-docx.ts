import type { CollectionEntry } from "astro:content";
import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

type Resume = CollectionEntry<"resumes">["data"];

const FONT = "Arial";
const BLACK = "111827";
const BORDER = "111827";

const spacing = {
  none: { before: 0, after: 0 },
  tight: { before: 0, after: 80 },
  section: { before: 220, after: 80 },
};

function stripProtocol(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/\/$/g, "");
}

function paragraph(
  text: string,
  options: ConstructorParameters<typeof Paragraph>[0] = {},
) {
  return new Paragraph({
    ...options,
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 20,
      }),
    ],
  });
}

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: spacing.section,
    border: {
      bottom: {
        color: BORDER,
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: false,
        font: FONT,
        size: 21,
        color: BLACK,
      }),
    ],
  });
}

function entryHeading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 20 },
    keepNext: true,
    children: [
      new TextRun({
        text,
        bold: true,
        font: FONT,
        size: 20,
        color: BLACK,
      }),
    ],
  });
}

function skillParagraph(title: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { before: 0, after: 70 },
    children: [
      new TextRun({
        text: `${title}: `,
        bold: true,
        font: FONT,
        size: 20,
        color: BLACK,
      }),
      new TextRun({
        text: value,
        font: FONT,
        size: 20,
        color: BLACK,
      }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 0, after: 55 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 20,
        color: BLACK,
      }),
    ],
  });
}

function contactLine(resume: Resume): string {
  return [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.website && stripProtocol(resume.contact.website),
    resume.contact.linkedin && `linkedin.com/in/${resume.contact.linkedin}`,
    resume.contact.github && `github.com/${resume.contact.github}`,
    resume.contact.stackOverflow &&
      `stackoverflow.com/users/${resume.contact.stackOverflow}`,
  ]
    .filter(Boolean)
    .join(" | ");
}

function buildChildren(resume: Resume): Paragraph[] {
  const children: Paragraph[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: spacing.tight,
      children: [
        new TextRun({
          text: resume.profile.name,
          bold: true,
          font: FONT,
          size: 36,
          color: BLACK,
        }),
      ],
    }),
  ];

  if (resume.profile.location) {
    children.push(
      paragraph(resume.profile.location, { spacing: spacing.none }),
    );
  }

  const contact = contactLine(resume);
  if (contact) {
    children.push(paragraph(contact, { spacing: spacing.tight }));
  }

  children.push(
    sectionHeading("Summary"),
    paragraph(resume.careerProfile.summary, { spacing: spacing.tight }),
  );

  if (resume.skills.length > 0) {
    children.push(sectionHeading("Skills"));
    for (const skill of resume.skills) {
      children.push(skillParagraph(skill.title, skill.value));
    }
  }

  if (resume.experiences.length > 0) {
    children.push(sectionHeading("Professional Experience"));
    for (const exp of resume.experiences) {
      children.push(entryHeading(`${exp.role} | ${exp.time}`));
      children.push(
        paragraph([exp.company, exp.location].filter(Boolean).join(" | "), {
          spacing: { before: 0, after: exp.summary ? 50 : 70 },
        }),
      );

      if (exp.summary) {
        children.push(paragraph(exp.summary, { spacing: spacing.tight }));
      }

      for (const item of exp.bullets ?? []) {
        children.push(bullet(item));
      }
    }
  }

  if (resume.projects && resume.projects.assignments.length > 0) {
    children.push(sectionHeading("Selected Projects"));
    if (resume.projects.intro) {
      children.push(
        paragraph(resume.projects.intro, { spacing: spacing.tight }),
      );
    }

    for (const project of resume.projects.assignments) {
      children.push(entryHeading(project.title));
      if (project.tagline) {
        children.push(paragraph(project.tagline, { spacing: spacing.tight }));
      }
    }
  }

  if (resume.publications && resume.publications.papers.length > 0) {
    children.push(sectionHeading("Publications"));
    if (resume.publications.intro) {
      children.push(
        paragraph(resume.publications.intro, { spacing: spacing.tight }),
      );
    }

    for (const paper of resume.publications.papers) {
      children.push(entryHeading(paper.title));
      children.push(paragraph(paper.authors, { spacing: spacing.none }));
      children.push(paragraph(paper.conference, { spacing: spacing.tight }));
    }
  }

  if (resume.education && resume.education.length > 0) {
    children.push(sectionHeading("Education"));
    for (const edu of resume.education) {
      children.push(entryHeading(edu.degree ?? edu.university));
      if (edu.degree) {
        children.push(paragraph(edu.university, { spacing: spacing.none }));
      }
      if (edu.time) {
        children.push(paragraph(edu.time, { spacing: spacing.none }));
      }
      if (edu.details) {
        children.push(paragraph(edu.details, { spacing: spacing.tight }));
      }
    }
  }

  if (resume.languages && resume.languages.length > 0) {
    children.push(
      sectionHeading("Languages"),
      paragraph(
        resume.languages
          .map((language) => `${language.idiom}: ${language.level}`)
          .join("; "),
      ),
    );
  }

  if (resume.interests && resume.interests.length > 0) {
    children.push(
      sectionHeading("Interests"),
      paragraph(resume.interests.map((interest) => interest.item).join("; ")),
    );
  }

  return children;
}

export function resumeDocxFilename(resume: Resume): string {
  return `${resume.profile.name.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "")}_Resume.docx`;
}

export async function buildResumeDocx(resume: Resume): Promise<Buffer> {
  const doc = new Document({
    creator: "Resume Example",
    title: `${resume.profile.name} Resume`,
    description: `ATS-friendly resume for ${resume.profile.name}`,
    styles: {
      default: {
        document: {
          run: {
            font: FONT,
            size: 20,
            color: BLACK,
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.5),
            },
          },
        },
        children: buildChildren(resume),
      },
    ],
  });

  return Packer.toBuffer(doc);
}
