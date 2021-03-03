import * as React from 'react';

import { IIconProps } from './interfaces';
import { Icon } from 'antd';
import SchemaSvg from '../Svgs/Schema';

const DEFAULT_STYLE = {
  fontSize: '20px',
  color: 'rgb(90, 178, 94)',
};

const SchemaIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={SchemaSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export default React.memo<IIconProps>(SchemaIcon);
