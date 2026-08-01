import { useMemo, useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Tooltip,
  Typography,
  Divider,
  Tag,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  InboxOutlined,
  BarChartOutlined,
  UserOutlined,
  PayCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

import { tokens } from '../theme/tokens';
import BrandLogo from '../components/common/BrandLogo';
import { useAuth } from '../context/useAuth';

const { Sider } = Layout;

const navItems = [
  { key: '/', label: 'Inbox', icon: <InboxOutlined /> },
  { key: '/reports', label: 'Reports', icon: <BarChartOutlined /> },
  { key: '/contacts', label: 'Contacts', icon: <UserOutlined /> },
  { key: '/billing', label: 'Billing & Subscription', icon: <PayCircleOutlined /> },
];

export default function SideNav() {
  const { logout, user, organization } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/logout', { replace: true });
  };

  const selectedKey = useMemo(() => {
    const path = location.pathname;
    if (path === '/') return '/';
    for (const item of navItems) {
      if (item.key !== '/' && path.startsWith(item.key)) return item.key;
    }
    return '/';
  }, [location.pathname]);

  const userInitial = (user?.fullName || user?.name || user?.email || 'N')
    .slice(0, 1)
    .toUpperCase();

  return (
    <Sider
      width={tokens.sidebar.width}
      collapsedWidth={tokens.sidebar.widthCollapsed}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      theme="light"
      breakpoint="lg"
      style={{
        background: tokens.sidebar.bg,
        borderRight: `1px solid ${tokens.sidebar.borderColor}`,
      }}
    >
      <div className="app-sider-inner">
        <div className={collapsed ? 'app-brand app-brand-collapsed' : 'app-brand'}>
          <div className="app-brand-main">
            <BrandLogo
              compact={collapsed}
              style={{
                width: collapsed ? 42 : 202,
                maxWidth: '100%',
              }}
            />

            <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="app-sider-collapse"
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>
            </Tooltip>
          </div>

          {!collapsed && (
            <Typography.Text className="app-brand-subtitle">
              Business Communication
            </Typography.Text>
          )}
        </div>

        <Divider style={{ borderColor: tokens.colors.border, margin: 0 }} />

        <div style={{ padding: collapsed ? '8px 4px' : '8px 16px', marginTop: 8, flex: 1 }}>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => navigate(key)}
            theme="light"
            inlineCollapsed={collapsed}
            style={{ borderRight: 'none', background: 'transparent' }}
            items={navItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
            }))}
          />
        </div>

        <div className="app-sider-footer" style={{ padding: collapsed ? 12 : 16 }}>
          <Tooltip title={collapsed ? 'Logout' : ''} placement="right">
            <button
              type="button"
              aria-label="Logout"
              onClick={handleLogout}
              className={collapsed ? 'app-sider-logout centered' : 'app-sider-logout'}
            >
              <LogoutOutlined />
              {!collapsed && <span>Logout</span>}
            </button>
          </Tooltip>

          <div className={collapsed ? 'app-user-card centered' : 'app-user-card'}>
            <Avatar size={40} style={{ background: tokens.colors.primary }}>
              {userInitial}
            </Avatar>
            {!collapsed && (
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="app-user-name">
                  {user?.fullName || user?.name || user?.email || 'Name'}
                </div>
                <div className="app-user-org">
                  {organization?.name || 'Organization'}
                </div>
                <Tag color="processing" style={{ marginTop: 4, fontSize: 11, lineHeight: '16px' }}>
                  {user?.role || 'Member'}
                </Tag>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sider>
  );
}