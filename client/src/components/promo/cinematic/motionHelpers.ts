// src/components/promo/cinematic/motionHelpers.ts
import { Transition } from 'framer-motion';

export const useReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Containerized helpers — every single one auto-respects reduced motion
export const pulse = (config: Transition = {}, reducedMotion: boolean = false): Transition | undefined => {
  if (reducedMotion) return { duration: config.duration ?? 2 };
  return { ...config, repeat: Infinity, repeatType: 'reverse' };
};

export const spin = (config: Transition = {}, reducedMotion: boolean = false): Transition | undefined => {
  if (reducedMotion) return undefined;
  return { ...config, repeat: Infinity, repeatType: 'loop' };
};

export const float = (config: Transition = {}, reducedMotion: boolean = false): Transition | undefined => {
  if (reducedMotion) return undefined;
  return { ...config, repeat: Infinity, repeatType: 'reverse' };
};

export const gradientShift = (config: Transition = {}, reducedMotion: boolean = false): Transition | undefined => {
  if (reducedMotion) return undefined;
  return { ...config, repeat: Infinity, repeatType: 'loop' };
};

export const shimmer = (config: Transition = {}, reducedMotion: boolean = false): Transition | undefined => {
  if (reducedMotion) return undefined;
  return { ...config, repeat: Infinity, repeatType: 'loop' };
};

export const particle = (config: Transition = {}, reducedMotion: boolean = false): Transition | undefined => {
  if (reducedMotion) return undefined;
  return { ...config, repeat: Infinity, repeatType: 'loop' };
};

export const infiniteLoop = (config: Transition = {}, reducedMotion: boolean = false): Transition | undefined => {
  if (reducedMotion) return undefined;
  return { ...config, repeat: Infinity, repeatType: 'loop' };
};
