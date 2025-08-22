import LocalStorage from '../utils/LocalStorage';
import { LoginInfo, LoginJWTData } from './types/loginType';

const LocalLoginInfoKey = 'AL_ADMIN_LOGIN_INFO';

export const setLoginInfo = (loginInfo: LoginJWTData) => {
  LocalStorage.setValue(LocalLoginInfoKey, loginInfo);
};

export const getLoginInfo = () => {
  const loginInfo = LocalStorage.getValue<LoginInfo>(LocalLoginInfoKey);
  if (loginInfo == null) {
    return undefined;
  }
  return loginInfo;
};

export const removeLoginInfo = () => {
  LocalStorage.removeValue(LocalLoginInfoKey);
};
