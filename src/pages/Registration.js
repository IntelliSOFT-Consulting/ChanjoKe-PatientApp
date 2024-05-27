import { useState } from 'react'
import MOHLogo from '../assets/nav-logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useApiRequest } from '../api/useApi'
import { Button, message, Input, Form, Row, Col } from 'antd'
import { LockOutlined, UserOutlined, MailOutlined, BookOutlined, WarningTwoTone } from '@ant-design/icons'

function Registration() {
  const navigate = useNavigate()
  const { post } = useApiRequest()
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [registrationError, setRegistrationError] = useState(false)

  const logUserIn = async (values) => {
    setLoading(true)

    try {
      const results = await post('/auth/client/register', values)

      console.log({ results })

      if (!results) {
        setRegistrationError(true)
        // Error message is shown
      } else {
        setRegistrationError(false)
        message.success('Registration successful, log in with the credentials used')

        navigate("/auth")
      }
    } catch (e) {
      console.log({ e })
    }

    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-5 md:mt-32">
      <div className="mx-auto max-w-3xl">
        <img
          className="h-24 mx-auto"
          src={MOHLogo}
          alt="Ministry of Health"/>

        <h1 className='text-4xl text-[#163C94] text-center'>Self Registration</h1>

        <Form
          layout='vertical'
          form={form}
          onFinish={logUserIn}
          className='mt-10 md:max-w-64 md:px-40'
          autoComplete='off'>
          <Row
            gutter={16}
            className='mt-5 px-5'>

            {registrationError && <div className="flex flex-col items-center bg-red-100 py-2 px-4 rounded-md ml-0 md:ml-2 h-full my-0 max-w-full mb-5">
              <WarningTwoTone
                twoToneColor="red"
                classID="text-black text-6xl"
              />
              <div className="ml-2 text-sm">
                Incorrect credentials when registering, please consult your practitioner for more information
              </div>
            </div>
            }

            <Col
              className='gutter-row w-full'
              md={24}
              sm={24}>
              <Form.Item
                name="secretCode"
                hasFeedback
                className='w-full'
                rules={[
                  {
                    required: true,
                    message: 'Please enter secret code',
                  },
                  {
                    min: 5,
                    message: 'Code is too short',
                  },
                ]}>
                  <Input
                    size='large'
                    placeholder='ID given by provider'
                    prefix={<BookOutlined className="site-form-item-icon" />}
                    className='rounded-md' />
              </Form.Item>
            </Col>

            <Col
              className='gutter-row w-full'
              md={24}
              sm={24}>
              <Form.Item
                name="idNumber"
                className='w-full'
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please enter ID Number',
                  },
                ]}>
                  <Input
                    size='large'
                    placeholder='ID Number'
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    className='rounded-md' />
              </Form.Item>
            </Col>

            <Col
              className='gutter-row w-full'
              md={24}
              sm={24}>
              <Form.Item
                name="email"
                className='w-full'
                hasFeedback
                rules={[
                  { type: 'email', message: 'Please enter a valid email address!' },
                  { required: true, message: 'Please input your email!' },
                ]}>
                  <Input
                    size='large'
                    type='email'
                    placeholder='Email'
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    className='rounded-md' />
              </Form.Item>
            </Col>

            <Col
              className='gutter-row w-full'
              md={24}
              sm={24}>
              <Form.Item
                name="password"
                className='w-full'
                hasFeedback
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
                    size='large'
                    type='password'
                    placeholder='Password'
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    className='rounded-md' />
              </Form.Item>
            </Col>

            <Col
              className='gutter-row w-full'
              md={24}
              sm={24}>
              <Form.Item
                name="confirmPassord"
                className='w-full'
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}>
                  <Input.Password
                    size='large'
                    type='password'
                    placeholder='Confirm Password'
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    className='rounded-md' />
              </Form.Item>
            </Col>
          </Row>

          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div></div>

            <Button
              type="submit"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
              size="large">
                Register
              </Button>
          </div>

          <p className='text-center mt-3 mb-5'>Already have an account? <Link className="text-[#163C94]" to="/auth">Login here</Link></p>
        </Form>

      </div>
    </div>
  );
}

export default Registration;