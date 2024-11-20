import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../../utils/axios";
import withAuth from "../../../hoc/withAuth";

const EditWorld: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchWorld = async () => {
        try {
          const response = await axiosInstance.get(`/world/${id}`);
          const world = response.data;
          setName(world.name);
          setDescription(world.description);
        } catch (error) {
          console.error("Failed to fetch world:", error);
          router.push("/dashboard");
        }
      };

      fetchWorld();
    }
  }, [id, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/world/${id}`, {
        name,
        description,
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to update world:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Edit World</h1>
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Update World
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditWorld);
