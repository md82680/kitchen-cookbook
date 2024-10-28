import { getAllRecipes, createRecipe } from "../../../models/Recipe";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const recipes = await getAllRecipes();
    return res.status(200).json(recipes);
  }

  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const recipe = await createRecipe(req.body, session.user.id);
    return res.status(201).json(recipe);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
