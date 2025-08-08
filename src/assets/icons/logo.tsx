'use client';

import * as React from "react"
import { SVGProps } from "react"
import { motion } from "framer-motion";

export const LogoSVG = ({ duration = 1, ...rest }: Omit<SVGProps<SVGSVGElement>, 'viewBox'> & { duration?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 35 35"
    width="1em"
    height="1em"
    {...rest}
  >
    <g stroke="currentColor" strokeWidth={5} strokeLinecap="round">
      <motion.path
        fill="none"
        d="M 2.5 32.5 v -10 a 20 20 0 0 1 20 -20 a 7.5 7.5 0 0 1 0 20"
        initial={{ 
          strokeDasharray: `${72.84 * 0.7} ${72.84 * 0.3}`,
          strokeDashoffset: 0,
        }}
        animate={{
          strokeDashoffset: -72.84,
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.path
        fill="none"
        d="M 32.5 32.5 h -10 a 7.5 7.5 0 0 1 0 -20"
        initial={{
          strokeDasharray: `${41.42 * 0.7} ${41.42 * 0.3}`,
          strokeDashoffset: 0,
        }}
        animate={{
          strokeDashoffset: -41.42,
          // opacity: 1
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </g>
  </svg>
)
