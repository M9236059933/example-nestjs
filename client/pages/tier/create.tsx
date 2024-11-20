import { useState, useEffect, FormEvent } from "react";
import axiosInstance from "../../utils/axios";
import { useRouter } from "next/router";
import withAuth from "../../hoc/withAuth";

interface Character {
  id: number;
  name: string;
}

const CreateTier: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [bonus, setBonus] = useState("");
  const [npcId, setNpcId] = useState<number | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axiosInstance.get("/character");
        setCharacters(response.data);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      }
    };

    fetchCharacters();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/tier", {
        level,
        bonus: bonus || null,
        npc: npcId,
      });
      router.push("/tier");
    } catch (error) {
      console.error("Failed to create tier:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Create Tier</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          placeholder="Level"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Bonus"
          value={bonus}
          onChange={(e) => setBonus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={npcId || ""}
          onChange={(e) => setNpcId(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select NPC (Optional)</option>
          {characters.map((character) => (
            <option key={character.id} value={character.id}>
              {character.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Create Tier
        </button>
      </form>
    </div>
  );
};

export default withAuth(CreateTier);
