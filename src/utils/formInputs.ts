export type InputNumberValue = string | number | null | undefined;

export function transformNumberValue(value: InputNumberValue, defaultValue: string = ''): string {
  if(typeof value === 'string') return value;
  if(typeof value === 'number') {
    if(Number.isNaN(value)) return defaultValue;
    return `${value}`;
  }
  return defaultValue;
}

export function transformNumberValueOnChange(value: string | number): string {
  const text = transformNumberValue(value).replace(/[^0-9.]/g, '');
  const [digit, ...fracs] = text.split('.');
  
  return fracs.length > 0 ? `${digit}.${fracs.join('')}` : digit;
}

export function transformNumberValueOnBlur(value: InputNumberValue, defaultValue: string|number = ''): string|number {
  if(value == null || typeof value === 'number' && Number.isNaN(value)) return defaultValue;
  
  const num = parseFloat(value.toString());

  return Number.isNaN(num) ? defaultValue : num;
}