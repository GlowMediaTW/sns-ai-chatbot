import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './globals.css';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </html>
    </SessionProvider>
  );
}
