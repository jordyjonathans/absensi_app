import { legacy_createStore as createStore } from 'redux';
import { adminReducer } from './reducers/adminReducer';

export const AdminStore = createStore(adminReducer);

AdminStore.subscribe(() => {
  console.log('Redux State Changed:', AdminStore.getState());
});
