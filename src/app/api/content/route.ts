import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body.key && body.value !== undefined) {
      await prisma.content.upsert({
        where: { key: body.key },
        update: { value: body.value },
        create: { key: body.key, value: body.value },
      });
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    if (body.items && Array.isArray(body.items)) {
      await prisma.$transaction(
        body.items.map((item: { key: string; value: string }) =>
          prisma.content.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value },
          })
        )
      );
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
  } catch (error) {
    console.error('Update content error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
