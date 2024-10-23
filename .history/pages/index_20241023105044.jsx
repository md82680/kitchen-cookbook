import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import CategoryCard from "../components/CategoryCard";
import SearchBar from "../components/SearchBar"; // Import the search bar component
import styles from "../styles/Home.module.scss";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const router = useRouter();

  const recipes = [
    {
      title: "Spaghetti Bolognese",
      description: "A hearty meat sauce with pasta.",
      slug: "spaghetti-bolognese",
    },
    {
      title: "Oat Flour Chocolate Chip Cookies",
      description: "Delicious and healthy oat flour cookies.",
      slug: "oat-flour-chocolate-chip-cookies",
    },
    {
      title: "Chicken Alfredo",
      description: "Creamy pasta with chicken and Alfredo sauce.",
      slug: "chicken-alfredo",
    },
    // Add more recipes here
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 4500); // Adjust this time to match your animation duration

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showContent) {
      router.push("/home");
    }
  }, [showContent, router]);

  return (
    <>
      {!showContent && (
        <div className={styles.landingPage}>
          <h1 className={styles.kitchen}>Kitchen</h1>
          <h1 className={styles.cookbook}>Cookbook</h1>
          <h1 className={styles.finalText}>Kitchen Cookbook</h1>
        </div>
      )}

      {showContent && (
        <>
          <Navbar />
          <div className={styles.homeSection} id="home">
            <h1>
              Cooking with heart is the best way to bring friends and family
              together
            </h1>
          </div>
          <div className={styles.aboutSection} id="about">
            <h2>About</h2>
            <p>
              The Kitchen Cookbook is an easy-to-reference cookbook for our
              family's favorite recipes.
            </p>
          </div>
          <div className={styles.recipeSection} id="recipes">
            <h2>Recipes</h2>
            <SearchBar recipes={recipes} />
            <div className={styles.recipeCards}>
              <CategoryCard
                title="Breakfast"
                link="/breakfast"
                imageSrc="/images/breakfast.jpg"
              />
              <CategoryCard
                title="Dinner"
                link="/dinner"
                imageSrc="/images/dinner.jpg"
              />
              <CategoryCard
                title="Dessert"
                link="/dessert"
                imageSrc="/images/dessert.jpg"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
