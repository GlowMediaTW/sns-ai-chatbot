'use client';

import Button from 'antd/es/button';
import Link from 'next/link';
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
        <span>Easily connect your SNS app with AI to launch your AI chatbot.</span>
      </p>
      {process.env.NEXT_PUBLIC_MAIN_REPO === 'true' ? (
        <Link href="https://vercel.com/import/project?template=GITHUB_REPO_URL" target="_blank">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://vercel.com/button" alt="Deploy on Vercel" />
        </Link>
      ) : (
        <Button type="primary" size="large" onClick={handleCTAClick}>
          Get Started
        </Button>
      )}
      <Link
        href="https://github.com/jerrycool123/sns-ai-chatbot"
        target="_blank"
        className="mt-4 text-muted fs-7"
      >
        Github Repo
      </Link>
    </div>
  );
}
