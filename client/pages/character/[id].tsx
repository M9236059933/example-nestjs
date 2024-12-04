import { useState, useEffect } from "react";
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
  subclass: string | null;
  secondClass: { id: number; desc: string } | null;
  secondSubclass: string | null;
  species: { id: number; desc: string } | null;
  customSpecies: string | null;
  subSpecies: string | null;
  gender: { id: number; desc: string } | null;
  customGender: string | null;
  hair: string | null;
  eyes: string | null;
  height: string | null;
  appearance: string | null;
  visibility: { id: number; desc: string } | null;
  createdBy: {
    id: number;
    username: string;
    email: string;
  };
  avatar: string | null;
}

const CharacterView: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user ID from JWT token
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUserId(payload.sub);
        }

        if (id) {
          const response = await axiosInstance.get(`/character/${id}`);
          setCharacter(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch character:", error);
        router.push("/dashboard");
      }
    };

    fetchData();
  }, [id, router]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      try {
        await axiosInstance.delete(`/character/${character?.id}`);
        router.push("/dashboard");
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

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      {character.avatar && (
        <div className="flex justify-center mb-8">
          <div className="w-48 h-48 rounded-full overflow-hidden ring-4 ring-blue-500 shadow-lg">
            <img 
              src={character.avatar} 
              alt={`${character.name}'s avatar`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">{character.name}</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          <span className="font-semibold">Nickname:</span>{" "}
          {character.nickname || "N/A"}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Type:</span> {character.type?.desc || "N/A"}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Class:</span> {character.class?.desc || "N/A"}
          {character.subclass && ` (${character.subclass})`}
        </p>
        {character.secondClass && (
          <p className="text-gray-600">
            <span className="font-semibold">Second Class:</span>{" "}
            {character.secondClass.desc}
            {character.secondSubclass && ` (${character.secondSubclass})`}
          </p>
        )}
        <p className="text-gray-600">
          <span className="font-semibold">Species:</span>{" "}
          {character.species?.desc === 'Custom'
            ? character.customSpecies
            : character.species?.desc || "N/A"}
          {character.subSpecies && ` (${character.subSpecies})`}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Gender:</span>{" "}
          {character.gender?.desc === 'Custom'
            ? character.customGender
            : character.gender?.desc || "N/A"}
        </p>
        {character.hair && (
          <p className="text-gray-600">
            <span className="font-semibold">Hair:</span> {character.hair}
          </p>
        )}
        {character.eyes && (
          <p className="text-gray-600">
            <span className="font-semibold">Eyes:</span> {character.eyes}
          </p>
        )}
        {character.height && (
          <p className="text-gray-600">
            <span className="font-semibold">Height:</span> {character.height}
          </p>
        )}
        {character.appearance && (
          <p className="text-gray-600">
            <span className="font-semibold">Appearance:</span> {character.appearance}
          </p>
        )}
        <p className="text-gray-600">
          <span className="font-semibold">Visibility:</span>{" "}
          {character.visibility?.desc || "N/A"}
        </p>
        <p className="text-gray-600 mt-4">
          <span className="font-semibold">Created By:</span>{" "}
          {character.createdBy?.username || character.createdBy?.email || "N/A"}
        </p>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Characters
        </button>
        
        {character.createdBy?.id === currentUserId && (
          <>
            <button
              onClick={() => router.push(`/character/edit/${character.id}`)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Edit Character
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Character
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(CharacterView);
