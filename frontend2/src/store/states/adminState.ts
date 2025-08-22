import { getLoginInfo } from '../local';
import { LoginJWTData } from '../types/loginType';

const loginInfo = getLoginInfo();

export const initAdminState: AdminState = {
  loginState: {
    loginToken: loginInfo?.token || '',
    user: loginInfo?.user || { email: '', externalId: '', roleName: '', roleSlug: '' },
  },
  frameState: {},
};

export interface AdminState {
  loginState: LoginState;
  frameState: FrameState;
}

export interface LoginState {
  loginToken: string;
  user: LoginJWTData;
}

export interface FrameState {}
