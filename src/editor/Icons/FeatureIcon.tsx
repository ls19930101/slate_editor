import * as React from 'react';
import { Icon } from 'antd';
import FeatureSvg from '../Svgs/Feature';
import { IIconProps } from './interfaces';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: '#2091fe',
};

const UserStoryIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={FeatureSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(UserStoryIcon);
