'use client';

import { ITemplateProps } from "@/types/templates/ITemplate";
import { Global, css } from "@emotion/react";
import Navbar from "./navigation/navbar";
import { useTemplatePageRouter } from "../hooks/templatePageRouter";
import { Footer } from "./footer";
import { ScrollToTop } from "@/components/scrollToTop";
import { MainSection } from "./sections/main";
import { ProjectsSection } from "./sections/projects";
import { styled } from "@mui/material/styles";
import { DetailsProject } from "./sections/projects/detailsProject";
import { NotFoundComponent } from "@/components/notFound";
import { useLocale } from "next-intl";
import { AboutSection } from "./sections/about";

export default function TemplateDefault({ defaultLocale = 'en', ...rest }: ITemplateProps) {
  const locale = useLocale();
  const { currentPage, getParam } = useTemplatePageRouter();

  const id = Number(getParam('id'));

  return (
    <Container {...rest}>
      <Global
        styles={css`
          :host,
          html {
            line-height:1.5;
            -webkit-text-size-adjust:100%;
            -moz-tab-size:4;
            tab-size:4;
            font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
            font-feature-settings:normal;
            font-variation-settings:normal;
            -webkit-tap-highlight-color:transparent;
          }
          body {
            margin:0;
            line-height:inherit;
          }

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
      <main className="container">
        <div className="content">
          {currentPage == 'projects' ? (
            Number.isNaN(id)
              ? <ProjectsSection />
              : <DetailsProject projectId={id} />
          ) : currentPage == 'about' ? (
            <AboutSection />
          ) : !currentPage ? (
            <MainSection />
          ) : (
            <NotFoundComponent homeUrl={`/${locale}`} />
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </Container>
  );
}

// =========================

const Container = styled('div')(({ theme }) => ({
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.default,

  transitionProperty: 'background-color',
  transitionDuration: '300ms',
  minHeight: '100vh',
  '.container': {
    width: '100%',
    [theme.breakpoints.up("sm")]: {
      maxWidth: theme.breakpoints.values.sm,
      margin: '0 auto',

      [theme.breakpoints.up("md")]: {
        maxWidth: theme.breakpoints.values.md,
      },
      [theme.breakpoints.up("lg")]: {
        maxWidth: theme.breakpoints.values.lg,
      },
    },
  },
  '& > main > .content': {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',

    maxWidth: '80rem',

    padding: theme.spacing(6),

    [theme.breakpoints.up("lg")]: {
      paddingLeft: '2rem',
      paddingRight: '2rem',
    },
  }
}));