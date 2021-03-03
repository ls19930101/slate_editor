import * as React from 'react';

import { IIconProps } from './interfaces';
import { Icon } from 'antd';
import { ReactComponent as InsertColLeftSvg } from '../../assets/icons/insert_col_left.svg';
import { ReactComponent as InsertColRightSvg } from '../../assets/icons/insert_col_right.svg';
import { ReactComponent as InsertRowAboveSvg } from '../../assets/icons/insert_row_above.svg';
import { ReactComponent as InsertRowBelowSvg } from '../../assets/icons/insert_row_below.svg';
import { ReactComponent as RemoveColSvg } from '../../assets/icons/delete_column.svg';
import { ReactComponent as RemoveRowSvg } from '../../assets/icons/delete_row.svg';
import { ReactComponent as RemoveTableSvg } from '../../assets/icons/delete.svg';

const DEFAULT_STYLE = {
  fontSize: '14px',
  color: 'rgba(0,0,0,.85)',
};

const InsertRowAboveIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={InsertRowAboveSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const InsertRowBelowIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={InsertRowBelowSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const InsertColLeftIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={InsertColLeftSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const InsertColRightIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={InsertColRightSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const RemoveRowIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={RemoveRowSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const RemoveColIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={RemoveColSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const RemoveTableIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={RemoveTableSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export {
  InsertRowAboveIcon,
  InsertRowBelowIcon,
  InsertColLeftIcon,
  InsertColRightIcon,
  RemoveRowIcon,
  RemoveColIcon,
  RemoveTableIcon,
};
