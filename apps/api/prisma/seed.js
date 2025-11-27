import { PrismaClient } from "@prisma/client";
import Chance from "chance";
import bcrypt from "bcryptjs";
import slugify from "slugify";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();
const chance = new Chance();

async function seedUsers(demoPassword = "123456", sharedPassword = "654321") {
  const users = [];

  for (let i = 0; i < 9; i++) {
    const hash = await bcrypt.hash(sharedPassword, 10);

    users.push({
      fullName: chance.name(),
      email: chance.email(),
      password: hash,
      role: "CUSTOMER",
    });
  }

  const demoHash = await bcrypt.hash(demoPassword, 10);

  users.push({
    fullName: "Demo",
    email: "demo@mint.boutique",
    password: demoHash,
    role: "ADMIN",
  });

  for (const u of users) {
    await prisma.user.create({
      data: u,
    });
  }
}

async function seedCategories() {
  const categories = [
    {
      name: "Flowers",
      desc: "Fresh and beautiful flowers for every occasion.",
      imageUrl: "https://images.unsplash.com/photo-1759145766123-c6ec8cfe6fc9",
    },
    {
      name: "Plants",
      desc: "Indoor and outdoor plants to brighten your space.",
      imageUrl: "https://images.unsplash.com/photo-1662842611249-cd4784b216b2",
    },
    {
      name: "Vases",
      desc: "Stylish vases to showcase your flowers.",
      imageUrl: "https://images.unsplash.com/photo-1635184494625-f2f8c8c0c9e7",
    },
    {
      name: "Garden Tools",
      desc: "Tools and equipment to care for your garden.",
      imageUrl: "https://images.unsplash.com/photo-1654002386579-2a2e92cb3e23",
    },
    {
      name: "Accessories",
      desc: "Decorative items and tools for plant lovers.",
      imageUrl: "https://images.unsplash.com/photo-1649597507114-4c5d92c2f8dd",
    },
  ];

  for (const cat of categories) {
    await prisma.category.create({
      data: {
        ...cat,
        slug: slugify(cat.name, { lower: true }),
        imageUrl: cat.imageUrl + "?q=85&fm=jpg&crop=entropy&cs=srgb&w=1920",
      },
    });
  }
}

async function seedProducts() {
  const products = [
    {
      slug: "roses-bouquet",
      name: "Roses Bouquet Deluxe",
      desc: `
# Roses Bouquet Deluxe
## Section 1
A luxurious bouquet featuring the finest roses in a mix of red, pink, and white. Perfect for anniversaries or special occasions.

## Section 2
Each stem is hand-selected for quality, with premium wrapping to ensure freshness during delivery.

## Section 3
Care instructions: Keep in a cool place, change water daily, trim stems regularly.

## Section 4
Delivery options: Available same-day in select areas.

## Section 5
Includes a complimentary greeting card for personalized messages.
`,
      weight: 1200,
      length: 30,
      width: 20,
      height: 25,
      tags: ["red", "pink", "white", "fresh", "bouquet", "romantic"],
      isFeatured: true,
      categoryId: "flowers",
    },
    {
      slug: "orchid-orchidaceae",
      name: "Elegant Orchid Plant",
      desc: `
# Elegant Orchid Plant
## Section 1
A delicate indoor orchid, known for its vibrant purple blooms and elegant long stems.

## Section 2
Ideal for office desks, living rooms, or as a gift for plant lovers.

## Section 3
Requires moderate sunlight and occasional watering; thrives in humidity.

## Section 4
Comes in a stylish ceramic pot to complement any interior.

## Section 5
Long-lasting blooms with minimal care required.
`,
      weight: 800,
      length: 25,
      width: 15,
      height: 35,
      tags: ["orchidaceae", "purple", "indoor", "elegant", "flowering"],
      isFeatured: true,
      categoryId: "plants",
    },
    {
      slug: "fiddle-leaf-fig",
      name: "Fiddle Leaf Fig Tree",
      desc: `
# Fiddle Leaf Fig Tree
## Section 1
Popular indoor tree with large, glossy leaves. Adds a bold touch to any space.

## Section 2
Perfect for living rooms, offices, and entryways.

## Section 3
Needs bright, indirect sunlight and moderate watering.

## Section 4
Pot not included, choose one that allows for good drainage.

## Section 5
Can grow up to 1.5 meters indoors with proper care.
`,
      weight: 5000,
      length: 40,
      width: 40,
      height: 150,
      tags: ["ficus", "indoor", "large-leaves", "decorative", "tropical"],
      isFeatured: true,
      categoryId: "plants",
    },
    {
      slug: "ceramic-vase-white",
      name: "White Ceramic Vase",
      desc: `
# White Ceramic Vase
## Section 1
Minimalist white ceramic vase for fresh or dried flowers.

## Section 2
Smooth finish with modern design that fits any interior.

## Section 3
Available in multiple sizes; holds water safely.

## Section 4
Easy to clean and durable for long-term use.

## Section 5
Perfect as a standalone decor or paired with flowers.
`,
      weight: 1500,
      length: 15,
      width: 15,
      height: 30,
      tags: ["white", "ceramic", "minimalist", "decor", "vase"],
      isFeatured: false,
      categoryId: "vases",
    },
    {
      slug: "garden-trowel-set",
      name: "Garden Trowel Set",
      desc: `
# Garden Trowel Set
## Section 1
Essential tools for planting, repotting, and small gardening tasks.

## Section 2
Made from durable stainless steel with ergonomic handles.

## Section 3
Includes three sizes: small, medium, and large trowels.

## Section 4
Lightweight, easy to store, and perfect for indoor/outdoor use.

## Section 5
A must-have for gardening enthusiasts.
`,
      weight: 1200,
      length: 30,
      width: 10,
      height: 5,
      tags: ["tools", "gardening", "planting", "trowel", "durable"],
      isFeatured: false,
      categoryId: "garden-tools",
    },
    {
      slug: "succulent-assortment",
      name: "Succulent Assortment Pack",
      desc: `
# Succulent Assortment Pack
## Section 1
Set of 5 assorted small succulents in mini pots, perfect for desktops or gifts.

## Section 2
Varieties include Echeveria, Haworthia, and Aloe.

## Section 3
Low maintenance, requires minimal watering.

## Section 4
Each pot comes with drainage for healthy growth.

## Section 5
Great for home or office decoration.
`,
      weight: 600,
      length: 25,
      width: 15,
      height: 10,
      tags: ["succulent", "indoor", "small", "assorted", "easy-care"],
      isFeatured: false,
      categoryId: "plants",
    },
    {
      slug: "rosewood-planter",
      name: "Rosewood Wooden Planter",
      desc: `
# Rosewood Wooden Planter
## Section 1
Elegant planter box made from polished rosewood for medium-sized plants.

## Section 2
Ideal for indoor and balcony use.

## Section 3
Provides sturdy support and natural aesthetics.

## Section 4
Water-resistant coating ensures durability.

## Section 5
Enhances the decor of any room or garden.
`,
      weight: 2000,
      length: 40,
      width: 20,
      height: 25,
      tags: ["wood", "planter", "medium", "decor", "natural"],
      isFeatured: false,
      categoryId: "accessories",
    },
    {
      slug: "mixed-bouquet-spring",
      name: "Mixed Spring Bouquet",
      desc: `
# Mixed Spring Bouquet
## Section 1
A cheerful mix of seasonal flowers in pastel shades.

## Section 2
Includes tulips, daisies, and lilies.

## Section 3
Wrapped in biodegradable paper for eco-friendliness.

## Section 4
Freshly picked and hand-tied for premium quality.

## Section 5
Perfect for birthdays, congratulations, or home decor.
`,
      weight: 1100,
      length: 30,
      width: 20,
      height: 25,
      tags: ["pastel", "spring", "tulip", "daisy", "lily", "bouquet"],
      isFeatured: true,
      categoryId: "flowers",
    },
    {
      slug: "ceramic-pot-large",
      name: "Large Ceramic Pot",
      desc: `
# Large Ceramic Pot
## Section 1
Spacious pot suitable for indoor or outdoor plants.

## Section 2
High-quality ceramic with glazed finish.

## Section 3
Includes drainage hole for plant health.

## Section 4
Durable and elegant design enhances plant display.

## Section 5
Perfect for trees, shrubs, or large flowering plants.
`,
      weight: 4000,
      length: 35,
      width: 35,
      height: 40,
      tags: ["ceramic", "large", "indoor", "outdoor", "pot"],
      isFeatured: false,
      categoryId: "vases",
    },
    {
      slug: "bonsai-maple",
      name: "Bonsai Maple Tree",
      desc: `
# Bonsai Maple Tree
## Section 1
Miniature maple bonsai tree with vibrant red leaves.

## Section 2
Ideal for desktops, shelves, or as a gift for bonsai lovers.

## Section 3
Requires bright light and careful watering.

## Section 4
Comes in a decorative ceramic pot.

## Section 5
Enhances the aesthetic of any indoor space.
`,
      weight: 1200,
      length: 25,
      width: 25,
      height: 30,
      tags: ["bonsai", "maple", "miniature", "indoor", "decorative"],
      isFeatured: true,
      categoryId: "plants",
    },
    {
      slug: "tulip-bouquet-pastel",
      name: "Pastel Tulip Bouquet",
      desc: `
# Pastel Tulip Bouquet
## Section 1
A soft pastel mix of tulips in pink, yellow, and white.

## Section 2
Perfect gift for spring celebrations or home decor.

## Section 3
Wrapped in eco-friendly paper, freshly picked.

## Section 4
Long-lasting freshness with proper care.

## Section 5
Includes a small greeting card for messages.
`,
      weight: 1000,
      length: 30,
      width: 20,
      height: 25,
      tags: ["pastel", "bouquet", "fresh", "pink", "yellow"],
      isFeatured: true,
      categoryId: "flowers",
    },
    {
      slug: "aloe-vera-plant",
      name: "Aloe Vera Plant",
      desc: `
# Aloe Vera Plant
## Section 1
Easy-to-care succulent known for medicinal properties.

## Section 2
Great for windowsills or office desks.

## Section 3
Needs minimal watering and indirect sunlight.

## Section 4
Comes in a simple pot for convenience.

## Section 5
Perfect for beginners or plant lovers.
`,
      weight: 700,
      length: 20,
      width: 15,
      height: 25,
      tags: ["succulent", "indoor", "easy-care", "green"],
      isFeatured: false,
      categoryId: "plants",
    },
    {
      slug: "mini-cactus-collection",
      name: "Mini Cactus Collection",
      desc: `
# Mini Cactus Collection
## Section 1
Set of 4 tiny cacti, easy to maintain.

## Section 2
Ideal for desks or shelves, low maintenance.

## Section 3
Varieties include Echinopsis, Mammillaria, Rebutia.

## Section 4
Each cactus comes in a small pot with drainage.

## Section 5
Great as a gift or decorative item.
`,
      weight: 500,
      length: 25,
      width: 15,
      height: 10,
      tags: ["succulent", "indoor", "small", "easy-care"],
      isFeatured: false,
      categoryId: "plants",
    },
    {
      slug: "pink-ceramic-vase",
      name: "Pink Ceramic Vase",
      desc: `
# Pink Ceramic Vase
## Section 1
Stylish pink vase for small to medium flowers.

## Section 2
Smooth finish, minimalist design.

## Section 3
Safe for water, easy to clean.

## Section 4
Pairs well with pastel flowers.

## Section 5
Perfect as a decor accent.
`,
      weight: 1200,
      length: 15,
      width: 15,
      height: 25,
      tags: ["pink", "ceramic", "vase", "decor"],
      isFeatured: false,
      categoryId: "vases",
    },
    {
      slug: "metal-garden-spade",
      name: "Metal Garden Spade",
      desc: `
# Metal Garden Spade
## Section 1
Durable spade for digging and gardening.

## Section 2
Ergonomic handle for comfort.

## Section 3
High-quality metal blade.

## Section 4
Suitable for outdoor use.

## Section 5
A must-have tool for plant care.
`,
      weight: 1500,
      length: 35,
      width: 10,
      height: 5,
      tags: ["tools", "gardening", "metal"],
      isFeatured: false,
      categoryId: "garden-tools",
    },
    {
      slug: "herb-garden-kit",
      name: "Herb Garden Kit",
      desc: `
# Herb Garden Kit
## Section 1
All-in-one kit for growing herbs indoors.

## Section 2
Includes seeds, soil, and small pots.

## Section 3
Great for beginners and indoor gardening.

## Section 4
Instructions included for easy planting.

## Section 5
Perfect for kitchens or windowsills.
`,
      weight: 1000,
      length: 30,
      width: 20,
      height: 15,
      tags: ["indoor", "planting", "tools", "green"],
      isFeatured: true,
      categoryId: "garden-tools",
    },
    {
      slug: "lavender-bouquet",
      name: "Lavender Bouquet",
      desc: `
# Lavender Bouquet
## Section 1
Fragrant lavender bouquet, calming and elegant.

## Section 2
Perfect for aromatherapy or decor.

## Section 3
Freshly picked and hand-tied.

## Section 4
Wrapped in recyclable paper.

## Section 5
Ideal for gifting or home use.
`,
      weight: 900,
      length: 25,
      width: 15,
      height: 25,
      tags: ["purple", "bouquet", "fresh", "decor"],
      isFeatured: false,
      categoryId: "flowers",
    },
    {
      slug: "bonsai-pine",
      name: "Bonsai Pine Tree",
      desc: `
# Bonsai Pine Tree
## Section 1
Miniature pine bonsai, resilient and decorative.

## Section 2
Requires bright indirect light.

## Section 3
Comes in a small ceramic pot.

## Section 4
Easy to maintain with proper care.

## Section 5
Adds elegance to desks or shelves.
`,
      weight: 1300,
      length: 25,
      width: 25,
      height: 30,
      tags: ["bonsai", "miniature", "indoor", "decor"],
      isFeatured: false,
      categoryId: "plants",
    },
    {
      slug: "round-terracotta-pot",
      name: "Round Terracotta Pot",
      desc: `
# Round Terracotta Pot
## Section 1
Classic terracotta pot for indoor/outdoor plants.

## Section 2
Natural clay, unglazed.

## Section 3
Includes drainage hole.

## Section 4
Durable and simple design.

## Section 5
Ideal for succulents, cacti, or medium plants.
`,
      weight: 2000,
      length: 30,
      width: 30,
      height: 30,
      tags: ["terracotta", "pot", "indoor", "outdoor", "decor"],
      isFeatured: false,
      categoryId: "vases",
    },
    {
      slug: "flower-gift-set",
      name: "Flower Gift Set",
      desc: `
# Flower Gift Set
## Section 1
Combination of small bouquets and decorative items.

## Section 2
Includes roses, tulips, and a small vase.

## Section 3
Beautiful packaging for gifting.

## Section 4
Fresh flowers with long-lasting quality.

## Section 5
Perfect for birthdays, anniversaries, or special occasions.
`,
      weight: 1500,
      length: 30,
      width: 20,
      height: 20,
      tags: ["bouquet", "flowers", "gift", "decor"],
      isFeatured: true,
      categoryId: "flowers",
    },
  ];

  const categories = await prisma.category.findMany({
    where: {
      slug: { in: products.map((p) => p.categoryId) },
    },
  });

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categoryId);
    await prisma.product.create({
      data: {
        ...p,
        categoryId: category.id,
      },
    });
  }
}

async function seedVariants() {
  const variants = [
    // Roses Bouquet Deluxe
    { name: "Small", price: 350_000, stockQuantity: 10, productSlug: "roses-bouquet" },
    { name: "Medium", price: 500_000, stockQuantity: 15, productSlug: "roses-bouquet" },
    { name: "Large", price: 700_000, stockQuantity: 5, productSlug: "roses-bouquet" },
    { name: "Premium", price: 900_000, stockQuantity: 3, productSlug: "roses-bouquet" },

    // Elegant Orchid Plant
    { name: "Small Pot", price: 250_000, stockQuantity: 12, productSlug: "orchid-orchidaceae" },
    { name: "Medium Pot", price: 400_000, stockQuantity: 8, productSlug: "orchid-orchidaceae" },
    { name: "Large Pot", price: 600_000, stockQuantity: 5, productSlug: "orchid-orchidaceae" },
    { name: "Premium Pot", price: 800_000, stockQuantity: 2, productSlug: "orchid-orchidaceae" },

    // Fiddle Leaf Fig Tree
    { name: "Medium Tree", price: 1_200_000, stockQuantity: 4, productSlug: "fiddle-leaf-fig" },
    { name: "Large Tree", price: 1_800_000, stockQuantity: 2, productSlug: "fiddle-leaf-fig" },
    { name: "XL Tree", price: 2_500_000, stockQuantity: 1, productSlug: "fiddle-leaf-fig" },
    { name: "Premium Tree", price: 3_000_000, stockQuantity: 1, productSlug: "fiddle-leaf-fig" },

    // White Ceramic Vase
    { name: "Small", price: 120_000, stockQuantity: 20, productSlug: "ceramic-vase-white" },
    { name: "Medium", price: 200_000, stockQuantity: 15, productSlug: "ceramic-vase-white" },
    { name: "Large", price: 350_000, stockQuantity: 10, productSlug: "ceramic-vase-white" },
    { name: "Premium", price: 500_000, stockQuantity: 5, productSlug: "ceramic-vase-white" },

    // Garden Trowel Set
    { name: "Standard Set", price: 150_000, stockQuantity: 25, productSlug: "garden-trowel-set" },
    { name: "Pro Set", price: 250_000, stockQuantity: 10, productSlug: "garden-trowel-set" },
    { name: "Deluxe Set", price: 400_000, stockQuantity: 5, productSlug: "garden-trowel-set" },
    { name: "Ultimate Set", price: 600_000, stockQuantity: 2, productSlug: "garden-trowel-set" },

    // Succulent Assortment Pack
    { name: "5-Pack", price: 180_000, stockQuantity: 20, productSlug: "succulent-assortment" },
    { name: "10-Pack", price: 350_000, stockQuantity: 10, productSlug: "succulent-assortment" },
    { name: "15-Pack", price: 500_000, stockQuantity: 5, productSlug: "succulent-assortment" },
    { name: "Premium Set", price: 650_000, stockQuantity: 2, productSlug: "succulent-assortment" },

    // Rosewood Wooden Planter
    { name: "Medium", price: 400_000, stockQuantity: 10, productSlug: "rosewood-planter" },
    { name: "Large", price: 650_000, stockQuantity: 5, productSlug: "rosewood-planter" },
    { name: "XL", price: 900_000, stockQuantity: 3, productSlug: "rosewood-planter" },
    { name: "Premium", price: 1_200_000, stockQuantity: 1, productSlug: "rosewood-planter" },

    // Mixed Spring Bouquet
    { name: "Small", price: 300_000, stockQuantity: 12, productSlug: "mixed-bouquet-spring" },
    { name: "Medium", price: 450_000, stockQuantity: 10, productSlug: "mixed-bouquet-spring" },
    { name: "Large", price: 600_000, stockQuantity: 5, productSlug: "mixed-bouquet-spring" },
    { name: "Premium", price: 800_000, stockQuantity: 2, productSlug: "mixed-bouquet-spring" },

    // Large Ceramic Pot
    { name: "Medium", price: 450_000, stockQuantity: 8, productSlug: "ceramic-pot-large" },
    { name: "Large", price: 700_000, stockQuantity: 5, productSlug: "ceramic-pot-large" },
    { name: "XL", price: 950_000, stockQuantity: 3, productSlug: "ceramic-pot-large" },
    { name: "Premium", price: 1_200_000, stockQuantity: 1, productSlug: "ceramic-pot-large" },

    // Bonsai Maple Tree
    { name: "Small", price: 600_000, stockQuantity: 5, productSlug: "bonsai-maple" },
    { name: "Medium", price: 900_000, stockQuantity: 3, productSlug: "bonsai-maple" },
    { name: "Large", price: 1_200_000, stockQuantity: 2, productSlug: "bonsai-maple" },
    { name: "Premium", price: 1_500_000, stockQuantity: 1, productSlug: "bonsai-maple" },

    // Pastel Tulip Bouquet
    { name: "Small", price: 300_000, stockQuantity: 12, productSlug: "tulip-bouquet-pastel" },
    { name: "Medium", price: 450_000, stockQuantity: 10, productSlug: "tulip-bouquet-pastel" },
    { name: "Large", price: 600_000, stockQuantity: 5, productSlug: "tulip-bouquet-pastel" },
    { name: "Premium", price: 800_000, stockQuantity: 2, productSlug: "tulip-bouquet-pastel" },

    // Aloe Vera Plant
    { name: "Small Pot", price: 180_000, stockQuantity: 15, productSlug: "aloe-vera-plant" },
    { name: "Medium Pot", price: 250_000, stockQuantity: 10, productSlug: "aloe-vera-plant" },
    { name: "Large Pot", price: 400_000, stockQuantity: 5, productSlug: "aloe-vera-plant" },
    { name: "Premium Pot", price: 600_000, stockQuantity: 2, productSlug: "aloe-vera-plant" },

    // Mini Cactus Collection
    { name: "4-Pack", price: 200_000, stockQuantity: 20, productSlug: "mini-cactus-collection" },
    { name: "8-Pack", price: 380_000, stockQuantity: 10, productSlug: "mini-cactus-collection" },
    { name: "12-Pack", price: 550_000, stockQuantity: 5, productSlug: "mini-cactus-collection" },
    { name: "Premium Set", price: 700_000, stockQuantity: 2, productSlug: "mini-cactus-collection" },

    // Pink Ceramic Vase
    { name: "Small", price: 120_000, stockQuantity: 15, productSlug: "pink-ceramic-vase" },
    { name: "Medium", price: 200_000, stockQuantity: 10, productSlug: "pink-ceramic-vase" },
    { name: "Large", price: 350_000, stockQuantity: 5, productSlug: "pink-ceramic-vase" },
    { name: "Premium", price: 500_000, stockQuantity: 2, productSlug: "pink-ceramic-vase" },

    // Metal Garden Spade
    { name: "Standard", price: 120_000, stockQuantity: 20, productSlug: "metal-garden-spade" },
    { name: "Pro", price: 200_000, stockQuantity: 12, productSlug: "metal-garden-spade" },
    { name: "Deluxe", price: 350_000, stockQuantity: 5, productSlug: "metal-garden-spade" },
    { name: "Ultimate", price: 500_000, stockQuantity: 2, productSlug: "metal-garden-spade" },

    // Herb Garden Kit
    { name: "Basic", price: 300_000, stockQuantity: 10, productSlug: "herb-garden-kit" },
    { name: "Standard", price: 450_000, stockQuantity: 7, productSlug: "herb-garden-kit" },
    { name: "Advanced", price: 600_000, stockQuantity: 5, productSlug: "herb-garden-kit" },
    { name: "Premium", price: 800_000, stockQuantity: 2, productSlug: "herb-garden-kit" },

    // Lavender Bouquet
    { name: "Small", price: 250_000, stockQuantity: 12, productSlug: "lavender-bouquet" },
    { name: "Medium", price: 400_000, stockQuantity: 8, productSlug: "lavender-bouquet" },
    { name: "Large", price: 550_000, stockQuantity: 5, productSlug: "lavender-bouquet" },
    { name: "Premium", price: 700_000, stockQuantity: 2, productSlug: "lavender-bouquet" },

    // Bonsai Pine Tree
    { name: "Small", price: 600_000, stockQuantity: 5, productSlug: "bonsai-pine" },
    { name: "Medium", price: 900_000, stockQuantity: 3, productSlug: "bonsai-pine" },
    { name: "Large", price: 1_200_000, stockQuantity: 2, productSlug: "bonsai-pine" },
    { name: "Premium", price: 1_500_000, stockQuantity: 1, productSlug: "bonsai-pine" },

    // Round Terracotta Pot
    { name: "Medium", price: 400_000, stockQuantity: 10, productSlug: "round-terracotta-pot" },
    { name: "Large", price: 650_000, stockQuantity: 5, productSlug: "round-terracotta-pot" },
    { name: "XL", price: 900_000, stockQuantity: 3, productSlug: "round-terracotta-pot" },
    { name: "Premium", price: 1_200_000, stockQuantity: 1, productSlug: "round-terracotta-pot" },

    // Flower Gift Set
    { name: "Small", price: 500_000, stockQuantity: 8, productSlug: "flower-gift-set" },
    { name: "Medium", price: 750_000, stockQuantity: 5, productSlug: "flower-gift-set" },
    { name: "Large", price: 1_000_000, stockQuantity: 3, productSlug: "flower-gift-set" },
    { name: "Premium", price: 1_250_000, stockQuantity: 1, productSlug: "flower-gift-set" },
  ];

  for (const v of variants) {
    await prisma.productVariant.create({
      data: v,
    });
  }
}

async function seedProductImages() {
  const images = {
    "roses-bouquet": ["https://images.unsplash.com/photo-1622459991831-3676cf94a8b3"],
    "orchid-orchidaceae": ["https://images.unsplash.com/photo-1618080606404-4ae39d25067b"],
    "fiddle-leaf-fig": ["https://images.unsplash.com/photo-1676296373338-0f2b7e2a0525"],
    "ceramic-vase-white": ["https://images.unsplash.com/photo-1630149462177-35a341b42fcf"],
    "garden-trowel-set": ["https://images.unsplash.com/photo-1639423188864-7b8152b32c3a"],
    "succulent-assortment": ["https://images.unsplash.com/photo-1655071515662-ea92f0aead1a"],
    "rosewood-planter": ["https://images.unsplash.com/photo-1743497162031-44479189af65"],
    "mixed-bouquet-spring": ["https://images.unsplash.com/photo-1710587385309-f264b4d503cd"],
    "ceramic-pot-large": ["https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8"],
    "bonsai-maple": ["https://images.unsplash.com/photo-1559133171-df1ff588e59f"],
    "tulip-bouquet-pastel": ["https://images.unsplash.com/photo-1625923819242-a62478d94dea"],
    "aloe-vera-plant": ["https://images.unsplash.com/photo-1763027076863-698a6a72c164"],
    "mini-cactus-collection": ["https://images.unsplash.com/photo-1615758043606-084300e6439b"],
    "pink-ceramic-vase": ["https://images.unsplash.com/photo-1727684812941-0c8c1e4b3395"],
    "metal-garden-spade": ["https://images.unsplash.com/photo-1597764983031-60a74afb8692"],
    "herb-garden-kit": ["https://images.unsplash.com/photo-1719153863464-b2ee7e28b6df"],
    "lavender-bouquet": ["https://images.unsplash.com/photo-1625504453710-8cba177a6927"],
    "bonsai-pine": ["https://images.unsplash.com/photo-1708837351625-30a43aa85f63"],
    "round-terracotta-pot": ["https://images.unsplash.com/photo-1591456498039-4d33e10125b7"],
    "flower-gift-set": ["https://images.unsplash.com/photo-1469317835793-6d02c2392778"],
  };

  for (const [slug, imageUrls] of Object.entries(images)) {
    await prisma.product.update({
      where: { slug },
      data: { imageUrls },
    });
  }
}

async function seedRatings() {
  const userIdsRaw = await prisma.user.findMany({
    select: { id: true },
  });
  const userIds = userIdsRaw.map((u) => u.id);

  const pickUsers = (n) => {
    return [...userIds].sort(() => Math.random() - 0.5).slice(0, n);
  };

  const productSlugsRaw = await prisma.product.findMany({
    select: { slug: true },
  });
  const productSlugs = productSlugsRaw.map((p) => p.slug);

  const sampleReviews = [
    "Surprisingly good quality!",
    "Looks exactly like the photos.",
    "Packaging was neat and secure.",
    "Worth the price, would buy again.",
    "Fast delivery and great condition.",
    "Feels very sturdy.",
    "Colors are vibrant in real life.",
    "Nice gift option, recipient loved it.",
    "Better than expected!",
    "Pretty decent overall.",
  ];

  for (const slug of productSlugs) {
    const reviewers = pickUsers(4 + Math.floor(Math.random() * 2));

    for (const userId of reviewers) {
      await prisma.rating.create({
        data: {
          stars: 3 + Math.floor(Math.random() * 3),
          review: sampleReviews[Math.floor(Math.random() * sampleReviews.length)],
          userId,
          productSlug: slug,
        },
      });
    }
  }
}

async function seedDiscountCodes() {
  const discountCodes = [
    {
      code: "WELCOME10",
      desc: "10% off for new customers",
      type: "PERCENTAGE",
      value: 10,
      usageLimit: 200,
    },
    {
      code: "SPRING20",
      desc: "Seasonal 20% spring discount",
      type: "PERCENTAGE",
      value: 20,
      usageLimit: 100,
    },
    {
      code: "FREESHIP50",
      desc: "50,000₫ off shipping fees",
      type: "FIXED",
      value: 50000,
      usageLimit: 300,
    },
    {
      code: "BLOOM5",
      desc: "5% off any flower bouquet",
      type: "PERCENTAGE",
      value: 5,
      usageLimit: 500,
    },
    {
      code: "PLANT50K",
      desc: "50,000₫ off all plant purchases",
      type: "FIXED",
      value: 50000,
      usageLimit: 150,
    },
    {
      code: "GIFTSET15",
      desc: "15% off any gift set",
      type: "PERCENTAGE",
      value: 15,
      usageLimit: 120,
    },
    {
      code: "VASE30K",
      desc: "30,000₫ off vases and pottery",
      type: "FIXED",
      value: 30000,
      usageLimit: 180,
    },
    {
      code: "FLASH25",
      desc: "Flash sale 25% off, limited redemptions",
      type: "PERCENTAGE",
      value: 25,
      usageLimit: 40,
    },
    {
      code: "WEEKEND10K",
      desc: "Weekend 10,000₫ off small items",
      type: "FIXED",
      value: 10000,
      usageLimit: 300,
    },
    {
      code: "THANKYOU12",
      desc: "12% off as a thank you bonus",
      type: "PERCENTAGE",
      value: 12,
      usageLimit: 250,
    },
  ];

  await prisma.discountCode.createMany({
    data: discountCodes,
  });
}

async function seedOrders() {
  const adminId = "6926fba54a1dfddfb694ad12";
  const responseCodes = [0, 7, 9, 10, 11, 12, 13, 24, 51, 65, 75, 79, 99];
  const transportations = ["truck", "van", "bike"];

  const userIdsRaw = await prisma.user.findMany({
    select: { id: true },
  });
  const userIds = userIdsRaw.map((u) => u.id);

  const productVariants = await prisma.productVariant.findMany({
    include: {
      product: true,
    },
  });

  for (let i = 0; i < 20; i++) {
    const userId = chance.pickone(userIds);

    const numItems = chance.integer({ min: 1, max: 5 });
    const items = [];
    let sumAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const v = chance.pickone(productVariants);
      const quantity = chance.integer({ min: 1, max: 3 });
      const sum = quantity * v.price;
      sumAmount += sum;

      items.push({
        variantId: v.id,
        productSlug: v.productSlug,
        quantity,
        unitPrice: v.price,
        sumAmount: sum,
        productName: v.product.name,
        variantName: v.name,
        weight: v.product.weight,
        length: v.product.length,
        width: v.product.width,
        height: v.product.height,
      });
    }

    const shippingFee = chance.integer({ min: 30000, max: 100000 });
    const discountValue = chance.integer({ min: 0, max: 50000 });
    const loyaltyPointsUsed = chance.integer({ min: 0, max: 50 });

    const code = chance.pickone(responseCodes);
    const payment = {
      cardType: chance.pickone(["QRCODE", "ATM"]),
      transactionId: Date.now().toString(),
      bankCode: code === 0 || code === 7 ? "VNPAY" : chance.pickone(["NCB", "VCB", "BIDV"]),
      payDate: new Date(),
      responseCode: code,
    };

    const shippingAddress = {
      fullName: chance.name(),
      address: chance.address(),
      province: chance.state({ full: true }),
      district: chance.city(),
      ward: chance.string({ length: 6, pool: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" }),
      phoneNumber: chance.phone({ formatted: false }),
    };

    const statusOptions = ["PENDING", "PROCESSING", "DELIVERING", "DELIVERED", "CANCELLED"];
    const status = chance.pickone(statusOptions);

    const logs =
      status !== "PENDING"
        ? [
            {
              userId: adminId,
              oldStatus: "PENDING",
              newStatus: status,
            },
          ]
        : [];

    await prisma.order.create({
      data: {
        userId,
        sumAmount,
        totalAmount: sumAmount + shippingFee - discountValue - loyaltyPointsUsed * 1000,
        initialShippingFee: shippingFee,
        discountValue,
        loyaltyPointsUsed,
        status,
        shipment: {
          set: {
            orderCode: nanoid(6).toUpperCase(),
            transportation: chance.pickone(transportations),
            expectedDeliveryTime: new Date(Date.now() + chance.integer({ min: 2, max: 5 }) * 24 * 60 * 60 * 1000).toISOString(),
            fee: shippingFee,
          },
        },
        payment: {
          set: payment,
        },
        shippingAddress: {
          set: shippingAddress,
        },
        OrderLog: {
          create: logs,
        },
        orderItems: {
          create: items,
        },
      },
    });
  }
}

async function randomizeOrderTimestamps() {
  const START = new Date("2025-07-01");
  const END = new Date();

  const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  const orders = await prisma.order.findMany({ select: { id: true } });

  for (const o of orders) {
    const createdAt = randomDate(START, END);
    const updatedAt = randomDate(createdAt, END);

    await prisma.order.update({
      where: { id: o.id },
      data: {
        createdAt,
        updatedAt,
      },
    });
  }
}

async function main() {
  // await seedUsers();
  // await seedCategories();
  // await seedProducts();
  // await seedVariants();
  // await seedProductImages();
  // await seedRatings();
  // await seedDiscountCodes();
  // await seedOrders();
  await randomizeOrderTimestamps();
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
