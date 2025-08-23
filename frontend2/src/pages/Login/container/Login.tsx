import React from 'react';
import LoginUI from '../component/LoginUI';
import { LoginService } from '../../../services/Login';
import { DispatchLoginAction } from '../../../store/actions/adminAction';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { LoginInfo } from '../../../store/types/loginType';
import { getFirebaseToken } from '../../../services/firebaseMessaging';

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const domainLoginCallback = async (values: { email: string; password: string }) => {
    const fcmToken = await getFirebaseToken();

    LoginService.systemLogin({
      email: values.email,
      password: values.password,
      fcmToken: fcmToken || '',
    })
      .then((loginInfo: LoginInfo) => {
        DispatchLoginAction(dispatch, loginInfo);
        window.location.href = '/';
      })
      .catch(e => {
        message.error('Login Failed. ' + e, 2);
      });
  };

  return (
    <>
      <LoginUI domainLoginFinishCallback={domainLoginCallback} />
    </>
  );
};

export default Login;
