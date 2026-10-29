(() => {
  const { games, tech, skills, events } = window.PORTFOLIO;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- 作品ごとのモチーフ（SVG） ----------
  const S = 'fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
  const shapes = {
    gravityflip: `<svg viewBox="0 0 100 100" ${S}><path d="M30 42V10M18 22l12-12 12 12"/><path d="M70 58v32M58 78l12 12 12-12"/><rect x="40" y="40" width="20" height="20" fill="currentColor"/></svg>`,
    pentacore: `<svg viewBox="0 0 100 100" ${S}><path d="M50 8l40 29-15 47H25L10 37z"/><path d="M50 32l17 12-6 20H39l-6-20z" fill="currentColor"/></svg>`,
    petapeta: `<svg viewBox="0 0 100 100" ${S}><path d="M50 8l11 26 28 2-21 18 7 28-25-15-25 15 7-28-21-18 28-2z"/><path d="M72 72l18 18" /></svg>`,
    momentiummaze: `<svg viewBox="0 0 100 100" ${S}><path d="M10 10h80v80H10z"/><path d="M10 30h55M35 30v25M90 50H55v20M10 70h25v20M75 70v20"/><circle cx="22" cy="20" r="4" fill="currentColor"/></svg>`,
    canes: `<svg viewBox="0 0 100 100" ${S}><circle cx="50" cy="50" r="38"/><circle cx="50" cy="50" r="26"/><path d="M50 36v28M42 42h16M42 58h16"/></svg>`,
    rpg: `<svg viewBox="0 0 100 100" ${S}><path d="M80 10L38 52l10 10 42-42V10z"/><path d="M28 52l20 20M18 82l16-16"/><circle cx="16" cy="84" r="5" fill="currentColor"/></svg>`,
    puyo: `<svg viewBox="0 0 100 100" ${S}><circle cx="30" cy="70" r="16"/><circle cx="64" cy="70" r="16" fill="currentColor"/><circle cx="64" cy="36" r="16"/><circle cx="25" cy="66" r="3" fill="currentColor"/><circle cx="35" cy="66" r="3" fill="currentColor"/></svg>`,
    action2d: `<svg viewBox="0 0 100 100" ${S}><path d="M8 88h84M8 88V68h24v20M56 88V48h20v40"/><rect x="36" y="30" width="12" height="18" fill="currentColor"/><path d="M42 18v6"/></svg>`,
    xevious: `<svg viewBox="0 0 100 100" ${S}><path d="M50 10l18 50-18-10-18 10z"/><path d="M32 60L14 72M68 60l18 12M50 70v20"/><circle cx="50" cy="94" r="2" fill="currentColor"/></svg>`,
  };

  const img = (file, w) => `img/${encodeURIComponent(file)}`;

  const cover = (g, extra = "") => `
    <div class="cover${g.image ? " cover--img" : ""}" style="--h:${g.hue}">
      <span class="cover__no">GAME_${g.no}</span>
      ${g.award ? `<span class="badge badge--award">🏆 ${esc(g.award)}</span>` : g.badge ? `<span class="badge badge--info">${esc(g.badge)}</span>` : ""}
      ${
        g.image
          ? `<img class="cover__img${g.imageFit === "contain" ? " cover__img--contain" : ""}" src="${img(g.image, 960)}" srcset="${img(g.image, 640)} 640w, ${img(g.image, 960)} 960w, ${img(g.image, 1400)} 1400w" sizes="(max-width: 700px) 100vw, 760px" alt="" loading="lazy" decoding="async" />`
          : `<div class="cover__shape" style="color:hsl(${g.hue} 90% 72%)">${shapes[g.id] || ""}</div>`
      }
      <span class="cover__title">${esc(g.title)}</span>
      ${extra}
    </div>`;

  const linkBtns = (links, cls = "btn--sm") =>
    links
      .map(
        (l) =>
          `<a class="btn ${l.kind === "play" ? "btn--primary" : "btn--ghost"} ${cls}" href="${esc(l.url)}" target="_blank" rel="noopener">${
            l.kind === "play" ? "▶ " : ""
          }${esc(l.label)}</a>`,
      )
      .join("");

  // ---------- 注目作品 ----------
  const featured = games.find((g) => g.featured);
  if (featured) {
    $("#featured").innerHTML = `
      <article class="featured reveal" data-tags="${esc(featured.tags.join(" "))}">
        ${cover(featured)}
        <div class="featured__body">
          <p class="featured__kicker">FEATURED — ${esc(featured.engine)} / ${esc(featured.period)}</p>
          <h3>${esc(featured.title)}</h3>
          <p>${esc(featured.summary)}</p>
          <ul class="featured__points">${featured.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <div class="featured__actions">
            ${linkBtns(featured.links, "")}
            <button class="btn btn--ghost" type="button" data-open="${featured.id}">詳細</button>
          </div>
        </div>
      </article>`;
  }

  // ---------- 作品一覧 ----------
  const grid = $("#works-grid");
  grid.innerHTML = games
    .filter((g) => !g.featured)
    .map(
      (g) => `
      <li class="work" data-tags="${esc(g.tags.join(" "))}">
        <button class="work__btn" type="button" data-open="${g.id}" style="--h:${g.hue}" aria-label="${esc(g.title)} の詳細を開く">
          ${cover(g)}
          <div class="work__info">
            <div class="work__meta"><span>${esc(g.engine)}</span><span>${g.type === "solo" ? "個人制作" : "チーム制作"}</span><span>${esc(g.period)}</span></div>
            <p class="work__summary">${esc(g.summary)}</p>
            <span class="work__more">詳細を見る →</span>
          </div>
        </button>
      </li>`,
    )
    .join("") + `<li class="empty" hidden>該当する作品がありません。</li>`;

  // ---------- 絞り込み ----------
  document.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      document.querySelectorAll(".chip").forEach((c) => {
        const on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on);
      });
      let shown = 0;
      document.querySelectorAll(".work").forEach((w) => {
        const match = f === "all" || w.dataset.tags.split(" ").includes(f);
        w.classList.toggle("is-hidden", !match);
        if (match) {
          shown++;
          w.style.animation = "none";
          w.offsetHeight; // アニメーションを再生し直す
          w.style.animation = "";
        }
      });
      const feat = $(".featured");
      if (feat) feat.hidden = !(f === "all" || feat.dataset.tags.split(" ").includes(f));
      $(".empty").hidden = shown > 0 || (feat && !feat.hidden);
    }),
  );

  // ---------- 詳細モーダル ----------
  const modal = $("#work-modal");
  const openWork = (id) => {
    const g = games.find((x) => x.id === id);
    if (!g) return;
    $("#modal-body").innerHTML = `
      <button class="modal__close" type="button" aria-label="閉じる" data-close>✕</button>
      ${cover(g)}
      <div class="modal__content">
        <h3 id="modal-title" class="h2" style="font-size:clamp(24px,3.4vw,32px)">${esc(g.title)} <span class="dim" style="font-size:.5em;font-weight:500">${esc(g.kana)}</span></h3>
        <p>${esc(g.summary)}</p>
        ${
          g.video
            ? `<div><h4>プレイ動画</h4><div class="modal__video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(g.video)}?rel=0" title="${esc(g.title)} プレイ動画" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></div>`
            : ""
        }
        <dl class="modal__facts">
          <div><dt>ENGINE</dt><dd>${esc(g.engine)}</dd></div>
          <div><dt>TYPE</dt><dd>${g.type === "solo" ? "個人制作" : "チーム制作"}</dd></div>
          <div><dt>PERIOD</dt><dd>${esc(g.period)}</dd></div>
          ${g.award ? `<div><dt>AWARD</dt><dd>🏆 ${esc(g.award)}</dd></div>` : ""}
        </dl>
        <div><h4>担当</h4><ul>${g.role.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
        <div><h4>技術・工夫したポイント</h4><ul>${g.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>
        ${
          g.demos && g.demos.length
            ? `<section class="modal__demos"><h4>${g.id === "rpg" ? "バトルシステムの実装例" : g.id === "momentiummaze" ? "実装の工夫" : g.id === "action2d" ? "マップ生成と敵データの管理" : g.id === "puyo" ? "消去判定とゲーム処理の実装例" : "操作感への工夫 — GIFで見る"}</h4><div class="modal__demo-grid">${g.demos.map((d) => `<article class="modal__demo${d.wide ? " modal__demo--wide" : ""}${g.id === "pentacore" ? " modal__demo--pentacore" : ""}">${d.images ? `<div class="modal__demo-images">${d.images.map((item) => `<figure><img src="${img(item.image)}" alt="${esc(item.alt || item.caption)}" loading="lazy" decoding="async" /><figcaption>${esc(item.caption || "")}</figcaption></figure>`).join("")}</div>` : `<img src="${img(d.image)}" alt="${esc(d.title)}の資料画像" loading="lazy" decoding="async" />`}<div class="modal__demo-copy"><h5>${esc(d.title)}</h5><p>${esc(d.description)}</p></div></article>`).join("")}</div></section>`
            : ""
        }
        ${g.sheets && g.sheets.length ? `<section class="modal__sheets"><h4>企画・制作資料</h4>${[...new Set(g.sheets.map((x) => x.group))].map((group) => `<section class="modal__sheet-group"><h5>${esc(group)}</h5><div class="modal__sheet-grid">${g.sheets.filter((x) => x.group === group).map((sheet) => { const id = (sheet.url.match(/spreadsheets\/d\/([^/]+)/) || [])[1]; const preview = id ? `https://docs.google.com/spreadsheets/d/${id}/htmlembed?widget=true&headers=false` : sheet.url; return `<article class="modal__sheet"><div class="modal__sheet-frame"><iframe src="${esc(preview)}" title="${esc(sheet.title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="modal__sheet-copy"><h6>${esc(sheet.title)}</h6><p>${esc(sheet.description)}</p><a class="btn btn--ghost btn--sm" href="${esc(sheet.url)}" target="_blank" rel="noopener">Googleスプレッドシートで開く ↗</a></div></article>`; }).join("")}</div></section>`).join("")}</section>` : ""}
        ${g.links.length ? `<div class="modal__links">${linkBtns(g.links, "")}</div>` : ""}
      </div>`;
    modal.showModal();
    history.replaceState(null, "", `#work-${id}`);
  };
  // 画像をクリックすると拡大表示（GIFは元ファイルを直接表示してアニメーションを維持）
  const imageLightbox = document.createElement("dialog");
  imageLightbox.className = "image-lightbox";
  imageLightbox.setAttribute("aria-label", "画像の拡大表示");
  imageLightbox.innerHTML = `<button class="image-lightbox__close" type="button" aria-label="閉じる">✕</button><img alt="拡大画像" />`;
  document.body.appendChild(imageLightbox);
  const lightboxImage = imageLightbox.querySelector("img");
  const closeLightbox = imageLightbox.querySelector("button");
  closeLightbox.addEventListener("click", () => imageLightbox.close());
  imageLightbox.addEventListener("click", (e) => { if (e.target === imageLightbox) imageLightbox.close(); });

  document.addEventListener("click", (e) => {
    const demoImage = e.target.closest(".modal__demo > img");
    if (demoImage) {
      lightboxImage.src = demoImage.currentSrc || demoImage.src;
      lightboxImage.alt = demoImage.alt || "拡大画像";
      imageLightbox.showModal();
      return;
    }
    const t = e.target.closest("[data-open]");
    if (t) openWork(t.dataset.open);
    if (e.target.closest("[data-close]") || e.target === modal) modal.close();
  });
  modal.addEventListener("close", () => {
    $("#modal-body").innerHTML = ""; // 閉じたら動画の再生も止める
    history.replaceState(null, "", location.pathname);
  });
  if (location.hash.startsWith("#work-")) openWork(location.hash.slice(6));

  // ---------- 技術検証・スキル・イベント ----------
  $("#tech-grid").innerHTML = tech
    .map(
      (t, i) => `
      <article class="tech__card reveal">
        <div class="tech__viz"><canvas data-viz="${i}" aria-hidden="true"></canvas></div>
        <p class="tech__sub">${esc(t.sub)}</p>
        <h3>${esc(t.title)}</h3>
        <p>${esc(t.body)}</p>
        <span class="tech__stack">${esc(t.stack)}</span>
        <div class="tech__links">
          <a class="btn btn--primary btn--sm" href="${esc(t.slides)}" target="_blank" rel="noopener noreferrer">▶ スライド ↗</a>
          <a class="btn btn--ghost btn--sm" href="${esc(t.github)}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </article>`,
    )
    .join("");
  $("#skills-list").innerHTML = skills.map((s) => `<li><strong>${esc(s.name)}</strong><span>${esc(s.note)}</span></li>`).join("");
  $("#events-list").innerHTML = events
    .map(
      (ev) => `
      <li class="event${ev.image ? "" : " event--text"}">
        ${
          ev.image
            ? `<div class="event__media">
                <img src="${img(ev.image, 720)}" srcset="${img(ev.image, 480)} 480w, ${img(ev.image, 720)} 720w, ${img(ev.image, 1080)} 1080w"
                  sizes="(max-width: 700px) 100vw, 400px" alt="${esc(ev.name)}の様子" loading="lazy" decoding="async" />
                ${ev.video ? `<button class="event__play" type="button" data-video="${esc(ev.video)}" data-title="${esc(ev.name)}" aria-label="${esc(ev.name)} の発表動画を再生"><span aria-hidden="true">▶</span>発表動画</button>` : ""}
              </div>`
            : ""
        }
        <div class="event__body"><strong>${esc(ev.name)}</strong><span>${esc(ev.note)}</span></div>
      </li>`,
    )
    .join("");
  // 発表動画はポップアップで再生（開いたときだけ読み込む）
  const videoModal = $("#video-modal");
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-video]");
    if (b) {
      $("#video-title").textContent = `${b.dataset.title} 発表動画`;
      $("#video-frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${esc(b.dataset.video)}?rel=0&autoplay=1" title="${esc(b.dataset.title)} 発表動画" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      videoModal.showModal();
    }
    if (e.target.closest("[data-close-video]") || e.target === videoModal) videoModal.close();
  });
  videoModal.addEventListener("close", () => ($("#video-frame").innerHTML = ""));

  // ---------- スクロールで表示 ----------
  document.querySelectorAll(".section .h2, .section__head, .profile__card, .skills, .events").forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("is-in"), io.unobserve(en.target))),
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---------- canvas 共通 ----------
  const fit = (cv) => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    cv.width = r.width * dpr;
    cv.height = r.height * dpr;
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: r.width, h: r.height };
  };

  // ---------- ヒーロー：衝突 + 重力反転デモ ----------
  const hero = $("#physics");
  const heroSec = $(".hero");
  const flipBtn = $("#flip-btn");
  let H = fit(hero);
  let gravity = 1;
  const colors = ["#c8ff3e", "#ff5a36", "#eef0f5", "#7b8cff"];
  const balls = [];
  const addBall = (x, y) => {
    const r = 10 + Math.random() * 22;
    balls.push({ x, y, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 4, r, m: r * r, c: colors[balls.length % colors.length] });
    if (balls.length > 40) balls.shift();
  };
  for (let i = 0; i < 14; i++) addBall(H.w * (0.45 + Math.random() * 0.5), Math.random() * H.h * 0.6);

  const step = () => {
    const { ctx, w, h } = H;
    for (const b of balls) {
      b.vy += 0.35 * gravity;
      b.vx *= 0.999;
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < b.r) (b.x = b.r), (b.vx *= -0.85);
      if (b.x > w - b.r) (b.x = w - b.r), (b.vx *= -0.85);
      if (b.y > h - b.r) (b.y = h - b.r), (b.vy *= -0.6), (b.vx *= 0.98);
      if (b.y < b.r) (b.y = b.r), (b.vy *= -0.6), (b.vx *= 0.98);
    }
    // 球同士の衝突（めり込み解消 + 運動量の交換）
    for (let i = 0; i < balls.length; i++)
      for (let j = i + 1; j < balls.length; j++) {
        const a = balls[i], b = balls[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy), min = a.r + b.r;
        if (dist === 0 || dist >= min) continue;
        const nx = dx / dist, ny = dy / dist;
        const overlap = (min - dist) / 2;
        a.x -= nx * overlap; a.y -= ny * overlap;
        b.x += nx * overlap; b.y += ny * overlap;
        const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rel > 0) continue;
        const imp = (-(1 + 0.8) * rel) / (1 / a.m + 1 / b.m);
        a.vx -= (imp / a.m) * nx; a.vy -= (imp / a.m) * ny;
        b.vx += (imp / b.m) * nx; b.vy += (imp / b.m) * ny;
      }
    ctx.clearRect(0, 0, w, h);
    for (const b of balls) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.c;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  };

  let heroVisible = true;
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(heroSec);
  const heroLoop = () => {
    if (heroVisible) step();
    requestAnimationFrame(heroLoop);
  };
  if (reduceMotion) step();
  else heroLoop();

  heroSec.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    const r = hero.getBoundingClientRect();
    addBall(e.clientX - r.left, e.clientY - r.top);
    if (reduceMotion) step();
  });
  flipBtn.addEventListener("click", () => {
    gravity *= -1;
    flipBtn.setAttribute("aria-pressed", gravity < 0);
  });

  // ---------- 技術検証カードのミニデモ ----------
  const vizzes = [...document.querySelectorAll("[data-viz]")].map((cv) => ({ cv, i: +cv.dataset.viz, ...fit(cv) }));
  let t0 = performance.now();
  const drawViz = (now) => {
    const t = (now - t0) / 1000;
    for (const v of vizzes) {
      const { ctx, w, h, i } = v;
      ctx.clearRect(0, 0, w, h);
      if (i === 0) {
        // ビリヤード：手球が的球に当たって運動量が移る
        const p = (t % 3) / 3;
        const cx = h / 2, hitAt = 0.4;
        const ax = p < hitAt ? 20 + (w * 0.5 - 40) * (p / hitAt) : w * 0.5 - 20;
        const bx = p < hitAt ? w * 0.5 + 2 : w * 0.5 + 2 + (w * 0.5 - 30) * ((p - hitAt) / (1 - hitAt)) * (1 - ((p - hitAt) / (1 - hitAt)) * 0.4);
        ctx.fillStyle = "#eef0f5"; ctx.beginPath(); ctx.arc(ax, cx, 11, 0, 7); ctx.fill();
        ctx.fillStyle = "#ff5a36"; ctx.beginPath(); ctx.arc(Math.min(bx, w - 14), cx, 11, 0, 7); ctx.fill();
      } else if (i === 1) {
        // ばね：減衰振動
        const anchorX = w / 2, rest = h * 0.55;
        const y = 12 + rest + Math.cos(t * 3.2) * Math.exp(-(t % 4) * 0.6) * 28;
        ctx.strokeStyle = "#c8ff3e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(anchorX, 0);
        const coils = 10;
        for (let k = 1; k <= coils; k++) ctx.lineTo(anchorX + (k % 2 ? 10 : -10), (y - 12) * (k / (coils + 1)));
        ctx.lineTo(anchorX, y - 12); ctx.stroke();
        ctx.fillStyle = "#ff5a36"; ctx.beginPath(); ctx.arc(anchorX, y, 12, 0, 7); ctx.fill();
      } else {
        // リズムゲーム：時間ベース判定ライン
        const lanes = 4, lw = w / lanes, judge = h - 22;
        ctx.strokeStyle = "#262c3b";
        for (let k = 1; k < lanes; k++) { ctx.beginPath(); ctx.moveTo(lw * k, 0); ctx.lineTo(lw * k, h); ctx.stroke(); }
        ctx.fillStyle = "#c8ff3e"; ctx.fillRect(0, judge, w, 2);
        for (let n = 0; n < 8; n++) {
          const ny = ((t * 70 + n * 47) % (h + 40)) - 20;
          const lane = (n * 3) % lanes;
          const near = Math.abs(ny - judge) < 8;
          ctx.fillStyle = near ? "#ff5a36" : "#eef0f5";
          ctx.fillRect(lane * lw + 8, ny - 4, lw - 16, 8);
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawViz);
  };
  requestAnimationFrame(drawViz);

  addEventListener("resize", () => {
    H = fit(hero);
    vizzes.forEach((v) => Object.assign(v, fit(v.cv)));
  });
})();
