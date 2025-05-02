import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: 'export',
 
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,
 
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },

  // exportPathMap(defaultMap, ctx) {
  //   return {
  //     ...defaultMap,
  //     '/admin': { page: '/' },
  //   }
  // },

  // webpack: config => {
  //   if(!config.module) {
  //     return config;
  //   }
  //   config.module.rules?.push({
  //     test: /src\/app\/admin\/.*/,
  //     loader: 'ignore-loader',
  //   });
  //   return config;
  // },
};

export default withNextIntl(nextConfig);
