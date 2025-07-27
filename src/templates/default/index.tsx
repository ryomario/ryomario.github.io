'use client';

import { Footer } from "@/components/navigation/footer";
import { ITemplateProps } from "@/types/templates/ITemplate";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";
import Navbar from "./navigation/navbar";
import { TemplateTheme } from "@/types/templates/ITemplateTheme";
import { useTemplatePageRouter } from "../hooks/templatePageRouter";

export default function TemplateDefault({ defaultLocale = 'en', ...rest }: ITemplateProps) {
  const { currentPage } = useTemplatePageRouter();

  return (
    <Container {...rest}>
      <Global
        styles={css`
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
          .unset-all-styles {
            all: unset;
          }
        `}
      />
      <Navbar />
      <main>
        <div className="content">
          {currentPage == 'projects' ? (
            <h1>Projects</h1>
          ) : currentPage == 'about' ? (
            <h1>About</h1>
          ) : (
            <h1>Default Template</h1>
          )}
        </div>
      </main>
      <Footer />
    </Container>
  );
}

// =========================

const Container = styled.div<{ theme?: TemplateTheme }>(({ theme }) => ({
  backgroundColor: theme.colors.background.default.main,
  ...theme.createStyles('dark', {
    backgroundColor: theme.colors.background.default.dark,
  }),
  transitionProperty: 'background-color',
  transitionDuration: '300ms',
  minHeight: '100vh',
  '& > main': {
    width: '100%',
    [theme.breakpoints.up(theme.breakpoints.values.mobile)]: {
      maxWidth: theme.breakpoints.values.mobile,
      margin: '0 auto',
      padding: '0 0.5rem',

      [theme.breakpoints.up(theme.breakpoints.values.tablet)]: {
        maxWidth: theme.breakpoints.values.tablet,
      },
      [theme.breakpoints.up(theme.breakpoints.values.desktop)]: {
        maxWidth: theme.breakpoints.values.desktop,
      },
    },

    '& > .content': {
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',

      maxWidth: '80rem',

      padding: '1.5rem',

      [theme.breakpoints.up(theme.breakpoints.values.desktop)]: {
        paddingLeft: '2rem',
        paddingRight: '2rem',
      },
    }
  }
}));