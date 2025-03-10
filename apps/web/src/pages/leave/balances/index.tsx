import React, { useState, useEffect } from 'react';
import { Table, Card, Select, DatePicker, Button, message, Space, Popconfirm } from 'antd';
import { DownloadOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import MainLayout from '../../../layouts/MainLayout';
import { fetchEmployeeLeaveBalances, EmployeeLeaveBalance, calculateLeaveBalances } from '../../../api/employeeLeaveBalances';
import { getEmployees, Employee } from '../../../api/employees';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';
import { Role } from '../../../types/auth';

const { Option } = Select;

const LeaveBalancesPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [balances, setBalances] = useState<EmployeeLeaveBalance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const isAdminOrHR = user?.roles?.some((role: Role) => ['admin', 'hr'].includes(role.name)) || false;

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      loadLeaveBalances(selectedEmployee, selectedYear);
    }
  }, [selectedEmployee, selectedYear]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      message.error('Failed to load employees');
      console.error(error);
    }
  };

  const loadLeaveBalances = async (employeeId: string, year: number) => {
    try {
      setLoading(true);
      const data = await fetchEmployeeLeaveBalances(employeeId, year);
      setBalances(data);
    } catch (error) {
      message.error('Failed to load leave balances');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (value: string) => {
    setSelectedEmployee(value);
  };

  const handleYearChange = (date: any, dateString: string) => {
    if (date) {
      setSelectedYear(date.year());
    }
  };

  const handleExport = () => {
    // Implement export functionality
    message.info('Export functionality will be implemented');
  };

  const handleAdjust = (id: string) => {
    router.push(`/leave/balances/adjust?id=${id}`);
  };

  const handleCalculateBalances = async () => {
    try {
      setCalculating(true);
      await calculateLeaveBalances(selectedYear);
      message.success(`Leave balances calculated for ${selectedYear}`);
      if (selectedEmployee) {
        loadLeaveBalances(selectedEmployee, selectedYear);
      }
    } catch (error) {
      message.error('Failed to calculate leave balances');
      console.error(error);
    } finally {
      setCalculating(false);
    }
  };

  const columns = [
    {
      title: 'Leave Type',
      dataIndex: ['leave_type', 'name'],
      key: 'leave_type',
      render: (_: string, record: EmployeeLeaveBalance) => (
        <span style={{ color: record.leave_type?.color_code }}>
          {record.leave_type?.name || 'Unknown'}
        </span>
      ),
    },
    {
      title: 'Opening Balance',
      dataIndex: 'opening_balance',
      key: 'opening_balance',
    },
    {
      title: 'Accrued',
      dataIndex: 'accrued',
      key: 'accrued',
    },
    {
      title: 'Used',
      dataIndex: 'used',
      key: 'used',
    },
    {
      title: 'Adjusted',
      dataIndex: 'adjusted',
      key: 'adjusted',
    },
    {
      title: 'Encashed',
      dataIndex: 'encashed',
      key: 'encashed',
    },
    {
      title: 'Carried Forward',
      dataIndex: 'carried_forward',
      key: 'carried_forward',
    },
    {
      title: 'Current Balance',
      dataIndex: 'closing_balance',
      key: 'closing_balance',
      render: (balance: number) => (
        <strong>{balance}</strong>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'last_updated',
      key: 'last_updated',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  // Add actions column if user is admin or HR
  if (isAdminOrHR) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      dataIndex: 'id',
      render: (_: any, record: EmployeeLeaveBalance) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleAdjust(record.id)}
          >
            Adjust
          </Button>
        </Space>
      ),
    });
  }

  return (
    <MainLayout title="Leave Balances">
      <div className="page-header">
        <h1>Leave Balances</h1>
        <Space>
          {isAdminOrHR && (
            <Popconfirm
              title="This will recalculate all leave balances based on policy and leave applications. Continue?"
              onConfirm={handleCalculateBalances}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="default"
                icon={<SyncOutlined />}
                loading={calculating}
              >
                Calculate Balances
              </Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            disabled={!selectedEmployee}
          >
            Export
          </Button>
        </Space>
      </div>

      <Card>
        <div className="filter-row" style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}>
          <Select
            placeholder="Select Employee"
            style={{ width: 300 }}
            onChange={handleEmployeeChange}
          >
            {employees.map(emp => (
              <Option key={emp.id} value={emp.id}>
                {`${emp.first_name} ${emp.last_name} (${emp.employee_code})`}
              </Option>
            ))}
          </Select>

          <DatePicker 
            picker="year" 
            defaultValue={null}
            onChange={handleYearChange}
            style={{ width: 120 }}
          />
        </div>

        {selectedEmployee ? (
          <Table
            columns={columns}
            dataSource={balances}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
            <p>Please select an employee to view leave balances</p>
          </div>
        )}
      </Card>
    </MainLayout>
  );
};

export default LeaveBalancesPage; 