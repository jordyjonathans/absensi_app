import { Dropdown, Layout, Space, MenuProps } from 'antd';
import { UserOutlined, LoginOutlined, ProfileOutlined, ProfileFilled } from '@ant-design/icons';

import { Link } from 'react-router-dom';

interface FrameHeaderUIProps {
  logoutCallback: () => void;
  roleSlug?: string;
}

const FrameHeaderUI = (props: FrameHeaderUIProps) => {
  const menuItems: MenuProps['items'] = [
    {
      label: <Link to="/profile/info">User Profile</Link>,
      key: 'profile_info',
      icon: <ProfileOutlined />,
    },
    ...(props.roleSlug === 'admin'
      ? [
          {
            label: <Link to="/profile/register">Register New User</Link>,
            key: 'register',
            icon: <ProfileFilled />,
          },
        ]
      : []),
    {
      type: 'divider',
    },
    {
      label: <a onClick={props.logoutCallback}>Logout</a>,
      key: 'profile_logout',
      icon: <LoginOutlined />,
    },
  ];
  return (
    <Layout.Header className="admin-header">
      <div className="admin-header-nav">
        <div className="admin-header-left">
          <div className="admin-header-logo">
            <a href="/">
              <span>Dexa Absensi App</span>
            </a>
          </div>
        </div>
        <div className="admin-header-right">
          <Dropdown menu={{ items: menuItems }}>
            <span className="admin-header-action">
              <Space>
                <UserOutlined />
              </Space>
            </span>
          </Dropdown>
        </div>
      </div>
    </Layout.Header>
  );
};

export default FrameHeaderUI;
