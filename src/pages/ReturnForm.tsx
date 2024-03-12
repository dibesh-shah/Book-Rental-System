import { Form, Input, Button, message, Select, Row, Col, DatePicker } from 'antd';
import { useEffect } from 'react';

import { MemberData, ReturnData } from "../assets/static-data";

interface BookFormProps {
  editMode: boolean;
  initialData: Object | null;
}

const { Option } = Select;

const ReturnForm: React.FC<BookFormProps>  = ({ editMode, initialData }) => {

    const [form] = Form.useForm();

  const onFinish = (values) => {
    // Handle form submission logic here
    console.log('Received values:', values);
    message.success('Book created successfully!');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Please check the form for errors.');
  };

  const onReset = () => {
    form.resetFields();
    
  };

  useEffect(() => {
    // Use setFieldsValue to set initial values after the form is mounted
    if (initialData) {
      form.setFieldsValue(initialData);
    }

    return () => {
      form.resetFields();
    };
  }, [form, initialData]);


  return (
    <Form
        form={form}
      name="bookForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{ span: 6, offset:0  }} 
      wrapperCol={{ span: 20 }}
    >
    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                label="Code"
                name="code"
                rules={[{ required: true, message: 'Please select a code!' }]}
            >
                <Select placeholder="Select Code">
                {ReturnData.map((data) => (
                    <Option key={data.key} value={data.code}>
                    {data.code}
                    </Option>
                ))}
                </Select>
            </Form.Item>
        </Col>

        <Col span={12}>
            <Form.Item
                label="Member"
                name="member"
                rules={[{ required: true, message: 'Please enter the member!' }]}
            >
                <Input placeholder="Member"  />
            </Form.Item>
        </Col>
    </Row>

    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                label="Request "
                name="from_date"
                rules={[{ required: true, message: 'Please enter the book request date!' }]}
            >
                <DatePicker placeholder="Book Request Date" className='w-full'/>
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                label="Return"
                name="to_date"
                rules={[{ required: true, message: 'Please enter the book return date!' }]}
            >
                <DatePicker placeholder="Book Return Date" className='w-full'/>
            </Form.Item>
        </Col>
    </Row>

    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                label="Status"
                name="active_closed"
                rules={[{ required: true, message: 'Please enter the status!' }]}
            >
                <Input  placeholder=" Status"  />
            </Form.Item>
        </Col>
        <Col span={12}>
             <Form.Item
                label="RentStatus"
                name="rent_status"
                rules={[{ required: true, message: 'Please enter the rent status date!' }]}
            >
                <Input  placeholder="Rent Status"  />
            </Form.Item>
        </Col>
    </Row>
    

    
      <Form.Item wrapperCol={{ offset: !editMode ? 18 : 20, span: 12 }}>
        <Button type="primary" className='bg-blue-600' htmlType="submit">
          {editMode ? 'Update' : 'Save'}
        </Button>
        {!editMode && (
          <Button type="primary" className='bg-green-600 ml-4' htmlType="button" onClick={onReset}>
            Reset
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default ReturnForm;
