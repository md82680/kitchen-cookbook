import Link from "next/link";
import styles from "../styles/Navbar.module.scss";
import LoginForm from "./LoginForm";
import { useState } from "react";
export default function Navbar() {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleLoginForm = () => {
    setShowLoginForm(!showLoginForm);
  };

   return (
     <nav className={styles.navbar}>
       <ul>
         <li>
           <Link href="/">Home</Link>
         </li>
         <li>
           <Link href="/#about">About</Link>
         </li>
         <li>
           <Link href="/#recipes">Recipes</Link>
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
