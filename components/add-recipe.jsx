import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RecipeForm from "../../components/RecipeForm";

export default function AddRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Show loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div>
      <h1>Add New Recipe</h1>
      <RecipeForm />
    </div>
  );
}
