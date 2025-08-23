import { getUrlConfig } from '../config/url';
import httpRequest from './http';
import { ProfileData, RolesData, UserPickerData } from '../store/types/profileType';

const profileUrl = {
  profileUser: '/user',
  rolesInfo: '/user/roles',
};

class Profile {
  getProfileInfo(externalId: string): Promise<ProfileData> {
    let profileInfoUrl = getUrlConfig().proxyUrl + profileUrl.profileUser + '/' + externalId;

    return httpRequest.get<ProfileData>(profileInfoUrl, {});
  }

  getRoles(): Promise<RolesData[]> {
    let rolesInfoUrl = getUrlConfig().proxyUrl + profileUrl.rolesInfo;
    return httpRequest.get<RolesData[]>(rolesInfoUrl, {});
  }

  getUsers(): Promise<UserPickerData[]> {
    let userPickerInfoUrl = getUrlConfig().proxyUrl + profileUrl.profileUser;
    return httpRequest.get<UserPickerData[]>(userPickerInfoUrl, {});
  }

  profileUpdate(externalId: string, profileUpdateInfo: {} | FormData): Promise<any> {
    let profileUpdateUrl = getUrlConfig().proxyUrl + profileUrl.profileUser + '/' + externalId;
    return httpRequest.put<any>(profileUpdateUrl, {}, profileUpdateInfo);
  }

  profileRegister(profileRegisterInfo: {} | FormData): Promise<any> {
    let profileRegisterUrl = getUrlConfig().proxyUrl + profileUrl.profileUser;
    return httpRequest.post<any>(profileRegisterUrl, {}, profileRegisterInfo);
  }
}

export const ProfileService = new Profile();
