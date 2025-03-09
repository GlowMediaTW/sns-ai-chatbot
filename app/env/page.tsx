import Markdown from '@/components/Markdown';

export default function EnvPage() {
  return (
    <div className="my-5 container">
      <Markdown
        content={`# Environment Variables Guide

\`AUTH_SECRET\`

A random string is used to hash tokens, sign/encrypt cookies and generate cryptographic keys.

You can quickly generate one [here](https://auth-secret-gen.vercel.app).

More detail: [NextAuth.js Documentation](https://next-auth.js.org/configuration/options#secret)

---

\`ADMIN_USERNAME\`, \`ADMIN_PASSWORD\`

The username and password for the admin panel. 

**Please remember these values as they will be used to access the admin panel.**

---

\`KV_URL\`, \`KV_REST_API_READ_ONLY_TOKEN\`, \`KV_REST_API_TOKEN\`, \`KV_REST_API_URL\`

**You don't need to set them manually.**

These variables will be added automatically after you set up the Upstash Redis integration.`}
      />
    </div>
  );
}
