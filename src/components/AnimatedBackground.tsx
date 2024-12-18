import { useEffect, useRef } from "react";
import gsap from "gsap";

export const AnimatedBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const b1 = `
  linear-gradient(217deg, rgba(24,24,25,0.85), rgba(18,18,20,0.1) 70%),
  linear-gradient(127deg, rgba(20,20,25,0.8), rgba(15,15,20,0.05) 70%),
  linear-gradient(336deg, rgba(30,30,35,0.9), rgba(18,18,22,0.1) 70%)
`;

        const b2 = `
  linear-gradient(17deg, rgba(35,35,40,0.8), rgba(25,25,30,0.05) 70%),
  linear-gradient(200deg, rgba(40,40,45,0.75), rgba(30,30,35,0.05) 70%),
  linear-gradient(336deg, rgba(24,24,28,0.7), rgba(18,18,22,0.1) 70%)
`;

        const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0 });
        tl.set(containerRef.current, { background: b1 })
            .to(containerRef.current, {
                duration: 6,
                ease: "none",
                background: b2,
            })
            .play(0);
    })

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
            }}
            className="max-md:hidden"
        />
    );
};
