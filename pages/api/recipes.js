import { createRecipe } from '../../models/Recipe'
import { getSession } from 'next-auth/react'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Prepare the recipe data
    const recipeData = {
      title: req.body.recipeTitle,
      description: req.body.recipeDescription,
      category: req.body.recipeCategory,
      instructions: req.body.recipeInstructions,
      ingredients: JSON.parse(req.body.ingredients),
      // imageUrl: imageUrl, // Add this once image upload is implemented
    }

    const recipe = await createRecipe(recipeData, session.user.id)
    res.status(201).json(recipe)
  } catch (error) {
    console.error('Recipe creation error:', error)
    res.status(500).json({ message: 'Error creating recipe', error: error.message })
  }
} 