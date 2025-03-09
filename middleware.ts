export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/((?!api|login|env|_next/static|_next/image|favicon.ico)(?!$).*)'],
};
