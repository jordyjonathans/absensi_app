import { Avatar, Button, Card, Form, Input, Select, Space, Upload } from 'antd';
import { LayoutForm, LayoutFormButton } from '../../../config/layout';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { ProfileData, RolesData, UserPickerData } from '../../../store/types/profileType';
import { RcFile } from 'antd/lib/upload';
import Title from 'antd/lib/typography/Title';
import UserPicker from '../../../components/userPicker';

interface ProfileInfoUIProps {
  profileInfo: ProfileData;
  rolesInfo?: RolesData[];
  onFinishCallback: (values: ProfileData) => void;
  imagePreview?: string | null;
  onHandleImageChange: (file: RcFile) => boolean;
  onHandleUserPickerData: (value: string) => void;
  roleSlug?: string;
  userPickerData?: UserPickerData[];
}

const ProfileInfoUI = (props: ProfileInfoUIProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(props.profileInfo);
  }, [props.profileInfo]);

  return (
    <div style={{ maxWidth: 700, padding: 24 }}>
      {props.userPickerData && (
        <Card style={{ marginBottom: 24 }}>
          <Title level={4}>Select User</Title>
          <UserPicker
            userPickerInfo={props.userPickerData}
            onHandleUserPickerChange={props.onHandleUserPickerData}
          />
        </Card>
      )}

      <Card>
        <Title level={4}>User Profile</Title>
        <Form
          {...LayoutForm}
          name="basic"
          form={form}
          onFinish={props.onFinishCallback}
          initialValues={props.profileInfo}
        >
          <Form.Item label="Photo">
            <Space direction="vertical" align="center">
              <Avatar
                size={96}
                src={props.imagePreview}
                icon={!props.imagePreview && <UserOutlined />}
                style={{ backgroundColor: '#f5f5f5' }}
              />
              <Upload
                showUploadList={false}
                beforeUpload={props.onHandleImageChange}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Change Picture</Button>
              </Upload>
            </Space>
          </Form.Item>
          <Form.Item label="E-mail" name="email" rules={[{ required: true }]}>
            <Input disabled={props.roleSlug !== 'admin'} />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input type="password" />
          </Form.Item>

          <Form.Item label="Name" name="nama">
            <Input disabled={props.roleSlug !== 'admin'} />
          </Form.Item>
          <Form.Item label="Posisi" name="posisi">
            <Input disabled={props.roleSlug !== 'admin'} />
          </Form.Item>
          <Form.Item label="No HP" name="noHp">
            <Input />
          </Form.Item>

          <Form.Item label="Role ID" name="roleId">
            <Select placeholder="Select role" disabled={props.roleSlug !== 'admin'}>
              {props.rolesInfo &&
                props.rolesInfo.map(option => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.roleName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item {...LayoutFormButton}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileInfoUI;
