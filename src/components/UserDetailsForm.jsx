import { Form, Row, Col, Input } from 'antd'
import { useEffect } from 'react'

export default function UserDetailsForm() {

  const [form] = Form.useForm()
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('user'))
    form.setFieldsValue(userDetails)
  })

  return (
    <Form
      layout='vertical'
      form={form}
      autoComplete='off'>
      <Row
        gutter={16}
        className='mt-5 px-5'>
        <Col
          className='gutter-row w-full'
          md={12}
          sm={24}>
          <Form.Item
            name="firstName"
            className='w-full'
            label={
              <span>FIRST NAME</span>
            }>
            <Input placeholder='FIRST NAME' className='rounded-md' disabled />
          </Form.Item>
        </Col>

        <Col
          className='gutter-row w-full'
          md={12}
          sm={24}>
          <Form.Item
            name="lastName"
            label={
              <span>LAST NAME</span>
            }>
            <Input placeholder='LAST NAME' className='rounded-md' disabled />
          </Form.Item>
        </Col>

        <Col
          className='gutter-row w-full'
          md={12}
          sm={24}>
          <Form.Item
            name="idNumber"
            label={
              <span>ID NUMBER</span>
            }>
            <Input placeholder='ID NUMBER' className='rounded-md' disabled />
          </Form.Item>
        </Col>

        <Col
          className='gutter-row w-full'
          md={12}
          sm={24}>
          <Form.Item
            name="phone"
            label={
              <span>PHONE NUMBER</span>
            }>
            <Input placeholder='PHONE NUMBER' className='rounded-md' type='number' disabled />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}