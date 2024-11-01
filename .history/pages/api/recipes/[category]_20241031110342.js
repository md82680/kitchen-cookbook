import prisma from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { category } = req.query;

  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        recipeCategory: category.toUpperCase(),
      },
      include: {
        ingredients: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
