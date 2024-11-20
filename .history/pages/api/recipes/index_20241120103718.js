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
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.headers.cookie);
  
  try {
    const session = await getServerSession(req, res, authOptions);
    
    console.log("Session in API:", {
      exists: !!session,
      user: session?.user,
      expires: session?.expires
    });

    if (!session?.user?.username) {
      console.log("No valid session found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
      try {
        const { fields, files } = await parseForm(req);
        
        // Get user from database using session username
        const user = await prisma.user.findUnique({
          where: { username: session.user.username }
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Process the recipe creation
        let imageData = {
          imageUrl: "/images/default-recipe.jpg",
          imageName: null,
        };

        if (files?.image) {
          imageData = await handleFileUpload(files.image);
        }

        // Create the recipe
        const recipe = await prisma.recipe.create({
          data: {
            title: fields.recipeTitle[0],
            description: fields.recipeDescription[0],
            instructions: fields.recipeInstructions[0],
            recipeCategory: fields.recipeCategory[0],
            imageUrl: imageData.imageUrl,
            imageName: imageData.imageName,
            ingredients: {
              create: JSON.parse(fields.ingredients).map(ing => ({
                amount: ing.amount,
                unit: ing.unit,
                item: ing.item
              }))
            },
            authorId: user.id
          }
        });

        return res.status(200).json(recipe);
      } catch (error) {
        console.error("Recipe creation error:", error);
        return res.status(500).json({ message: error.message });
      }
    }

    // Your existing GET and other method handling...

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: error.message });
  }
}
