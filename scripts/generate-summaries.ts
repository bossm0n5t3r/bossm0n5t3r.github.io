import * as fs from "node:fs";
import * as path from "node:path";
import matter = require("gray-matter");
import glob = require("fast-glob");

const POSTS_DIR = path.join(process.cwd(), "content/posts");
const SUMMARY_DIR = path.join(process.cwd(), "data/summaries");

// 아주 단순한 요약 함수(나중에 AI 호출로 교체 가능)
function simpleSummarize(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.slice(0, 300) + "...";
}

function toKeyFromRelPath(relPath: string) {
  // posts 하위 경로를 요약 키로 변환
  // 예) "k8s/intro.md" -> "k8s-intro"
  // 예) "my-post/index.md" -> "my-post"
  let p = relPath.replace(/\\/g, "/");
  p = p.replace(/\/index\.md$/, ""); // leaf bundle
  p = p.replace(/\.md$/, "");
  return p.replace(/\//g, "-");
}

async function main() {
  if (!fs.existsSync(SUMMARY_DIR)) {
    fs.mkdirSync(SUMMARY_DIR, { recursive: true });
  }

  const files = await glob("**/*.md", { cwd: POSTS_DIR });

  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);

    const key = toKeyFromRelPath(file);
    const title = data.title ?? key;

    const summaryJson = {
      title,
      key,
      summary: simpleSummarize(content),
      updatedAt: new Date().toISOString(),
    };

    const outPath = path.join(SUMMARY_DIR, `${key}.json`);
    fs.writeFileSync(outPath, JSON.stringify(summaryJson, null, 2), "utf-8");

    console.log(`✅ summary generated: ${outPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
