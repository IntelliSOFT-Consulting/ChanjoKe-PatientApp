import MOHLogo from '../assets/nav-logo.png';
import TextInput from '../components/TextInput';
import { Link } from 'react-router-dom'
import  { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate()

  const logUserIn = () => {
    localStorage.setItem('token', 'distoken')
    navigate("/")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
      <div className="mx-auto max-w-3xl">
        <img
          className="h-24 mx-auto"
          src={MOHLogo}
          alt="Ministry of Health"/>

        <h1 className='text-4xl text-[#163C94] text-center'>Login to your account</h1>

        <form className='mt-5'>
          <TextInput
            inputType="email"
            inputName="email"
            inputId="email"
            leadingIcon="true"
            leadingIconName="mail"
            inputPlaceholder="ID or Passport Number"/>

          <br />

          <TextInput
            inputType="password"
            inputName="password"
            inputId="password"
            leadingIcon="true"
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
            <a
              onClick={logUserIn}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-[#163C94] px-3 py-3 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
              <span className="text-sm font-semibold leading-6">
                Login
              </span>
            </a>
          </div>

          <p className='text-center mt-3'>Don't have an account? <Link className="text-[#163C94]" to="/auth/registration">Sign up here</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Login;