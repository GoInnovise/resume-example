// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // Set this to your public origin when you deploy, so canonical URLs and the
  // printed "current version" line use an absolute address.
  // site: "https://example.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
