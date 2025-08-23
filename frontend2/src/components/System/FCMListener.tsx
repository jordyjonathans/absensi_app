// src/FcmListener.tsx
import { useEffect } from 'react';
import { notification } from 'antd';
import { getFirebaseToken, setupOnMessageListener } from '../../services/firebaseMessaging';

export default function FcmListener() {
  useEffect(() => {
    getFirebaseToken();

    setupOnMessageListener(payload => {
      payload.notification &&
        notification.open({
          message: payload.notification.title,
          description: payload.notification.body,
          duration: 0,
        });
    });
  }, []);

  return null;
}
