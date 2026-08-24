import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count(),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, price, salePrice, categoryId, image, images, sizes, colors, stock, featured, status, occasion, gender, deliveryFee } = body;

    if (!name || !description || !price || !categoryId || !image) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const productSlug = slug || slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug: productSlug,
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        categoryId,
        image,
        images: JSON.stringify(images || []),
        sizes: JSON.stringify(sizes || []),
        colors: JSON.stringify(colors || []),
        stock: Number(stock) || 0,
        featured: featured || false,
        status: status || 'active',
        occasion: occasion || null,
        gender: gender || 'unisex',
        deliveryFee: Number(deliveryFee) || 2500,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'A product with this slug already exists' }, { status: 400 });
    }
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });

    const body = await request.json();
    const { name, slug, description, price, salePrice, categoryId, image, images, sizes, colors, stock, featured, status, occasion, gender, deliveryFee } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: slug || slugify(name),
        description,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        categoryId,
        image,
        images: JSON.stringify(images || []),
        sizes: JSON.stringify(sizes || []),
        colors: JSON.stringify(colors || []),
        stock: Number(stock) || 0,
        featured: featured || false,
        status: status || 'active',
        occasion: occasion || null,
        gender: gender || 'unisex',
        deliveryFee: Number(deliveryFee) || 2500,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });

    await prisma.orderItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
