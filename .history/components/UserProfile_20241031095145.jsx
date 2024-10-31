import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import styles from "../styles/UserProfile.module.scss";
import Modal from "./Modal";
import RecipeForm from "./RecipeForm";

export default function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  const firstInitial = session.user.username.charAt(0).toUpperCase();

  const handleAddRecipe = () => {
    setIsOpen(false); // Close dropdown
    setShowRecipeForm(true); // Show recipe form modal
  };

  return (
    <div className={styles.userProfileContainer} ref={dropdownRef}>
      <button
        className={styles.profileCircle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {firstInitial}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userName}>{session.user.username}</div>
          <button 
            onClick={handleAddRecipe}
            className={styles.dropdownItem}
          >
            Add New Recipe
          </button>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            className={styles.dropdownItem}
          >
            Logout
          </button>
        </div>
      )}

      <Modal 
        isOpen={showRecipeForm} 
        onClose={() => setShowRecipeForm(false)}
      >
        <RecipeForm 
          onSuccess={() => {
            setShowRecipeForm(false);
            // Optionally refresh the page or update the recipe list
          }}
        />
      </Modal>
    </div>
  );
}
