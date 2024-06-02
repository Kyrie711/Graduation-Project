import React from 'react';
import { Form, Button, Input, message } from 'antd';
import axios from 'axios';
import bcrypt from 'bcryptjs';

import { useNavigate } from 'react-router-dom';
import { sleep } from '@/util';
import { BackendUrl } from '@/consts';

import styles from './index.module.scss';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: '注册成功，即将跳转至主页',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '该账号已存在',
    });
  };

  const onFinish = async (values: any) => {
    const hashedPassword = await bcrypt.hash(values.password, 10);
    try {
      const res = await axios.post(`${BackendUrl}/auth/register`, {
        username: values.username,
        password: hashedPassword,
      });
      success();
      localStorage.setItem('token', res.data.token);
      await sleep(1000);
      navigate('/home', {
        replace: true,
      });
    } catch (e: any) {
      console.log(e?.response?.status === 400);
      error();
    }
  };

  return (
    <>
      {contextHolder}
      <div className={styles.register}>
        <div className={styles.left}>
          <div>
            欢迎使用<span style={{ color: '#84ebad' }}>股票分析系统</span>
          </div>
          <div>给您提供高效的股票行情展示</div>
        </div>
        <div className={styles.right}>
          <div className={styles.nav}>
            已有账户？
            <div
              className={styles.login}
              onClick={() =>
                navigate('/login', {
                  replace: true,
                })
              }
            >
              登录
            </div>
          </div>
          <div>
            <div className={styles.title}>注册账户</div>
            <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              style={{ width: 400 }}
              scrollToFirstError
              labelAlign="left"
            >
              <Form.Item
                name="username"
                label="账号"
                rules={[
                  {
                    required: true,
                    message: '请输入账号！',
                  },
                ]}
              >
                <Input placeholder="请输入账号" />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="确认密码"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请输入你的确认密码!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('您输入的新密码不匹配!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="请确认密码" />
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  注册
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
