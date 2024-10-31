import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RecipeForm from "../../components/RecipeForm";
import styles from "../../styles/AddRecipe.module.scss"; // New styles file

export default function AddRecipePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Let's get</h1>
      <RecipeForm />
    </div>
  );
} 