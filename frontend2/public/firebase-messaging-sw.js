/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC_MdtsczQwkaketG285TCnBrcK85eDn4g',
  authDomain: 'absensi-app-ff2b4.firebaseapp.com',
  projectId: 'absensi-app-ff2b4',
  storageBucket: 'absensi-app-ff2b4.firebasestorage.app',
  messagingSenderId: '448992788971',
  appId: '1:448992788971:web:08a5f41c02b4cd4f9899ae',
  measurementId: 'G-37JLHE97WB',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title || 'Notifikasi Baru';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
