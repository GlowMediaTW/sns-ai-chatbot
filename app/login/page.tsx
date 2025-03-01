'use client';

import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import message from 'antd/es/message';
import Spin from 'antd/es/spin';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    const { username, password } = values;

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    console.log(result);
    if (typeof result?.error === 'string') {
      messageApi.error('Invalid username or password');
    } else {
      messageApi.success('Login successful!');
      setTimeout(() => {
        router.push('/settings');
      }, 2000);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/settings');
    }
  }, [router, status]);

  if (status !== 'unauthenticated') {
    return (
      <div className="vw-100 vh-100 d-flex justify-content-center align-items-center">
        <Spin indicator={<LoadingOutlined className="fs-2 text-secondary" />} />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <Card title="Login" style={{ width: 400 }}>
          <Form name="login" layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Your username cannot be empty' }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Your password cannot be empty' }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}
