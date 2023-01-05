import type { ProductPricing } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error("There is no user in database can't seed.");
  }

  for (let i = 0; i <= 50; i++) {
    const name = faker.commerce.productName();
    const slug = slugify(name, { lower: true, strict: true, trim: true });
    const tagline = faker.random.words(3);
    const motivation = faker.commerce.productDescription();
    const pricing: ProductPricing = faker.helpers.arrayElement([
      "FREE",
      "PAID",
      "FREEMIUM",
    ]);
    const website = faker.internet.url();
    const logo = faker.image.avatar();
    const description = faker.commerce.productDescription();
    const product = await prisma.product.create({
      data: {
        name,
        description,
        slug,
        tagline,
        logo,
        motivation,
        website,
        pricing,
        startingPrice:
          pricing !== "FREE" ? faker.datatype.number(50) : undefined,
        userId: user.id,
      },
    });
    console.log(`Created Product: ${product.name}`);
  }
}

main()
  .finally(() => {
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error(err);
  });

export default main;
