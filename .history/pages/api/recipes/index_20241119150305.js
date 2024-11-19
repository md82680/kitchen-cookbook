import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { parseForm } from "../../../lib/parseForm"; // assuming you have this utility

export default async function handler(req, res) {
  try {
    // Get the authenticated session
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in API route:", session);

    if (!session) {
      console.log("No session found - unauthorized");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
      console.log("Starting POST request processing");

      try {
        // Parse the multipart form data
        const { fields, files } = await parseForm(req);
        console.log("Parsed form data:", fields);
        console.log("Files received:", files);

        // Parse ingredients from form data
        const ingredients = Array.isArray(fields.ingredients) 
          ? JSON.parse(fields.ingredients[0] || "[]")
          : JSON.parse(fields.ingredients || "[]");

        // Get the user from the session
        const user = await prisma.user.findUnique({
          where: { username: session.user.username }
        });

        if (!user) {
          console.log("User not found in database");
          return res.status(404).json({ message: "User not found" });
        }

        // Create the recipe
        const recipe = await prisma.recipe.create({
          data: {
            authorId: user.id,
            recipeTitle: fields.recipeTitle[0],
            recipeDescription: fields.recipeDescription[0],
            recipeCategory: fields.recipeCategory[0],
            recipeInstructions: fields.recipeInstructions[0],
            recipeImage: files.image ? `/images/recipes/${files.image.newFilename}` : null,
            imageName: files.image ? files.image.newFilename : null,
            ingredients: {
              create: ingredients.map(ing => ({
                amount: ing.amount,
                unit: ing.unit,
                item: ing.item
              }))
            }
          },
          include: {
            ingredients: true
          }
        });

        console.log("Recipe created successfully:", recipe);
        return res.status(200).json(recipe);

      } catch (error) {
        console.error("Error processing recipe:", error);
        return res.status(500).json({ 
          message: "Error creating recipe", 
          error: error.message 
        });
      }
    }

    // Handle GET requests if needed
    if (req.method === "GET") {
      // ... GET logic here
    }

    // Return 405 for other methods
    return res.status(405).json({ message: "Method not allowed" });

  } catch (error) {
    console.error("API route error:", error);
    return res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
}
