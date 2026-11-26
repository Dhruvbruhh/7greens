const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const header = $("#header");
addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 20));

const nav = $("#nav");
const toggle = $("#navToggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", open);
});
$$(".nav__link, .nav__cta").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
  })
);

const slides = $$(".hero__slide");
const dotsWrap = $("#heroDots");
if (slides.length > 1 && dotsWrap) {
  let current = 0;
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Slide ${i + 1}`);
    b.addEventListener("click", () => show(i));
    dotsWrap.appendChild(b);
  });
  const dots = $$("button", dotsWrap);

  function show(i) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }
  show(0);
  let heroTimer = setInterval(() => show(current + 1), 5000);
  dotsWrap.addEventListener("click", () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => show(current + 1), 5000);
  });
}

const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }),
  { threshold: 0.12 }
);
$$(".reveal").forEach((el) => io.observe(el));

const fmt = (n) => n.toLocaleString("en-IN");
const countIO = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countIO.unobserve(el);
    }),
  { threshold: 0.5 }
);
$$("[data-count]").forEach((el) => countIO.observe(el));

const form = $("#quoteForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  $$("input, textarea", form).forEach((f) => {
    if (f.required && !f.value.trim()) {
      f.classList.add("is-invalid");
      ok = false;
    } else if (f.type === "email" && f.value && !/^\S+@\S+\.\S+$/.test(f.value)) {
      f.classList.add("is-invalid");
      ok = false;
    } else {
      f.classList.remove("is-invalid");
    }
  });
  if (!ok) return;
  const d = new FormData(form);
  const msg =
    `New enquiry from 7greens.in%0A` +
    `Name: ${d.get("first")} ${d.get("last")}%0A` +
    `Phone: ${d.get("phone")}%0A` +
    `Email: ${d.get("email")}%0A%0A` +
    `${encodeURIComponent(d.get("message"))}`;
  window.open(`https://wa.me/919833804366?text=${msg}`, "_blank");
  $("#formNote").hidden = false;
  form.reset();
});

document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && !img.dataset.fallback) {
      img.dataset.fallback = "1";
      img.src =
        "https://images.pexels.com/photos/18829033/pexels-photo-18829033.jpeg?auto=compress&cs=tinysrgb&w=1600";
    }
  },
  true
);
