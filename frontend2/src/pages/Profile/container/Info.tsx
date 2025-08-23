import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { ProfileService } from '../../../services/Profile';
import ProfileInfoUI from '../component/InfoUI';
import { ProfileData, RolesData, UserPickerData } from '../../../store/types/profileType';
import { useOutletContext } from 'react-router-dom';
import { RcFile } from 'antd/lib/upload';

const DEFAULT_PROFILE_DATA: ProfileData = {
  email: '',
  fotoUrl: '',
  nama: '',
  noHp: '',
  posisi: '',
  roleId: 2,
} as const;

const ProfileInfo: React.FC = () => {
  const outlet = useOutletContext<{ myExternalId?: string; myRoleSlug?: string } | undefined>();
  const { myExternalId, myRoleSlug } = outlet || {};

  const [profileData, setProfileData] = useState<ProfileData>({ ...DEFAULT_PROFILE_DATA });
  const [rolesDataInfo, setRolesDataInfo] = useState<RolesData[]>();
  const [userPickerData, setUserPickerData] = useState<UserPickerData[]>();
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedExternalId, setSelectedExternalId] = useState<string>();

  useEffect(() => {
    getProfileFormInfo(myRoleSlug !== 'admin' ? myExternalId || '' : '');
  }, []);

  const getProfileFormInfo = async (externalId: string) => {
    const [rolesData, userPickerData] = await Promise.all([
      ProfileService.getRoles(),
      myRoleSlug === 'admin' && ProfileService.getUsers(),
    ]);

    setRolesDataInfo(rolesData);
    userPickerData && setUserPickerData(userPickerData);

    myRoleSlug !== 'admin' && getProfileData(externalId);
  };

  const getProfileData = (externalId: string) => {
    ProfileService.getProfileInfo(externalId)
      .then((profileData: ProfileData) => {
        setSelectedExternalId(externalId);
        setProfileData(profileData);
        profileData.fotoUrl && setImagePreview(profileData.fotoUrl);
      })
      .catch(() => {});
  };

  const onFinishCallback = (values: ProfileData) => {
    const formData = new FormData();

    formData.append('email', values.email);
    formData.append('password', values.password || ''); // optional
    formData.append('role_id', values.roleId.toString());
    formData.append('nama', values.nama);
    formData.append('posisi', values.posisi);
    formData.append('no_hp', values.noHp);

    if (selectedImage) {
      formData.append('profile_image', selectedImage); // matches multer field name
    }

    ProfileService.profileUpdate(selectedExternalId || '', formData)
      .then(() => {
        message.info('Update success');
        getProfileData(selectedExternalId || '');
      })
      .catch(() => {});
  };

  const handleImageChange = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedImage(file);
    return false; // Prevent auto upload
  };

  const handleUserPickerChange = (value: string) => {
    value && getProfileData(value);
  };

  return (
    <div className="pdt24">
      <ProfileInfoUI
        profileInfo={profileData}
        rolesInfo={rolesDataInfo}
        onFinishCallback={onFinishCallback}
        imagePreview={imagePreview}
        onHandleImageChange={handleImageChange}
        roleSlug={myRoleSlug}
        userPickerData={userPickerData}
        onHandleUserPickerData={handleUserPickerChange}
      />
    </div>
  );
};

export default ProfileInfo;
