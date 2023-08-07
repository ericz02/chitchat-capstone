import RootLayout from "@/app/layout";
import AuthProvider from "@/app/contexts/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
