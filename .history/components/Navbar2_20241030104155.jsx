import { useState } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react"; // Add this import
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";

export default function Navbar2() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const router = useRouter();
  const { data: session } = useSession(); // Add this hook

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

  const handleAuthClick = async () => {
    if (session) {
      // Handle logout
      await signOut({ redirect: false });
      // You might want to handle post-logout actions here
    } else {
      // Handle login
      toggleLoginForm();
    }
  };

  const navigateToSection = (sectionId) => {
    localStorage.setItem("hasSeenAnimation", "true");
    router.push(`/#${sectionId}`);
  };

  const navigateToHome = () => {
    localStorage.removeItem("hasSeenAnimation");
    router.push("/");
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <a onClick={navigateToHome} style={{ cursor: "pointer" }}>
            Home
          </a>
        </li>
        <li>
          <a
            onClick={() => navigateToSection("about")}
            style={{ cursor: "pointer" }}
          >
            About
          </a>
        </li>
        <li>
          <a
            onClick={() => navigateToSection("recipes")}
            style={{ cursor: "pointer" }}
          >
            Recipes
          </a>
        </li>
        <li>
          <button onClick={handleAuthClick}>
            {session ? "Logout" : "Login"}
          </button>
        </li>
      </ul>
      {showLoginForm && !session && (
        <div className={styles.loginFormContainer}>
          <LoginForm onClose={() => setShowLoginForm(false)} />
        </div>
      )}
    </nav>
  );
}
