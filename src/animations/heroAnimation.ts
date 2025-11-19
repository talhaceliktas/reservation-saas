import gsap from "gsap";

export function heroAnimation() {
  const tl = gsap.timeline();

  tl.from(".hero-badge", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    ease: "power3.out",
  })
    .from(".hero-title", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "back.out(1.7)",
    })
    .from(".hero-desc", { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
    .from(
      ".hero-btns",
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.2"
    );
}
