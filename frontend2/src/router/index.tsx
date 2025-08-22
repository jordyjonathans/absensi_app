import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Error404 from '../pages/Error/Error404';
import FrameHome from '../pages/Frame';
import { getLoginInfo } from '../store/local';
import { IRouter } from '../components/Router/View';
import Main from '../pages/Main';
import Register from '../pages/Register';

function HomeGate() {
  if (getLoginInfo()?.token) {
    return <FrameHome />;
  }
  return <Login />;
}

const AdminRouters: IRouter[] = [
  {
    path: '/login',
    key: 'login',
    component: <Login />,
  },
  {
    path: '/home',
    key: 'home',
    component: <HomeGate />,
  },
  {
    path: '/',
    key: 'index',
    component: <HomeGate />,
    children: [
      {
        index: true,
        key: 'main_index',
        component: <Main.MainIndex />,
      },
      {
        path: '/profile/info',
        key: 'profile_info',
        component: <Profile.ProfileInfo />,
      },
      {
        path: '/profile/register',
        key: 'register',
        component: <Register.Register />,
      },
      {
        path: '*',
        key: 'error_404',
        component: <Error404 />,
      },
    ],
  },
];

export default AdminRouters;
