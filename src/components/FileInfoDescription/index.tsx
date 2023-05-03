import { DocumentInfo, FileInfo, LinkInfo } from '@/services/files/entities';
import { useFriendlyDateTimeFormatter } from '@/utils/hooks';
import { mapPermission } from '@/utils/permission';
import { Descriptions } from 'antd';
import { UserAvatarWithNickname } from '../UserAvatar';

export interface FileInfoProps {
  file: FileInfo;
}

const FileInfoDescription: React.FC<FileInfoProps> = ({ file: originFile }) => {
  const formatDate = useFriendlyDateTimeFormatter();
  const file = originFile instanceof LinkInfo ? originFile.ref : originFile;

  if (file) {
    return (
      <Descriptions column={1}>
        <Descriptions.Item label="文件名">
          {originFile.filename}
        </Descriptions.Item>
        <Descriptions.Item label="文件类型">
          {file instanceof DocumentInfo ? '文档' : '目录'}
          {originFile instanceof LinkInfo ? '（链接）' : ''}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {formatDate(file.ctime)}
        </Descriptions.Item>
        {file.atime ? (
          <Descriptions.Item label="上次访问时间">
            {formatDate(file.atime)}
          </Descriptions.Item>
        ) : null}
        {file.mtime ? (
          <Descriptions.Item label="上次修改时间">
            {formatDate(file.mtime)}
          </Descriptions.Item>
        ) : null}
        {originFile instanceof LinkInfo ? (
          <>
            <Descriptions.Item label="原文件所有者">
              <UserAvatarWithNickname uid={file.ownerUid} />
            </Descriptions.Item>
            <Descriptions.Item label="权限">
              {mapPermission(originFile.permission)}
            </Descriptions.Item>
          </>
        ) : null}
      </Descriptions>
    );
  } else {
    return (
      <Descriptions column={1}>
        <Descriptions.Item label="文件名">
          {originFile.filename}
        </Descriptions.Item>
        <Descriptions.Item label="文件类型">（链接已被移除）</Descriptions.Item>
      </Descriptions>
    );
  }
};

export default FileInfoDescription;
