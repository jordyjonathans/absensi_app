import { Result, Button } from 'antd';

const Error404 = () => {
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Page Not Found！"
        extra={<Button type="primary">OK</Button>}
      />
    </>
  );
};

export default Error404;
