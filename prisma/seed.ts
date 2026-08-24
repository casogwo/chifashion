import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const PEXELS = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

async function main() {
  console.log('Seeding database...');

  // Admin
  const passwordHash = await hash('chifashion2024', 12);
  await prisma.admin.upsert({
    where: { email: 'admin@chifashion.com' },
    update: {},
    create: {
      email: 'admin@chifashion.com',
      passwordHash,
      name: 'Chi Fashion Admin',
    },
  });
  console.log('✓ Admin created (admin@chifashion.com / chifashion2024)');

  // Categories
  const categories = [
    { name: 'Dresses', slug: 'dresses' },
    { name: 'Tops & Blouses', slug: 'tops' },
    { name: 'Bottoms', slug: 'bottoms' },
    { name: 'Suits & Blazers', slug: 'suits' },
    { name: 'Traditional', slug: 'traditional' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log('✓ Categories created');

  // Products
  const products = [
    // WOMEN - Dresses
    {
      name: 'Elegant Floral Maxi Dress',
      slug: 'elegant-floral-maxi-dress',
      description:
        'A stunning floral maxi dress perfect for garden parties and weddings. Features a flattering V-neckline, flowing silhouette, and delicate floral print on lightweight fabric.',
      price: 28500,
      salePrice: 24500,
      categoryId: categoryMap['dresses'],
      image: PEXELS(1536619),
      images: JSON.stringify([PEXELS(1536619), PEXELS(1021693)]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Pink', 'Green', 'Blue']),
      stock: 25,
      featured: true,
      status: 'active',
      occasion: 'wedding',
      gender: 'female',
    },
    {
      name: 'Red Party Cocktail Dress',
      slug: 'red-party-cocktail-dress',
      description:
        'Turn heads at any party with this sleek red cocktail dress. Body-hugging fit with elegant draping and a hemline that falls just above the knee.',
      price: 32000,
      salePrice: null,
      categoryId: categoryMap['dresses'],
      image: PEXELS(2220316),
      images: JSON.stringify([PEXELS(2220316), PEXELS(1183266)]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['Red', 'Black']),
      stock: 15,
      featured: true,
      status: 'active',
      occasion: 'party',
      gender: 'female',
    },
    {
      name: 'Midi Wrap Dress',
      slug: 'midi-wrap-dress',
      description:
        'Classic wrap dress in a sophisticated midi length. Flattering on all body types with a self-tie waist and elegant V-neckline.',
      price: 26000,
      salePrice: null,
      categoryId: categoryMap['dresses'],
      image: PEXELS(2681751),
      images: JSON.stringify([PEXELS(2681751), PEXELS(1040173)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Navy', 'Burgundy', 'Emerald']),
      stock: 20,
      featured: false,
      status: 'active',
      occasion: 'office',
      gender: 'female',
    },
    {
      name: 'White Lace Wedding Guest Dress',
      slug: 'white-lace-wedding-guest-dress',
      description:
        'Exquisite lace detailing makes this the perfect dress for special occasions. Illusion neckline, cap sleeves, and a beautifully structured bodice.',
      price: 45000,
      salePrice: 38000,
      categoryId: categoryMap['dresses'],
      image: PEXELS(1040173),
      images: JSON.stringify([PEXELS(1040173), PEXELS(1536619)]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['White', 'Ivory']),
      stock: 10,
      featured: true,
      status: 'active',
      occasion: 'wedding',
      gender: 'female',
    },
    // WOMEN - Tops
    {
      name: 'Silk V-Neck Blouse',
      slug: 'silk-v-neck-blouse',
      description:
        'Luxurious silk blouse with a relaxed fit and V-neckline. Perfect for the office or evening outings. Pairs beautifully with trousers or skirts.',
      price: 18500,
      salePrice: null,
      categoryId: categoryMap['tops'],
      image: PEXELS(2294361),
      images: JSON.stringify([PEXELS(2294361), PEXELS(1755683)]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Champagne', 'Black', 'Blush']),
      stock: 30,
      featured: false,
      status: 'active',
      occasion: 'office',
      gender: 'female',
    },
    {
      name: 'Off-Shoulder Ruffle Top',
      slug: 'off-shoulder-ruffle-top',
      description:
        'Flirty off-shoulder top with romantic ruffle detailing. Lightweight and perfect for casual brunches and summer outings.',
      price: 14000,
      salePrice: 11500,
      categoryId: categoryMap['tops'],
      image: PEXELS(1755683),
      images: JSON.stringify([PEXELS(1755683), PEXELS(2294361)]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['White', 'Pink', 'Peach']),
      stock: 35,
      featured: false,
      status: 'active',
      occasion: 'casual',
      gender: 'female',
    },
    // WOMEN - Bottoms
    {
      name: 'High-Waist Palazzo Pants',
      slug: 'high-waist-palazzo-pants',
      description:
        'Flowing palazzo pants with a flattering high waist. Wide-leg silhouette creates an effortlessly chic look for any occasion.',
      price: 22000,
      salePrice: null,
      categoryId: categoryMap['bottoms'],
      image: PEXELS(274937),
      images: JSON.stringify([PEXELS(274937), PEXELS(2065195)]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Black', 'Cream', 'Navy']),
      stock: 20,
      featured: false,
      status: 'active',
      occasion: 'office',
      gender: 'female',
    },
    // MEN - Suits
    {
      name: 'Classic Navy Blazer',
      slug: 'classic-navy-blazer',
      description:
        'Impeccably tailored navy blazer in premium Italian wool blend. Two-button front, notched lapels, and a modern slim fit.',
      price: 65000,
      salePrice: null,
      categoryId: categoryMap['suits'],
      image: PEXELS(1055691),
      images: JSON.stringify([PEXELS(1055691), PEXELS(3812433)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Navy', 'Charcoal']),
      stock: 12,
      featured: true,
      status: 'active',
      occasion: 'formal',
      gender: 'male',
    },
    {
      name: 'Charcoal Three-Piece Suit',
      slug: 'charcoal-three-piece-suit',
      description:
        'A complete three-piece suit in sophisticated charcoal grey. Includes jacket, waistcoat, and slim-fit trousers. Perfect for weddings and business events.',
      price: 120000,
      salePrice: 98000,
      categoryId: categoryMap['suits'],
      image: PEXELS(3812433),
      images: JSON.stringify([PEXELS(3812433), PEXELS(1055691)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Charcoal', 'Navy']),
      stock: 8,
      featured: true,
      status: 'active',
      occasion: 'formal',
      gender: 'male',
    },
    {
      name: 'Slim Fit Tuxedo',
      slug: 'slim-fit-tuxedo',
      description:
        'Show-stopping tuxedo with satin peak lapels and a tailored slim fit. The ultimate statement piece for black-tie events.',
      price: 145000,
      salePrice: null,
      categoryId: categoryMap['suits'],
      image: PEXELS(2065195),
      images: JSON.stringify([PEXELS(2065195), PEXELS(1055691)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Black']),
      stock: 6,
      featured: false,
      status: 'active',
      occasion: 'party',
      gender: 'male',
    },
    // MEN - Tops
    {
      name: 'Classic Oxford Shirt',
      slug: 'classic-oxford-shirt',
      description:
        'Timeless Oxford shirt in crisp cotton. Button-down collar, single chest pocket, and a versatile fit that works casual or formal.',
      price: 15000,
      salePrice: null,
      categoryId: categoryMap['tops'],
      image: PEXELS(1047977),
      images: JSON.stringify([PEXELS(1047977), PEXELS(2684218)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['White', 'Blue', 'Pink']),
      stock: 40,
      featured: false,
      status: 'active',
      occasion: 'office',
      gender: 'male',
    },
    {
      name: 'Linen Camp Collar Shirt',
      slug: 'linen-camp-collar-shirt',
      description:
        'Relaxed linen shirt with a camp collar for effortless weekend style. Breathable fabric perfect for warm weather.',
      price: 16500,
      salePrice: 13000,
      categoryId: categoryMap['tops'],
      image: PEXELS(2684218),
      images: JSON.stringify([PEXELS(2684218), PEXELS(1047977)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Sand', 'White', 'Olive']),
      stock: 25,
      featured: false,
      status: 'active',
      occasion: 'casual',
      gender: 'male',
    },
    // MEN - Bottoms
    {
      name: 'Tailored Slim Trousers',
      slug: 'tailored-slim-trousers',
      description:
        'Precision-cut slim trousers in stretch cotton for all-day comfort. Flat front, tapered leg, and a polished finish.',
      price: 20000,
      salePrice: null,
      categoryId: categoryMap['bottoms'],
      image: PEXELS(1631110),
      images: JSON.stringify([PEXELS(1631100), PEXELS(2065195)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Black', 'Grey', 'Navy']),
      stock: 22,
      featured: false,
      status: 'active',
      occasion: 'office',
      gender: 'male',
    },
    {
      name: 'Casual Chino Shorts',
      slug: 'casual-chino-shorts',
      description:
        'Classic chino shorts for laid-back summer days. Mid-thigh length with a comfortable regular fit.',
      price: 12000,
      salePrice: 9500,
      categoryId: categoryMap['bottoms'],
      image: PEXELS(2814116),
      images: JSON.stringify([PEXELS(2814116), PEXELS(2531736)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Khaki', 'Navy', 'Stone']),
      stock: 30,
      featured: false,
      status: 'active',
      occasion: 'casual',
      gender: 'male',
    },
    // TRADITIONAL (both genders)
    {
      name: 'Ankara Print Dashiki Set',
      slug: 'ankara-dashiki-set',
      description:
        'Vibrant Ankara print dashiki set with matching trousers. Celebrate African heritage with this bold and beautiful traditional ensemble.',
      price: 35000,
      salePrice: null,
      categoryId: categoryMap['traditional'],
      image: PEXELS(2531736),
      images: JSON.stringify([PEXELS(2531736), PEXELS(3373716)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Blue/Gold', 'Red/Green', 'Yellow/Blue']),
      stock: 15,
      featured: true,
      status: 'active',
      occasion: 'traditional',
      gender: 'male',
    },
    {
      name: 'Iro & Buba Set',
      slug: 'iro-buba-set',
      description:
        'Elegant Iro and Buba in premium George fabric. Features delicate embroidery along the neckline and sleeves. A timeless traditional look.',
      price: 42000,
      salePrice: 36000,
      categoryId: categoryMap['traditional'],
      image: PEXELS(3373716),
      images: JSON.stringify([PEXELS(3373716), PEXELS(2531736)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Wine', 'Gold', 'Green']),
      stock: 10,
      featured: true,
      status: 'active',
      occasion: 'traditional',
      gender: 'female',
    },
    {
      name: 'Agbada Classic',
      slug: 'agbada-classic',
      description:
        'Grand Agbada in premium fabric with hand-embroidered detailing. The ultimate statement of Nigerian elegance for celebrations.',
      price: 85000,
      salePrice: null,
      categoryId: categoryMap['traditional'],
      image: PEXELS(4066293),
      images: JSON.stringify([PEXELS(4066293), PEXELS(3755706)]),
      sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['White', 'Cream', 'Royal Blue']),
      stock: 5,
      featured: true,
      status: 'active',
      occasion: 'traditional',
      gender: 'male',
    },
    // WOMEN - Party
    {
      name: 'Sequin Mini Dress',
      slug: 'sequin-mini-dress',
      description:
        'Dazzling sequin-covered mini dress that catches the light from every angle. Perfect for nights out, birthdays, and celebrations.',
      price: 38000,
      salePrice: null,
      categoryId: categoryMap['dresses'],
      image: PEXELS(6311475),
      images: JSON.stringify([PEXELS(6311475), PEXELS(2220316)]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['Gold', 'Silver', 'Rose Gold']),
      stock: 12,
      featured: false,
      status: 'active',
      occasion: 'party',
      gender: 'female',
    },
    // Accessories
    {
      name: 'Classic Leather Belt',
      slug: 'classic-leather-belt',
      description:
        'Handcrafted genuine leather belt with a brushed gold buckle. A wardrobe essential that elevates any outfit.',
      price: 8500,
      salePrice: null,
      categoryId: categoryMap['accessories'],
      image: PEXELS(2814116),
      images: JSON.stringify([PEXELS(2814116)]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Black', 'Brown', 'Tan']),
      stock: 50,
      featured: false,
      status: 'active',
      occasion: 'casual',
      gender: 'unisex',
    },
    {
      name: 'Structured Tote Bag',
      slug: 'structured-tote-bag',
      description:
        'Spacious structured tote in vegan leather. Multiple compartments, magnetic closure, and an elegant silhouette for work or weekends.',
      price: 22000,
      salePrice: 18000,
      categoryId: categoryMap['accessories'],
      image: PEXELS(1040173),
      images: JSON.stringify([PEXELS(1040173)]),
      sizes: JSON.stringify(['One Size']),
      colors: JSON.stringify(['Black', 'Camel', 'White']),
      stock: 20,
      featured: false,
      status: 'active',
      occasion: 'casual',
      gender: 'female',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product as any,
    });
  }
  console.log(`✓ ${products.length} products created`);

  // Homepage content
  const content = [
    {
      key: 'hero_heading',
      value: 'Redefine Your Style',
    },
    {
      key: 'hero_tagline',
      value: 'New Collection 2026',
    },
    {
      key: 'hero_subheading',
      value:
        'Curated fashion for the modern Nigerian. From everyday elegance to statement pieces for every occasion.',
    },
    {
      key: 'hero_cta',
      value: 'Shop Now',
    },
    {
      key: 'hero_image',
      value: PEXELS(2220316),
    },
    {
      key: 'promo_banner',
      value: 'Free delivery on orders over ₦50,000',
    },
    {
      key: 'brand_story',
      value:
        'ChiFashion is a premium Nigerian fashion brand celebrating African elegance with a modern twist. We craft timeless pieces for every occasion — from the boardroom to the ballroom.',
    },
    {
      key: 'newsletter_heading',
      value: 'Join the ChiFashion Family',
    },
    {
      key: 'newsletter_text',
      value:
        'Subscribe for exclusive drops, styling tips, and members-only discounts.',
    },
  ];

  for (const c of content) {
    await prisma.content.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: c,
    });
  }
  console.log('✓ Homepage content created');

  // Store settings
  const settings = [
    { key: 'store_name', value: 'ChiFashion' },
    { key: 'currency', value: 'NGN' },
    { key: 'currency_symbol', value: '₦' },
    { key: 'phone', value: '091645033555' },
    { key: 'email', value: 'asogwochinazapeace@gmail.com' },
    { key: 'address', value: 'Lagos, Nigeria' },
    { key: 'shipping_threshold', value: '50000' },
    { key: 'shipping_fee', value: '2500' },
    { key: 'delivery_fee', value: '2500' },
    { key: 'whatsapp', value: '09164503355' },
    { key: 'instagram', value: '@chifashion' },
    { key: 'twitter', value: '@chifashion' },
    { key: 'bank_name', value: 'Guaranty Trust Bank (GTBank)' },
    { key: 'account_number', value: '0637568363' },
    { key: 'account_name', value: 'Asogwo Chinaza Peace' },
  ];

  for (const s of settings) {
    await prisma.storeSettings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✓ Store settings created');

  console.log('\nSeeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
