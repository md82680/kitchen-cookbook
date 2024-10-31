import { IncomingForm } from "formidable";
import path from "path";
import fs from "fs/promises";
import prisma from "../../../lib/db";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data with better error handling
const parseForm = async (req) => {
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

// Enhanced file upload handler with validation
const handleFileUpload = async (file) => {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG and WebP images are allowed.');
  }

  const uploadDir = path.join(process.cwd(), "public/images/recipes");
  await fs.mkdir(uploadDir, { recursive: true });

  const uniqueFilename = `recipe-${Date.now()}-${Math.random().toString(36).substring(2)}${path.extname(
    file.originalFilename
  )}`;
  const finalPath = path.join(uploadDir, uniqueFilename);

  try {
    await fs.rename(file.filepath, finalPath);
  } catch (error) {
    // If rename fails (e.g., across devices), try copy + unlink
    await fs.copyFile(file.filepath, finalPath);
    await fs.unlink(file.filepath);
  }

  return {
    imageUrl: `/images/recipes/${uniqueFilename}`,
    imageName: file.originalFilename,
  };
};

// Validate recipe data
const validateRecipeData = (fields, ingredients) => {
  if (!fields.recipeTitle?.trim()) {
    throw new Error('Recipe title is required');
  }
  if (!fields.recipeDescription?.trim()) {
    throw new Error('Recipe description is required');
  }
  if (!fields.recipeInstructions?.trim()) {
    throw new Error('Recipe instructions are required');
  }
  if (!ingredients?.length) {
    throw new Error('At least one ingredient is required');
  }
  if (ingredients.some(ing => !ing.amount || !ing.unit || !ing.item)) {
    throw new Error('All ingredient fields must be filled out');
  }
};

export default async function handler(req, res) {
  try {
    // GET method handler
    if (req.method === "GET") {
      const recipes = await prisma.recipe.findMany({
        include: {
          author: {
            select: {
              username: true,
            },
          },
          ingredients: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return res.status(200).json(recipes);
    }

    // POST method handler
    if (req.method === "POST") {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Parse form data
      const { fields, files } = await parseForm(req);

      // Parse and validate ingredients
      const ingredients = JSON.parse(fields.ingredients || "[]");
      validateRecipeData(fields, ingredients);

      // Handle image upload
      let imageData = {
        imageUrl: "/images/default-recipe.jpg",
        imageName: null,
      };
      if (files.image) {
        imageData = await handleFileUpload(files.image);
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { username: session.user.username },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create recipe with transaction to ensure data consistency
      const recipe = await prisma.$transaction(async (prisma) => {
        const newRecipe = await prisma.recipe.create({
          data: {
            recipeTitle: fields.recipeTitle.trim(),
            recipeDescription: fields.recipeDescription.trim(),
            recipeImage: imageData.imageUrl,
            imageName: imageData.imageName,
            recipeCategory: fields.recipeCategory,
            recipeInstructions: fields.recipeInstructions.trim(),
            authorId: user.id,
            ingredients: {
              create: ingredients.map((ing) => ({
                amount: ing.amount.trim(),
                unit: ing.unit.trim(),
                item: ing.item.trim(),
              })),
            },
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

        return newRecipe;
      });

      return res.status(201).json(recipe);
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    
    // Clean up any partially uploaded files
    if (error.filepath) {
      try {
        await fs.unlink(error.filepath);
      } catch (unlinkError) {
        console.error("Error cleaning up file:", unlinkError);
      }
    }

    return res.status(error.status || 500).json({
      error: error.status ? error.message : "Internal server error",
      message: error.status ? error.message : "An unexpected error occurred",
    });
  }
}
