#!/usr/bin/env node
// i18n consistency checks. Run: npm run i18n:check
//  1. every key exists in every language (same nested shape)
//  2. every literal t("key") used in src/ resolves in its namespace
//  3. files listed in TRANSLATED have no hardcoded Vietnamese left (comments ignored)
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "src");
const LOCALES = path.join(SRC, "i18n", "locales");
const BASE_LANG = "vi";

// Directories/files whose UI text has been moved to translation files.
// Add an entry when a new area is translated.
const TRANSLATED = [
  "layouts/CustomerLayout",
  "layouts/AuthLayout",
  "pages/Auth",
  "components/auth",
  "components/search",
  "components/common",
  "pages/Customer",
  "components/HelpCenter",
  "data",
  "layouts/OwnerLayout",
  "layouts/AdminLayout",
  "pages/Owner",
  "pages/Admin",
  "pages/Partner",
  "routes",
  "utils",
  "context",
  "services",
  "pages/ComponentsPreview.jsx",
];
// Allowed to contain Vietnamese (language names, Vietnamese-only data, etc.)
const VIETNAMESE_ALLOWED = [/i18n\//, /SUPPORTED_LANGUAGES/];

const VI_CHARS = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log("  ✗ " + msg);
};

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );

// ---------- 1. key parity ----------
const langs = fs.readdirSync(LOCALES).filter((d) => fs.statSync(path.join(LOCALES, d)).isDirectory());
const keys = {}; // keys[lang][ns] = Set
for (const lang of langs) {
  keys[lang] = {};
  for (const f of fs.readdirSync(path.join(LOCALES, lang)).filter((f) => f.endsWith(".json"))) {
    const ns = f.replace(/\.json$/, "");
    try {
      keys[lang][ns] = new Set(flatten(JSON.parse(fs.readFileSync(path.join(LOCALES, lang, f), "utf8"))));
    } catch (e) {
      fail(`${lang}/${f}: invalid JSON (${e.message})`);
      keys[lang][ns] = new Set();
    }
  }
}
console.log(`1) Key parity across ${langs.join(", ")}`);
const allNs = new Set(langs.flatMap((l) => Object.keys(keys[l])));
for (const ns of allNs) {
  for (const lang of langs) {
    if (!keys[lang][ns]) {
      fail(`${lang}/${ns}.json missing`);
      continue;
    }
    for (const other of langs) {
      if (other === lang || !keys[other][ns]) continue;
      for (const k of keys[other][ns]) if (!keys[lang][ns].has(k)) fail(`${lang}/${ns}.json missing "${k}"`);
    }
  }
}

// ---------- 2. used keys resolve ----------
console.log("2) Literal t() keys resolve");
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "i18n" ? [] : walk(p);
    return /\.(jsx?|tsx?)$/.test(e.name) ? [p] : [];
  });
const files = walk(SRC);
const base = keys[BASE_LANG] ?? {};
const hasKey = (ns, k) => base[ns]?.has(k) || [...(base[ns] ?? [])].some((x) => x.startsWith(k + "_")); // plurals
for (const file of files) {
  const code = fs.readFileSync(file, "utf8");
  const nsDecl = [...code.matchAll(/useTranslation\(\s*(\[[^\]]*\]|["'][^"']+["'])?/g)];
  if (!nsDecl.length && !/\bi18n\.t\(/.test(code)) continue;
  const declared = nsDecl.flatMap((m) => (m[1] ? [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]) : ["common"]));
  const defaultNs = declared[0] ?? "common";
  for (const m of code.matchAll(/\bt\(\s*["'`]([^"'`$]+)["'`]/g)) {
    let key = m[1];
    let ns = defaultNs;
    const nsSep = key.indexOf(":");
    if (nsSep > 0) {
      ns = key.slice(0, nsSep);
      key = key.slice(nsSep + 1);
    }
    const candidates = nsSep > 0 ? [ns] : [ns, ...declared, "common"];
    if (!candidates.some((n) => hasKey(n, key))) fail(`${path.relative(SRC, file)}: "${m[1]}" not found (ns: ${candidates[0]})`);
  }
}

// ---------- 3. leftover Vietnamese ----------
console.log("3) No hardcoded Vietnamese in translated areas");
const stripComments = (src) =>
  src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
for (const file of files) {
  const rel = path.relative(SRC, file);
  if (!TRANSLATED.some((t) => rel === t || rel.startsWith(t + "/"))) continue;
  const raw = fs.readFileSync(file, "utf8").split("\n");
  const lines = stripComments(raw.join("\n")).split("\n");
  // Proper nouns / Vietnamese-only data can be exempted with an `i18n-ignore` comment on the
  // line, or an `i18n-ignore-start` … `i18n-ignore-end` block.
  let ignoring = false;
  lines.forEach((line, i) => {
    if (raw[i].includes("i18n-ignore-start")) ignoring = true;
    if (raw[i].includes("i18n-ignore-end")) {
      ignoring = false;
      return;
    }
    if (ignoring || /i18n-ignore(?!-)/.test(raw[i])) return;
    if (VI_CHARS.test(line) && !VIETNAMESE_ALLOWED.some((re) => re.test(rel) || re.test(line)))
      fail(`${rel}:${i + 1}: ${line.trim().slice(0, 90)}`);
  });
}

console.log(failures ? `\n${failures} problem(s)` : "\nAll i18n checks passed");
process.exit(failures ? 1 : 0);
