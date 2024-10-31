import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/RecipeForm.module.scss";

// Add file validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const validateImageFile = (file) => {
    if (!file) {
      throw new Error('Please select an image');
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('File must be a JPEG, PNG or WebP image');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
    }

    return true;
  };

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
      validateForm();

      const submitData = new FormData();
      
      if (image) {
        submitData.append("image", image);
      }

      Object.keys(formData).forEach((key) => {
        if (key === "ingredients") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    try {
      if (file) {
        validateImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Optional: validate dimensions
            if (img.width < 200 || img.height < 200) {
              throw new Error('Image must be at least 200x200 pixels');
            }
            setImagePreview(e.target.result);
            setImage(file);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        console.log("Selected file:", file);
      }
    } catch (error) {
      setError(error.message);
      setImage(null);
      setImagePreview(null);
      e.target.value = ''; // Reset input
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    const imageInput = document.getElementById('image');
    if (imageInput) {
      imageInput.value = '';
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
          spellCheck="true"
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
          spellCheck="true"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image">Recipe Image</label>
        <input
          type="file"
          id="image"
          name="image"
          className={styles.fileInput}
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          onChange={handleImageChange}
          required
        />
        {imagePreview && (
          <div className={styles.imagePreview}>
            <img 
              src={imagePreview} 
              alt="Recipe preview" 
              className={styles.previewImage}
            />
            <button 
              type="button" 
              onClick={removeImage}
              className={styles.removeImageButton}
            >
              Remove Image
            </button>
          </div>
        )}
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
              spellCheck="true"
            />
            <input
              type="text"
              placeholder="Unit"
              value={ing.unit}
              onChange={(e) =>
                handleIngredientChange(index, "unit", e.target.value)
              }
              required
              spellCheck="true"
            />
            <input
              type="text"
              placeholder="Ingredient"
              value={ing.item}
              onChange={(e) =>
                handleIngredientChange(index, "item", e.target.value)
              }
              required
              spellCheck="true"
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
          spellCheck="true"
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
