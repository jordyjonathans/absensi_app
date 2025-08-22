import { useSelector } from 'react-redux';
import { AdminState } from '../../../store/states/adminState';
import MainIndexStaff from './IndexStaff';
import MainIndexAdmin from './IndexAdmin';

const MainIndex: React.FC = () => {
  const roleSlug = useSelector((state: AdminState) => state.loginState.user.roleSlug);

  return (
    <div className="panel">{roleSlug === 'admin' ? <MainIndexAdmin /> : <MainIndexStaff />}</div>
  );
};

export default MainIndex;
