export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  console.log("Test endpoint session:", session);

  if (session) {
    res.json({
      authenticated: true,
      session,
    });
  } else {
    res.json({
      authenticated: false,
      message: "No session found",
    });
  }
}
