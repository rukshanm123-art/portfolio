(() => {
  // ==========================
  // EmailJS CONFIG
  // ==========================
  const EMAILJS_PUBLIC_KEY = "chlrHgrxRpQ3_XAV9";
  const EMAILJS_SERVICE_ID = "service_1g6prb3";
  const EMAILJS_TEMPLATE_ID = "template_8rqtnzr";

  // ---------- Year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // ---------- Theme ----------
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const drawerTheme = document.getElementById("drawerTheme");
  const themeIcon = document.getElementById("themeIcon");

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  } else {
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
    root.setAttribute("data-theme", prefersLight ? "light" : "dark");
  }

  const syncIcon = () => {
    const t = root.getAttribute("data-theme") || "dark";
    if (themeIcon) themeIcon.textContent = t === "light" ? "☀️" : "⚡";
  };
  syncIcon();

  const toggleTheme = () => {
    const current = root.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncIcon();
  };

  themeToggle?.addEventListener("click", toggleTheme);
  drawerTheme?.addEventListener("click", toggleTheme);

  // ---------- Smooth scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ---------- Active nav highlighting ----------
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach(a => {
      const href = a.getAttribute("href");
      a.classList.toggle("active", href === `#${id}`);
    });
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(en => en.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, { threshold: [0.25, 0.5, 0.75] });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ---------- Scroll progress ----------
  const scrollBar = document.getElementById("scrollBar");
  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = `${p}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Drawer ----------
  const drawer = document.getElementById("drawer");
  const openDrawer = document.getElementById("openDrawer");
  const closeDrawer = document.getElementById("closeDrawer");

  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  };

  openDrawer?.addEventListener("click", () => setDrawer(true));
  closeDrawer?.addEventListener("click", () => setDrawer(false));
  drawer?.addEventListener("click", (e) => { if (e.target === drawer) setDrawer(false); });

  document.querySelectorAll("[data-drawer]").forEach(a => {
    a.addEventListener("click", () => setDrawer(false));
  });

  // ---------- Reveal ----------
  const revealEls = document.querySelectorAll("[data-reveal]");
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("revealed");
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));

  // ---------- Animate skill bars ----------
  const barFills = document.querySelectorAll(".bar__fill");
  const barsObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const fill = en.target;
      const w = fill.style.getPropertyValue("--w") || "70%";
      fill.animate([{ width: "0%" }, { width: w }], {
        duration: 900,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "forwards"
      });
      barsObs.unobserve(fill);
    });
  }, { threshold: 0.35 });
  barFills.forEach(f => barsObs.observe(f));

  // ---------- Project Modal ----------
  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modalClose");
  const modalX = document.getElementById("modalX");
  const mTitle = document.getElementById("mTitle");
  const mStack = document.getElementById("mStack");
  const mDesc = document.getElementById("mDesc");
  const mLinks = document.getElementById("mLinks");

  const openModal = (data) => {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (mTitle) mTitle.textContent = data.title || "Project";
    if (mStack) mStack.textContent = data.stack || "";
    if (mDesc) mDesc.textContent = data.desc || "";

    if (mLinks) {
      mLinks.innerHTML = "";
      const links = Array.isArray(data.links) ? data.links : [];
      if (!links.length) {
        const span = document.createElement("div");
        span.className = "muted";
        span.style.fontWeight = "800";
        span.textContent = "No external links added yet.";
        mLinks.appendChild(span);
      } else {
        links.forEach(l => {
          const a = document.createElement("a");
          a.className = "btn btn--primary";
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.href = l.url;
          a.textContent = l.label;
          mLinks.appendChild(a);
        });
      }
    }
  };

  const closeModalFn = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  modalClose?.addEventListener("click", closeModalFn);
  modalX?.addEventListener("click", closeModalFn);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setDrawer(false);
      closeModalFn();
    }
  });

  document.querySelectorAll("[data-project]").forEach(btn => {
    btn.addEventListener("click", () => {
      const data = {
        title: btn.getAttribute("data-title"),
        desc: btn.getAttribute("data-desc"),
        stack: btn.getAttribute("data-stack"),
        links: JSON.parse(btn.getAttribute("data-links") || "[]")
      };
      openModal(data);
    });
  });

  // ---------- TERMINAL ----------
  const termBody = document.getElementById("termBody");
  const termForm = document.getElementById("termForm");
  const termInput = document.getElementById("termInput");

  const writeLine = (html, cls = "term-line") => {
    if (!termBody) return;
    const div = document.createElement("div");
    div.className = cls;
    div.innerHTML = html;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  };

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));

  const terminalHelp = () => {
    writeLine(`<span class="term-ok">Available commands:</span>`);
    writeLine(`<span class="term-muted">help</span> — show commands`);
    writeLine(`<span class="term-muted">projects</span> — list highlighted projects`);
    writeLine(`<span class="term-muted">skills</span> — show key skills`);
    writeLine(`<span class="term-muted">contact</span> — show contact links`);
    writeLine(`<span class="term-muted">case</span> — open Wiley case study`);
    writeLine(`<span class="term-muted">airwayai</span> — open AirwayAI case study`);
    writeLine(`<span class="term-muted">clear</span> — clear terminal`);
  };

  const runCmd = (raw) => {
    const cmd = (raw || "").trim().toLowerCase();
    if (!cmd) return;

    writeLine(`<span class="term-muted">$</span> ${escapeHtml(raw)}`);

    switch (cmd) {
      case "help":
        terminalHelp();
        break;

      case "projects":
        writeLine(`<span class="term-ok">Projects:</span>`);
        writeLine(`• <b>Car Rental System (MSE800)</b> — <a href="https://github.com/rukshanm123-art/mse800-car-rental-system" target="_blank" rel="noopener noreferrer">repo</a>`);
        writeLine(`• <b>AirwayAI — Lung Cancer Detection</b> — <a href="case-studies/airwayai.html">open case study</a>`);
        writeLine(`• <b>UI Dashboards</b> — add screenshots to turn into a case study`);
        break;

      case "skills":
        writeLine(`<span class="term-ok">Skills:</span>`);
        writeLine(`• Service Desk / IT Support • Incident handling • Troubleshooting`);
        writeLine(`• Documentation • Communication • Workflow thinking`);
        writeLine(`• Frontend UI • JavaScript • Debugging`);
        break;

      case "contact":
        writeLine(`<span class="term-ok">Contact:</span>`);
        writeLine(`• Email: <a href="mailto:rukshanm123@gmail.com">rukshanm123@gmail.com</a>`);
        writeLine(`• LinkedIn: <a href="https://www.linkedin.com/in/rukshan-de-silva99" target="_blank" rel="noopener noreferrer">rukshan-de-silva99</a>`);
        writeLine(`• GitHub: <a href="https://github.com/rukshanm123-art" target="_blank" rel="noopener noreferrer">rukshanm123-art</a>`);
        break;

      case "case":
      case "case-study":
      case "casestudy":
        writeLine(`<span class="term-ok">Opening Wiley case study…</span>`);
        setTimeout(() => window.location.href = "case-studies/wiley.html", 250);
        break;

      case "airwayai":
      case "ai":
      case "lung":
        writeLine(`<span class="term-ok">Opening AirwayAI case study…</span>`);
        setTimeout(() => window.location.href = "case-studies/airwayai.html", 250);
        break;

      case "clear":
        if (termBody) termBody.innerHTML = "";
        writeLine(`<span class="term-ok">Terminal cleared.</span>`);
        break;

      default:
        writeLine(`<span class="term-warn">Unknown command:</span> ${escapeHtml(cmd)}. Try <b>help</b>.`);
    }
  };

  // Boot terminal
  if (termBody) {
    writeLine(`<span class="term-ok">Welcome.</span> Type <b>help</b> to explore.`);
    writeLine(`<span class="term-muted">Tip:</span> Try <b>projects</b> then <b>airwayai</b>.`);
  }

  termForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!termInput) return;
    const value = termInput.value;
    termInput.value = "";
    runCmd(value);
  });

  // ---------- EmailJS ----------
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const sendBtn = document.getElementById("sendBtn");

  const setStatus = (msg, type = "info") => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color =
      type === "ok" ? "rgba(34,197,94,.95)" :
      type === "err" ? "rgba(255,95,87,.95)" :
      "var(--muted)";
  };

  const emailjsReady = () =>
    typeof emailjs !== "undefined" &&
    EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID;

  if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY) {
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (_) {}
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!emailjsReady()) {
      setStatus("Email form not configured yet. Check EmailJS keys in script.js.", "err");
      return;
    }

    const formData = new FormData(form);
    const params = {
      from_name: String(formData.get("from_name") || ""),
      reply_to: String(formData.get("reply_to") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || "")
    };

    if (!params.from_name || !params.reply_to || !params.subject || !params.message) {
      setStatus("Please fill all fields.", "err");
      return;
    }

    sendBtn && (sendBtn.disabled = true);
    setStatus("Sending…");

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
      setStatus("Message sent successfully ✅", "ok");
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus("Failed to send. Please try again later.", "err");
    } finally {
      sendBtn && (sendBtn.disabled = false);
    }
  });

  // ---------- Canvas Particle Network ----------
  const canvas = document.getElementById("bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const state = {
    w: 0, h: 0, dpr: Math.min(window.devicePixelRatio || 1, 2),
    pts: [],
    mouse: { x: null, y: null },
  };

  const rand = (min, max) => Math.random() * (max - min) + min;

  const resize = () => {
    state.w = window.innerWidth;
    state.h = window.innerHeight;
    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    canvas.style.width = `${state.w}px`;
    canvas.style.height = `${state.h}px`;
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  };

  const makePoints = () => {
    const count = Math.floor(Math.min(140, Math.max(70, state.w / 14)));
    state.pts = Array.from({ length: count }, () => ({
      x: rand(0, state.w),
      y: rand(0, state.h),
      vx: rand(-0.35, 0.35),
      vy: rand(-0.35, 0.35),
      r: rand(1.2, 2.2),
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, state.w, state.h);

    ctx.fillStyle = root.getAttribute("data-theme") === "light"
      ? "rgba(255,255,255,0.06)"
      : "rgba(0,0,0,0.10)";
    ctx.fillRect(0, 0, state.w, state.h);

    for (const p of state.pts) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = state.w + 20;
      if (p.x > state.w + 20) p.x = -20;
      if (p.y < -20) p.y = state.h + 20;
      if (p.y > state.h + 20) p.y = -20;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = root.getAttribute("data-theme") === "light"
        ? "rgba(0,0,0,0.35)"
        : "rgba(255,255,255,0.55)";
      ctx.fill();
    }

    const maxDist = 110;
    for (let i = 0; i < state.pts.length; i++) {
      for (let j = i + 1; j < state.pts.length; j++) {
        const a = state.pts[i], b = state.pts[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.18;
          ctx.strokeStyle = root.getAttribute("data-theme") === "light"
            ? `rgba(0,0,0,${alpha})`
            : `rgba(124,58,237,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    if (state.mouse.x != null && state.mouse.y != null) {
      const g = ctx.createRadialGradient(state.mouse.x, state.mouse.y, 0, state.mouse.x, state.mouse.y, 180);
      if (root.getAttribute("data-theme") === "light") {
        g.addColorStop(0, "rgba(124,58,237,0.12)");
        g.addColorStop(1, "rgba(124,58,237,0.0)");
      } else {
        g.addColorStop(0, "rgba(34,197,94,0.12)");
        g.addColorStop(1, "rgba(34,197,94,0.0)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, state.w, state.h);
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener("mousemove", (e) => {
    state.mouse.x = e.clientX;
    state.mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    state.mouse.x = null;
    state.mouse.y = null;
  });

  window.addEventListener("resize", () => {
    resize();
    makePoints();
  });

  resize();
  makePoints();
  draw();
})();