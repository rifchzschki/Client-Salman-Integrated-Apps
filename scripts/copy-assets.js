import pkg from 'fs-extra';
const { copySync } = pkg;
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const source = resolve(
  __dirname,
  "../node_modules/@shoelace-style/shoelace/dist/assets/"
);
const destination = resolve(__dirname, "../public/shoelace-assets/assets/");

try {
  copySync(source, destination);
  console.log("✅ Shoelace assets copied successfully!");
} catch (err) {
  console.error("❌ Error copying Shoelace assets:", err);
}
