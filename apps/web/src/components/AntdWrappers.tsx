import React, { ReactNode } from 'react';
import { 
  Typography, 
  Breadcrumb,
  Button,
  Tag,
  Row,
  Col,
  Form,
  Menu,
  Modal,
  Dropdown,
  Statistic,
  Table
} from 'antd';
import type { TableProps } from 'antd/lib/table';
import type { FormProps, FormItemProps } from 'antd/lib/form';
import type { ButtonProps } from 'antd/lib/button';
import type { TagProps } from 'antd/lib/tag';
import type { RowProps } from 'antd/lib/grid';
import type { ColProps } from 'antd/lib/grid';
import type { ModalProps } from 'antd/lib/modal';
import type { DropdownProps } from 'antd/lib/dropdown';
import type { StatisticProps } from 'antd/lib/statistic';
import type { MenuProps, MenuItemProps, MenuDividerProps } from 'antd/lib/menu';
import type { BreadcrumbProps, BreadcrumbItemProps } from 'antd/lib/breadcrumb';

// Typography wrappers
export const Title = ({ children, ...props }: { children: ReactNode; level?: 1 | 2 | 3 | 4 | 5; className?: string; style?: React.CSSProperties }) => (
  <Typography.Title {...props}>{children}</Typography.Title>
);
export const Text = ({ children, ...props }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <Typography.Text {...props}>{children}</Typography.Text>
);
export const Paragraph = ({ children, ...props }: { children: ReactNode; className?: string; style?: React.CSSProperties }) => (
  <Typography.Paragraph {...props}>{children}</Typography.Paragraph>
);

// Breadcrumb wrappers
export const BreadcrumbWrapper = ({ children, ...props }: { children: ReactNode } & BreadcrumbProps) => (
  <Breadcrumb {...props}>{children}</Breadcrumb>
);
export const BreadcrumbItemWrapper = ({ children, ...props }: { children: ReactNode } & BreadcrumbItemProps) => (
  <Breadcrumb.Item {...props}>{children}</Breadcrumb.Item>
);

// Button wrapper
export const ButtonWrapper = ({ children, ...props }: { children?: ReactNode } & ButtonProps) => (
  <Button {...props}>{children}</Button>
);

// Tag wrapper
export const TagWrapper = ({ children, ...props }: { children: ReactNode } & TagProps) => (
  <Tag {...props}>{children}</Tag>
);

// Row and Col wrappers
export const RowWrapper = ({ children, ...props }: { children: ReactNode } & RowProps) => (
  <Row {...props}>{children}</Row>
);
export const ColWrapper = ({ children, ...props }: { children: ReactNode } & ColProps) => (
  <Col {...props}>{children}</Col>
);

// Form wrappers
export const FormWrapper = ({ children, ...props }: { children: ReactNode } & FormProps) => (
  <Form {...props}>{children}</Form>
);
export const FormItemWrapper = ({ children, ...props }: { children: ReactNode } & FormItemProps) => (
  <Form.Item {...props}>{children}</Form.Item>
);

// Menu wrappers
export const MenuWrapper = ({ children, ...props }: { children: ReactNode } & MenuProps) => (
  <Menu {...props}>{children}</Menu>
);
export const MenuItemWrapper = ({ children, ...props }: { children: ReactNode } & MenuItemProps) => (
  <Menu.Item {...props}>{children}</Menu.Item>
);
export const MenuDividerWrapper = (props: MenuDividerProps) => (
  <Menu.Divider {...props} />
);

// Modal wrapper
export const ModalWrapper = ({ children, ...props }: { children: ReactNode } & ModalProps) => (
  <Modal {...props}>{children}</Modal>
);

// Dropdown wrapper
export const DropdownWrapper = ({ children, ...props }: { children: ReactNode } & DropdownProps) => (
  <Dropdown {...props}>{children}</Dropdown>
);

// Statistic wrapper
export const StatisticWrapper = (props: StatisticProps) => (
  <Statistic {...props} />
);

// Table wrapper
export const TableWrapper = <T extends object>(props: TableProps<T>) => (
  <Table<T> {...props} />
);

// Re-export the original components (for cases where we don't need the wrapper)
export { Typography, Breadcrumb, Button, Tag, Row, Col, Form, Menu, Modal, Dropdown, Statistic, Table }; 