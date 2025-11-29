// app/signup/page.tsx
// Redirect to register page for consistency

import { redirect } from 'next/navigation';

export default function SignupPage() {
  redirect('/register');
}
