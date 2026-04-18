import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const iconSource = resolve("icons");
const iconTarget = resolve("public", "icons");
const choiceSource = resolve("dev-choices");
const choiceTarget = resolve("public", "dev-choices");
const imagePattern = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

if (!existsSync(iconSource)) {
  mkdirSync(iconSource, { recursive: true });
}

if (!existsSync(choiceSource)) {
  mkdirSync(choiceSource, { recursive: true });
}

rmSync(iconTarget, { recursive: true, force: true });
mkdirSync(iconTarget, { recursive: true });
cpSync(iconSource, iconTarget, { recursive: true });

rmSync(choiceTarget, { recursive: true, force: true });
mkdirSync(choiceTarget, { recursive: true });
cpSync(choiceSource, choiceTarget, { recursive: true });

const choices = readdirSync(choiceSource, { withFileTypes: true })
  .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
  .map((entry) => ({
    label: entry.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    url: `/dev-choices/${entry.name}`
  }));

writeFileSync(resolve(choiceTarget, "manifest.json"), `${JSON.stringify(choices, null, 2)}\n`);
