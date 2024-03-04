import { useState } from 'react';
import MOHLogo from '../assets/nav-logo.png';
import TextInput from '../components/TextInput';
import { Link } from 'react-router-dom';
import  { useNavigate } from 'react-router-dom';

function Registration() {
  const navigate = useNavigate()
  const [registrationData, setRegistrationData] = useState({
    idType: '',
    idNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (name, value) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const logUserIn = () => {
    localStorage.setItem('token', 'distoken')
    navigate("/")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    navigate("/")

    // Call API endpoint to get token
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <div className="mx-auto max-w-3xl">
        <img
          className="h-24 mx-auto"
          src={MOHLogo}
          alt="Ministry of Health"/>

        <h1 className='text-4xl text-[#163C94] text-center'>Self Registration</h1>

        <form className='mt-5 w-full max-w-64 px-40' onSubmit={handleSubmit}>

          <div>
            <select
              id="location"
              name="location"
              className="mt-2 block w-full rounded-md border-0 py-4 pl-3 pr-10 text-gray-400 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:leading-6"
              defaultValue="">
              <option>Identification Number</option>
              <option>Passport Number</option>
            </select>
          </div>

          <br />

          <TextInput
            inputType="number"
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

          <p className='text-center mt-3'>Already have an account? <Link className="text-[#163C94]" to="/auth">Login here</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Registration;