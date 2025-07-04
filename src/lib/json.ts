export function parseJSON<T>(json: string): T {
  if(!json || (typeof json !== 'string') || json.trim() == '') {
    throw Error("parseJSON error");
  }

  const data: T = JSON.parse(json);

  return data;
}

export function toJSON<T>(data: T): string {
  const json = JSON.stringify(data);

  return json;
}

export function parseJSON_safe<T>(json?: string|null, callback?: T): T | undefined {
  if(!json || (typeof json !== 'string') || json.trim() == '') {
    return callback;
  }

  try {
    const data: T = JSON.parse(json);

    return data;
  } catch(error) {
    return callback;
  }
}
export function toJSON_safe<T>(data: T, callback = ''): string {
  try {
    return toJSON(data);
  } catch {
    return callback ?? '';
  }
}
