'use client';

import 'antd/dist/reset.css';
import { ConfigProvider, Layout, Menu } from 'antd';
import Link from 'next/link';
import { ReactNode } from 'react';

const { Header, Content } = Layout;

const menuItems = [
  {
    key: 'todo',
    label: <Link href="/todo">Todos</Link>,
  },
  {
    key: 'charts',
    label: <Link href="/charts">Charts</Link>,
  },
];

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['todo']}
            items={menuItems}
          />
        </Header>
        <Content style={{ padding: '24px' }}>{children}</Content>
      </Layout>
    </ConfigProvider>
  );
}
