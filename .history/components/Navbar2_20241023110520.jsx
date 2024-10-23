import { useState } from "react";
import { useRouter } from 'next/router';
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";

export default function Navbar2() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const router = useRouter();

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const navigateToSection = (sectionId) => {
    router.push(`/#${sectionId}`, undefined, { shallow: true });
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <a onClick={() => router.push('/')} style={{cursor: 'pointer'}}>Home</a>
        </li>
        <li>
          <a onClick={() => navigateToSection('about')} style={{cursor: 'pointer'}}>About</a>
        </li>
        <li>
          <a onClick={() => navigateToSection('recipes')} style={{cursor: 'pointer'}}>Recipes</a>
        </li>
        <li>
          <button onClick={toggleLoginForm}>
            {showLoginForm ? "Close" : "Login"}
          </button>
        </li>
      </ul>
      {showLoginForm && (
        <div className={styles.loginFormContainer}>
          <LoginForm onClose={() => setShowLoginForm(false)} />
        </div>
      )}
    </nav>
  );
}
