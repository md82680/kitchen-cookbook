import Link from "next/link";
import styles from "../styles/Navbar.module.scss"; // Assuming you use SCSS for styles

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <a href="/" scroll={false}>Home</a>
        </li>
        <li>
          <a href="#about" scroll={false}>About</a>
        </li>
        <li>
          <a href="#recipes" scroll={false}>Recipes</a>
        </li>
      </ul>
    </nav>
  );
}
