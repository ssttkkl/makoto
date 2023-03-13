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
  const btnProps: ButtonProps = props;
  if (mini === true) {
    btnProps.size = 'small';
    btnProps.type = 'text';
    btnProps.danger = false;
  }

  const showTooltipCondition = _showTooltip ?? 'mini';
  const showTooltip =
    showTooltipCondition === 'mini' ? mini : showTooltipCondition;

  const text = mini ? '' : title;

  if (showTooltip) {
    return (
      <Tooltip title={title}>
        <Button {...btnProps}>{text}</Button>
      </Tooltip>
    );
  } else {
    return <Button {...btnProps}>{text}</Button>;
  }
};
