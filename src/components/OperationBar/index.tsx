import { ButtonProps, Space } from 'antd';
import { ReactNode } from 'react';
import { OperationButton } from '../OperationButton';

export interface CustomOperation {
  key: string;
  title: string;
  render: (key: string, mini: boolean) => ReactNode;
}

export interface ButtonOperation {
  key: string;
  title: string;
  icon?: ReactNode;
  onClick?: ButtonProps['onClick'];
  showTooltip?: true | false | 'mini';
  btnProps?: ButtonProps;
}

export type Operation = CustomOperation | ButtonOperation;

export interface OperationBarProps {
  operations: Operation[];
  mini?: boolean;
}

export const OperationBar: React.FC<OperationBarProps> = ({
  operations,
  mini: _mini,
}) => {
  const mini = _mini ?? false;

  return (
    <Space wrap>
      {operations.map((x) => {
        if ('render' in x) {
          return x.render(x.key, mini);
        } else {
          return (
            <OperationButton
              key={x.key}
              icon={x.icon}
              title={x.title}
              onClick={x.onClick}
              mini={mini}
              showTooltip={x.showTooltip ?? 'mini'}
              {...x.btnProps}
            />
          );
        }
      })}
    </Space>
  );
};
