import MOHLogo from '../assets/nav-logo.png'
import TextInput from '../components/TextInput'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from 'antd'
import { useApiRequest } from '../api/useApi'

export default function Login() {
  const [authData, setAuthData] = useState({
    idNumber: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisibility] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigation = useNavigate()
  const { post, get } = useApiRequest()

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
      const results = await post('/auth/client/login', authData)

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

        <form className='mt-10 w-full max-w-64 md:px-40' onSubmit={handleSubmit}>
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

          <div className='text-right mx-10 text-[#707070] mt-3'>
            <Link to="/registration">Forgot password?</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
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
        </form>
      </div>
    </div>
  );
}