import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.storeSettings.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });

    return NextResponse.json({
      settings: {
        bank_name: map.bank_name || 'Guaranty Trust Bank (GTBank)',
        account_number: map.account_number || '0637568363',
        account_name: map.account_name || 'Asogwo Chinaza Peace',
        phone: map.phone || '09164503355',
        whatsapp: map.whatsapp || '09164503355',
        email: map.email || 'asogwochinazapeace@gmail.com',
        delivery_fee: parseInt(map.delivery_fee || '2500', 10),
      },
    });
  } catch {
    return NextResponse.json({ settings: {} });
  }
}
