import { Button, ButtonProps } from 'antd';

export interface ToolbarButtonProps extends ButtonProps {
  isActive?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  isActive,
  onClick: _onClick,
  ...props
}) => {
  return (
    <Button
      size="small"
      shape="circle"
      type={isActive ? 'primary' : 'text'}
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
