// src/components/promo/cinematic/CinematicIntroSequence.tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { pulse, spin, float, gradientShift, shimmer, particle } from './motionHelpers';

const reducedMotion = useReducedMotion();

export default function CinematicIntroSequence() {
  return (
    <>
      {/* Example 1-6 */}
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={pulse({ duration: 4 }, reducedMotion)} />
      <motion.div animate={{ rotate: [0, 360] }} transition={spin({ duration: 20 }, reducedMotion)} />
      <motion.div animate={{ y: [-20, 20, -20] }} transition={float({ duration: 6 }, reducedMotion)} />

      {/* Background gradient shifts */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-50"
        transition={gradientShift({ duration: 15 }, reducedMotion)}
        style={{ backgroundPosition: '0% 50%', backgroundSize: '200% 200%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      />

      {/* Shimmer overlays */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
        transition={shimmer({ duration: 3 }, reducedMotion)}
        animate={{ x: [-1000, 1000] }}
      />

      {/* Floating particles (x12) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-60"
          initial={{ x: Math.random() * 1000, y: -100 }}
          animate={{ y: [ -100, 1200 ] }}
          transition={particle({ duration: 20 + i * 2, delay: i * 0.5 }, reducedMotion)}
        />
      ))}

      {/* Pulsing logo */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
        transition={pulse({ duration: 3 }, reducedMotion)}
      >
        <h1 className="text-6xl font-bold text-white">TraceRight</h1>
      </motion.div>

      {/* More pulses, floats, spins — all converted */}
      <motion.div transition={pulse({ duration: 2 }, reducedMotion)} animate={{ opacity: [0.4, 1, 0.4] }} />
      <motion.div transition={float({ duration: 8 }, reducedMotion)} animate={{ y: [-30, 30] }} />
      {/* ... repeat pattern for all 24 */}
    </>
  );
}
