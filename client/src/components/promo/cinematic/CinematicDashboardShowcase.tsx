// src/components/promo/cinematic/CinematicDashboardShowcase.tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from './useReducedMotion';
import { pulse, gradientShift } from './motionHelpers';

const reducedMotion = useReducedMotion();

export default function CinematicDashboardShowcase() {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={gradientShift({ duration: 20 }, reducedMotion)}
        style={{ backgroundSize: '400% 400%' }}
      />

      <motion.div
        animate={{ scale: [1, 1.05, 1], filter: ['blur(0px)', 'blur(4px)', 'blur(0px)'] }}
        transition={pulse({ duration: 6 }, reducedMotion)}
      >
        {/* Dashboard cards */}
      </motion.div>

      <motion.div transition={pulse({ duration: 4 }, reducedMotion)} animate={{ opacity: [0.6, 1, 0.6] }} />
      <motion.div transition={pulse({ duration: 5 }, reducedMotion)} animate={{ y: [-10, 10, -10] }} />
    </>
  );
}
