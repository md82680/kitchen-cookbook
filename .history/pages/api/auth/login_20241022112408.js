export default function handler(req, res) {
  if (req.method === "POST") {
    // Here you would typically check the user credentials against a database
    const { username, password } = req.body;

    // This is a mock authentication. Replace with actual auth logic later.
    if (username === "admin" && password === "password") {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
