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
      });
      return res.status(200).json(recipes);
    }

    if (req.method === "POST") {
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Parse the multipart form data
      const { fields, files } = await parseForm(req);

      // Handle image upload if a file was provided
      let imageData = {
        imageUrl: "/images/default-recipe.jpg",
        imageName: null,
      };
      if (files.image) {
        imageData = await handleFileUpload(files.image);
      }

      // Parse ingredients from form data
      const ingredients = JSON.parse(fields.ingredients || "[]");

      // Get user
      const user = await prisma.user.findUnique({
        where: { username: session.user.username },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create recipe with all data
      const recipe = await prisma.recipe.create({
        data: {
          recipeTitle: fields.recipeTitle,
          recipeDescription: fields.recipeDescription,
          recipeImage: imageData.imageUrl,
          imageName: imageData.imageName,
          recipeCategory: fields.recipeCategory,
          recipeInstructions: fields.recipeInstructions,
          authorId: user.id,
          ingredients: {
            create: ingredients.map((ing) => ({
              amount: ing.amount,
              unit: ing.unit,
              item: ing.item,
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

      return res.status(201).json(recipe);
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
