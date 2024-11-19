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
  
  try {
    // Simplify to just use getServerSession
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in API:", session);

    if (!session) {
      console.log("No session found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
      console.log("Processing POST request for user:", session.user.username);
      
      // Parse form after authentication
      const { fields, files } = await parseForm(req);
      console.log("Form data parsed successfully");

      // Parse ingredients and handle files as you currently do
      const ingredients = Array.isArray(fields.ingredients) 
        ? JSON.parse(fields.ingredients[0] || "[]")
        : JSON.parse(fields.ingredients || "[]");

      // Your existing image handling code
      let imageData = {
        imageUrl: "/images/default-recipe.jpg",
        imageName: null,
      };

      if (files && files.image) {
        console.log("Processing image upload");
        imageData = await handleFileUpload(files.image);
      }

      // Get user directly from session username
      const user = await prisma.user.findUnique({
        where: { username: session.user.username }
      });

      if (!user) {
        console.log("User not found:", session.user.username);
        return res.status(404).json({ error: "User not found" });
      }

      // Rest of your existing recipe creation code...
    }

    // Your existing GET and other method handling...

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: error.message });
  }
}