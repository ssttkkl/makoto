import { FolderInfo, LinkInfo } from '@/services/files/entities';
import { getSpaceFileInfo } from '@/services/space';
import { FilePath, mergePath } from '@/utils/path';
import { useRequest } from '@/utils/request';
import { Spin } from 'antd';
import { DataNode } from 'antd/es/tree';
import DirectoryTree from 'antd/es/tree/DirectoryTree';
import React, { useState } from 'react';

interface Node extends DataNode {
  folder: FolderInfo;
  path: FilePath;
  children?: Node[];
}

function folderInfoToNode(folder: FolderInfo, path: FilePath): Node {
  return {
    folder,
    path,
    key: mergePath(path),
    title: folder.filename,
    children: folder.children
      ?.map((child) => (child instanceof LinkInfo ? child.ref : child))
      .filter((child) => child instanceof FolderInfo)
      .map((child) => folderInfoToNode(child, [...path, child.filename])),
  };
}

function pathToKeys(path: FilePath): string[] {
  return [
    '/',
    ...path.map((_, index, array) => mergePath(array.slice(0, index + 1))),
  ];
}

// It's just a simple demo. You can use tree map to optimize update perf.
const updateTreeData = (
  list: Node[],
  key: React.Key,
  children: Node[],
): Node[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    } else {
      return node;
    }
  });

export interface SpaceTreeProps {
  selectedPath?: FilePath;
  onSelect?: (path: FilePath, folder: FolderInfo) => void;
}

const SpaceTree: React.FC<SpaceTreeProps> = ({ selectedPath, onSelect }) => {
  const [treeData, setTreeData] = useState<Node[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['/']);

  const rootReq = useRequest(async () => {
    const root = (await getSpaceFileInfo({ depth: 1 })) as FolderInfo;

    setTreeData([
      {
        ...folderInfoToNode(root, []),
        title: '我的空间',
      },
    ]);

    setLoadedKeys(['/']);

    if (selectedPath) {
      setExpandedKeys(pathToKeys(selectedPath));
    }
    return root;
  });

  return (
    <Spin spinning={rootReq.loading}>
      <DirectoryTree
        selectable
        loadData={async (node) => {
          const loaded = (await getSpaceFileInfo({
            depth: 1,
            path: mergePath(node.path),
          })) as FolderInfo;
          const newNode = folderInfoToNode(loaded, node.path);
          setTreeData((origin) =>
            updateTreeData(origin, node.key, newNode.children!),
          );
        }}
        treeData={treeData}
        selectedKeys={[mergePath(selectedPath ?? [])]}
        onSelect={(_, { node }) => {
          if (onSelect) {
            onSelect(node.path, node.folder);
          }
        }}
        expandedKeys={expandedKeys}
        onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
        loadedKeys={loadedKeys}
        onLoad={(loadedKeys) => setLoadedKeys(loadedKeys)}
      />
    </Spin>
  );
};

export default SpaceTree;
