export function mergePath(pathArray: string[]): string {
  let path = '';
  for (const p of pathArray) {
    path += '/';
    path += p;
  }
  return path;
}

export function splitPath(path: string): string[] {
  return path.split('/').filter((v) => v.length > 0);
}
