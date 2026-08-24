import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body.key && body.value !== undefined) {
      await prisma.storeSettings.upsert({
        where: { key: body.key },
        update: { value: body.value },
        create: { key: body.key, value: body.value },
      });
      return NextResponse.json({ success: true });
    }

    if (body.items && Array.isArray(body.items)) {
      await prisma.$transaction(
        body.items.map((item: { key: string; value: string }) =>
          prisma.storeSettings.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value },
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Key and value required' }, { status: 400 });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}
