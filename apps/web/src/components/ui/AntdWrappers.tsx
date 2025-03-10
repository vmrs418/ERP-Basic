import React from 'react';
import { 
  Row as AntRow, 
  Col as AntCol, 
  Card as AntCard,
  Table as AntTable,
  DatePicker as AntDatePicker,
  Select as AntSelect,
  Button as AntButton,
  Spin as AntSpin,
  Tabs as AntTabs,
  Empty as AntEmpty,
  Tag as AntTag,
  Badge as AntBadge,
  Breadcrumb as AntBreadcrumb,
  Calendar as AntCalendar,
  Form as AntForm,
  Input as AntInput,
  Modal as AntModal,
  Popconfirm as AntPopconfirm,
  message,
  notification,
  Space as AntSpace,
  Dropdown as AntDropdown,
  Menu as AntMenu,
  Tooltip as AntTooltip,
  Upload as AntUpload,
  Drawer as AntDrawer,
  List as AntList,
  Avatar as AntAvatar,
  Checkbox as AntCheckbox,
  Radio as AntRadio,
  Switch as AntSwitch,
  Divider as AntDivider,
  Steps as AntSteps,
  Alert as AntAlert,
  Descriptions as AntDescriptions,
  Layout as AntLayout,
  Collapse as AntCollapse,
  Timeline as AntTimeline,
  Tree as AntTree,
  Cascader as AntCascader,
  Slider as AntSlider,
  TimePicker as AntTimePicker,
  Transfer as AntTransfer,
  TreeSelect as AntTreeSelect,
  InputNumber as AntInputNumber,
  Pagination as AntPagination,
  Popover as AntPopover,
} from 'antd';
import AntTextArea from 'antd/lib/input/TextArea';

// Re-export message and notification directly
export { message, notification };

// DatePicker components
const { RangePicker: AntRangePicker } = AntDatePicker;
export const DatePicker = (props: any) => <AntDatePicker {...props} />;
export const RangePicker = (props: any) => <AntRangePicker {...props} />;

// Select components
export const Select = (props: any) => <AntSelect {...props} />;
Select.Option = (props: any) => <AntSelect.Option {...props} />;

// Tabs components
export const Tabs = (props: any) => <AntTabs {...props} />;
Tabs.TabPane = (props: any) => <AntTabs.TabPane {...props} />;
export const TabPane = (props: any) => <AntTabs.TabPane {...props} />;

// Layout components
const { Header, Footer, Sider, Content } = AntLayout;
export const Layout = {
  ...AntLayout,
  Header: (props: any) => <Header {...props} />,
  Footer: (props: any) => <Footer {...props} />,
  Sider: (props: any) => <Sider {...props} />,
  Content: (props: any) => <Content {...props} />,
};

// Form components
export const Form = {
  ...AntForm,
  Item: (props: any) => <AntForm.Item {...props} />,
};

// Create a custom Statistic component
export const Statistic = (props: any) => {
  const { title, value, prefix, suffix, ...rest } = props;
  return (
    <div className="ant-statistic" {...rest}>
      {title && <div className="ant-statistic-title">{title}</div>}
      <div className="ant-statistic-content">
        {prefix && <span className="ant-statistic-content-prefix">{prefix}</span>}
        <span className="ant-statistic-content-value">{value}</span>
        {suffix && <span className="ant-statistic-content-suffix">{suffix}</span>}
      </div>
    </div>
  );
};

// Other components
export const Row = (props: any) => <AntRow {...props} />;
export const Col = (props: any) => <AntCol {...props} />;
export const Card = (props: any) => <AntCard {...props} />;
export const Table = (props: any) => <AntTable {...props} />;
export const Button = (props: any) => <AntButton {...props} />;
export const Spin = (props: any) => <AntSpin {...props} />;
export const Empty = (props: any) => <AntEmpty {...props} />;
export const Tag = (props: any) => <AntTag {...props} />;
export const Badge = (props: any) => <AntBadge {...props} />;
export const Breadcrumb = (props: any) => <AntBreadcrumb {...props} />;
Breadcrumb.Item = (props: any) => <AntBreadcrumb.Item {...props} />;
export const Calendar = (props: any) => <AntCalendar {...props} />;
export const Input = (props: any) => <AntInput {...props} />;
export const TextArea = (props: any) => <AntTextArea {...props} />;
export const Modal = (props: any) => <AntModal {...props} />;
export const Popconfirm = (props: any) => <AntPopconfirm {...props} />;
export const Space = (props: any) => <AntSpace {...props} />;
export const Dropdown = (props: any) => <AntDropdown {...props} />;
export const Menu = (props: any) => <AntMenu {...props} />;
Menu.Item = (props: any) => <AntMenu.Item {...props} />;
Menu.SubMenu = (props: any) => <AntMenu.SubMenu {...props} />;
export const Tooltip = (props: any) => <AntTooltip {...props} />;
export const Upload = (props: any) => <AntUpload {...props} />;
export const Drawer = (props: any) => <AntDrawer {...props} />;
export const List = (props: any) => <AntList {...props} />;
export const Avatar = (props: any) => <AntAvatar {...props} />;
export const Checkbox = (props: any) => <AntCheckbox {...props} />;
export const Radio = (props: any) => <AntRadio {...props} />;
export const Switch = (props: any) => <AntSwitch {...props} />;
export const Divider = (props: any) => <AntDivider {...props} />;
export const Progress = (props: any) => {
  const { percent, status, strokeWidth = 8, type = 'line', ...rest } = props;
  
  if (type === 'line') {
    return (
      <div className="ant-progress ant-progress-line" {...rest}>
        <div className="ant-progress-outer" style={{ width: '100%', height: strokeWidth + 'px' }}>
          <div className="ant-progress-inner">
            <div 
              className={`ant-progress-bg ${status ? `ant-progress-status-${status}` : ''}`}
              style={{ 
                width: `${percent}%`, 
                height: strokeWidth + 'px',
                background: status === 'success' ? '#52c41a' : 
                          status === 'exception' ? '#ff4d4f' : 
                          '#1890ff'
              }}
            ></div>
          </div>
        </div>
        {props.children && <span className="ant-progress-text">{props.children}</span>}
      </div>
    );
  }
  
  // For circle type, just return a simple representation
  return (
    <div className="ant-progress ant-progress-circle" {...rest}>
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '14px' }}>{percent}%</span>
      </div>
      {props.children && <span className="ant-progress-text">{props.children}</span>}
    </div>
  );
};
export const Steps = (props: any) => <AntSteps {...props} />;
export const Alert = (props: any) => <AntAlert {...props} />;
export const Descriptions = (props: any) => <AntDescriptions {...props} />;
Descriptions.Item = (props: any) => <AntDescriptions.Item {...props} />;
export const Collapse = (props: any) => <AntCollapse {...props} />;
export const Timeline = (props: any) => <AntTimeline {...props} />;
export const Tree = (props: any) => <AntTree {...props} />;
export const Cascader = (props: any) => <AntCascader {...props} />;
export const Slider = (props: any) => <AntSlider {...props} />;
export const TimePicker = (props: any) => <AntTimePicker {...props} />;
export const Transfer = (props: any) => <AntTransfer {...props} />;
export const TreeSelect = (props: any) => <AntTreeSelect {...props} />;
export const InputNumber = (props: any) => <AntInputNumber {...props} />;
export const Pagination = (props: any) => <AntPagination {...props} />;
export const Popover = (props: any) => <AntPopover {...props} />; 