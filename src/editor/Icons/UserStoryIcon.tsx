import * as React from 'react';
import { Icon } from 'antd';
import UserStorySvg from '../Svgs/Userstory';
import { IIconProps } from './interfaces';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(90, 178, 94)',
};

const UserStoryIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={UserStorySvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(UserStoryIcon);
