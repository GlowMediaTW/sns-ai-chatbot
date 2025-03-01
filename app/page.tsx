'use client';

import Button from 'antd/es/button';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleCTAClick = () => {
    router.push('/login');
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="mb-3">Welcome to SNS AI Chatbot</h1>
      <p className="text-muted mx-3 mb-4">
        Easily connect your SNS app with AI to launch your AI chatbot.
      </p>
      <Button type="primary" size="large" onClick={handleCTAClick}>
        Get Started
      </Button>
    </div>
  );
}
