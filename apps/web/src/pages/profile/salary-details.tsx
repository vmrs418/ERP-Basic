import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Spin, Alert, Button, Divider, Tabs, Typography, Tag } from 'antd';
import { LockOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getEmployeeSalary, getEmployeePayslips, SalaryDetail, PayslipItem } from '../../api/payroll';
import { formatDate } from '../../utils/dateUtils';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const SalaryDetailsPage = () => {
  const { user } = useAuth();
  const [salaryDetails, setSalaryDetails] = useState<SalaryDetail | null>(null);
  const [payslips, setPayslips] = useState<PayslipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('salary');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (user?.id) {
      loadSalaryDetails();
    }
  }, [user]);

  useEffect(() => {
    if (user?.id && activeTab === 'payslips') {
      loadPayslips();
    }
  }, [user, activeTab, selectedYear]);

  const loadSalaryDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        setError('User information not available');
        return;
      }
      
      const data = await getEmployeeSalary(user.id);
      setSalaryDetails(data);
    } catch (err) {
      console.error('Error loading salary details', err);
      setError('Failed to load salary details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const loadPayslips = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        setError('User information not available');
        return;
      }
      
      const data = await getEmployeePayslips(user.id, selectedYear);
      setPayslips(data);
    } catch (err) {
      console.error('Error loading payslips', err);
      setError('Failed to load payslips. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };
  
  const renderSalaryDetails = () => {
    if (!salaryDetails) {
      return (
        <Alert
          message="No Salary Information"
          description="No salary details have been configured yet. Please contact HR for assistance."
          type="info"
          showIcon
        />
      );
    }
    
    const totalEarnings = (
      salaryDetails.basic_salary +
      salaryDetails.hra +
      salaryDetails.conveyance_allowance +
      salaryDetails.medical_allowance +
      salaryDetails.special_allowance
    );
    
    const totalDeductions = (
      salaryDetails.pf_employee_contribution +
      salaryDetails.esi_employee_contribution +
      salaryDetails.professional_tax
    );
    
    const netSalary = totalEarnings - totalDeductions;
    
    return (
      <>
        <Alert 
          message="Confidential Information" 
          description="Please keep your salary information confidential." 
          type="warning" 
          showIcon
          icon={<LockOutlined />}
          style={{ marginBottom: '20px' }}
        />
        
        <Descriptions
          title="Earnings"
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Basic Salary">₹{salaryDetails.basic_salary.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="HRA">₹{salaryDetails.hra.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Conveyance Allowance">₹{salaryDetails.conveyance_allowance.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Medical Allowance">₹{salaryDetails.medical_allowance.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Special Allowance">₹{salaryDetails.special_allowance.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Total Earnings" className="total-row">
            <Text strong>₹{totalEarnings.toFixed(2)}</Text>
          </Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Descriptions
          title="Deductions"
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="PF Employee Contribution">₹{salaryDetails.pf_employee_contribution.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="ESI Employee Contribution">₹{salaryDetails.esi_employee_contribution.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Professional Tax">₹{salaryDetails.professional_tax.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Total Deductions" className="total-row">
            <Text strong>₹{totalDeductions.toFixed(2)}</Text>
          </Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Descriptions
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="Net Salary" className="total-row">
            <Text strong style={{ fontSize: '16px' }}>₹{netSalary.toFixed(2)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Effective From">
            {formatDate(salaryDetails.effective_from)}
          </Descriptions.Item>
        </Descriptions>
        
        <div style={{ marginTop: '20px' }}>
          <Text type="secondary">
            * PF Employer Contribution (₹{salaryDetails.pf_employer_contribution.toFixed(2)}) and 
            ESI Employer Contribution (₹{salaryDetails.esi_employer_contribution.toFixed(2)}) 
            are company contributions and not part of take-home salary.
          </Text>
        </div>
      </>
    );
  };
  
  const renderPayslips = () => {
    if (payslips.length === 0) {
      return (
        <Alert
          message="No Payslips Found"
          description={`No payslips are available for the selected year (${selectedYear}).`}
          type="info"
          showIcon
        />
      );
    }
    
    const years = Array.from(new Set(payslips.map(p => new Date(p.created_at).getFullYear()))).sort();
    const currentYear = new Date().getFullYear();
    const availableYears = [...new Set([...years, currentYear])].sort().reverse();
    
    return (
      <>
        <div style={{ marginBottom: '20px' }}>
          <Text>Select Year: </Text>
          {availableYears.map(year => (
            <Button 
              key={year}
              type={selectedYear === year ? 'primary' : 'default'}
              style={{ marginRight: '8px', marginBottom: '8px' }}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </Button>
          ))}
        </div>
        
        <div className="payslips-container">
          {payslips.map(payslip => {
            const monthNames = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            const payslipDate = new Date(payslip.created_at);
            const monthName = monthNames[payslipDate.getMonth()];
            const year = payslipDate.getFullYear();
            
            return (
              <Card 
                key={payslip.id} 
                className="payslip-card"
                style={{ marginBottom: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong style={{ fontSize: '16px' }}>{monthName} {year} Payslip</Text>
                    <div>
                      <Text>Net Amount: </Text>
                      <Text strong>₹{payslip.net_salary.toFixed(2)}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Generated on {formatDate(payslip.created_at)}</Text>
                    </div>
                  </div>
                  <div>
                    <Tag color={payslip.status === 'paid' ? 'green' : (payslip.status === 'published' ? 'blue' : 'orange')}>
                      {payslip.status.toUpperCase()}
                    </Tag>
                    <Button 
                      icon={<FileTextOutlined />}
                      type="primary"
                      onClick={() => window.open(`/api/payslips/${payslip.id}/download`)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </>
    );
  };
  
  return (
    <MainLayout title="Salary Details">
      <div className="page-header">
        <div>
          <Title level={2}>
            <DollarOutlined /> Salary Details
          </Title>
        </div>
      </div>
      
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}
      
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Salary Structure" key="salary" />
          <TabPane tab="Payslips" key="payslips" />
        </Tabs>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="details-container">
            {activeTab === 'salary' ? renderSalaryDetails() : renderPayslips()}
          </div>
        )}
      </Card>
      
      <style jsx global>{`
        .total-row {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        
        .payslip-card {
          transition: all 0.3s;
        }
        
        .payslip-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </MainLayout>
  );
};

export default SalaryDetailsPage; 