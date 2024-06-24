import MOHLogo from '../assets/nav-logo.png'
import TextInput from '../components/TextInput'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button, message } from 'antd'
import { useApiRequest } from '../api/useApi'

export default function SetNewPassword() {
  const [authData, setAuthData] = useState({
    resetCode: '',
    idNumber: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisibility] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigation = useNavigate()
  const { post } = useApiRequest()

  const handleChange = (name, value) => {
    setAuthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const results = await post('/auth/client/reset-password', authData)

      if (!results) {
        // Error message is shown
      } else {
        message.info('Password reset successfully, you can login')

        navigation("/auth/login")
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

        <h1 className='text-4xl text-[#163C94] text-center'>Reset your password</h1>

        <form className='mt-10 w-full max-w-64 md:px-40' onSubmit={handleSubmit}>
        <TextInput
            inputType="text"
            inputName="resetCode"
            inputId="resetCode"
            inputValue={authData.resetCode}
            onInputChange={(value) => handleChange("resetCode", value)}
            leadingIcon="true"
            leadingIconName="mail"
            inputPlaceholder="Reset Code"/>

            <br />
          <TextInput
            inputType="text"
            inputName="idNumber"
            inputId="idNumber"
            inputValue={authData.idNumber}
            onInputChange={(value) => handleChange("idNumber", value)}
            leadingIcon="true"
            leadingIconName="mail"
            inputPlaceholder="ID or Passport Number"/>

          <br />

          <TextInput
            inputType={passwordVisible ? 'text' : 'password'}
            inputName="password"
            inputId="password"
            leadingIcon="true"
            inputValue={authData.password}
            onInputChange={(value) => handleChange("password", value)}
            leadingIconName="lock"
            trailingIcon="true"
            onTrailingIconClick={() => setPasswordVisibility(!!passwordVisible)}
            trailingIconName="visibility"
            inputPlaceholder="Password"/>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div></div>
            <Button
              type="submit"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
              size="large">
                Reset Password
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
}