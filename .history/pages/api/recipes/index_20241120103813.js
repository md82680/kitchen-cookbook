import { IncomingForm } from "formidable";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let imageData = {
      imageUrl: "/images/default-recipe.jpg",
      imageName: null,
    };

    if (files?.image) {
      imageData = await handleFileUpload(files.image);
    }

    const recipe = await prisma.recipe.create({
      data: {
        title: fields.recipeTitle[0],
        instructions: fields.recipeInstructions[0],
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
    console.error('API Error:', error);
    return res.status(500).json({ message: error.message });
  }
}
