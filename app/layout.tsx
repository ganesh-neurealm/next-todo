import { ReactNode } from 'react';
import LayoutComponent from './LayoutComponent';
import { App as AntdApp } from 'antd';

export const metadata = {
  title: 'Next Todo App',
  description: 'Manage todos with charts and simple UI.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdApp><LayoutComponent>{children}</LayoutComponent></AntdApp>
      </body>
    </html>
  );
}
