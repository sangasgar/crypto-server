/* eslint-disable no-console */
import React from 'react';
import './Singin.css';
import {
  Button, Checkbox, Form, Input,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../Redux/Actions/userAction';

function Singin() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const onFinish = (values) => {
    dispatch(getUser(values));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="singin">
      <div className="intro">
        <h1>ВХОД</h1>
        {user.error ? user.error : null}
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" size="large" shape="round">
              Войти
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Singin;
