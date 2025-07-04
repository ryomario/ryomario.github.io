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