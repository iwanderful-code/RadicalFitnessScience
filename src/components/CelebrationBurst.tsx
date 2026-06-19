import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface CelebrationBurstProps {
  badgeName: string;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  gravity: number;
  drag: number;
  spin: number;
  angle: number;
  fadeSpeed: number;
}

export default function CelebrationBurst({ badgeName, onComplete }: CelebrationBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Screen resizing
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Color palette to match Radical Slate Theme (Orange, Golden Amber, Chrome White)
    const colors = [
      "#FF5F15", // Radical Neon Orange
      "#FFA500", // Bright Gold
      "#FFD700", // Golden Yellow
      "#F5F5F5", // Slate Chrome Metallic
      "#FF4500", // Flame Vermilion
    ];

    // Helper to spawn a single explosion
    const createExplosion = (centerX: number, centerY: number, count = 80, power = 10) => {
      const bursts: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * power + 3;
        bursts.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (Math.random() * 2), // upward bias
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3.5 + 1.5,
          alpha: 1,
          gravity: 0.12,
          drag: 0.96 + Math.random() * 0.02,
          spin: (Math.random() - 0.5) * 0.1,
          angle: Math.random() * Math.PI,
          fadeSpeed: 0.008 + Math.random() * 0.007,
        });
      }
      return bursts;
    };

    // Helper to create rising rockets that will explode at the peak
    interface Rocket {
      x: number;
      y: number;
      vy: number;
      vx: number;
      targetY: number;
      color: string;
      trailCounter: number;
    }
    const rockets: Rocket[] = [];

    // Trigger initial central blast
    particles.push(...createExplosion(window.innerWidth / 2, window.innerHeight * 0.45, 120, 11));

    // Queue rocket launches from bottom-left and bottom-right
    const w = window.innerWidth;
    const h = window.innerHeight;

    rockets.push({
      x: w * 0.15,
      y: h,
      vy: -15 - Math.random() * 4,
      vx: 2 + Math.random() * 2,
      targetY: h * 0.3,
      color: "#FF5F15",
      trailCounter: 0,
    });

    rockets.push({
      x: w * 0.85,
      y: h,
      vy: -15 - Math.random() * 4,
      vx: -2 - Math.random() * 2,
      targetY: h * 0.3,
      color: "#FFA500",
      trailCounter: 0,
    });

    // Main animation loop
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.05; // slight deceleration

        // Draw rocket head
        ctx.beginPath();
        ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Draw trail particles
        r.trailCounter++;
        if (r.trailCounter % 2 === 0) {
          particles.push({
            x: r.x,
            y: r.y,
            vx: -r.vx * 0.2 + (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.2) * 2,
            color: "#FF5F15",
            size: Math.random() * 2 + 1,
            alpha: 0.8,
            gravity: 0.02,
            drag: 0.98,
            spin: 0,
            angle: 0,
            fadeSpeed: 0.03, // slow down faster
          });
        }

        // Explode condition
        if (r.vy >= 0 || r.y <= r.targetY || r.x < 0 || r.x > w) {
          particles.push(...createExplosion(r.x, r.y, 100, 12));
          rockets.splice(i, 1);
        }
      }

      // Handle Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        // Apply physics
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fadeSpeed;
        p.angle += p.spin;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Sparks can be square debris or stars
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;

        if (Math.random() > 0.5) {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // Draw standard spark star
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 1.5);
          ctx.lineTo(p.size * 0.4, -p.size * 0.4);
          ctx.lineTo(p.size * 1.5, 0);
          ctx.lineTo(p.size * 0.4, p.size * 0.4);
          ctx.lineTo(0, p.size * 1.5);
          ctx.lineTo(-p.size * 0.4, p.size * 0.4);
          ctx.lineTo(-p.size * 1.5, 0);
          ctx.lineTo(-p.size * 0.4, -p.size * 0.4);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      // Automatically stop and unmount when finished
      if (particles.length === 0 && rockets.length === 0) {
        onComplete();
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Secondary automatic clean up timer (safety fallback)
    const timeoutId = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none w-screen h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic interactive Canvas container */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full block" />

      {/* Screen flash light backdrop */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-[#FF5F15]/10 pointer-events-none"
      />

      {/* Futuristic Achievement HUD Toast overlay */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: [1, 1.05, 1], opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -40 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative pointer-events-auto bg-[#0A0A0A]/95 border-2 border-[#FF5F15] p-6 rounded-2xl shadow-[0_0_50px_rgba(255,95,21,0.4)] max-w-md text-center m-4 z-50 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5F15] to-transparent animate-pulse" />
        
        {/* Sparkles circle accent */}
        <div className="mx-auto w-14 h-14 bg-[#FF5F15]/10 border border-[#FF5F15]/30 rounded-full flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(255,95,21,0.2)]">
          🔥
        </div>

        <div className="text-[10px] font-mono text-[#FF5F15] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 animate-spin text-yellow-400" />
          RADICAL PROTOCOL COMPLETE
          <Sparkles className="w-3 h-3 animate-spin text-yellow-400" />
        </div>

        <h3 className="text-2xl font-black uppercase text-white tracking-tight italic mt-2">
          7-Day Milestone!
        </h3>

        <div className="bg-zinc-950/80 border border-white/5 rounded-xl p-3.5 my-3">
          <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-widest font-bold">UNLOCKED SYSTEM BADGE</span>
          <span className="text-sm font-black font-mono text-yellow-400 uppercase tracking-wide block mt-0.5">
            🏆 {badgeName}
          </span>
          <p className="text-[10px] font-mono text-zinc-400 leading-normal mt-1.5 uppercase">
            ESTABLISHED INDESTRUCTIBLE RECOMPOSITIONAL DISCIPLINE. THE TRIANGLE IS REINFORCED.
          </p>
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-[#FF5F15] hover:bg-orange-600 text-black font-black text-xs py-2.5 rounded-lg uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(255,95,21,0.2)] hover:shadow-[0_0_20px_rgba(255,95,21,0.4)]"
        >
          Acknowledge & Continue
        </button>
      </motion.div>
    </div>
  );
}
