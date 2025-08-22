import { Dispatch } from 'redux';

export enum ActionType {
  LOADING,
  LOGIN,
  LOGOUT,
  PROFILE_ACCOUNT_UPDATE,
  LOGIN_INFO_UPDATE,
  ROLE_LIST_CHANGE,
  ROLE_SEARCH_CHANGE,
  ROLE_SEARCH_RESET,
  ROLE_EDIT_FINISH,
  ROLE_DELETE,
}

export interface AdminAction {
  type: ActionType;
  data: any;
}

export const DispatchLoginAction = (dispatch: Dispatch, data: any) => {
  dispatch({
    type: ActionType.LOGIN,
    data: data,
  });
};

export const DispatchLogoutAction = (dispatch: Dispatch, data: any) => {
  dispatch({
    type: ActionType.LOGOUT,
    data: data,
  });
};
