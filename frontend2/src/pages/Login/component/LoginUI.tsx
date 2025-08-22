import { Button, Col, Form, Input, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.css';

import logoImg from '../../../assets/images/logo_2.png';

interface LoginUIProps {
  domainLoginFinishCallback: (values: any) => void;
}

const DomainLoginUI = (props: LoginUIProps) => {
  const [domainLoginForm] = Form.useForm();

  return (
    <Form
      name="domain_login"
      className="login-form"
      form={domainLoginForm}
      initialValues={{ remember: true }}
      onFinish={props.domainLoginFinishCallback}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, type: 'email', message: 'E-mail not valid!' }]}
      >
        <Input
          size="large"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="E-mail"
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Password cannot be empty!' }]}>
        <Input
          size="large"
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button size="large" type="primary" htmlType="submit" className="login-form-button" block>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

const LoginUI = (props: LoginUIProps) => {
  return (
    <div className="login">
      <div className="login-header">
        <div className="login-title">
          <img src={logoImg} alt="logo"></img>
        </div>
      </div>
      <div className="login-content">
        <Row justify="center">
          <Col span={6}>
            <DomainLoginUI {...props} />
          </Col>
        </Row>
      </div>
      <div className="login-footer">
        <p className="login-footer-recommed">*Created by Jordy Jonathan Sjarif</p>
      </div>
    </div>
  );
};

export default LoginUI;
