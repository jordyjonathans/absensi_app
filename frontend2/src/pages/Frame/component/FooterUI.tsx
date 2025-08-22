import { Layout } from 'antd';

interface FrameFooterUIProps {
  text: string;
}

const FrameFooterUI = (props: FrameFooterUIProps) => {
  return <Layout.Footer className="admin-footer">{props.text}</Layout.Footer>;
};

export default FrameFooterUI;
