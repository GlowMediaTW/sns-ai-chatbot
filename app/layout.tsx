import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';

import './globals.css';

export const metadata: Metadata = {
  title: 'SNS AI Chatbot',
  description: 'Easily connect your SNS app with AI to launch your AI chatbot.',
};

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
