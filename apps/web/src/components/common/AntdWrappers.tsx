import React from 'react';
import { Tooltip as AntTooltip, TooltipProps, Tag as AntTag, TagProps, Col as AntCol, ColProps, Badge as AntBadge, BadgeProps, Select as AntSelect, SelectProps, Row as AntRow, RowProps, Spin as AntSpin, SpinProps } from 'antd';

interface ExtendedTooltipProps extends TooltipProps {
  children: React.ReactNode;
}

export const Tooltip: React.FC<ExtendedTooltipProps> = (props) => {
  return <AntTooltip {...props} />;
};

interface ExtendedTagProps extends TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<ExtendedTagProps> = (props) => {
  return <AntTag {...props} />;
};

// Define custom props for Col to avoid typing issues
interface CustomColProps {
  children?: React.ReactNode;
  className?: string;
  span?: number | string;
  xs?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
  [key: string]: any; // Allow any other props
}

export const Col: React.FC<CustomColProps> = (props) => {
  // Cast to any to avoid TypeScript issues
  return <AntCol {...props as any} />;
};

interface CustomBadgeProps {
  status?: string;
  text?: string;
  className?: string;
  color?: string;
  children?: React.ReactNode;
  count?: number;
  style?: React.CSSProperties;
  [key: string]: any; // Allow any other props
}

export const Badge: React.FC<CustomBadgeProps> = (props) => {
  return <AntBadge {...props as any} />;
};

interface CustomSelectOptionProps {
  children?: React.ReactNode;
  value: string | number;
  [key: string]: any; // Allow any other props
}

export const Option: React.FC<CustomSelectOptionProps> = (props) => {
  return <AntSelect.Option {...props as any} />;
};

interface CustomSelectProps extends SelectProps {
  children?: React.ReactNode;
  [key: string]: any; // Allow any other props
}

export const Select: React.FC<CustomSelectProps> = (props) => {
  return <AntSelect {...props as any} />;
};

interface CustomRowProps {
  children?: React.ReactNode;
  gutter?: number | [number, number] | object;
  className?: string;
  [key: string]: any; // Allow any other props
}

export const Row: React.FC<CustomRowProps> = (props) => {
  return <AntRow {...props as any} />;
};

interface CustomSpinProps extends SpinProps {
  className?: string;
  [key: string]: any; // Allow any other props
}

export const Spin: React.FC<CustomSpinProps> = (props) => {
  return <AntSpin {...props as any} />;
}; 