import { useState } from "react";

export default function RecipeForm() {
  const [formData, setFormData] = useState({
    recipeTitle: "",
    recipeDescription: "",
    recipeCategory: "",
    recipeInstructions: "",
    ingredients: [],
  });
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to send both image and recipe data
    const submitFormData = new FormData();

    // Append image if one was selected
    if (image) {
      submitFormData.append("image", image);
    }

    // Append other form data
    submitFormData.append("recipeTitle", formData.recipeTitle);
    submitFormData.append("recipeDescription", formData.recipeDescription);
    submitFormData.append("recipeCategory", formData.recipeCategory);
    submitFormData.append("recipeInstructions", formData.recipeInstructions);
    submitFormData.append("ingredients", JSON.stringify(formData.ingredients));

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        body: submitFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      const recipe = await response.json();
      // Handle successful submission (e.g., redirect or show success message)
    } catch (error) {
      console.error("Error creating recipe:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="recipeTitle">Recipe Title</label>
        <input
          type="text"
          id="recipeTitle"
          value={formData.recipeTitle}
          onChange={(e) =>
            setFormData({ ...formData, recipeTitle: e.target.value })
          }
        />
      </div>

      <div>
        <label htmlFor="image">Recipe Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Add other form fields */}

      <button type="submit">Create Recipe</button>
    </form>
  );
}
