document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const CARD_OFFSET = 5;
  const CARD_SCALE_STEP = 0.075;

  const section = document.querySelector(".cards");
  const cards = gsap.utils.toArray(".card");

  if (!section || cards.length < 2) return;

  // Карточки движутся только вслед за прокруткой, поэтому при
  // уменьшенном движении отключаем лишь плавный скролл
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const transitions = cards.length - 1;

  // Положение карточки, которая стоит `depth` позиций позади верхней
  const stackPosition = (depth) => ({
    yPercent: -50 + depth * CARD_OFFSET,
    scale: 1 - depth * CARD_SCALE_STEP,
  });

  cards.forEach((card, index) => {
    gsap.set(card, { xPercent: -50, ...stackPosition(index) });
  });

  // Один шаг таймлайна равен смене одной карточки
  const tl = gsap.timeline({
    defaults: { duration: 1, ease: "none" },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * transitions}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  cards.slice(0, -1).forEach((card, step) => {
    tl.to(card, { yPercent: -200, rotationX: 35 }, step);

    cards.slice(step + 1).forEach((behind, depth) => {
      tl.to(behind, stackPosition(depth), step);
    });
  });
});
