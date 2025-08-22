import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchLogoutAction } from '../../../store/actions/adminAction';
import '../component/home.css';
import FrameHeaderUI from '../component/HeaderUI';
import FrameFooterUI from '../component/FooterUI';
import { AdminState } from '../../../store/states/adminState';

const homeConfig = {
  footerText: 'Absensi App 2025 by Jordy',
};

const FrameHome: React.FC = () => {
  console.log('==START FRAME HOME==');
  const { externalId, roleSlug } = useSelector((state: AdminState) => state.loginState.user);

  const dispatch = useDispatch();

  useEffect(() => {}, [externalId]);

  const logoutCallback = () => {
    DispatchLogoutAction(dispatch, null);
    window.location.href = '/';
  };

  return (
    <Layout>
      <FrameHeaderUI logoutCallback={logoutCallback} roleSlug={roleSlug} />
      <Layout>
        <Layout className="admin-main">
          <Layout.Content className="admin-content">
            <Outlet context={{ myExternalId: externalId, myRoleSlug: roleSlug }} />
          </Layout.Content>
          <FrameFooterUI text={homeConfig.footerText} />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default FrameHome;
