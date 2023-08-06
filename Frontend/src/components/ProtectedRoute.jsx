import { useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";


export default function ProtectedRoute({ children }) {
    const { currentUser } = useContext(AuthContext);
    const router = useRouter();

  
    if (!currentUser) {
      return router.push("/");;
    }
  
    return children;
}

