import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/RecipeForm.module.scss";

export default function RecipeForm({ onSuccess }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recipeTitle: "",
    recipeDescription: "",
    recipeCategory: "BREAKFAST",
    recipeInstructions: "",
    ingredients: [{ amount: "", unit: "", item: "" }],
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { amount: "", unit: "", item: "" }],
    });
  };

  const validateForm = () => {
    if (!image) {
      throw new Error("Please select an image");
    }

    if (!formData.recipeTitle.trim()) {
      throw new Error("Recipe title is required");
    }

    if (!formData.recipeDescription.trim()) {
      throw new Error("Recipe description is required");
    }

    if (!formData.recipeInstructions.trim()) {
      throw new Error("Recipe instructions are required");
    }

    const hasEmptyIngredient = formData.ingredients.some(
      ing => !ing.amount.trim() || !ing.unit.trim() || !ing.item.trim()
    );
    if (hasEmptyIngredient) {
      throw new Error("Please fill in all ingredient fields");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validate form
      validateForm();

      // Create FormData object
      const submitData = new FormData();
      
      // Add image
      if (image) {
        submitData.append("image", image);
      }

      // Add other form data
      Object.keys(formData).forEach((key) => {
        if (key === "ingredients") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Debug log
      console.log("Submitting recipe:", {
        ...formData,
        image: image ? image.name : 'No image'
      });

      const response = await fetch("/api/recipes", {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create recipe");
      }

      if (onSuccess) {
        onSuccess(data);
      }

      router.push(`/${formData.recipeCategory.toLowerCase()}`);
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.recipeForm}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="recipeTitle">Recipe Title</label>
        <input
          type="text"
          id="recipeTitle"
          value={formData.recipeTitle}
          onChange={(e) =>
            setFormData({ ...formData, recipeTitle: e.target.value })
          }
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="recipeDescription">Description</label>
        <textarea
          id="recipeDescription"
          value={formData.recipeDescription}
          onChange={(e) =>
            setFormData({ ...formData, recipeDescription: e.target.value })
          }
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image">Recipe Image</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            console.log("Selected file:", file);
            setImage(file);
          }}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="recipeCategory">Category</label>
        <select
          id="recipeCategory"
          value={formData.recipeCategory}
          onChange={(e) =>
            setFormData({ ...formData, recipeCategory: e.target.value })
          }
          required
        >
          <option value="BREAKFAST">Breakfast</option>
          <option value="DINNER">Dinner</option>
          <option value="DESSERT">Dessert</option>
          <option value="SNACK_APPETIZER">Snack/Appetizer</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Ingredients</label>
        {formData.ingredients.map((ing, index) => (
          <div key={index} className={styles.ingredientRow}>
            <input
              type="text"
              placeholder="Amount"
              value={ing.amount}
              onChange={(e) =>
                handleIngredientChange(index, "amount", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Unit"
              value={ing.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
              required
            />
            <input
              type="text"
              placeholder="Ingredient"
              value={ing.item}
              onChange={(e) =>
                handleIngredientChange(index, "item", e.target.value)
              }
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className={styles.addButton}
        >
          Add Ingredient
        </button>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="recipeInstructions">Instructions</label>
        <textarea
          id="recipeInstructions"
          value={formData.recipeInstructions}
          onChange={(e) =>
            setFormData({ ...formData, recipeInstructions: e.target.value })
          }
          required
        />
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
      </button>
    </form>
  );
}
