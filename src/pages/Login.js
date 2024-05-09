import MOHLogo from '../assets/nav-logo.png'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button, Input, Form, Row, Col, Alert } from 'antd'
import { useApiRequest } from '../api/useApi'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const navigation = useNavigate()
  const { post, get } = useApiRequest()
  const [form] = Form.useForm()

  const handleSubmit = async (values) => {
    setLoading(true)

    try {
      const results = await post('/auth/client/login', values)

      if (!results) {
        // Error message is shown
      } else {
        localStorage.setItem('auth', JSON.stringify(results))

        const userData = await get('/auth/client/me')

        localStorage.setItem('user', JSON.stringify(userData?.user))

        navigation("/")
      }
    } catch (e) {
      console.log({ e })
    }

    setLoading(false)

  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  mt-5 md:mt-32">
      <div className="mx-auto max-w-3xl">
        <img
          className="h-24 mx-auto"
          src={MOHLogo}
          alt="Ministry of Health"/>

        <h1 className='text-4xl text-[#163C94] text-center'>Login to your account</h1>

        {/* <Alert
                message="Unauthorized: Incorrect credentials"
                type="warning"
                className='mt-4 mx-48'
                closable
                // onClose={onClose}
              /> */}

        <Form
          layout='vertical'
          form={form}
          onFinish={handleSubmit}
          className='mt-10 md:max-w-64 md:px-40'
          autoComplete='off'>
          <Row
            gutter={16}
            className='mt-5 px-5'>
              
              <Col
                className='gutter-row w-full'
                md={24}
                sm={24}>
                <Form.Item
                  name="idNumber"
                  className='w-full'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter ID number',
                    },
                    {
                      min: 5,
                      message: 'ID Number is too short',
                    },
                  ]}>
                    <Input
                      size='large'
                      placeholder='ID or Passport Number'
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      className='rounded-md' />
                </Form.Item> 
              </Col>

              <br />

              <Col
                className='gutter-row w-full'
                md={24}
                sm={24}>
                <Form.Item
                  name="password"
                  className='w-full'
                  rules={[
                    {
                      required: true,
                      message: 'Please enter password',
                    },
                    {
                      min: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                  ]}>
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                    />
                </Form.Item>
              </Col>
          </Row>

          <div className='text-right mx-10 text-[#707070]'>
            <Link to="/auth/reset-password">Forgot password?</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 mx-5">
            <div></div>
            <Button
              type="submit"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
              size="large">
                Login
              </Button>
          </div>

          <p className='text-center mt-3 mb-5'>Don't have an account? <Link className="text-[#163C94]" to="/auth/registration">Sign up here</Link></p>
        </Form>

      </div>
    </div>
  );
}