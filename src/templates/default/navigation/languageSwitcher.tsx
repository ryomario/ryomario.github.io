import { Locale } from "@/i18n/routing";
import React, { useCallback } from "react";
import { useLanguage } from "@/templates/hooks/languageHook";
import { darken, styled } from "@mui/material/styles";

type Props = React.ComponentProps<'button'>;

/**
 * Only handle two locales `en` and `id`
 * @returns 
 */
export function LanguageSwitcher({
  disabled: propDisabled,
  className,
  ...rest
}: Props) {
  const {
    language: lang,
    isLoading,
    onChange,
  } = useLanguage();

  const disabled = propDisabled || isLoading;

  const toggleLanguange = useCallback(() => {
    const newLang: Locale = lang != 'en' ? 'en' : 'id';
    onChange(newLang);
  }, [lang, onChange]);

  return (
    <StyledButton
      type="button"
      onClick={toggleLanguange}
      disabled={disabled}
      className={[
        languageSwitcherClasses.root,
        className,
      ].join(' ')}
      {...rest}
    >
      <span className={[
        languageSwitcherClasses.thumb,
        lang === 'id' ? languageSwitcherClasses.thumbRight : '',
      ].join(' ')}>
        <span
          className={`fi fis ${lang === 'en' ? 'fi-gb' : 'fi-id'
            } ${languageSwitcherClasses.thumbFlag}`}
        />
      </span>
      <span className={languageSwitcherClasses.label}>EN</span>
      <span className={[languageSwitcherClasses.label, languageSwitcherClasses.labelRight].join(' ')}>ID</span>
    </StyledButton>
  );
}

// ========================================

export const languageSwitcherClasses = {
  root: 'languageSwitcher-root',
  thumb: 'languageSwitcher-thumb',
  thumbRight: 'languageSwitcher-thumb-right',
  thumbFlag: 'languageSwitcher-thumb-flag',
  label: 'languageSwitcher-label',
  labelRight: 'languageSwitcher-label-right',
};

const StyledButton = styled('button')(({ theme }) => ({
  all: 'unset',

  boxSizing: 'border-box',
  cursor: 'pointer',
  position: 'relative',
  display: 'inline-flex',
  fontSize: '1rem',
  height: '2em',
  width: '4em',
  margin: 'auto 0',
  alignItems: 'center',
  borderRadius: '9999px',
  padding: '0.25rem',

  transitionProperty: 'background-color',
  transitionDuration: '200ms',

  outline: 'none',

  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: darken(theme.palette.background.paper, theme.palette.action.hoverOpacity),
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'wait',
  },

  [`.${languageSwitcherClasses.thumb}`]: {
    display: 'inline-flex',
    width: '1.5em',
    height: '1.5em',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(0)',

    borderRadius: '9999px',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[1],

    transitionProperty: 'transform',
    transitionDuration: '200ms',

    zIndex: 1,

    [`&.${languageSwitcherClasses.thumbRight}`]: {
      transform: 'translateX(2em)',
    },
    [`.${languageSwitcherClasses.thumbFlag}`]: {
      borderRadius: '9999px',
    },
  },

  [`.${languageSwitcherClasses.label}`]: {
    position: 'absolute',
    left: '0.25em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1.5em',
    height: '1.5em',
    scale: 0.75,
    fontWeight: 500,
    [`&.${languageSwitcherClasses.labelRight}`]: {
      left: 'unset',
      right: '0.25em',
    },
  }
}));
