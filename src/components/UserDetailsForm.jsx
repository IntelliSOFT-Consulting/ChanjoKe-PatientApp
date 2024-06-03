import { Form, Row, Col, Input } from 'antd'
import { useEffect } from 'react'

export default function UserDetailsForm() {

  const [form] = Form.useForm()
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('user'))
    const userInfo = JSON.parse(localStorage.getItem('userDetails'))
    const moreDetails = {
      county: userInfo?.address?.[0]?.line?.[0],
      subCounty: userInfo?.address?.[0]?.line?.[1],
      ward: userInfo?.address?.[0]?.line?.[2],
    }
    form.setFieldsValue({ ...userDetails, ...moreDetails })
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

        <Col
          className='gutter-row w-full'
          md={12}
          sm={24}>
          <Form.Item
            name="county"
            className='w-full'
            label={
              <span>COUNTY</span>
            }>
            <Input placeholder='COUNTY' className='rounded-md' disabled />
          </Form.Item>
        </Col>

        <Col
          className='gutter-row w-full'
          md={12}
          sm={24}>
          <Form.Item
            name="subCounty"
            className='w-full'
            label={
              <span>SUB COUNTY</span>
            }>
            <Input placeholder='SUB COUNTY' className='rounded-md' disabled />
          </Form.Item>
        </Col>

        <Col
          className='gutter-row w-full'
          md={12}
          sm={24}>
          <Form.Item
            name="ward"
            className='w-full'
            label={
              <span>WARD</span>
            }>
            <Input placeholder='WARD' className='rounded-md' disabled />
          </Form.Item>
        </Col>

      </Row>
    </Form>
  )
}