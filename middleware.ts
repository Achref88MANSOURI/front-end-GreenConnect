// Middleware disabled: using per-section server layouts for auth gating.
import { NextResponse } from 'next/server';
export const config = { matcher: [] };
export default function middleware() {
  return NextResponse.next();
}
