export function searchStringContains(text: string, str2search: string) {
  if(!str2search) return true

  const strs = str2search.replace(/\s+/g,' ').split(' ')

  return strs.every(str => text.search(new RegExp(str,'i')) != -1)
}