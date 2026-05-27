const header = document.querySelector("[data-header]");
const revealElements = document.querySelectorAll(".reveal");
const faqItems = document.querySelectorAll(".faq-item");
const registrationForm = document.querySelector("[data-registration-form]");
const submitButton = document.querySelector("[data-submit-button]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  });
});

const revealOnScroll = (
  elements,
  { threshold = 0.12, rootMargin = "0px 0px -6% 0px", stagger = false, staggerStep = 80 } = {},
) => {
  if (!elements.length) return;

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold, rootMargin },
  );

  elements.forEach((element, index) => {
    if (stagger) {
      element.style.transitionDelay = `${index * staggerStep}ms`;
    }

    observer.observe(element);
  });
};

const whyReveals = document.querySelectorAll("#why .reveal");
const otherReveals = [...revealElements].filter((element) => !element.closest("#why"));

revealOnScroll(document.querySelectorAll("section.section:not(#why)"), {
  threshold: 0.08,
  rootMargin: "0px 0px -4% 0px",
});
revealOnScroll(whyReveals, { threshold: 0.12, rootMargin: "0px 0px -5% 0px", stagger: true, staggerStep: 100 });
revealOnScroll(otherReveals, { stagger: true });

const closeFaqItem = (item) => {
  const trigger = item.querySelector(".faq-trigger");
  const panel = item.querySelector(".faq-panel");

  item.classList.remove("is-open");
  trigger?.setAttribute("aria-expanded", "false");
  if (panel) panel.style.maxHeight = "0px";
};

const openFaqItem = (item) => {
  const trigger = item.querySelector(".faq-trigger");
  const panel = item.querySelector(".faq-panel");

  item.classList.add("is-open");
  trigger?.setAttribute("aria-expanded", "true");
  if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
};

faqItems.forEach((item) => {
  const trigger = item.querySelector(".faq-trigger");

  trigger?.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");
    faqItems.forEach(closeFaqItem);
    if (!isOpen) openFaqItem(item);
  });
});

window.addEventListener(
  "resize",
  () => {
    document.querySelectorAll(".faq-item.is-open .faq-panel").forEach((panel) => {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    });
  },
  { passive: true },
);

registrationForm?.addEventListener("submit", () => {
  if (!registrationForm.checkValidity() || !submitButton) return;

  submitButton.classList.add("is-loading");
  submitButton.textContent = "שולחים...";
});
