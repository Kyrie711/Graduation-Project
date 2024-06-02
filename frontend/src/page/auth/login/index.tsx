import React from 'react';
import axios from 'axios';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { sleep } from '@/util';
import { BackendUrl } from '@/consts';

import styles from './index.module.scss';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: '登录成功',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '账号或密码错误',
    });
  };

  const onFinish = async (values: any) => {
    try {
      const res = await axios.post(`${BackendUrl}/auth/login`, {
        username: values.username,
        password: values.password,
      });
      success();
      localStorage.setItem('token', res.data.token);
      await sleep(600);
      navigate('/home', {
        replace: true,
      });
    } catch (e: any) {
      console.log(e?.response?.status === 401);
      error();
    }
  };

  const handleRegister = () => {
    navigate('/register', {
      replace: true,
    });
  };
  return (
    <>
      {contextHolder}
      <div className={styles.register}>
        <div className={styles.left}>
          <div>
            欢迎来到<span style={{ color: '#84ebad' }}>股票分析系统</span>
          </div>
        </div>
        <div className={styles.right}>
          <div>
            <div className={styles.title}>用户登录</div>
            <Form
              initialValues={{ remember: true }}
              onFinish={onFinish}
              style={{ width: 320 }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入你的用户名!' }]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="用户名"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your Password!' },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登录
                </Button>
                {` Or `}{' '}
                <a href="" onClick={handleRegister}>
                  {' '}
                  现在注册!
                </a>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
