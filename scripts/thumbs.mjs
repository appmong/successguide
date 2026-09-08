// images/successguide/*.JPEG (생성 시각순 = 1~15) → public/shots/<slug>/thumb-wide.webp (1280x720)
import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const SRC = resolve(root, "..", "images", "successguide");

// 순서(1~15) → (슬러그, 포스트 파일명)
const SLUGS = [
  ["qnet", "큐넷-원서접수-시험일정"],
  ["comexcel", "컴퓨터활용능력-자격증-정리"],
  ["written-pass", "자격증-필기합격-유효기간"],
  ["korhistory", "한국사능력검정-급수-정리"],
  ["toeic", "토익-성적-유효기간-활용"],
  ["letter", "자기소개서-잘쓰는법-star"],
  ["interview", "면접-자주나오는질문-대응"],
  ["resume", "이력서-작성법-신입-경력"],
  ["jobposting", "채용공고-읽는법-직무정하기"],
  ["aptitude", "인적성-ncs-필기-준비"],
  ["study", "공부-잘하는법-인출-분산학습"],
  ["timemgmt", "시간관리-뽀모도로-생산성"],
  ["goals", "목표설정-smart-습관만들기"],
  ["jobchange", "이직-준비-체크리스트"],
  ["portfolio", "포트폴리오-만드는법"],
];

// 파일명(생성 시각) 오름차순 정렬 → 1~15 순서
const files = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png)$/i.test(f))
  .sort();

if (files.length !== SLUGS.length) {
  console.log(`⚠ 이미지 ${files.length}개 / 슬러그 ${SLUGS.length}개 — 개수 불일치`);
}

let ok = 0;
for (let i = 0; i < SLUGS.length && i < files.length; i++) {
  const [slug] = SLUGS[i];
  const outDir = resolve(root, "public/shots", slug);
  mkdirSync(outDir, { recursive: true });
  const info = await sharp(resolve(SRC, files[i]))
    .resize(1280, 720, { fit: "cover", position: "attention" })
    .webp({ quality: 82 })
    .toFile(resolve(outDir, "thumb-wide.webp"));
  console.log(`  ✓ ${i + 1} ${files[i]} → shots/${slug}/ (${(info.size / 1024).toFixed(0)}KB)`);
  ok++;
}
console.log(`\n완료: ${ok}/${SLUGS.length}`);
