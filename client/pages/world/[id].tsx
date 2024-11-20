import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axios";
import withAuth from "../../hoc/withAuth";

interface World {
  id: number;
  name: string;
  description: string;
}

const WorldView: React.FC = () => {
  const [world, setWorld] = useState<World | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchWorld = async () => {
        try {
          const response = await axiosInstance.get(`/world/${id}`);
          setWorld(response.data);
        } catch (error) {
          console.error("Failed to fetch world:", error);
          router.push("/world");
        }
      };

      fetchWorld();
    }
  }, [id, router]);

  if (!world) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">{world.name}</h1>
      <p className="text-gray-600 mb-6">{world.description}</p>
      <button
        onClick={() => router.push("/world")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Worlds
      </button>
    </div>
  );
};

export default withAuth(WorldView);
