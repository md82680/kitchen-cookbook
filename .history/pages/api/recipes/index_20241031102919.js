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

// Helper function to parse form data
const parseForm = async (req) => {
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

// Helper function to handle file upload
const handleFileUpload = async (file) => {
  console.log('Processing file upload:', {
    originalFilename: file.originalFilename,
    size: file.size,
    type: file.mimetype
  });

  if (!file || !file.originalFilename) {
    throw new Error('Invalid file object');
  }

  const uploadDir = path.join(process.cwd(), "public/images/recipes");
  await fs.mkdir(uploadDir, { recursive: true });

  const fileExt = path.extname(file.originalFilename || '');
  const uniqueFilename = `recipe-${Date.now()}${fileExt}`;
  const finalPath = path.join(uploadDir, uniqueFilename);

  try {
    await fs.copyFile(file.filepath, finalPath);
    await fs.unlink(file.filepath);

    return {
      imageUrl: `/images/recipes/${uniqueFilename}`,
      imageName: file.originalFilename,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

// Add basic validation without using trim
const validateRecipeData = (fields, ingredients) => {
  if (!fields.recipeTitle) {
    throw new Error('Recipe title is required');
  }
  if (!fields.recipeDescription) {
    throw new Error('Recipe description is required');
  }
  if (!fields.recipeInstructions) {
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
      try {
        const session = await getSession({ req });
        if (!session) {
          return res.status(401).json({ error: "Not authenticated" });
        }

        // Parse the multipart form data
        const { fields, files } = await parseForm(req);

        console.log('Files received:', files);
        console.log('Fields received:', fields);

        // Parse ingredients from form data
        const ingredients = JSON.parse(fields.ingredients || "[]");

        // Validate the data
        validateRecipeData(fields, ingredients);

        // Handle image upload if a file was provided
        let imageData = {
          imageUrl: "/images/default-recipe.jpg",
          imageName: null,
        };
        if (files && files.image) {
          imageData = await handleFileUpload(files.image);
        }

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
      } catch (error) {
        console.error('Submit error:', error);
        return res.status(500).json({
          error: 'Internal server error',
          message: error.message,
        });
      }
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
