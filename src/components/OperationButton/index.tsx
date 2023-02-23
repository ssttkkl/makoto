import { ButtonProps, Tooltip, Button } from 'antd';

export interface OperationButtonProps extends Omit<ButtonProps, 'children'> {
  mini?: boolean;
  showTooltip?: true | false | 'mini';
}

export const OperationButton: React.FC<OperationButtonProps> = ({
  title,
  mini,
  showTooltip: _showTooltip,
  ...props
}) => {
  const extraBtnProps: ButtonProps = {};
  if (mini === true) {
    extraBtnProps.size = 'small';
    extraBtnProps.type = 'text';
    extraBtnProps.danger = false;
  }

  const showTooltipCondition = _showTooltip ?? 'mini';
  const showTooltip =
    showTooltipCondition === 'mini' ? mini : showTooltipCondition;

  const text = mini ? '' : title;

  if (showTooltip) {
    return (
      <Tooltip title={title}>
        <Button {...extraBtnProps} {...props}>
          {text}
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Button {...extraBtnProps} {...props}>
        {text}
      </Button>
    );
  }
};
