import './assets/styles/style.css';
import en_US from 'antd/es/locale/en_US';
import RouterView from './components/Router/View';
import { ConfigProvider } from 'antd';
import AdminRouters from './router/index';
import { Provider } from 'react-redux';
import { AdminStore } from './store';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (container != null) {
  const root = createRoot(container);
  root.render(
    <Provider store={AdminStore}>
      <ConfigProvider locale={en_US}>
        <RouterView routers={AdminRouters} />
      </ConfigProvider>
    </Provider>
  );
}
