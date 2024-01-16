import MOHLogo from '../assets/nav-logo.png'
import TextInput from '../components/TextInput'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
// import  { useNavigate } from 'react-router-dom'
import UsePostRequest from '../api/UsePostRequest'

export default function Login() {
  const [authData, setAuthData] = useState({
    idNumber: '',
    password: '',
  });

  const navigation = useNavigate()

  const handleChange = (name, value) => {
    setAuthData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    navigation("/")

    // Do something with authData, e.g., call an API
    console.log(authData);

    try {
      const { data, loading, error } = await UsePostRequest('auth/client/login', {
        idNumber: authData.idNumber,
        password: authData.password,
      });

      console.log({ data, loading, error });

      // Reset the form if needed
      setAuthData({ idNumber: '', password: '' });
    } catch (error) {
      console.error('Error in usePostRequest:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <div className="mx-auto max-w-3xl">
        <img
          className="h-24 mx-auto"
          src={MOHLogo}
          alt="Ministry of Health"/>

        <h1 className='text-4xl text-[#163C94] text-center'>Login to your account</h1>

        <p>{authData.idNumber}</p>

        <form className='mt-5' onSubmit={handleSubmit}>
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
            inputType="password"
            inputName="password"
            inputId="password"
            leadingIcon="true"
            inputValue={authData.password}
            onInputChange={(value) => handleChange("password", value)}
            leadingIconName="lock"
            inputPlaceholder="Password"/>

          <div className='text-right mx-10 text-[#707070] mt-3'>
            <Link to="/registration">Forgot password?</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <a
              href="#"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#4C7DE8] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]">
              <span className="text-sm font-semibold leading-6">
                Login with eCitizen
              </span>
            </a>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
              <span className="text-sm font-semibold leading-6">
                Login
              </span>
            </button>
          </div>

          <p className='text-center mt-3'>Don't have an account? <Link className="text-[#163C94]" to="/auth/registration">Sign up here</Link></p>
        </form>
      </div>
    </div>
  );
}