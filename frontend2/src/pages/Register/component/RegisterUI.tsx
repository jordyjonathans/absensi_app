import { Avatar, Button, Form, Input, Select, Space, Upload } from 'antd';
import { LayoutForm, LayoutFormButton } from '../../../config/layout';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { ProfileData, RolesData } from '../../../store/types/profileType';
import { RcFile } from 'antd/lib/upload';

interface RegisterUIProps {
  rolesInfo?: RolesData[];
  onFinishCallback: (values: ProfileData) => void;
  imagePreview?: string | null;
  onHandleImageChange: (file: RcFile) => boolean;
}

const RegisterUI = (props: RegisterUIProps) => {
  const [form] = Form.useForm();

  return (
    <div className="panel-body">
      <Form {...LayoutForm} name="basic" form={form} onFinish={props.onFinishCallback}>
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
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input />
        </Form.Item>

        <Form.Item label="Name" name="nama">
          <Input />
        </Form.Item>
        <Form.Item label="Posisi" name="posisi">
          <Input />
        </Form.Item>
        <Form.Item label="No HP" name="noHp">
          <Input />
        </Form.Item>

        <Form.Item label="Role ID" name="roleId">
          <Select placeholder="Select role">
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterUI;
