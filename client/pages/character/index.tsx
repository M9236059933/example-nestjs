import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axios";
import withAuth from "../../hoc/withAuth";
import { AxiosError } from "axios";

interface Character {
  id: number;
  name: string;
  nickname: string | null;
  type: { id: number; desc: string } | null;
  class: { id: number; desc: string } | null;
  species: { id: number; desc: string } | null;
  customSpecies: string | null;
  visibility: { id: number; desc: string } | null;
  createdBy: {
    id: number;
    username: string;
    email: string;
  };
  avatar: string | null;
}

const CharacterPage: React.FC = () => {
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user ID from JWT token
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserId(payload.sub); // 'sub' contains userId in JWT
        }

        const response = await axiosInstance.get("/character");
        setCharacterList(response.data);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      try {
        await axiosInstance.delete(`/character/${id}`);
        setCharacterList(characterList.filter((char) => char.id !== id));
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 403) {
          alert("You don't have permission to delete this character");
        } else {
          console.error("Failed to delete character:", axiosError);
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Characters</h1>

      <button
        onClick={() => router.push("/character/create")}
        className="mb-6 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
      >
        Create Character
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 p-3 w-12"></th>
              <th className="border border-gray-300 p-3">Avatar</th>
              <th className="border border-gray-300 p-3 text-left">ID</th>
              <th className="border border-gray-300 p-3 text-left">Name</th>
              <th className="border border-gray-300 p-3 text-left">Nickname</th>
              <th className="border border-gray-300 p-3 text-left">Type</th>
              <th className="border border-gray-300 p-3 text-left">Class</th>
              <th className="border border-gray-300 p-3 text-left">Species</th>
              <th className="border border-gray-300 p-3 text-left">Visibility</th>
              <th className="border border-gray-300 p-3 text-left">Created By</th>
              <th className="border border-gray-300 p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {characterList.map((character) => (
              <tr key={character.id} className="hover:bg-gray-100 transition">
                <td className="border border-gray-300 p-3">
                  <button
                    onClick={() => router.push(`/character/${character.id}`)}
                    className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  </button>
                </td>
                <td className="border border-gray-300 p-3">
                  {character.avatar ? (
                    <img
                      src={character.avatar}
                      alt={`${character.name}'s avatar`}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border border-gray-300 p-3">{character.id}</td>
                <td className="border border-gray-300 p-3">{character.name}</td>
                <td className="border border-gray-300 p-3">
                  {character.nickname || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {character.type?.desc || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {character.class?.desc || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {character.species?.desc === 'Custom'
                    ? character.customSpecies
                    : character.species?.desc || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {character.visibility?.desc || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  {character.createdBy?.username || character.createdBy?.email || "N/A"}
                </td>
                <td className="border border-gray-300 p-3">
                  <div className="flex space-x-2">
                    {character.createdBy?.id === currentUserId && (
                      <>
                        <button
                          onClick={() => router.push(`/character/edit/${character.id}`)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(character.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(CharacterPage);
