import * as React from "react";

import { ReactComponent as BoldSvg } from "../../assets/icons/bold.svg";
import { ReactComponent as BulletedlistSvg } from "../../assets/icons/bulleted_list.svg";
import { ReactComponent as CodeSvg } from "../../assets/icons/code.svg";
import { ReactComponent as H1Svg } from "../../assets/icons/h1.svg";
import { ReactComponent as H2Svg } from "../../assets/icons/h2.svg";
import { ReactComponent as H3Svg } from "../../assets/icons/h3.svg";
import { IIconProps } from "./interfaces";
import { Icon } from "antd";
import { ReactComponent as ItalicSvg } from "../../assets/icons/italic.svg";
import { ReactComponent as LinkSvg } from "../../assets/icons/link.svg";
import { ReactComponent as NumberedlistSvg } from "../../assets/icons/numbered_list.svg";
import { ReactComponent as ParagraphSvg } from "../../assets/icons/paragraph.svg";
import { ReactComponent as QuoteSvg } from "../../assets/icons/quote.svg";
import { ReactComponent as StrikethroughSvg } from "../../assets/icons/strike_through.svg";
import { ReactComponent as TableSvg } from "../../assets/icons/table.svg";
import { ReactComponent as UnderlineSvg } from "../../assets/icons/underline.svg";

const DEFAULT_STYLE = {
  fontSize: "14px",
  color: "rgba(0,0,0,.85)",
};

const ParagraphIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon
    component={ParagraphSvg}
    style={{ ...DEFAULT_STYLE, ...style }}
    {...rest}
  />
);

const H1Icon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={H1Svg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const H2Icon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={H2Svg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const H3Icon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={H3Svg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const QuoteIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={QuoteSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const NumberedlistIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon
    component={NumberedlistSvg}
    style={{ ...DEFAULT_STYLE, ...style }}
    {...rest}
  />
);

const BulletedlistIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon
    component={BulletedlistSvg}
    style={{ ...DEFAULT_STYLE, ...style }}
    {...rest}
  />
);

const UnderlineIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon
    component={UnderlineSvg}
    style={{ ...DEFAULT_STYLE, ...style }}
    {...rest}
  />
);
const BoldIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={BoldSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const ItalicIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon
    component={ItalicSvg}
    style={{ ...DEFAULT_STYLE, ...style }}
    {...rest}
  />
);

const StrikethroughIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon
    component={StrikethroughSvg}
    style={{ ...DEFAULT_STYLE, ...style }}
    {...rest}
  />
);

const CodeIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={CodeSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const LinkIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={LinkSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

const TableIcon: React.FC<IIconProps> = ({ style, ...rest }) => (
  <Icon component={TableSvg} style={{ ...DEFAULT_STYLE, ...style }} {...rest} />
);

export {
  ParagraphIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  QuoteIcon,
  NumberedlistIcon,
  BulletedlistIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
  LinkIcon,
  TableIcon,
};
