import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Navbar.module.scss";

export default function Navbar({ recipes }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fuzzy search logic to match recipes by title or description
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 1) {
      const results = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(term) ||
          recipe.description.toLowerCase().includes(term)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <nav className={styles.navbar}>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="#about">About</Link></li>
        <li><Link href="#recipes">Recipes</Link></li>
      </ul>

      {/* Search bar */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {searchResults.length > 0 && (
          <ul className={styles.searchResults}>
            {searchResults.map((recipe, index) => (
              <li key={index}>
                <Link href={`/recipes/${recipe.slug}`}>
                  <a>
                    <strong>{recipe.title}</strong> - {recipe.description}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
