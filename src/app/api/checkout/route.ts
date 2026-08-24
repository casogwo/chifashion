import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, email, phone, address, city, state, country,
      items, subtotal, total, paymentMethod,
    } = body;

    if (!name || !email || !phone || !address || !city || !state || !items?.length) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: name,
          email,
          phone,
          address,
          city,
          state,
          country: country || 'Nigeria',
          subtotal,
          shipping: 0,
          total,
          status: 'confirmed',
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          paymentMethod,
          items: JSON.stringify(items),
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item: any) => ({
          orderId: order.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
          image: item.image || null,
        })),
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    return NextResponse.json({ success: true, orderNumber: result.orderNumber });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
