import { favShare, unfavShare } from '@/services/share';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, ButtonProps, message } from 'antd';

const FavButton: React.FC<ButtonProps> = (props) => {
  const model = useModel('Share.model');
  const shareId = model.share?.shareId;

  if (model.share?.fav === false) {
    async function onClick() {
      if (shareId !== undefined) {
        await favShare({ shareId });
        message.success('成功收藏分享');
        await model.refresh();
      }
    }

    return (
      <Button icon={<StarOutlined />} onClick={onClick} {...props}>
        收藏
      </Button>
    );
  } else if (model.share?.fav === true) {
    async function onClick() {
      if (shareId !== undefined) {
        await unfavShare({ shareId });
        message.success('成功取消收藏分享');
        await model.refresh();
      }
    }

    return (
      <Button icon={<StarFilled />} onClick={onClick} {...props}>
        已收藏
      </Button>
    );
  } else {
    return null;
  }
};

export default FavButton;
