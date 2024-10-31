import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/RecipeForm.module.scss";

export default function RecipeForm({ onSuccess }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    recipeTitle: "",
    recipeDescription: "",
    recipeCategory: "BREAKFAST", // default value
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
      ingredients: [
        ...formData.ingredients,
        { amount: "", unit: "", item: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for image upload
      const submitData = new FormData();
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

      const response = await fetch("/api/recipes", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      const recipe = await response.json();
      router.push(`/${formData.recipeCategory.toLowerCase()}`);
    } catch (error) {
      setError(error.message);
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
          onChange={(e) => setImage(e.target.files[0])}
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
            />
            <input
              type="text"
              placeholder="Unit"
              value={ing.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Ingredient"
              value={ing.item}
              onChange={(e) =>
                handleIngredientChange(index, "item", e.target.value)
              }
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

      <button type="submit" className={styles.submitButton}>
        Create Recipe
      </button>
    </form>
  );
}
