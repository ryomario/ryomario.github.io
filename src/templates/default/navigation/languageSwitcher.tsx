import { Locale } from "@/i18n/routing";
import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { useLanguage } from "@/templates/hooks/languageHook";
import { TemplateTheme } from "@/types/templates/ITemplateTheme";

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

const StyledButton = styled.button<{ theme?: TemplateTheme }>(({ theme }) => ({
  all: 'unset',

  boxSizing: 'border-box',
  cursor: 'pointer',
  position: 'relative',
  display: 'inline-flex',
  height: theme.spacing(8),
  width: theme.spacing(16),
  margin: 'auto 0',
  alignItems: 'center',
  borderRadius: '9999px',
  padding: theme.spacing(1),

  transitionProperty: 'background-color',
  transitionDuration: '200ms',

  outline: 'none',

  backgroundColor: '#e5e7eb',
  color: '#374151',
  '&:hover': {
    backgroundColor: '#d1d5db',
  },
  // dark theme
  ...theme.createStyles('dark', {
    backgroundColor: '#374151',
    color: '#e5e7eb',
    '&:hover': {
      backgroundColor: '#2b323e',
    },
  }),

  '&:disabled': {
    opacity: 0.5,
    cursor: 'wait',
  },

  [`.${languageSwitcherClasses.thumb}`]: {
    display: 'inline-flex',
    width: theme.spacing(6),
    height: theme.spacing(6),
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translateX(0)',

    borderRadius: '9999px',
    backgroundColor: '#fff',
    // dark theme
    ...theme.createStyles('dark', {
      backgroundColor: '#666',
    }),
    boxShadow: theme.shadows(0.5),

    transitionProperty: 'transform',
    transitionDuration: '200ms',

    zIndex: 1,

    [`&.${languageSwitcherClasses.thumbRight}`]: {
      transform: `translateX(${theme.spacing(8)})`,
    },
    [`.${languageSwitcherClasses.thumbFlag}`]: {
      borderRadius: '9999px',
    },
  },

  [`.${languageSwitcherClasses.label}`]: {
    position: 'absolute',
    left: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.spacing(6),
    height: theme.spacing(6),
    fontSize: theme.spacing(3),
    fontWeight: 500,
    [`&.${languageSwitcherClasses.labelRight}`]: {
      left: 'unset',
      right: theme.spacing(1),
    },
  }
}));
