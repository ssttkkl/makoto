import SpaceTreeForm, { SpaceTreeFormData } from '@/components/SpaceTreeForm';
import { createSpaceLink } from '@/services/space';
import { FilePath, mergePath } from '@/utils/path';
import { ModalFormProps } from '@ant-design/pro-components';

export const LinkFileFormButton: React.FC<
  ModalFormProps<SpaceTreeFormData> & {
    shareId: number;
    refPath: FilePath[];
  }
> = ({ shareId, refPath, onFinish, ...modalFormProps }) => {
  return (
    <SpaceTreeForm
      title="链接文件"
      onFinish={async (formData) => {
        await createSpaceLink({
          path: mergePath(formData.path),
          shareId: shareId,
          links: refPath.map((x) => {
            return {
              filename: x[x.length - 1],
              refPath: mergePath(x),
            };
          }),
        });
        if (onFinish) {
          return onFinish(formData);
        } else {
          return true;
        }
      }}
      {...modalFormProps}
    />
  );
};
