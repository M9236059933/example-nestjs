import { useState, FormEvent } from "react";
import axiosInstance from "../../utils/axios";
import { useRouter } from "next/router";
import withAuth from "../../hoc/withAuth";

const CreateWorld: React.FC = () => {
  const [name, setName] = useState("Middle-Earth");
  const [description, setDescription] = useState(
    "A vast fantasy world filled with unique creatures and epic quests"
  );
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.sub;

      await axiosInstance.post(`/world/${userId}`, {
        name,
        description,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create world:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Create World</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-gray-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreateWorld);
