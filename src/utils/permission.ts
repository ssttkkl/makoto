import { FilePermissionEnum } from '@/services/files/entities';

export function mapPermission(permission: FilePermissionEnum): string {
  switch (permission) {
    case FilePermissionEnum.R:
      return '只读';
    case FilePermissionEnum.RW:
      return '可读写';
    case FilePermissionEnum.RWX:
      return '可读写、可再次分享';
    default:
      return '';
  }
}
