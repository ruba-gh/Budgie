(() => {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");
  const motion = document.querySelector(".motion-toggle");
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let motionOverride = null;
  try {
    motionOverride = localStorage.getItem("budgie-reduce-motion");
  } catch {}
  const applyMotion = () => {
    const reduced =
      motionOverride === null ? media.matches : motionOverride === "true";
    root.classList.toggle("reduce-motion", reduced);
    motion.setAttribute("aria-pressed", String(reduced));
    motion.textContent = reduced ? "Motion reduced" : "Reduce motion";
  };
  applyMotion();
  media.addEventListener("change", applyMotion);
  motion.addEventListener("click", () => {
    motionOverride = String(!root.classList.contains("reduce-motion"));
    try {
      localStorage.setItem("budgie-reduce-motion", motionOverride);
    } catch {}
    applyMotion();
  });
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  function closeMenu() {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menu.focus();
    }
  });
  window.matchMedia("(min-width:821px)").addEventListener("change", closeMenu);
  // No auto-rotation: people control the pace, including on keyboard and touch.
  const slides = [...document.querySelectorAll("[data-slide]")];
  const dots = [...document.querySelectorAll("[data-goto]")];
  let active = 1;
  const smallScreen = window.matchMedia("(max-width:820px)");
  function showSlide(index, announce = true) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const position =
        i === active
          ? "center"
          : i === (active + slides.length - 1) % slides.length
            ? "left"
            : i === (active + 1) % slides.length
              ? "right"
              : "hidden";
      slide.className = `hero-card position-${position}`;
      const hidden =
        position === "hidden" || (smallScreen.matches && position !== "center");
      slide.inert = hidden;
      slide.setAttribute("aria-hidden", String(hidden));
    });
    dots.forEach((dot, i) =>
      dot.setAttribute("aria-pressed", String(i === active)),
    );
    if (announce)
      document.querySelector("#carousel-status").textContent =
        `${active + 1} of ${slides.length}: ${slides[active].querySelector("h2").textContent}`;
  }
  document
    .querySelector(".carousel-prev")
    .addEventListener("click", () => showSlide(active - 1));
  document
    .querySelector(".carousel-next")
    .addEventListener("click", () => showSlide(active + 1));
  dots.forEach((dot) =>
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.goto))),
  );
  document.querySelector(".hero-carousel").addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      showSlide(active + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  showSlide(active, false);
  smallScreen.addEventListener("change", () => showSlide(active, false));
  // Make deep links into collapsed content open the relevant disclosures first.
  function revealTarget(hash) {
    if (!hash || hash === "#") return;
    let target;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return;
    }
    if (!target) return;
    for (
      let parent = target.parentElement;
      parent;
      parent = parent.parentElement
    ) {
      if (parent.tagName === "DETAILS") parent.open = true;
    }
    target.closest(".reveal")?.classList.remove("pending");
    requestAnimationFrame(() =>
      target.scrollIntoView({
        behavior: root.classList.contains("reduce-motion")
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
  }
  document.addEventListener("click", (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor && anchor.hash) revealTarget(anchor.hash);
  });
  window.addEventListener("hashchange", () => revealTarget(location.hash));
  if (location.hash) revealTarget(location.hash);
  // Progressive enhancement: content is visible if JavaScript/observer support is unavailable.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("pending");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.05 },
    );
    document
      .querySelectorAll("main > section:not(.hero-section) > .container")
      .forEach((element) => {
        element.classList.add("reveal");
        if (element.getBoundingClientRect().top > window.innerHeight)
          element.classList.add("pending");
        observer.observe(element);
      });
  }
  const dialog = document.querySelector(".image-dialog");
  let lastImageLink;
  document.querySelectorAll(".screen-link").forEach((link) =>
    link.addEventListener("click", (e) => {
      if (typeof dialog.showModal !== "function") return;
      e.preventDefault();
      lastImageLink = link;
      dialog.querySelector("img").src = link.href;
      dialog.querySelector("img").alt = link.querySelector("img").alt;
      dialog.querySelector("p").textContent = link.querySelector("img").alt;
      dialog.showModal();
    }),
  );
  dialog
    .querySelector("button")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (
        e.clientX < box.left ||
        e.clientX > box.right ||
        e.clientY < box.top ||
        e.clientY > box.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("close", () => lastImageLink?.focus());
  document.querySelector("#year").textContent = new Date().getFullYear();
  const config = window.BUDGIE_CONFIG || {};
  if (
    config.appStoreUrl &&
    /^https:\/\/apps\.apple\.com\//.test(config.appStoreUrl)
  ) {
    document.querySelectorAll(".app-store-link").forEach((link) => {
      link.href = config.appStoreUrl;
      link.hidden = false;
    });
  }
  // Activate the promo only when real files have been supplied in site-config.js.
  if (config.promoVideo?.src) {
    const section = document.createElement("section");
    section.id = "video";
    const wrap = document.createElement("div");
    wrap.className = "container";
    const title = document.createElement("h2");
    title.textContent = "See Budgie in action.";
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.src = config.promoVideo.src;
    if (config.promoVideo.poster) video.poster = config.promoVideo.poster;
    video.style.cssText = "width:100%;margin-top:32px;border-radius:24px";
    wrap.append(title, video);
    section.append(wrap);
    document.querySelector("#app").after(section);
  }
})();
