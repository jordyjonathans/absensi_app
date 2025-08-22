import { ActionType, AdminAction } from '../actions/adminAction';
import { removeLoginInfo, setLoginInfo } from '../local';
import { initAdminState, LoginState } from '../states/adminState';

const login = (
  loginState: LoginState = initAdminState.loginState,
  action: AdminAction
): LoginState => {
  console.log('loginState:', loginState);
  console.log('actionData:', action.data);
  setLoginInfo(action.data);
  console.log('action:', action.data);
  return {
    ...loginState,
    loginToken: action.data?.token,
    user: action.data?.user,
  };
};

const loginUpdate = (
  loginState: LoginState = initAdminState.loginState,
  action: AdminAction
): LoginState => {
  return {
    loginToken: action.data?.login_token,
    user: action.data?.user,
  };
};

const logout = (
  loginState: LoginState = initAdminState.loginState,
  action: AdminAction
): LoginState => {
  removeLoginInfo();
  return {
    loginToken: '',
    user: {
      email: '',
      externalId: '',
      roleName: '',
      roleSlug: '',
    },
  };
};

export const loginReducer = (
  loginState: LoginState = initAdminState.loginState,
  action: AdminAction
): LoginState => {
  switch (action.type) {
    case ActionType.LOGIN:
      return login(loginState, action);
    case ActionType.LOGIN_INFO_UPDATE:
      return loginUpdate(loginState, action);
    case ActionType.LOGOUT:
      return logout(loginState, action);
    default:
      return loginState;
  }
};
