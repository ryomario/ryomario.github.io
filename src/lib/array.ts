export function getUniqueArrayByKey(arr: any[], keyName = 'id'): any[] {
  const seensIds = new Set<any>();

  return arr.filter(item => {
    if(seensIds.has(item[keyName])) {
      return false;
    } else {
      seensIds.add(item[keyName]);
      return true;
    }
  });
}

export function descendingArrayComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type ArrayOrder = 'asc' | 'desc';

export function getArrayComparator<Key extends keyof any>(
  order: ArrayOrder,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingArrayComparator(a, b, orderBy)
    : (a, b) => -descendingArrayComparator(a, b, orderBy);
}