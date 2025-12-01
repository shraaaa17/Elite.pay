// components/withAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function withAuth(WrappedComponent) {
  return function Protected(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Check for session cookie presence
      const hasSession = document.cookie.split(';').some(c => c.trim().startsWith('session='));
      if (!hasSession) {
        router.replace('/auth/login');
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return <WrappedComponent {...props} />;
  }
}
