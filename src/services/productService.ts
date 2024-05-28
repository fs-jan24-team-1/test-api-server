import prisma from '../utils/db';

export const productService = {
  getAllProducts: async () => {
    const products = await prisma.product.findMany();

    return products;
  },

  getProductById: async (id: string) => {
    const product = await prisma.productInfo.findUnique({
      where: {
        id,
      },
    });
    return product;
  },

  getByCategory: async (
    category: string,
    { sortBy = 'year', perPage, page = 1 }: any,
  ) => {
    const totalCount = await prisma.product.count({
      where: {
        category,
      },
    });

    const itemsOnPage = perPage ? perPage : totalCount;

    const totalPages = Math.ceil(totalCount / itemsOnPage) || 1;

    const products = await prisma.product.findMany({
      where: {
        category,
      },

      orderBy: {
        [sortBy]: 'asc',
      },

      skip: +itemsOnPage * (+page - 1),
      take: +itemsOnPage,
    });
    return { products, totalCount, totalPages };
  },

  getRecommendedProducts: async (id: string) => {
    const targetProduct = await prisma.productInfo.findUnique({
      where: {
        id,
      },
    });

    const category = targetProduct?.category;

    const products = await prisma.product.findMany({
      where: {
        category,
      },
      take: 10,
    });
    return products;
  },

  getNewestProducts: async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        year: 'desc',
      },
      take: 10,
    });
    return products;
  },

  getHotPricesProducts: async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        price: 'asc',
      },
      take: 10,
    });
    return products;
  },
};
