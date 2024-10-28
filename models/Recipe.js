import prisma from "../lib/db";

export async function getAllRecipes() {
  return prisma.recipe.findMany({
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function getRecipeById(id) {
  return prisma.recipe.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function createRecipe(data, userId) {
  return prisma.recipe.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
}
