import { NextResponse } from 'next/server';
import { sendTestNotification } from '@/lib/notifications/telegram';

export async function GET() {
  const result = await sendTestNotification();
  
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}
