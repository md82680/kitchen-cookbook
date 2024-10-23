import { useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/router';
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";

export default function Navbar2() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const router = useRouter();

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const scrollToSection = (sectionId) => {
    router.push('/', undefined, { shallow: true }).then(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <a onClick={() => scrollToSection('about')} style={{cursor: 'pointer'}}>About</a>
        </li>
        <li>
          <a onClick={() => scrollToSection('recipes')} style={{cursor: 'pointer'}}>Recipes</a>
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
