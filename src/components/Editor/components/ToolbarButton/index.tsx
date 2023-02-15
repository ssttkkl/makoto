import { Button, ButtonProps } from 'antd';

const ToolbarButton: React.FC<ButtonProps> = ({
  onClick: _onClick,
  ...props
}) => {
  return (
    <Button
      size="small"
      shape="circle"
      type="text"
      {...props}
      onClick={(e) => {
        // 避免编辑框失焦
        e.preventDefault();
        if (_onClick) {
          // @ts-ignore
          _onClick(e);
        }
      }}
    />
  );
};
export default ToolbarButton;
