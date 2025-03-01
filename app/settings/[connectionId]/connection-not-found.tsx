'use client';

import Button from 'antd/es/button';
import Result from 'antd/es/result';
import { useRouter } from 'next/navigation';

export default function ConnectionNotFound() {
  const router = useRouter();

  return (
    <div className="vh-100 w-100 d-flex justify-content-center align-items-center">
      <Result
        status="404"
        title="Connection not found"
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.push('/settings');
            }}
          >
            Back to Connections
          </Button>
        }
      />
    </div>
  );
}
