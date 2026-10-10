"use client";

import { useEffect, useRef } from "react";

export default function CreativeMouseTracker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Only run on devices with fine pointer (mouse/trackpad)
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    const core = coreRef.current;

    if (!container || !spotlight || !core) return;

    let mouseX = -200;
    let mouseY = -200;
    let previousX = 0;
    let previousY = 0;
    let velocity = 0;
    let lastTime = performance.now();
    let hasMoved = false;
    let animationFrameId = 0;
    let disposed = false;

    const trails = trailRefs.current.filter(
      (item): item is HTMLDivElement => item !== null,
    );

    const trailPositions = trails.map(() => ({
      x: -200,
      y: -200,
    }));

    const setPosition = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!hasMoved) {
        hasMoved = true;
        trailPositions.forEach((pos) => {
          pos.x = mouseX;
          pos.y = mouseY;
        });
        container.style.opacity = "1";
      }

      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      const dx = mouseX - previousX;
      const dy = mouseY - previousY;
      const distance = Math.hypot(dx, dy);

      velocity = Math.min(distance / 25, 1);

      previousX = mouseX;
      previousY = mouseY;
      lastTime = now;
    };

    const onMouseLeave = () => {
      container.style.opacity = "0";
      hasMoved = false;
    };

    const onMouseEnter = () => {
      container.style.opacity = "1";
    };

    const animate = () => {
      if (disposed) return;

      if (hasMoved) {
        setPosition(core, mouseX, mouseY);
        setPosition(spotlight, mouseX, mouseY);

        // Smooth trailing particles
        trails.forEach((trail, index) => {
          const pos = trailPositions[index];
          const easing = Math.max(0.35 - index * 0.02, 0.06);

          pos.x += (mouseX - pos.x) * easing;
          pos.y += (mouseY - pos.y) * easing;

          setPosition(trail, pos.x, pos.y);

          const opacity = (1 - index / trails.length) * 0.55;
          trail.style.opacity = String(opacity);
        });

        // Dynamic glow and velocity fade
        velocity *= 0.94;
        core.style.opacity = String(0.7 + velocity * 0.3);
        spotlight.style.opacity = String(0.6 + velocity * 0.3);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-9999 overflow-hidden opacity-0 transition-opacity duration-300"
    >
      {/* Ambient soft glow spotlight */}
      <div
        ref={spotlightRef}
        className="mouse-spotlight fixed left-0 top-0 h-80 w-80 rounded-full"
      />

      {/* Fluid trail particles */}
      {Array.from({ length: 50 }, (_, item) => (
        <div
          key={item}
          ref={(element) => {
            trailRefs.current[item] = element;
          }}
          className="mouse-trail fixed left-0 top-0 rounded-full"
          style={{
            width: `${Math.max(8 - item * 0.4, 2)}px`,
            height: `${Math.max(8 - item * 0.4, 2)}px`,
          }}
        />
      ))}

      {/* Minimal clean center dot */}
      <div
        ref={coreRef}
        className="cursor-core pointer-events-none fixed left-0 top-0 h-2 w-2 rounded-full"
      />
    </div>
  );
}
