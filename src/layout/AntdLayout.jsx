import { useCallback, useMemo, useRef } from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import SideNav from './SideNav';
import TopBar from './TopBar';
import { LayoutActionsProvider } from './LayoutContext';

const { Content } = Layout;

export default function AntdLayout() {
  const navigate = useNavigate();
  const newMessageHandlerRef = useRef(null);

  const handleNewMessage = useCallback(() => {
    if (newMessageHandlerRef.current) {
      newMessageHandlerRef.current();
      return;
    }
    navigate('/');
  }, [navigate]);

  const registerNewMessageHandler = useCallback((handler) => {
    newMessageHandlerRef.current = handler;
  }, []);

  const layoutActions = useMemo(
    () => ({ registerNewMessageHandler }),
    [registerNewMessageHandler],
  );

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <SideNav />
      <Layout
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TopBar onNewMessage={handleNewMessage} />
        <Content
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
          }}
        >
          <LayoutActionsProvider value={layoutActions}>
            <Outlet />
          </LayoutActionsProvider>
        </Content>
      </Layout>
    </Layout>
  );
}
