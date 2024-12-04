import withAuth from "../../hoc/withAuth";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { useRouter } from "next/router";

interface World {
  id: number;
  name: string;
  description: string;
}

const WorldPage: React.FC = () => {
  const [worldList, setWorldList] = useState<World[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        const response = await axiosInstance.get("/world");
        setWorldList(response.data);
      } catch (error) {
        console.error("Failed to fetch worlds:", error);
      }
    };

    fetchWorlds();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/world/${id}`);
      setWorldList(worldList.filter((world) => world.id !== id));
    } catch (error) {
      console.error("Failed to delete World:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        World List
      </h1>
      <button
        onClick={() => router.push("/world/create")}
        className="mb-6 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        Create World
      </button>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border border-gray-300 p-3 w-12" aria-label="View Details"></th>
            <th className="border border-gray-300 p-3 text-left">ID</th>
            <th className="border border-gray-300 p-3 text-left">Name</th>
            <th className="border border-gray-300 p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {worldList.map((world) => (
            <tr key={world.id} className="hover:bg-gray-100 transition">
              <td className="border border-gray-300 p-3">
                <button
                  onClick={() => router.push(`/world/${world.id}`)}
                  className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                  title="View Details"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </button>
              </td>
              <td className="border border-gray-300 p-3">{world.id}</td>
              <td className="border border-gray-300 p-3">{world.name}</td>
              <td className="border border-gray-300 p-3 space-x-2">
                <button
                  onClick={() => router.push(`/world/edit/${world.id}`)}
                  className="px-3 py-1 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(world.id)}
                  className="px-3 py-1 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuth(WorldPage);
