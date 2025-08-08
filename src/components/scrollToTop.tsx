'use client';

import { useEffect, useState } from "react";
import { darken, styled } from "@mui/material/styles";

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

const StyledButton = styled('button')(({ theme }) => ({
  // reset styles
  all: 'unset',
  cursor: 'pointer',
  // Positioning
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),

  // Shape
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '9999px',
  padding: theme.spacing(2),

  // Typography
  fontSize: '0.75rem',
  fontWeight: 500,
  textTransform: 'uppercase',
  lineHeight: '1.25',
  color: theme.palette.text.disabled,

  // Background & Shadow
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],

  // Transition
  transition: 'all 150ms ease-in-out',

  // Hover states
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: darken(theme.palette.background.paper, 0.05),
    boxShadow: theme.shadows[2],
  },

  // Focus states
  '&:focus': {
    backgroundColor: darken(theme.palette.background.paper, 0.2),
    boxShadow: theme.shadows[2],
    outline: 'none',
  },

  // Active states
  '&:active': {
    backgroundColor: darken(theme.palette.background.paper, 0.2),
    boxShadow: theme.shadows[1],
  },

  [`&.${ScrollToTopClasses.hidden}`]: {
    display: 'none',
  },
  'svg': {
    width: '1rem',
    height: '1rem',
  }
}));