import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);
  
  return {
    props: {
      session: JSON.parse(JSON.stringify(session))
    }
  };
}

export default function TestSession({ session }) {
  return (
    <div>
      <h1>Session Test Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
