import httpRequest from './http';
import { getUrlConfig } from '../config/url';
import { LoginInfo } from '../store/types/loginType';

const authUrl = {
  systemLogin: '/auth/signin',
};

class Login {
  getSystemLoginUrl(): string {
    return getUrlConfig().proxyUrl + authUrl.systemLogin;
  }

  systemLogin(loginInfo: {
    email: string;
    password: string;
    fcmToken: string;
  }): Promise<LoginInfo> {
    return httpRequest.post<LoginInfo>(this.getSystemLoginUrl(), {}, loginInfo);
  }
}

export const LoginService = new Login();
