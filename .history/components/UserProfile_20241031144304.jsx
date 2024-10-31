import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import styles from "../styles/UserProfile.module.scss";

export default function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

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
    setIsOpen(false);
    router.push('/admin/add-recipe');
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
    </div>
  );
}
