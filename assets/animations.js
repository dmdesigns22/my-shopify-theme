document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── Product card stagger reveal ─────────────────────────────────────── */
  const productLists = document.querySelectorAll('.product-list, [class*="product-grid"]');

  // Collect all product cards — works whether they're in a grid or not
  const cards = document.querySelectorAll('.product-card');

  if (cards.length === 0) return;

  // Set initial hidden state immediately so there's no flash
  gsap.set(cards, { opacity: 0, y: 40, scale: 0.96 });

  // Group cards by their parent container so each container staggers independently
  const groups = new Map();
  cards.forEach((card) => {
    const parent = card.closest('ul, ol, div[class*="grid"], .product-list__products') || card.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(card);
  });

  groups.forEach((groupCards) => {
    ScrollTrigger.create({
      trigger: groupCards[0].parentElement,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(groupCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: {
            amount: 0.5,   // total stagger spread across all cards
            from: 'start',
          },
        });
      },
    });
  });
});
