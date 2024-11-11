import MOHLogo from "../assets/nav-logo.png";
import TextInput from "../components/TextInput";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Form, Input } from "antd";
import { useApiRequest } from "../api/useApi";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate();
  const { get } = useApiRequest();

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const { idNumber, email } = values;
      const results = await get(`/auth/client/reset-password?idNumber=${idNumber}&email=${email}`);

      if (!results) {
        // Error message is shown
      } else {
        navigation("/user-auth/set-password");
      }
    } catch (e) {
      console.log({ e });
    }

    setLoading(false);
  };

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8  mt-5 md:mt-32'>
      <div className='mx-auto max-w-3xl'>
        <img className='h-24 mx-auto' src={MOHLogo} alt='Ministry of Health' />

        <h1 className='text-4xl text-[#163C94] text-center'>Reset your password</h1>

        <Form className='flex flex-col mt-10 mx-10' onFinish={handleSubmit} layout='vertical'>
          <Form.Item name='idNumber' rules={[{ required: true, message: "Please enter your ID or Passport Number" }]}>
            <Input placeholder='ID or Passport Number' />
          </Form.Item>

          <Form.Item name='email' rules={[{ required: true, message: "Please enter your email" }]}>
            <Input placeholder='Email' />
          </Form.Item>

          <div className='flex justify-end'>
            <Button type='primary' htmlType='submit' loading={loading} disabled={loading} className='px-10'>
              Request Reset
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
