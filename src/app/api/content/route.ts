import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const { key, value } = await request.json();

    if (key && value !== undefined) {
      await prisma.content.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
      return NextResponse.json({ success: true });
    }

    const { items } = await request.json();
    if (items && Array.isArray(items)) {
      await prisma.$transaction(
        items.map((item: { key: string; value: string }) =>
          prisma.content.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value },
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
