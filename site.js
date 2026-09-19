(() => {
  "use strict";
  const root = document.documentElement;
  root.classList.add("js");
  const motion = document.querySelector(".motion-toggle");
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  let choice = null;
  try {
    choice = localStorage.getItem("budgie-reduce-motion");
  } catch {}
  const applyMotion = () => {
    const reduced = choice === null ? media.matches : choice === "true";
    root.classList.toggle("reduce-motion", reduced);
    motion?.setAttribute("aria-pressed", String(reduced));
    if (motion)
      motion.textContent = reduced ? "Motion reduced" : "Reduce motion";
    const status = document.querySelector("#preference-status");
    if (status)
      status.textContent =
        choice === null
          ? "Using your device’s setting. No preference is saved."
          : `Saved choice: ${reduced ? "reduced motion" : "standard motion"}.`;
  };
  applyMotion();
  media.addEventListener("change", applyMotion);
  motion?.addEventListener("click", () => {
    choice = String(!root.classList.contains("reduce-motion"));
    try {
      localStorage.setItem("budgie-reduce-motion", choice);
    } catch {}
    applyMotion();
  });
  document.querySelector("#reset-preference")?.addEventListener("click", () => {
    try {
      localStorage.removeItem("budgie-reduce-motion");
    } catch {}
    choice = null;
    applyMotion();
  });
  const menu = document.querySelector(".menu-toggle"),
    nav = document.querySelector("#primary-nav");
  const closeMenu = () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  };
  menu.addEventListener("click", () => {
    menu.setAttribute("aria-expanded", String(nav.classList.toggle("open")));
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
  matchMedia("(min-width:821px)").addEventListener("change", closeMenu);
  const slides = [...document.querySelectorAll("[data-slide]")],
    dots = [...document.querySelectorAll("[data-goto]")];
  const small = matchMedia("(max-width:820px)");
  let active = 1;
  function showSlide(index, announce = true) {
    if (!slides.length) return;
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const pos =
        i === active
          ? "center"
          : i === (active + slides.length - 1) % slides.length
            ? "left"
            : i === (active + 1) % slides.length
              ? "right"
              : "hidden";
      slide.className = `hero-card position-${pos}`;
      const hidden = pos === "hidden" || (small.matches && pos !== "center");
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
    ?.addEventListener("click", () => showSlide(active - 1));
  document
    .querySelector(".carousel-next")
    ?.addEventListener("click", () => showSlide(active + 1));
  dots.forEach((dot) =>
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.goto))),
  );
  document.querySelector(".hero-carousel")?.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      showSlide(active + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  showSlide(active, false);
  small.addEventListener("change", () => showSlide(active, false));
  document.querySelectorAll("[data-story]").forEach((button) =>
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.story);
      if (!dialog) return;
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
        dialog.addEventListener("close", () => button.focus(), { once: true });
      } else {
        dialog.setAttribute("open", "");
        dialog.scrollIntoView();
      }
    }),
  );
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog
      .querySelector(".dialog-close")
      .addEventListener("click", () =>
        typeof dialog.close === "function"
          ? dialog.close()
          : dialog.removeAttribute("open"),
      );
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        const b = dialog.getBoundingClientRect();
        if (
          e.clientX < b.left ||
          e.clientX > b.right ||
          e.clientY < b.top ||
          e.clientY > b.bottom
        )
          dialog.close();
      }
    });
  });
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
      .querySelectorAll(
        "main>section:not(.hero-section):not(.policy-hero)>.container,.policy-section",
      )
      .forEach((el) => {
        el.classList.add("reveal");
        if (el.getBoundingClientRect().top > innerHeight)
          el.classList.add("pending");
        observer.observe(el);
      });
  }
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
  const storeUrl = window.BUDGIE_CONFIG?.appStoreUrl;
  if (storeUrl && /^https:\/\/apps\.apple\.com\//.test(storeUrl))
    document.querySelectorAll(".app-store-link").forEach((a) => {
      a.href = storeUrl;
      a.hidden = false;
    });
})();
