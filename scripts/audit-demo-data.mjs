import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "src/data/demo.ts");
const source = fs.readFileSync(file, "utf8");
const ids = [...source.matchAll(/id:\s*"([^"]+)"/g)].map((match) => match[1]);
const fixtureTags = [...source.matchAll(/source:\s*"fixture"/g)].length;

const errors = [];
if (!ids.length) errors.push("No demo ids found.");
for (const id of ids) {
  if (!id.startsWith("demo-")) errors.push(`Fixture id must start with demo-: ${id}`);
}
if (fixtureTags < ids.length) errors.push(`Expected at least ${ids.length} fixture source tags, found ${fixtureTags}.`);

if (errors.length) {
  console.error("Demo data audit failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Demo data audit passed: ${ids.length} fixture ids, ${fixtureTags} source tags.`);
