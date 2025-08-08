export type RGB = {
  r: number;
  g: number;
  b: number;
}

export type RGBA = RGB & {
  a?: number;
}

/**
 * Append alpha value in color hex
 * @param hex color in hex format, start with #, ex. `#abc` `#abcf` `#aabbcc` `#aabbccff`
 * @param alpha alpha value (0 - 1) to be appended to color result, multiplied to source color alpha if exist
 * @returns color that appended alpha in hex format `#aabbccaa`
 */
export function hexAlpha(hex: string, alpha = 1): string {
  const { r, g, b, a: oldAlpha } = hex2rgb(hex);

  const a = Math.round((oldAlpha ?? 1) * alpha * 255);

  // do not append alpha if alpha = 1
  const hexWithAlpha = [r, g, b, ...(a < 255 ? [a] : [])].map(color => {
    // clamp
    if (color < 0) color = 0;
    if (color > 255) color = 255;

    // Convert to hex
    const hex = color.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  return `#${hexWithAlpha}`;
}

export function hex2rgb(hex: string): RGBA {
  if (!isHexColor(hex)) {
    throw Error(`hex2rgb error, "${hex}" is not valid hex color`)
  }

  hex = hex.trim();
  if (hex.length == 4 || hex.length == 5) {
    hex = hex.split('').map(h => h != '#' ? `${h}${h}` : '#').join('');
  }

  let a: number | undefined = undefined;
  if (hex.length == 9) {
    a = parseInt(hex.substring(7, 9), 16) / 255;
  }

  return {
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16),
    a,
  }
}

export function isHexColor(hex: string) {
  if (!hex || !hex.trim()) {
    return false;
  }

  hex = hex.trim();

  const regexp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{8}$)|(^#[0-9A-F]{3}$)|(^#[0-9A-F]{4}$)/i

  return regexp.test(hex);
}

/**
 * Convert RGB color into HEX color
 * @param rgb - Color with RGB value (e.g., `{r: R, g: G, b: B}` or `[R, G, B]`)
 * @param a - alpha color (0 to 1), default = 1
 * @returns The hex color
 */
export function rgb2hex(rgb: RGB | [number, number, number], a = 1): string {
  let r: number, g: number, b: number;
  if (Array.isArray(rgb)) {
    [r, g, b] = rgb;
  } else {
    ({ r, g, b } = rgb);
  }

  const hex = [r, g, b].map(color => {
    // clamp
    if (color < 0) color = 0;
    if (color > 255) color = 255;

    // Convert to hex
    const hex = color.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  return hexAlpha(`#${hex}`, a);
}

/**
 * Adjusts the brightness of a hex color by a given percentage
 * @param hexColor - The original color in hex format (e.g., "#RRGGBB" or "#RGB")
 * @param percent - Percentage to adjust (-100 to 100). Negative values darken, positive values lighten
 * @returns The adjusted color in hex format
 */
export function adjustColorBrightness(hexColor: string, percent: number): string {
  if (percent < -100 || percent > 100) {
    throw new Error('Percentage must be between -100 and 100');
  }
  if (percent === 0) return hexColor;

  // Convert input
  const { r, g, b } = hex2rgb(hexColor);

  const adjustedHex = [r, g, b].map(color => {
    // Adjust brightness
    const amount = Math.round(color * (percent / 100));
    if (percent > 0) {
      // Lighten - add to each channel
      return Math.min(255, color + amount);
    } else {
      // Darken - subtract from each channel
      return Math.max(0, color + amount);
    }
  }).map(color => {
    // Convert back to hex
    const hex = color.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')

  return `#${adjustedHex}`;
}

/**
 * Get black or white text color based on background color to be contrast combination
 * @param bgColor background color in hex format or RGB object
 * @returns text color (black or white) in hex format
 */
export function getContrastTextColor(bgColor: string | RGB): string {
  const { r, g, b } = typeof bgColor === 'string' ? hex2rgb(bgColor) : bgColor;

  // Calculate perceived brightness (luminance)
  const [R, G, B] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  // Return true for dark colors, false for light colors
  const isDarkBg = luminance < 0.259;

  return isDarkBg ? rgb2hex([255, 255, 255]) : rgb2hex([0, 0, 0]);
}