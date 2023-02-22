import { Button, ButtonProps, Tooltip } from 'antd';

const TooltipButton: React.FC<ButtonProps & { hideTootip?: boolean }> = (
  props,
) => {
  const title = props.title;

  if (props.hideTootip === true) {
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
