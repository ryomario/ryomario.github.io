export function getErrorMessage(error: unknown): string {
  if(typeof error == 'string') return error;
  
  if(error instanceof Error) {
    if(error.message) return error.message;
    if(error.name) return error.name;
  }

  return 'unknown error';
}