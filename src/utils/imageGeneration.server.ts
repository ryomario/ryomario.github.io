'use server';

import path from "path";
import os from "os";
import puppeteer, { ImageFormat, PuppeteerLifeCycleEvent, ScreenshotClip } from "puppeteer";
import fs from "fs";
import { Logger } from "./logger";
import { getErrorMessage } from "./errorMessage";

const tempDir = os.tmpdir();

// Cache directory setup
const CACHE_DIR = path.join(process.cwd(), 'cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

type Options = {
  /**
   * @default
   * 1200
   */
  width?: number;
  /**
   * @default
   * 628
   */
  height?: number;
  /**
   * @default
   * 1.0
   */
  scale?: number;
  /**
   * @default
   * ['domcontentloaded','networkidle2'] // Wait for network to be idle
   */
  waitUntil?: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[];
  /**
   * @default
   * 30000 // (30 seconds)
   */
  timeout?: number;
  /**
   * @default
   * 'png'
   */
  format?: ImageFormat;
  /**
   * For jpeg format
   * @default
   * 80
   */
  quality?: number;
  /**
   * @default
   * false
   */
  fullPage?: boolean;
  /**
   * {x, y, width, height}
   */
  clip?: ScreenshotClip;
  /**
   * @default
   * false
   */
  transparent?: boolean;

  removeElements?: string[];
}

type FinalOptions = Required<Omit<Options, 'clip' | 'removeElements'>> & {
  clip?: ScreenshotClip;
  removeElements?: string[];
};

export async function generatePagePreview(url: string, _options?: Options) {
  const options: FinalOptions = {
    width: 1200,
    height: 628,
    scale: 1.0,
    waitUntil: ['networkidle2', 'domcontentloaded', 'load', 'networkidle0'],
    timeout: 30000,
    format: 'png',
    quality: 80,
    fullPage: false,
    transparent: false,

    ..._options
  };

  const browser = await puppeteer.launch({
    browser: 'firefox',
    executablePath: '/usr/bin/firefox', // Linux
    timeout: 30000,
    headless: true,
    args: [
      '--no-remote',          // Disables remote operation
      '--foreground',         // Runs in foreground
      '--no-first-run',       // Skips first run welcome page
      '--no-default-browser-check', // Disables default browser check
      '--profile',        // Uses temporary profile
      tempDir,
    ],
    extraPrefsFirefox: {
      // Disable creating profile files
      'browser.shell.skipDefaultBrowserCheck': true,
      'browser.startup.homepage_override.mstone': 'ignore',
      'startup.homepage_welcome_url': 'about:blank',
      'devtools.debugger.remote-enabled': true
    },
  });

  try {
    const page = await browser.newPage();

    // Set viewport size (default to 1280x720)
    await page.setViewport({
      width: options.width,
      height: options.height,
      deviceScaleFactor: options.scale,
    });

    // Navigate to the URL
    await page.goto(url, {
      waitUntil: options.waitUntil, // Wait for network to be idle
      timeout: options.timeout, // 30 seconds timeout
    });

    // Remove specific elements before screenshot
    if (options.removeElements) {
      const bodyHandle = await page.$('body');
      await page.evaluate((body, selectors) => {
        selectors.forEach(selector => {
          const elements = body?.querySelectorAll(selector);
          elements?.forEach(el => el.remove());
        });
      }, bodyHandle, options.removeElements);
    }

    // Take screenshot
    const screenshot = await page.screenshot({
      type: options.format,
      quality: options.format !== 'png' ? options.quality : undefined,
      fullPage: options.fullPage,
      clip: options.clip,
      omitBackground: options.transparent,
    });

    return screenshot;
  } catch (error) {
    const message = getErrorMessage(error);
    Logger.error(message, `generatePagePreview "${url}" error`);
    throw new Error(message);
  } finally {
    if (browser) await browser.close();
  }
}

export async function generatePreviewWithCache(url: string, options: Options = {}) {
  const cachePath = path.join(CACHE_DIR, `${encodeURIComponent(url)}.${options.format || 'png'}`);

  // Check cache first
  if (fs.existsSync(cachePath)) {
    return new Uint8Array(fs.readFileSync(cachePath));
  }

  // Generate new preview if not in cache
  const image = await generatePagePreview(url, options);

  // Save to cache
  fs.writeFileSync(cachePath, image);

  return image;
}