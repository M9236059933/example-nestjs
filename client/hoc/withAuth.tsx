import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const WithAuthComponent: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  // Add display name for debugging
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(
    WrappedComponent
  )})`;

  return WithAuthComponent;
};

// Helper function to get the display name of a component
function getDisplayName(WrappedComponent: React.ComponentType): string {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuth;
