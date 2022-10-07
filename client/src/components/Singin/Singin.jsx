/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './Singin.css';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import {
  Button, Checkbox, Form, Input,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../Redux/Actions/userAction';

function Singin() {
  const [sparkData, setSparkData] = useState([]);
  function randomData(num) {
    const arr = [];
    for (let i = 0; i < num; i += 1) {
      arr.push(Math.floor(Math.random() * 10) + 1);
    }
    return arr;
  }
  useEffect(() => {
    setSparkData(randomData(30));
  }, []);
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
            <Checkbox style={{ borderColor: 'black' }}>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" style={{ background: 'black', borderColor: 'black' }} size="large" shape="round">
              Войти
            </Button>
          </Form.Item>
        </Form>
        <Sparklines data={sparkData} limit={20}>
          <SparklinesLine color="#1c8cdc" />
          <SparklinesSpots />
        </Sparklines>
      </div>
    </div>
  );
}

export default Singin;
