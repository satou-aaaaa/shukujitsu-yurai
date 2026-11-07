// アプリのアイコン（icon-192.png・icon-512.png と、切り抜かれても欠けない icon-maskable-512.png）を作る。生成りの地に、朱の日めくりと「祝」「由来」の字。
// maskable は中央の円（直径の80%）の中に全部が入るよう、絵を0.78倍に縮める（https://web.dev/articles/maskable-icon）
// 使い方: node tools/make-icons.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const [s, name, k] of [[192, "icon-192.png", 1], [512, "icon-512.png", 1], [512, "icon-maskable-512.png", 0.78]]) {
    const p = await b.newPage({ viewport: { width: s, height: s } });
    await p.setContent(`<body style="margin:0"><svg width="${s}" height="${s}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f2ecdf"/><g transform="translate(50 50) scale(${k}) translate(-50 -50)">
      <rect x="18" y="14" width="64" height="72" rx="8" fill="#fff" stroke="#a83a1c" stroke-width="5"/>
      <rect x="18" y="14" width="64" height="20" rx="8" fill="#a83a1c"/><rect x="18" y="26" width="64" height="8" fill="#a83a1c"/>
      <text x="50" y="30" font-size="13" font-weight="700" text-anchor="middle" fill="#fff" font-family="Noto Sans CJK JP,sans-serif">祝</text>
      <text x="50" y="70" font-size="25" font-weight="900" text-anchor="middle" fill="#211c16" font-family="Noto Serif CJK JP,serif">由来</text>
      </g></svg></body>`);
    await p.screenshot({ path: path.join(__dirname, "..", name), clip: { x: 0, y: 0, width: s, height: s } });
  }
  await b.close();
})();
