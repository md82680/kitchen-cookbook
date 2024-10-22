import Link from "next/link";

function RecipesPage() {
  return (
    <div>
      <h1>Recipes</h1>
      <p>Select a category to explore our recipes:</p>
      <ul>
        <li>
          <Link href="/recipes/breakfast">
            <a>Breakfast Recipes</a>
          </Link>
        </li>
        <li>
          <Link href="/recipes/dinner">
            <a>Dinner Recipes</a>
          </Link>
        </li>
        <li>
          <Link href="/recipes/dessert">
            Dessert Recipes<
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default RecipesPage;
