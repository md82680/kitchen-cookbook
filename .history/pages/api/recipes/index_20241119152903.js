import { IncomingForm } from "formidable";
import path from "path";
import fs from "fs/promises";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

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
  console.log('Raw file object:', file);

  // Handle array of files if necessary
  const fileToProcess = Array.isArray(file) ? file[0] : file;
  
  if (!fileToProcess || !fileToProcess.filepath) {
    console.error('Invalid file object received:', fileToProcess);
    throw new Error('Invalid file object');
  }

  const uploadDir = path.join(process.cwd(), "public/images/recipes");
  await fs.mkdir(uploadDir, { recursive: true });

  // Get original filename or generate one
  const originalFilename = fileToProcess.originalFilename || 'uploaded-file';
  const fileExt = path.extname(originalFilename);
  const uniqueFilename = `recipe-${Date.now()}${fileExt}`;
  const finalPath = path.join(uploadDir, uniqueFilename);

  try {
    await fs.copyFile(fileToProcess.filepath, finalPath);
    await fs.unlink(fileToProcess.filepath); // Clean up the temp file

    console.log('File uploaded successfully:', uniqueFilename);
    return {
      imageUrl: `/images/recipes/${uniqueFilename}`,
      imageName: originalFilename,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

export default async function handler(req, res) {
  console.log("=== Request Details ===");
  console.log("Method:", req.method);
  
  try {
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in API:", session);

    if (!session) {
      console.log("No session found");
      return res.status(401).json({ message: "Unauthorized" });
    }

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
      console.log("Processing POST request for user:", session.user.username);
      
      // Parse form after authentication
      const { fields, files } = await parseForm(req);
      console.log("Form data parsed successfully");
      
      // Debug log the entire files object
      console.log("Files received:", JSON.stringify(files, null, 2));

      // Parse ingredients from form data
      const ingredients = Array.isArray(fields.ingredients) 
        ? JSON.parse(fields.ingredients[0] || "[]")
        : JSON.parse(fields.ingredients || "[]");

      // Handle image upload if a file was provided
      let imageData = {
        imageUrl: "/images/default-recipe.jpg",
        imageName: null,
      };

      if (files && files.image) {
        console.log("Processing image upload");
        imageData = await handleFileUpload(files.image);
      }

      // Get user directly from session
      const user = await prisma.user.findUnique({
        where: { username: session.user.username }
      });

      if (!user) {
        console.log("User not found:", session.user.username);
        return res.status(404).json({ error: "User not found" });
      }

      console.log("Creating recipe");
      const recipe = await prisma.recipe.create({
        data: {
          recipeTitle: Array.isArray(fields.recipeTitle) 
            ? fields.recipeTitle[0] 
            : fields.recipeTitle,
          recipeDescription: Array.isArray(fields.recipeDescription)
            ? fields.recipeDescription[0]
            : fields.recipeDescription,
          recipeImage: imageData.imageUrl,
          imageName: imageData.imageName,
          recipeCategory: Array.isArray(fields.recipeCategory)
            ? fields.recipeCategory[0]
            : fields.recipeCategory,
          recipeInstructions: Array.isArray(fields.recipeInstructions)
            ? fields.recipeInstructions[0]
            : fields.recipeInstructions,
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

      console.log("Recipe created successfully:", recipe.id);
      return res.status(201).json(recipe);
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: error.message });
  }
}
