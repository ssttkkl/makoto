import { Button, ButtonProps, Tooltip } from 'antd';

const TooltipButton: React.FC<ButtonProps & { hideTooltip?: boolean }> = ({
  hideTooltip: hideTootip,
  ...props
}) => {
  const title = props.title;

  if (hideTootip === true) {
    return <Button {...props} />;
  } else {
    return (
      <Tooltip title={title}>
        <Button {...props} />
      </Tooltip>
    );
  }
};

export default TooltipButton;
