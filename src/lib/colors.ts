export type RGB = {
  r: number;
  g: number;
  b: number;
}

export function hex2rgb(hex: string): RGB {
  if(!isHexColor(hex)) {
    throw Error('hex2rgb error, not valid hex color')
  }

  hex = hex.trim();
  if(hex.length == 4) {
    hex = hex.split('').map(h => h != '#' ? `${h}${h}` : '#').join('');
  }

  return {
    r: parseInt(hex.substring(1,3), 16),
    g: parseInt(hex.substring(3,5), 16),
    b: parseInt(hex.substring(5,7), 16),
  }
}

export function isHexColor(hex: string) {
  if(!hex || !hex.trim()) {
    return false;
  }

  hex = hex.trim();
  
  const regexp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i

  return regexp.test(hex);
}