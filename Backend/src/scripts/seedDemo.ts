import { prisma } from "../lib/prisma";

const categories = [
  { id: "demo-category-first-aid", categoryName: "First Aid", description: "Sample category for the MediStore preview catalogue." },
  { id: "demo-category-health-devices", categoryName: "Health Devices", description: "Sample category for the MediStore preview catalogue." },
  { id: "demo-category-personal-care", categoryName: "Personal Care", description: "Sample category for the MediStore preview catalogue." },
];

const products = [
  { id: "demo-digital-thermometer", name: "Digital Thermometer (Preview)", description: "Sample listing for testing the storefront, product page, cart and order flow. Not a real product offer.", price: 450, stock: 15, image: "/images/products/thermometer.svg", manufacturer: "MediStore Demo Catalogue", categoryId: "demo-category-health-devices" },
  { id: "demo-first-aid-kit", name: "First Aid Kit (Preview)", description: "Sample listing for testing the storefront and cart. Not a real product offer or medical recommendation.", price: 900, stock: 10, image: "/images/products/first-aid-kit.svg", manufacturer: "MediStore Demo Catalogue", categoryId: "demo-category-first-aid" },
  { id: "demo-pill-organizer", name: "Weekly Pill Organiser (Preview)", description: "Sample healthcare accessory for testing product browsing and checkout. Not a real product offer.", price: 300, stock: 20, image: "/images/products/pill-organizer.svg", manufacturer: "MediStore Demo Catalogue", categoryId: "demo-category-health-devices" },
  { id: "demo-hand-sanitizer", name: "Hand Sanitiser (Preview)", description: "Sample personal-care listing for testing the catalogue and search. Not a real product offer.", price: 200, stock: 20, image: "/images/products/hand-sanitizer.svg", manufacturer: "MediStore Demo Catalogue", categoryId: "demo-category-personal-care" },
];

async function seedDemo() {
  if (process.env.DEMO_MODE !== "true") {
    console.log("Demo seed skipped because DEMO_MODE is not enabled.");
    return;
  }

  for (const category of categories) {
    await prisma.category.upsert({ where: { categoryName: category.categoryName }, create: category, update: { description: category.description } });
  }

  for (const product of products) {
    await prisma.medicine.upsert({
      where: { id: product.id },
      create: { ...product, authorId: "medistore-demo-seller", isActive: true },
      update: { name: product.name, description: product.description, image: product.image, manufacturer: product.manufacturer, categoryId: product.categoryId, isActive: true },
    });
  }

  console.log(`Seeded ${categories.length} preview categories and ${products.length} preview products.`);
}

seedDemo()
  .catch((error) => { console.error("Demo catalogue seed failed:", error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
