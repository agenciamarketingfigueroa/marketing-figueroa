const WHATSAPP_NUMBER = "5511999999999";

const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector("#contact-form");
const yearTarget = document.querySelector("#current-year");
const revealItems = document.querySelectorAll(".reveal");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const nome = String(formData.get("nome") || "").trim();
    const empresa = String(formData.get("empresa") || "").trim();
    const servico = String(formData.get("servico") || "").trim();
    const objetivo = String(formData.get("objetivo") || "").trim();

    const message = [
      "Ola, Marketing Figueroa.",
      `Meu nome e ${nome}.`,
      `Atuo em: ${empresa}.`,
      `Tenho interesse em: ${servico}.`,
      `Objetivo principal: ${objetivo}`,
      "Gostaria de receber uma proposta personalizada."
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
