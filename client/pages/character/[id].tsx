import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axios";
import withAuth from "../../hoc/withAuth";

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
}

const CharacterView: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchCharacter = async () => {
        try {
          const response = await axiosInstance.get(`/character/${id}`);
          setCharacter(response.data);
        } catch (error) {
          console.error("Failed to fetch character:", error);
          router.push("/dashboard");
        }
      };

      fetchCharacter();
    }
  }, [id, router]);

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">{character.name}</h1>
      <div className="space-y-4">
        {character.nickname && (
          <p className="text-gray-600">
            <span className="font-semibold">Nickname:</span> {character.nickname}
          </p>
        )}
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
      </div>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Characters
      </button>
    </div>
  );
};

export default withAuth(CharacterView);
