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

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

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
