"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [maskPos, setMaskPos] = useState({ cx: 500, cy: 82 });

  // Idle animation: sweeps automatically across the large name when not hovering
  useEffect(() => {
    if (hovered) return;
    let frameId: number;
    const start = Date.now();

    const animateIdle = () => {
      const elapsed = (Date.now() - start) / 1000;
      // Gentle ambient sweep across the wide typography
      const x = 500 + Math.sin(elapsed * 1.5) * 360;
      const y = 82 + Math.cos(elapsed * 2.1) * 20;
      setMaskPos({ cx: x, cy: y });
      frameId = requestAnimationFrame(animateIdle);
    };

    frameId = requestAnimationFrame(animateIdle);
    return () => cancelAnimationFrame(frameId);
  }, [hovered]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    // Convert client coordinates to exact SVG viewBox coordinates (0 to 1000, 0 to 165)
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 165;
    setMaskPos({ cx: x, cy: y });
    setHovered(true);
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 1000 165"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn("select-none uppercase cursor-pointer overflow-visible", className)}
    >
      <defs>
        {/* Glowing Aerospace Red Linear Gradient */}
        <linearGradient
          id="staraptorTextGradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="1000"
          y2="0"
        >
          <stop offset="0%" stopColor="#ff7973" />
          <stop offset="25%" stopColor="#EF5F5A" />
          <stop offset="50%" stopColor="#D04741" />
          <stop offset="75%" stopColor="#ad2822" />
          <stop offset="100%" stopColor="#ff524a" />
        </linearGradient>

        {/* Large Cursor & Ambient Tracking Radial Mask */}
        <radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="250"
          cx={maskPos.cx}
          cy={maskPos.cy}
        >
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="55%" stopColor="white" stopOpacity="0.85" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="1000"
            height="165"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>

      {/* 1. Base wireframe background stroke */}
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="central"
        strokeWidth="1.2"
        className="fill-transparent stroke-neutral-700/60 font-montserrat text-[118px] font-extrabold tracking-[0.02em]"
      >
        {text}
      </text>

      {/* 2. Drawing stroke line that animates when entering viewport */}
      <motion.text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="central"
        strokeWidth="1.6"
        className="fill-transparent stroke-[#EF5F5A]/80 font-montserrat text-[118px] font-extrabold tracking-[0.02em]"
        initial={{ strokeDashoffset: 2800, strokeDasharray: 2800 }}
        whileInView={{
          strokeDashoffset: 0,
          strokeDasharray: 2800,
        }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{
          duration: duration ?? 3.2,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>

      {/* 3. Glowing gradient text revealed by radial mask */}
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="central"
        mask="url(#textMask)"
        fill="url(#staraptorTextGradient)"
        stroke="url(#staraptorTextGradient)"
        strokeWidth="1.6"
        className="font-montserrat text-[118px] font-extrabold tracking-[0.02em] pointer-events-none transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0.9 }}
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, rgba(15, 15, 17, 0.4) 40%, rgba(208, 71, 65, 0.22) 100%)",
      }}
    />
  );
};
