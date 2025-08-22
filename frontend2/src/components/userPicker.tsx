import { UserPickerData } from '../store/types/profileType';
import { Select } from 'antd';

interface UserPickerProps {
  userPickerInfo: UserPickerData[];
  onHandleUserPickerChange: (value: string) => void;
}

const UserPicker = (props: UserPickerProps) => {
  return (
    <Select
      placeholder="Select role"
      onChange={props.onHandleUserPickerChange}
      style={{ width: '100%' }}
    >
      {props.userPickerInfo &&
        props.userPickerInfo.map(option => (
          <Select.Option key={option.externalId} value={option.externalId}>
            {option.nama} - {option.roleName}
          </Select.Option>
        ))}
    </Select>
  );
};

export default UserPicker;
