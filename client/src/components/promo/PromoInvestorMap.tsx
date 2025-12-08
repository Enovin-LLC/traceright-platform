// src/components/promo/PromoInvestorMap.tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from './cinematic/useReducedMotion';
import { pulse, spin } from './cinematic/motionHelpers';

export default function PromoInvestorMap() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={pulse({ duration: 4 }, reducedMotion ?? false)}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={spin({ duration: 30 }, reducedMotion ?? false)}
      />

      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={pulse({ duration: 3 }, reducedMotion ?? false)}
      />
    </>
  );
}
