import { DocumentInfo, FileInfo, LinkInfo } from '@/services/files/entities';
import { mapPermission } from '@/utils/permission';
import { Descriptions } from 'antd';

export interface FileInfoProps {
  file: FileInfo;
}

const FileInfoDescription: React.FC<FileInfoProps> = ({ file: originFile }) => {
  const file = originFile instanceof LinkInfo ? originFile.ref : originFile;

  return (
    <Descriptions column={1}>
      <Descriptions.Item label="文件名">{file.filename}</Descriptions.Item>
      <Descriptions.Item label="文件类型">
        {file instanceof DocumentInfo ? '文档' : '目录'}
        {originFile instanceof LinkInfo ? '（链接）' : ''}
      </Descriptions.Item>
      <Descriptions.Item label="创建时间">
        {file.ctime.toLocaleString()}
      </Descriptions.Item>
      {file.atime ? (
        <Descriptions.Item label="上次访问时间">
          {file.atime.toLocaleString()}
        </Descriptions.Item>
      ) : null}
      {file.mtime ? (
        <Descriptions.Item label="上次修改时间">
          {file.mtime.toLocaleString()}
        </Descriptions.Item>
      ) : null}
      {originFile instanceof LinkInfo ? (
        <Descriptions.Item label="权限">
          {mapPermission(originFile.permission)}
        </Descriptions.Item>
      ) : null}
    </Descriptions>
  );
};

export default FileInfoDescription;
