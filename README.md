# Resume Example

A small Astro site for hosting resumes from YAML, and a public example of an extensible [dev container](https://code.visualstudio.com/docs/devcontainers/containers).

The committed container is the toolchain everyone on the repo shares: Node.js 22.14.0, Git, vim, and the Astro, Tailwind, and Prettier extensions. Personal extensions and shell setup live in gitignored files, so one person's theme or git email never lands in the shared config. Details are in [`.devcontainer/README.md`](.devcontainer/README.md).

Resumes are files in [`src/content/resumes`](src/content/resumes). The sample candidate, Morgan Hale, is fictional.

## Run it

Open the folder in VS Code or Cursor and choose **Reopen in Container**. When the container finishes, start the dev server:

```bash
npm run dev
```

The site is at [http://localhost:4321](http://localhost:4321). The sample resume is at `/resumes/morgan-hale/`.

Without a container, use Node.js 22.12 or newer:

```bash
npm ci
npm run dev
```

## Personalize the container

Shared extensions are listed in [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json). Your own go in a gitignored file:

```bash
cp .devcontainer/extensions.local.example .devcontainer/extensions.local
cp .devcontainer/setup.local.sh.example   .devcontainer/setup.local.sh
```

`extensions.local` is extension IDs, one per line. `setup.local.sh` is a shell script for a git identity, a different shell, or a CLI only you use. [`.devcontainer/setup-dev-container.sh`](.devcontainer/setup-dev-container.sh) runs both after the editor is ready to install extensions. If the files are absent, setup continues.

Rebuild the container after you change either file.

## Add a resume

1. Copy [`src/content/resumes/morgan-hale.yaml`](src/content/resumes/morgan-hale.yaml). The filename, without the extension, is the URL slug.
2. Add a portrait at `public/images/resumes/{slug}.svg`. The `avatar` field in the YAML is that same slug.
3. Run `npm run dev`.

You get three URLs:

| URL | What it is |
| --- | --- |
| `/resumes/{slug}/` | Resume page |
| `/resumes/{slug}/print/` | Single-column page for printing or saving a PDF |
| `/resumes/{slug}/resume.docx` | Word download |

The schema in [`src/content.config.ts`](src/content.config.ts) checks the YAML at build time. Unknown keys fail the build. Optional sections — education, projects, publications, languages, interests — can be omitted. Set `display.educationInSidebar` to `false` to place education in the main column.

Before you deploy, set `site` in [`astro.config.mjs`](astro.config.mjs) to your public origin. The print view uses it for the "current version" line.

```bash
npm run build
npm run preview
```
