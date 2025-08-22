import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { ProfileService } from '../../../services/Profile';
import { ProfileData, RolesData } from '../../../store/types/profileType';
import { RcFile } from 'antd/lib/upload';
import RegisterUI from '../component/RegisterUI';

const Register: React.FC = () => {
  const [rolesDataInfo, setRolesDataInfo] = useState<RolesData[]>();
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    getRolesData();
  }, []);

  const getRolesData = () => {
    ProfileService.getRoles()
      .then((rolesData: RolesData[]) => {
        setRolesDataInfo(rolesData);
      })
      .catch(() => {});
  };

  const onFinishCallback = (values: ProfileData) => {
    console.log('values:', values);
    const formData = new FormData();

    formData.append('email', values.email);
    formData.append('password', values.password || '');
    formData.append('role_id', values.roleId?.toString() || '');
    formData.append('nama', values.nama);
    formData.append('posisi', values.posisi);
    formData.append('no_hp', values.noHp);

    if (selectedImage) {
      formData.append('profile_image', selectedImage);
    }

    console.log('formData:', formData);

    ProfileService.profileRegister(formData)
      .then(() => {
        message.info('Register Success');
        window.location.href = `${window.location.origin}`;
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
    return false;
  };
  return (
    <div className="pdt24">
      <RegisterUI
        rolesInfo={rolesDataInfo}
        onFinishCallback={onFinishCallback}
        imagePreview={imagePreview}
        onHandleImageChange={handleImageChange}
      />
    </div>
  );
};

export default Register;
