// 祝日の由来：国民の祝日16の日付・意味（祝日法の趣旨）・日の決め方・昔の名前と、振替休日などの休みのきまりを当てる。
// 日付・意味は内閣府「国民の祝日について」（祝日法 第2条・第3条）、昔の日付・名前は英語版 Wikipedia「Public holidays in Japan」で確かめたもの（README の出典）。
(function (root) {
  "use strict";
  const LV = ["やさしい", "ふつう", "むずかしい"];
  // 組（練習の組・祝日の帳の分け方）
  const AREAS = ["冬の祝日（1・2月）", "春の祝日（3〜5月）", "夏の祝日（7・8月）", "秋の祝日（9〜11月）", "休みのきまり"];
  const WD = ["日", "月", "火", "水", "木", "金", "土"];

  // ---- 国民の祝日（祝日法 第2条）----
  // [名前, 読み, 月, 決め方 f=毎年同じ日付・w=第N月曜日・e=春分日/秋分日・s=政令で定める日, 日（w は第N）, 意味（祝日法の文のまま）, 意味の中の言葉（穴うめ）, 昔の日付・名前（出典にあるものだけ）]
  const HD = [
    ["元日", "がんじつ", 1, "f", 1, "年のはじめを祝う。", "年のはじめ", ""],
    ["成人の日", "せいじんのひ", 1, "w", 2, "おとなになったことを自覚し、みずから生き抜こうとする青年を祝いはげます。", "おとな", "前は1月15日。2000年から1月の第2月曜日に"],
    ["建国記念の日", "けんこくきねんのひ", 2, "s", 11, "建国をしのび、国を愛する心を養う。", "国を愛する心", "1967年から。1872〜1948年の同じ日は紀元節"],
    ["天皇誕生日", "てんのうたんじょうび", 2, "f", 23, "天皇の誕生日を祝う。", "天皇の誕生日", "2019年より前は12月23日だった"],
    ["春分の日", "しゅんぶんのひ", 3, "e", 20, "自然をたたえ、生物をいつくしむ。", "生物", "1948年より前は春季皇霊祭"],
    ["昭和の日", "しょうわのひ", 4, "f", 29, "激動の日々を経て、復興を遂げた昭和の時代を顧み、国の将来に思いをいたす。", "復興", "2007年から。この日の祝日は、前はみどりの日という名前"],
    ["憲法記念日", "けんぽうきねんび", 5, "f", 3, "日本国憲法の施行を記念し、国の成長を期する。", "日本国憲法の施行", "1947年5月3日に日本国憲法が施行された"],
    ["みどりの日", "みどりのひ", 5, "f", 4, "自然に親しむとともにその恩恵に感謝し、豊かな心をはぐくむ。", "豊かな心", "前は4月29日。2007年から5月4日に"],
    ["こどもの日", "こどものひ", 5, "f", 5, "こどもの人格を重んじ、こどもの幸福をはかるとともに、母に感謝する。", "母", ""],
    ["海の日", "うみのひ", 7, "w", 3, "海の恩恵に感謝するとともに、海洋国日本の繁栄を願う。", "海洋国日本", "1996年から。前は7月20日"],
    ["山の日", "やまのひ", 8, "f", 11, "山に親しむ機会を得て、山の恩恵に感謝する。", "山に親しむ機会", "2016年から。いちばん新しくできた祝日"],
    ["敬老の日", "けいろうのひ", 9, "w", 3, "多年にわたり社会につくしてきた老人を敬愛し、長寿を祝う。", "長寿", "前は9月15日。老人の日から名前が変わった"],
    ["秋分の日", "しゅうぶんのひ", 9, "e", 23, "祖先をうやまい、なくなった人々をしのぶ。", "祖先", "1948年より前は秋季皇霊祭"],
    ["スポーツの日", "すぽーつのひ", 10, "w", 2, "スポーツを楽しみ、他者を尊重する精神を培うとともに、健康で活力ある社会の実現を願う。", "他者を尊重する精神", "前は体育の日・10月10日（東京オリンピックの開会式の日）"],
    ["文化の日", "ぶんかのひ", 11, "f", 3, "自由と平和を愛し、文化をすすめる。", "自由と平和", "1946年11月3日に日本国憲法が公布された日"],
    ["勤労感謝の日", "きんろうかんしゃのひ", 11, "f", 23, "勤労をたっとび、生産を祝い、国民たがいに感謝しあう。", "生産", "1948年より前の同じ日は新嘗祭"],
  ];
  const GRP = (m) => (m <= 2 ? 0 : m <= 5 ? 1 : m <= 8 ? 2 : 3);
  const ruleOf = (t, m, d) => (t === "f" ? `${m}月${d}日` : t === "w" ? `${m}月の第${d}月曜日` : t === "s" ? "政令で定める日（2月11日）" : m === 3 ? "春分日（3月20日ごろ）" : "秋分日（9月23日ごろ）");
  // 1年の中の並び（第N月曜日はその週のまん中、春分日・秋分日はおよその日）
  const ordOf = (t, m, d) => m * 100 + (t === "w" ? (d - 1) * 7 + 4 : d);
  const ITEMS = HD.map(([nm, yomi, m, t, d, mean, kw, old], no) => ({ no, g: GRP(m), nm, yomi, yomis: [yomi, nm], m, t, d, mean, kw, old, rule: ruleOf(t, m, d), ord: ordOf(t, m, d) }));
  // 休みのきまり（祝日法 第3条第2項・第3項）
  ITEMS.push({ no: 16, g: 4, nm: "振替休日", yomi: "ふりかえきゅうじつ", yomis: ["ふりかえきゅうじつ"], rule: "第3条第2項", mean: "祝日が日曜日に当たるとき、その後のいちばん近い祝日でない日が休日になる。", kw: "", old: "" });
  ITEMS.push({ no: 17, g: 4, nm: "祝日にはさまれた日", yomi: "しゅくじつにはさまれたひ", yomis: ["しゅくじつにはさまれたひ"], rule: "第3条第3項", mean: "前の日と次の日が祝日の平日は、休日になる。", kw: "", old: "" });
  ITEMS.push({ no: 18, g: 4, nm: "祝日の無い月", yomi: "しゅくじつのないつき", yomis: ["しゅくじつのないつき"], rule: "6月・12月", mean: "国民の祝日が1つも無いのは6月と12月。", kw: "", old: "" });
  const BY = {}; for (const k of ITEMS) { k.ar = k.g; k.mi = AREAS[k.g]; BY[k.no] = k; }
  const IDS = ITEMS.map((k) => k.no);
  const HOL = ITEMS.slice(0, 16), ORD = HOL.slice().sort((a, b) => a.ord - b.ord);
  const TYPE = { f: "毎年同じ日付", w: "○月の第○月曜日", e: "春分日・秋分日", s: "政令で定める日" };
  // 昔のことの文に、もう一方の名前が出てくる組（選び肢にいっしょに出さない）
  const PAIR = { 5: 7, 7: 5 };
  const MON = HOL.filter((k) => k.t === "w");
  const FIX = HOL.filter((k) => k.t === "f" || k.t === "s");
  const cntOf = (m) => HOL.filter((k) => k.m === m).length;

  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  // ---- 絵：日めくりの1枚（帳に出す。問題には出さない）----
  const symHtml = (k) => {
    const top = k.g === 4 ? "休み" : `${k.m}月`, mid = k.g === 4 ? (k.no === 16 ? "振替" : k.no === 17 ? "はさみ" : "6・12") : k.t === "w" ? `第${k.d}月` : k.t === "e" ? `${k.d}日ごろ` : String(k.d);
    const fs = [...mid].length > 2 ? 15 : 26;
    return `<svg class="pic" viewBox="0 0 64 64" width="52" role="img" aria-label="${esc(k.nm)}・${esc(k.rule)}"><rect x="6" y="6" width="52" height="54" rx="6" fill="var(--card,#fff)" stroke="currentColor" stroke-width="2.5"/><rect x="6" y="6" width="52" height="16" rx="6" fill="currentColor"/><text x="32" y="19" text-anchor="middle" font-size="11" fill="var(--bg,#fff)" font-weight="700">${top}</text><text x="32" y="${fs > 20 ? 50 : 45}" text-anchor="middle" font-size="${fs}" fill="currentColor" font-weight="700">${esc(mid)}</text></svg>`;
  };
  const symLabel = (k) => `${k.nm}・${k.rule}`;

  function seedOf(str) { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function shuffled(arr, R) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // ---- 暦の計算 ----
  // M月1日が曜日 w のとき、第n月曜日は何日
  const nthMon = (w, n) => 1 + ((8 - w) % 7) + 7 * (n - 1);
  // 振替休日：日曜日の祝日 d（M月D日）の後で、いちばん近い祝日でない日
  const isHol = (m, d) => HOL.some((k) => (k.t === "f" || k.t === "s") && k.m === m && k.d === d);
  const furikae = (k) => { let d = k.d + 1; while (isHol(k.m, d)) d++; return d; };
  const CAL = []; // c・C：[祝日, M月1日の曜日]
  for (const k of MON) for (let w = 0; w < 7; w++) CAL.push([k, w]);
  const SAND = ["敬老の日が9月21日、秋分の日が9月23日の年。9月22日は？", "祝日と祝日のあいだに、平日が1日だけある。その日は？"];
  const SANDO = ["休日になる", "ふつうの平日", "国民の祝日になる", "振替休日になる"];

  // ---- 問題の形 ----
  // やさしい：a＝名前 → 意味／A＝意味 → 名前／d＝名前 → 月／D＝日付 → 名前／q＝月 → その月の祝日／x＝月曜日に決まっている祝日は？
  // ふつう：r＝名前 → 日付の決め方／t＝名前 → 決め方の種類／w＝意味の穴うめ／o＝昔のこと → 名前／n＝次に来る祝日／N＝前の祝日／z＝祝日の無い月／m＝その月の祝日の数／g＝同じ月の祝日
  // むずかしい：y＝意味 → 名前を入力／c＝M月1日の曜日 → 第N月曜日の日付／C＝日付 → M月1日の曜日／f＝振替休日の日付／h＝はさまれた日／b＝2つの祝日のあいだ／O＝名前 → 昔のこと
  const KIND = { a: 0, A: 0, d: 0, D: 0, q: 0, x: 0, r: 1, t: 1, w: 1, o: 1, n: 1, N: 1, z: 1, m: 1, g: 1, y: 2, c: 2, C: 2, f: 2, h: 2, b: 2, O: 2 };
  const QS = [], QBY = {}, POOL = [[], [], []];
  const addQ = (kd, key, no) => { const id = kd + key, q = { id, lv: KIND[kd], kd, no, key }; QS.push(q); QBY[id] = q; POOL[q.lv].push(id); };
  for (const kd of ["a", "A", "d", "D", "q", "r", "t", "w", "n", "N", "y"]) for (const k of HOL) addQ(kd, k.no, k.no);
  for (const k of MON) addQ("x", k.no, k.no);
  for (const kd of ["o", "O"]) for (const k of HOL) if (k.old) addQ(kd, k.no, k.no);
  [6, 12].forEach((m) => addQ("z", m, 18));
  for (let m = 1; m <= 12; m++) addQ("m", m, ORD.find((k) => k.m === m) ? ORD.find((k) => k.m === m).no : 18);
  for (const k of HOL) if (cntOf(k.m) === 2) addQ("g", k.no, k.no);
  CAL.forEach(([k], i) => { addQ("c", i, k.no); addQ("C", i, k.no); });
  FIX.forEach((k) => addQ("f", k.no, 16));
  SAND.forEach((_, i) => addQ("h", i, 17));
  for (let i = 1; i < ORD.length - 1; i++) addQ("b", ORD[i].no, ORD[i].no);
  const DIM = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const md = (m, d) => `${m}月${d}日`;

  // 選び肢のしるし：h＝祝日の名前、m＝意味、M＝月、s＝日付の決め方の文、t＝決め方の種類、w＝穴うめの言葉、o＝昔のこと、c＝数、D＝日（その月）、W＝曜日、z＝はさまれた日の答え
  function optHtml(o) { const l = optLabel(o); return `<span class="tx${[...l].length > 12 ? " lg" : ""}">${esc(l)}</span>`; }
  function optLabel(o) {
    const t = o[0], v = o.slice(2);
    if (t === "h") return BY[v].nm; if (t === "m") return BY[v].mean; if (t === "M") return v + "月"; if (t === "s") return v;
    if (t === "t") return TYPE[v]; if (t === "w") return BY[v].kw; if (t === "o") return BY[v].old; if (t === "c") return v === "0" ? "0（無い）" : v + "つ";
    if (t === "D") { const [m, d] = v.split("/"); return md(m, d); } if (t === "W") return WD[v] + "曜日"; if (t === "z") return SANDO[v];
    return o;
  }
  const H = (k) => "h:" + k.no;
  const near = (k, R, pool) => { const s = shuffled(pool.filter((x) => x !== k), R); return s.sort((a, b) => Math.abs(a.ord - k.ord) - Math.abs(b.ord - k.ord)); };
  function optsOf(id) {
    const q = QBY[id]; if (q.kd === "y") return [];
    const R = rng(seedOf("opt:" + id)), k = BY[q.no];
    let ans, pick = [];
    const other = (f) => shuffled(HOL.filter((x) => x !== k && f(x)), R);
    switch (q.kd) {
      case "a": ans = "m:" + k.no; pick = near(k, R, HOL).slice(0, 3).map((x) => "m:" + x.no); break;
      case "A": case "D": case "y": ans = H(k); pick = near(k, R, HOL).slice(0, 3).map(H); break;
      case "d": { ans = "M:" + k.m; const ms = shuffled([1, -1, 2, -2, 3, -3, 4, 5, 6].map((d) => ((k.m - 1 + d + 12) % 12) + 1), R); pick = [...new Set(ms)].filter((m) => m !== k.m).slice(0, 3).map((m) => "M:" + m); break; }
      case "q": ans = H(k); pick = other((x) => x.m !== k.m).sort((a, b) => Math.abs(a.m - k.m) - Math.abs(b.m - k.m)).slice(0, 3).map(H); break;
      case "x": ans = H(k); pick = other((x) => x.t !== "w").slice(0, 3).map(H); break;
      case "r": {
        ans = "s:" + k.rule;
        const v = [];
        if (k.t === "w") v.push(ruleOf("w", k.m, k.d === 2 ? 3 : 2), ruleOf("w", k.m, k.d === 2 ? 1 : 4));
        if (k.old && /^前は(\d+)月(\d+)日/.test(k.old)) v.push(k.old.match(/^前は(\d+月\d+日)/)[1]);
        if (k.t === "f" || k.t === "s") v.push(ruleOf("w", k.m, k.d <= 7 ? 1 : k.d <= 14 ? 2 : k.d <= 21 ? 3 : 4));
        for (const x of near(k, R, HOL)) v.push(x.rule);
        pick = [...new Set(v)].filter((s) => s !== k.rule).slice(0, 3).map((s) => "s:" + s); break;
      }
      case "t": ans = "t:" + k.t; pick = Object.keys(TYPE).filter((x) => x !== k.t).map((x) => "t:" + x); break;
      case "w": ans = "w:" + k.no; pick = other(() => true).slice(0, 3).map((x) => "w:" + x.no); break;
      case "o": case "O": { const os = other((x) => !!x.old && !(PAIR[k.no] === x.no)); ans = q.kd === "o" ? H(k) : "o:" + k.no; pick = os.slice(0, 3).map((x) => (q.kd === "o" ? H(x) : "o:" + x.no)); break; }
      case "n": case "N": {
        const i = ORD.indexOf(k), at = (j) => ORD[(j + 32) % 16], a = q.kd === "n" ? at(i + 1) : at(i - 1);
        ans = H(a); pick = shuffled([q.kd === "n" ? at(i - 1) : at(i + 1), q.kd === "n" ? at(i + 2) : at(i - 2), ...shuffled(HOL.filter((x) => x !== k && x !== a && x !== at(i - 1) && x !== at(i + 1) && x !== at(i + 2) && x !== at(i - 2)), R).slice(0, 1)], R).map(H); break;
      }
      case "z": ans = "M:" + q.key; pick = shuffled([1, 2, 3, 4, 5, 7, 8, 9, 10, 11], R).slice(0, 3).map((m) => "M:" + m); break;
      case "m": ans = "c:" + cntOf(q.key); pick = [0, 1, 2, 3].filter((n) => n !== cntOf(q.key)).map((n) => "c:" + n); break;
      case "g": { const a = HOL.find((x) => x !== k && x.m === k.m); ans = H(a); pick = other((x) => x.m !== k.m).sort((p, r) => Math.abs(p.m - k.m) - Math.abs(r.m - k.m)).slice(0, 3).map(H); break; }
      case "c": { const [h, w] = CAL[q.key], a = nthMon(w, h.d); ans = `D:${h.m}/${a}`; pick = shuffled([a - 7, a + 7, a - 1, a + 1, a + 6].filter((x) => x >= 1 && x <= 28), R).slice(0, 3).map((x) => `D:${h.m}/${x}`); break; }
      case "C": { const [, w] = CAL[q.key]; ans = "W:" + w; pick = shuffled([0, 1, 2, 3, 4, 5, 6].filter((x) => x !== w), R).slice(0, 3).map((x) => "W:" + x); break; }
      case "f": { const h = BY[q.key], a = furikae(h); ans = `D:${h.m}/${a}`; pick = shuffled([...new Set([h.d - 1, h.d + 1, h.d + 2, h.d + 3, h.d + 4, h.d + 7, h.d - 7, h.d - 2])].filter((x) => x !== a && x >= 1 && x <= DIM[h.m] && (a === h.d + 1 || x !== h.d - 1)), R).slice(0, 3).map((x) => `D:${h.m}/${x}`); break; }
      case "h": ans = "z:0"; pick = ["z:1", "z:2", "z:3"]; break;
      case "b": { const i = ORD.indexOf(k); ans = H(k); pick = shuffled(HOL.filter((x) => x !== k && x !== ORD[i - 1] && x !== ORD[i + 1]), R).sort((p, r) => Math.abs(p.ord - k.ord) - Math.abs(r.ord - k.ord)).slice(0, 3).map(H); break; }
    }
    return shuffled([ans, ...pick], R);
  }
  function ansKey(q) {
    const k = BY[q.no];
    switch (q.kd) {
      case "a": return "m:" + k.no; case "d": return "M:" + k.m; case "r": return "s:" + k.rule; case "t": return "t:" + k.t; case "w": return "w:" + k.no; case "O": return "o:" + k.no;
      case "n": case "N": { const i = ORD.indexOf(k); return H(ORD[(i + (q.kd === "n" ? 1 : -1) + 16) % 16]); }
      case "z": return "M:" + q.key; case "m": return "c:" + cntOf(q.key);
      case "g": return H(HOL.find((x) => x !== k && x.m === k.m));
      case "c": { const [h, w] = CAL[q.key]; return `D:${h.m}/${nthMon(w, h.d)}`; }
      case "C": return "W:" + CAL[q.key][1];
      case "f": { const h = BY[q.key]; return `D:${h.m}/${furikae(h)}`; }
      case "h": return "z:0"; case "y": return "";
      default: return H(k);
    }
  }
  // 問いの文（大きな字と、その下の小さな字）。h は画面に出す HTML、l は読み上げの文
  function ask(q) {
    const k = BY[q.no], tx = (s, c = "") => `<span class="tx${c}">${esc(s)}</span>`, big = (s, sub, c = "") => ({ h: tx(s, c), l: s, sub });
    switch (q.kd) {
      case "a": return big(k.nm, "この祝日の意味は？（祝日法の文）");
      case "A": return big(k.mean, "という意味の祝日は？", " long");
      case "d": return big(k.nm, "は、何月？");
      case "D": return big(k.rule, "の祝日は？");
      case "q": return big(`${k.m}月`, "にある祝日は？");
      case "x": return big("月曜日の祝日", "日付でなく「第○月曜日」に決まっている祝日は？");
      case "r": return big(k.nm, "の日は？（祝日法の決め方）");
      case "t": return big(k.nm, "の日の決め方は？");
      case "w": { const s = k.mean.replace(k.kw, "（　　）"); return big(s, `${k.nm}の意味。（　）に入る言葉は？`, " long"); }
      case "o": return big(k.old, "これは、どの祝日のこと？", " long");
      case "O": return big(k.nm, "について、正しいのは？");
      case "n": return big(k.nm, "の次に来る祝日は？（1年の中で）");
      case "N": return big(k.nm, "の前の祝日は？（1年の中で）");
      case "z": return big("祝日の無い月", "国民の祝日が1つも無い月は？（どちらか1つ）");
      case "m": return big(`${q.key}月`, "の国民の祝日はいくつ？");
      case "g": return big(k.nm, "と同じ月の祝日は？");
      case "y": return big(k.mean, "という意味の祝日は？（名前を入力）", " long");
      case "c": { const [h, w] = CAL[q.key]; return big(`${h.m}月1日が${WD[w]}曜日`, `の年。${h.nm}（${h.rule}）は？`); }
      case "C": { const [h, w] = CAL[q.key]; return big(`${h.nm}が${md(h.m, nthMon(w, h.d))}`, `の年。${h.m}月1日は何曜日？`); }
      case "f": { const h = BY[q.key]; return big(`${h.nm}（${md(h.m, h.d)}）が日曜日`, "その年、振替休日になる日は？"); }
      case "h": return big(SAND[q.key], "祝日法では？", " long");
      default: { const i = ORD.indexOf(k); return big(`${ORD[i - 1].nm}と${ORD[i + 1].nm}`, "のあいだにある祝日は？"); }
    }
  }
  // 1問：tag は「難しさ:問題の id|モードと日付…」
  function make(tag) {
    const m = String(tag).match(/^([012]):([a-zA-Z]\d+)\|/); if (!m || !QBY[m[2]] || QBY[m[2]].lv !== +m[1]) throw new Error("知らない問題 " + tag);
    const q = QBY[m[2]], k = BY[q.no], opts = optsOf(q.id), A = ask(q);
    return { tag, lv: q.lv, id: q.id, kd: q.kd, key: q.key, input: q.kd === "y", p: k, opts, ans: q.kd === "y" ? -1 : opts.indexOf(ansKey(q)), bigHtml: A.h, bigLabel: A.l, sub: A.sub };
  }
  // 入力の答え：全角・半角・ひらがな・中黒・空白をそろえて、読みか名前と比べる
  const norm = (s) => String(s || "").normalize("NFKC").replace(/[\s　・･.]/g, "").replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
  const okInput = (P, s) => P.p.yomis.some((y) => norm(y) === norm(s));
  // 入力のヒント（2回まで）：1回目は字数とはじめの字、2回目は半分の字
  function inputHint(P, n) {
    const y = [...P.p.yomi];
    if (n <= 1) return y.map((c, i) => (i === 0 ? c : "○")).join("");
    return y.map((c, i) => (i % 2 === 0 ? c : "○")).join("");
  }
  // 答えのあとに出す説明
  function facts(P) {
    const k = P.p, out = [];
    if (P.kd === "c" || P.kd === "C") {
      const [h, w] = CAL[P.key], f = nthMon(w, 1);
      out.push(`${h.m}月1日が${WD[w]}曜日なら、はじめの月曜日は${md(h.m, f)}。`);
      out.push(`第${h.d}月曜日は、そこから${h.d - 1}週あとの${md(h.m, nthMon(w, h.d))}。`);
      return out;
    }
    if (P.kd === "f") {
      const h = BY[P.key], a = furikae(h);
      out.push("祝日が日曜日なら、その後のいちばん近い祝日でない日が休み。");
      out.push(a === h.d + 1 ? `${h.nm}の次の日、${md(h.m, a)}が振替休日。` : `${md(h.m, h.d + 1)}〜は祝日が続くので、${md(h.m, a)}が振替休日。`);
      return out;
    }
    if (P.kd === "h") { out.push("前の日と次の日が祝日の平日は、休日になる（祝日法 第3条第3項）。"); return out; }
    if (P.kd === "z" || P.kd === "m") {
      const m = P.kd === "z" ? P.key : P.key, hs = HOL.filter((x) => x.m === m);
      if (P.kd === "z") out.push("国民の祝日が無いのは6月と12月。");
      else out.push(hs.length ? `${m}月は${hs.map((x) => x.nm).join("・")}。` : `${m}月は国民の祝日が無い（6月と12月）。`);
      return out;
    }
    out.push(`「${k.nm}」は${k.rule}。`);
    if (k.t === "w") out.push("第○月曜日に決めて、土日と合わせ3連休にする（ハッピーマンデー）。");
    if (k.t === "e") out.push("日付は国立天文台が前の年の2月に官報で知らせる。");
    if (k.t === "s") out.push("祝日法では「政令で定める日」。政令で2月11日と決めている。");
    if (k.old) out.push(k.old + "。");
    return out;
  }

  // 答えの見出し：名前と、その下の小さな字
  const titleOf = (P) => { const k = P.p; if (k.g === 4) return { nm: k.nm, sm: k.mean }; return { nm: `${k.nm}（${k.rule}）`, sm: k.mean }; };
  // まちがえた選び肢の説明（その選び肢が何だったか）
  function wrongNote(o) {
    const t = o[0], v = o.slice(2);
    if (t === "h" && BY[v]) return `${BY[v].nm}は${BY[v].rule}。`;
    if ((t === "m" || t === "w" || t === "o") && BY[v]) return `それは${BY[v].nm}。`;
    if (t === "s") { const x = HOL.find((h) => h.rule === v); return x ? `それは${x.nm}の日。` : ""; }
    if (t === "M") { const hs = HOL.filter((x) => x.m === +v); return hs.length ? `${v}月は${hs.map((x) => x.nm).join("・")}。` : `${v}月は祝日が無い。`; }
    return "";
  }

  // ---- 今日の5問・上級（日本時間の日付から。だれでも同じ）----
  const DAY = 864e5, EPOCH = "2026-11-07";
  const dayMs = (k) => Date.parse(k + "T00:00:00Z");
  const keyOf = (ms) => new Date(ms).toISOString().slice(0, 10);
  const dayIdx = (k) => Math.max(0, Math.round((dayMs(k) - dayMs(EPOCH)) / DAY));
  const CYC = {};
  function cycle(name, lv, c) {
    const key = name + lv + ":" + c; if (CYC[key]) return CYC[key];
    let a = shuffled(POOL[lv], rng(seedOf(name + ":" + lv + ":" + c)));
    // 前の周の後ろ半分は、次の周の後ろ半分へ回す（周のつなぎ目で同じ問題がすぐ戻らない）
    if (c > 0) { const prev = cycle(name, lv, c - 1), tail = new Set(prev.slice(-Math.floor(prev.length / 2))); a = [...a.filter((id) => !tail.has(id)), ...a.filter((id) => tail.has(id))]; }
    return (CYC[key] = a);
  }
  const nth = (name, lv, idx) => cycle(name, lv, Math.floor(idx / POOL[lv].length))[idx % POOL[lv].length];
  const LVS = [0, 0, 1, 1, 2];
  // その日のほかの問題と、祝日が重ならない問題を選ぶ（重なる問題は次の日へ回す）。並びの問題は一度ずつ使う
  const evOf = (id) => { const q = QBY[id]; return [q.kd === "f" ? q.key : q.kd === "h" ? "h" + q.key : "cC".includes(q.kd) ? "cal" + q.key : q.no]; }; // 振替休日はその祝日、曜日の計算は曜日の組ごとに数える
  const SIM = {};
  function simDay(name, lvs, i, avoidOf) {
    const S = SIM[name] || (SIM[name] = { days: [], ptr: [0, 0, 0], wait: [[], [], []] });
    while (S.days.length <= i) {
      const d = S.days.length, used = new Set(avoidOf ? avoidOf(d).flatMap(evOf) : []), out = [];
      const free = (id) => evOf(id).every((e) => !used.has(e));
      for (const lv of lvs) {
        const w = S.wait[lv], wi = w.findIndex(free);
        let id = wi >= 0 ? w.splice(wi, 1)[0] : null;
        for (let g = 0; id == null; g++) { if (g > 4 * POOL[lv].length) throw new Error("問題を選べない"); const x = nth(name, lv, S.ptr[lv]++); if (free(x)) id = x; else w.push(x); }
        for (const e of evOf(id)) used.add(e); out.push([lv, id]);
      }
      S.days.push(out);
    }
    return S.days[i];
  }
  const dayPick = (i) => simDay("day", LVS, i);
  const hardPick = (i) => simDay("hard", [2, 2, 2], i, (d) => dayPick(d).map((o) => o[1]));
  const dailyTags = (k) => dayPick(dayIdx(k)).map(([lv, id]) => `${lv}:${id}|d${k}`);
  const hardTags = (k) => hardPick(dayIdx(k)).map(([lv, id]) => `${lv}:${id}|h${k}`);

  const API = { titleOf, wrongNote, LV, AREAS, ITEMS, BY, IDS, HOL, ORD, QS, QBY, POOL, KIND, CAL, WD, TYPE, nthMon, furikae, optsOf, optHtml, optLabel, ansKey, symHtml, symLabel, ask, make, norm, okInput, inputHint, facts, seedOf, rng, shuffled, dailyTags, hardTags, dayIdx, EPOCH, dayMs, keyOf, evOf };
  if (typeof module === "object" && module.exports) module.exports = API;
  root.SHUKU = API;
})(typeof window !== "undefined" ? window : globalThis);
