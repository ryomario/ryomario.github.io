"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IProject, IProjectFilter } from "@/types/IProject";
import { useTranslations } from "next-intl";
import { useDataContext } from "@/contexts/dataContext";
import { alpha, styled } from "@mui/material/styles";

type Props = {
  filter: Required<IProjectFilter>;
  onChangeFilter: (filter: Partial<IProjectFilter>) => void
}

export function ProjectsFilter({ filter, onChangeFilter }: Props) {
  const t = useTranslations('ProjectsFilter');
  const { refs: { project_tags } } = useDataContext();

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownOverlayRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen(old => !old), [setOpen])

  const selectedTags = useMemo(() => filter.tags, [filter.tags]);
  const isSelectedTag = useCallback((tag: IProject['tags'][number]) => selectedTags.findIndex(s => s === tag) !== -1, [selectedTags]);
  const setSelectedTag = useCallback((tag: IProject['tags'][number], isSelected: boolean) => {
    const tags = [...filter.tags];
    const existId = tags.findIndex(s => s == tag);
    if (isSelected && existId === -1) {
      tags.push(tag);
    } else if (!isSelected && existId !== -1) {
      tags.splice(existId, 1);
    }

    onChangeFilter({ tags });
  }, [filter.tags]);

  const label = useMemo<string>(() => {
    if (!filter.tags.length) return t('labels.not_filterred');
    return t('labels.tag_filterred', { count: filter.tags.length });
  }, [filter, t]);

  useEffect(() => {
    if (!buttonRef.current || !dropdownRef.current || !dropdownOverlayRef.current) return;
    const dropdownOverlay = dropdownOverlayRef.current;
    const dropdownBox = dropdownRef.current;

    if (open) {
      dropdownOverlay.style.display = 'block';
      dropdownOverlay.style.pointerEvents = 'auto';

      // HANDLE RECT : START
      let dropdownBoxRect = dropdownBox.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();

      window.document.documentElement.style.overflow = 'hidden';
      dropdownBox.style.left = `${buttonRect.left + buttonRect.width - dropdownBoxRect.width}px`;
      dropdownBox.style.top = `${buttonRect.top + buttonRect.height + 10}px`;

      // update rect
      dropdownBoxRect = dropdownBox.getBoundingClientRect();
      // check if overflow to bottom
      if (dropdownBoxRect.bottom > window.innerHeight - 10) {
        dropdownBox.style.top = `${buttonRect.top - dropdownBoxRect.height - 10}px`;
      }
      // update rect
      dropdownBoxRect = dropdownBox.getBoundingClientRect();
      // check if overflow to top
      if (dropdownBoxRect.top < 10) {
        dropdownBox.style.top = `${10}px`;
      }
      // update rect
      dropdownBoxRect = dropdownBox.getBoundingClientRect();
      // check if still overflow to bottom, content will be scroll type
      if (dropdownBoxRect.bottom > window.innerHeight - 10) {
        dropdownBox.style.bottom = `${10}px`;
      } else {
        // also reset on close
        dropdownBox.style.bottom = '';
      }
      // HANDLE RECT : END

      const animation = dropdownBox.animate(
        [
          { opacity: 0, transform: 'translateY(-10px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        {
          duration: 300,
          easing: 'ease-in-out',
          fill: 'forwards'
        }
      );

      const closeDropdown = (e: MouseEvent) => !dropdownRef.current?.contains(e.target as Node) && setOpen(false);
      window.document.addEventListener('click', closeDropdown);

      return () => {
        animation.cancel();
        window.document.removeEventListener('click', closeDropdown);
      }
    } else {
      const animation = dropdownBox.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' }
        ],
        {
          duration: 300,
          easing: 'ease-in-out',
          fill: 'forwards'
        }
      );
      animation.onfinish = () => {
        window.document.documentElement.style.overflow = 'auto';
        dropdownOverlay.style.display = 'none';
        dropdownBox.style.bottom = '';
      };

      return () => {
        animation.cancel();
      };
    }
  }, [open, setOpen]);

  return (
    <>
      <StyledButton
        ref={buttonRef}
        onClick={toggleOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" style={{ opacity: 0.5 }}>
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        {label}
        <svg className={`arrow ${open ? 'open' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path clipRule="evenodd" fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </StyledButton>
      {createPortal(
        <DropdownContainer ref={dropdownOverlayRef} open={open} className={dropdownClasses.root}>
          <div className={dropdownClasses.box} ref={dropdownRef}>
            <div className="heading">{t('labels.tag_heading')}</div>
            <ul>
              {project_tags.map(tag => (
                <TagSelectItem key={tag}>
                  <input
                    type="checkbox"
                    name={`filter.tags.${tag}`}
                    id={`filter.tags.${tag}`}
                    checked={isSelectedTag(tag)}
                    onChange={(e) => setSelectedTag(tag, e.target.checked)}
                  />
                  {tag}
                </TagSelectItem>
              ))}
            </ul>
          </div>
        </DropdownContainer>
        ,
        window.document.body
      )}
    </>
  );
}

// ==========================================================

const dropdownClasses = {
  root: 'dropdown-container',
  box: 'dropdown-box',
}

const StyledButton = styled('button')(({ theme }) => ({
  all: 'unset',
  cursor: 'pointer',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  fontSize: '0.875rem',
  fontWeight: 500,
  color: alpha(theme.palette.text.primary, 0.75),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(1),
  border: '1px solid',
  borderColor: theme.palette.divider,
  transitionProperty: 'background-color, color',
  transitionDuration: '300ms',
  transitionTimingFunction: 'ease',

  // Hover states
  '&:hover': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },

  ['&:focus']: {
    borderColor: alpha(theme.palette.primary.main, 0.5),
    outline: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
  },

  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },

  ['svg']: {
    width: '1.25rem',
    height: '1.25rem',

    ['&.arrow']: {
      marginLeft: 'auto',
      transition: 'all 150ms ease',
      [theme.breakpoints.up('md')]: {
        marginLeft: theme.spacing(1),
      },
      ['&.open']: {
        transform: 'rotate(-180deg)',
      },
    },
  },
}));

const DropdownContainer = styled('div')<{ open?: boolean }>(({ open = false, theme }) => ({
  position: 'fixed',
  display: open ? 'block' : 'none',
  inset: 0,
  transitionProperty: 'display',
  transitionDelay: '0.3s',
  zIndex: 10,

  [`.${dropdownClasses.box}`]: {
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    overflowY: 'auto',
    width: theme.spacing(28),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[3],

    ['& > :not(:last-child)']: {
      borderBottom: `2px solid`,
      borderColor: 'inherit',
      paddingBottom: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    ['.heading']: {
      fontSize: '1em',
      fontWeight: 'normal',
    },

    ['ul, ol']: {
      margin: 0,
      ['& > * + *']: {
        marginTop: theme.spacing(1.5),
      },
      padding: 0,
      paddingTop: theme.spacing(1.5),
      fontSize: '0.875rem',
    }
  },
}));

const TagSelectItem = styled('label')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '1em',
  lineHeight: 1.1,
  color: theme.palette.text.primary,

  ['input']: {
    appearance: 'none',
    margin: 0,
    marginRight: theme.spacing(1.5),
    backgroundColor: theme.palette.background.default,
    font: 'inherit',
    width: '1em',
    height: '1em',
    border: '0.1em solid',
    borderColor: theme.palette.divider,
    backgroundClip: 'content-box',
    borderRadius: '0.1em',
    transform: 'translateY(-0.05em)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    ['&::before']: {
      content: '""',
      width: '0.55em',
      height: '0.55em',
      transform: 'scale(0)',
      transition: '120ms transform ease-in-out',
      boxShadow: `inset 1em 1em ${theme.palette.primary.main}`,
    },
    ['&:checked::before']: {
      transform: 'scale(1)',
    },
    '&:focus': {
      outline: 'none',
      borderColor: alpha(theme.palette.primary.main, 0.5),
      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.5)}`,
    },
  }
}));
