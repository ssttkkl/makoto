export type FilePath = string[];

export function mergePath(path: FilePath): string {
  if (path.length === 0) {
    return '/';
  }

  let rawPath = '';
  for (const p of path) {
    rawPath += '/';
    rawPath += p;
  }
  return rawPath;
}

export function splitPath(rawPath: string): FilePath {
  return rawPath.split('/').filter((v) => v.length > 0);
}
