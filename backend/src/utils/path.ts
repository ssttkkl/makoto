import { type ArgumentMetadata, Injectable, type PipeTransform } from '@nestjs/common'

export type FilePath = string[]

export function mergePath (path: FilePath): string {
  let rawPath = ''
  for (const p of path) {
    rawPath += '/'
    rawPath += p
  }
  return rawPath
}

export function splitPath (rawPath: string): FilePath {
  return rawPath.split('/').filter((v) => v.length > 0)
}

@Injectable()
export class SplitPathPipe implements PipeTransform {
  transform (value: any, metadata: ArgumentMetadata): FilePath {
    return splitPath(value ?? '')
  }
}
