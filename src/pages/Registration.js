import { useState } from 'react';
import MOHLogo from '../assets/nav-logo.png';
import TextInput from '../components/TextInput';
import { Link } from 'react-router-dom';
import  { useNavigate } from 'react-router-dom';
import { useApiRequest } from '../api/useApi'
import { message } from 'antd'

function Registration() {
  const navigate = useNavigate()
  const { post, get } = useApiRequest()
  const [registrationData, setRegistrationData] = useState({
    idNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretCode: '',
  })

  const handleChange = (name, value) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const logUserIn = async (e) => {

    e.preventDefault()

    try {
      const results = await post('/auth/client/register', registrationData)

      if (!results) {
        // Error message is shown
      } else {
        message.success('Registration successful, log in with the credentials used')

        navigate("/auth")
      }
    } catch (e) {
      console.log({ e })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-5 md:mt-32">
      <div className="mx-auto max-w-3xl">
        <img
          className="h-24 mx-auto"
          src={MOHLogo}
          alt="Ministry of Health"/>

        <h1 className='text-4xl text-[#163C94] text-center'>Self Registration</h1>

        <form className='mt-5 w-full max-w-64 md:px-40'>

          {/* <div>
            <select
              id="location"
              name="location"
              className="mt-2 block w-full rounded-md border-0 py-4 pl-3 pr-10 text-gray-400 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:leading-6"
              defaultValue="">
              <option>Identification Number</option>
              <option>Passport Number</option>
            </select>
          </div> */}

          <TextInput
            inputType="text"
            inputName="secretCode"
            inputId="secretCode"
            leadingIcon="true"
            inputValue={registrationData.secretCode}
            onInputChange={(value) => handleChange("secretCode", value)}
            leadingIconName="remember_me"
            inputPlaceholder="ID given by provider"/>
          
          <br />

          <TextInput
            inputType="text"
            inputName="idNumber"
            inputId="idNumber"
            leadingIcon="true"
            inputValue={registrationData.idNumber}
            onInputChange={(value) => handleChange("idNumber", value)}
            leadingIconName="branding_watermark"
            inputPlaceholder="ID Number"/>

          <br />

          <TextInput
            inputType="email"
            inputName="email"
            inputId="email"
            leadingIcon="true"
            inputValue={registrationData.email}
            onInputChange={(value) => handleChange("email", value)}
            leadingIconName="mail"
            inputPlaceholder="Email"/>

          <br />

          <TextInput
            inputType="password"
            inputName="password"
            autocomplete="new_password"
            inputId="password"
            leadingIcon="true"
            trailingIcon="true"
            trailingIconName="visibility"
            inputValue={registrationData.password}
            onInputChange={(value) => handleChange("password", value)}
            leadingIconName="lock"
            inputPlaceholder="Password"/>

          <br />

          <TextInput
            inputType="password"
            inputName="confirm_password"
            autocomplete="new_password"
            inputId="confirm_password"
            leadingIcon="true"
            trailingIcon="true"
            trailingIconName="visibility"
            inputValue={registrationData.confirmPassword}
            onInputChange={(value) => handleChange("confirmPassword", value)}
            leadingIconName="lock"
            inputPlaceholder="Confirm Password"/>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div></div>
            <a
              onClick={logUserIn}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
              <span className="text-sm font-semibold leading-6">
                Submit
              </span>
            </a>
          </div>

          <p className='text-center mt-3 mb-5'>Already have an account? <Link className="text-[#163C94]" to="/auth">Login here</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Registration;