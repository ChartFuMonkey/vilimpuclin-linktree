import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs/promises";
import path from "node:path";

export const prerender = true;

const FONT_PATHS: Record<string, string> = {
  "inter-700": "@fontsource/inter/files/inter-latin-700-normal.woff",
  "inter-800": "@fontsource/inter/files/inter-latin-800-normal.woff",
  "oswald-700": "@fontsource/oswald/files/oswald-latin-700-normal.woff",
};

async function loadFont(family: string, weight: number): Promise<ArrayBuffer> {
  const key = `${family.toLowerCase()}-${weight}`;
  const rel = FONT_PATHS[key];
  if (!rel) throw new Error(`No font mapping for ${family} ${weight}`);
  const fontPath = path.join(process.cwd(), "node_modules", rel);
  const buf = await fs.readFile(fontPath);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

async function loadLogoDataUri(): Promise<string | null> {
  const p = path.join(process.cwd(), "public", "assets", "s1-logo.png");
  try {
    const buf = await fs.readFile(p);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export const GET: APIRoute = async () => {
  const siteEntry = await getEntry("settings", "site");
  const site = siteEntry!.data;

  const [inter700, inter800, oswald700, logoDataUri] = await Promise.all([
    loadFont("Inter", 700),
    loadFont("Inter", 800),
    loadFont("Oswald", 700),
    loadLogoDataUri(),
  ]);

  const width = 1200;
  const height = 630;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          position: "relative",
          fontFamily: "Inter",
          color: "#fff",
          overflow: "hidden",
        },
        children: [
          // Faded background S1 logo
          logoDataUri && {
            type: "img",
            props: {
              src: logoDataUri,
              style: {
                position: "absolute",
                width: 620,
                height: 620,
                top: (height - 620) / 2 - 30,
                left: (width - 620) / 2,
                opacity: 0.14,
                objectFit: "contain",
              },
            },
          },
          // Faded background wordmark along the bottom
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: 28,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                fontFamily: "Oswald",
                fontWeight: 700,
                fontSize: 96,
                letterSpacing: 2,
                color: "#F5B800",
                opacity: 0.18,
                textTransform: "uppercase",
              },
              children: `${site.hero_title} ${site.hero_subtitle}`,
            },
          },
          // Foreground column
          {
            type: "div",
            props: {
              style: {
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
              },
              children: [
                logoDataUri && {
                  type: "img",
                  props: {
                    src: logoDataUri,
                    style: { width: 160, height: 160, objectFit: "contain" },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontFamily: "Oswald",
                      fontWeight: 700,
                      fontSize: 104,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#fff",
                      marginTop: 8,
                    },
                    children: site.hero_title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontFamily: "Inter",
                      fontWeight: 800,
                      fontSize: 28,
                      letterSpacing: 8,
                      textTransform: "uppercase",
                      color: "#F5B800",
                    },
                    children: site.hero_subtitle,
                  },
                },
                site.hero_tagline && {
                  type: "div",
                  props: {
                    style: {
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: 22,
                      color: "rgba(255,255,255,0.65)",
                      marginTop: 4,
                      maxWidth: 720,
                      textAlign: "center",
                    },
                    children: site.hero_tagline,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontFamily: "Inter",
                      fontWeight: 700,
                      fontSize: 20,
                      color: "rgba(255,255,255,0.55)",
                      marginTop: 18,
                    },
                    children: site.instagram_handle,
                  },
                },
              ].filter(Boolean),
            },
          },
        ].filter(Boolean),
      },
    } as any,
    {
      width,
      height,
      fonts: [
        { name: "Inter", data: inter700, weight: 700, style: "normal" },
        { name: "Inter", data: inter800, weight: 800, style: "normal" },
        { name: "Oswald", data: oswald700, weight: 700, style: "normal" },
      ],
    },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
