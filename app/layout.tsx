'use client';



import 'antd/dist/reset.css';
import { ConfigProvider, Layout, Menu } from 'antd';
import Link from 'next/link';
import { ReactNode } from 'react';

const { Header, Content } = Layout;

export const metadata = {
  title: 'Next Todo App',
  description: 'Manage your todos with a simple Todo app',
};

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}
