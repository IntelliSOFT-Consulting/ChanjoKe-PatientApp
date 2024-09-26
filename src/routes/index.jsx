import { createBrowserRouter } from 'react-router-dom'
import Page404 from '../pages/Page404'
import Root from './Root'
import Home from '../pages/Home'
import VaccinationCertificate from '../pages/VaccinationCertificate'
import VaccinationSchedule from '../pages/VaccinationSchedule'
import Login from '../pages/Login'
import Registration from '../pages/Registration'
import UnauthorizedLayout from '../layouts/UnauthorizedLayout'
import FAQs from '../pages/FAQs'
import ResetPassword from '../pages/ResetPassword'
import SetNewPassword from '../pages/SetNewPassword'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Page404 />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'vaccination-schedule',
        element: <VaccinationSchedule />
      },
      {
        path: 'vaccination-certificate',
        element: <VaccinationCertificate />
      },
      {
        path: 'faqs',
        element: <FAQs />
      }
    ]
  },
  {
    path: '/auth',
    element: <UnauthorizedLayout />,
    errorElement: <Page404 />,
    children: [
      {
        path: '',
        element: <Login />
      },
      {
        path: 'registration',
        element: <Registration />
      },
      {
        path: 'reset-password',
        element: <ResetPassword />
      },
      {
        path: 'set-password',
        element: <SetNewPassword />
      }
    ]
  }
])

export default router;