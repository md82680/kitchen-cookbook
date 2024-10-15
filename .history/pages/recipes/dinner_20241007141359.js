import RecipeDetails from "../../components/RecipeDetails";

export default function Dinner() {
  const dinnerRecipes = [
    {
      title: "Spaghetti Bolognese",
      description: "A hearty meat sauce with pasta.",
      image: "/spaghetti.jpg",
    },
    // Add more recipes here
  ];

    return (
        <>
      <Navbar />
    <div>
      <h2>Dinner Recipes</h2>
      <div className="recipeList">
        {dinnerRecipes.map((recipe, index) => (
          <RecipeDetails key={index} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
