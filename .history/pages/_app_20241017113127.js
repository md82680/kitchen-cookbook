// pages/_app.js
import globalStyles from "../styles/globals.scss"; // Import global styles
import "../styles/globals.scss"; // Import global styles



export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
