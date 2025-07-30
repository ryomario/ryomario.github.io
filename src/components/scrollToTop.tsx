'use client';

import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import { adjustColorBrightness } from "@/lib/colors";

export function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  })

  const onScroll = () => {
    if (!showScroll && window.scrollY > 400) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 400) {
      setShowScroll(false);
    }
  };

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <StyledButton
      type="button"
      className={`${ScrollToTopClasses.root} ${showScroll ? '' : ScrollToTopClasses.hidden}`}
      onClick={backToTop}
      id="btn-back-to-top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="3"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
      </svg>
    </StyledButton>
  )
}

// ==============================================

const ScrollToTopClasses = {
  root: 'ScrollToTopClasses-root',
  hidden: 'ScrollToTopClasses-hidden',
};

const StyledButton = styled.button<{ theme?: TemplateTheme }>(({ theme }) => ({
  // reset styles
  all: 'unset',
  cursor: 'pointer',
  // Positioning
  position: 'fixed',
  bottom: theme.spacing(5) || '1.25rem',
  right: theme.spacing(5) || '1.25rem',

  // Shape
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '9999px',
  padding: theme.spacing(3) || '0.75rem',

  // Typography
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  lineHeight: '1.25',
  color: theme.colors.text.disabled.light || '#9ca3af',

  // Background & Shadow
  backgroundColor: theme.colors.background.paper.light || '#f3f4f6',
  boxShadow: theme.shadows(1) || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',

  // Transition
  transition: 'all 150ms ease-in-out',

  // Hover states
  '&:hover': {
    color: theme.colors.primary.light || '#6366f1',
    backgroundColor: adjustColorBrightness(theme.colors.background.paper.light || '#f3f4f6', -5),
    boxShadow: theme.shadows(2) || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },

  // Focus states
  '&:focus': {
    backgroundColor: theme.colors.background.default.light || '#e5e7eb',
    boxShadow: theme.shadows(2) || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    outline: 'none'
  },

  // Active states
  '&:active': {
    backgroundColor: theme.colors.background.default.light || '#e5e7eb',
    boxShadow: theme.shadows(2) || '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },

  // Dark mode styles using theme createStyles
  ...theme.createStyles('dark', {
    color: theme.colors.text.disabled.dark || '#818cf8',
    backgroundColor: theme.colors.background.paper.dark || '#1f2937',
    '&:hover': {
      color: theme.colors.primary.light || '#818cf8',
    },
    '&:focus, &:active, &:hover': {
      backgroundColor: adjustColorBrightness(theme.colors.background.paper.dark || '#111827', 20),
    },
  }),

  [`&.${ScrollToTopClasses.hidden}`]: {
    display: 'none',
  },
  'svg': {
    width: theme.spacing(4),
    height: theme.spacing(4),
  }
}));