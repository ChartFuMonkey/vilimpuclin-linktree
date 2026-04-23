import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://vilimpuclin.netlify.app",
  integrations: [tailwind({ applyBaseStyles: false })],
});
