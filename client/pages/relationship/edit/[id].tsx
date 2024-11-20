import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../../utils/axios";
import withAuth from "../../../hoc/withAuth";

interface Character {
  id: number;
  name: string;
}

interface Tier {
  id: number;
  level: number;
}

interface Visibility {
  id: number;
  desc: string;
}

const EditRelationship: React.FC = () => {
  const [pc, setPc] = useState<number | null>(null);
  const [npc, setNpc] = useState<number | null>(null);
  const [tier, setTier] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<number | null>(null);
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [visibilities, setVisibilities] = useState<Visibility[]>([]);
  
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const [relationshipRes, charactersRes, tiersRes, visibilitiesRes] = 
            await Promise.all([
              axiosInstance.get(`/relationship/${id}`),
              axiosInstance.get("/character"),
              axiosInstance.get("/tier"),
              axiosInstance.get("/visibility")
            ]);

          const relationship = relationshipRes.data;
          setPc(relationship.pc.id);
          setNpc(relationship.npc.id);
          setTier(relationship.tier?.id || null);
          setVisibility(relationship.visibility.id);

          setCharacters(charactersRes.data);
          setTiers(tiersRes.data);
          setVisibilities(visibilitiesRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        router.push("/relationship");
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/relationship/${id}`, {
        pc,
        npc,
        tier,
        visibility,
      });
      router.push("/relationship");
    } catch (error) {
      console.error("Failed to update relationship:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Edit Relationship</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={pc || ""}
          onChange={(e) => setPc(e.target.value ? Number(e.target.value) : null)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select PC</option>
          {characters.map((char) => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>

        <select
          value={npc || ""}
          onChange={(e) => setNpc(e.target.value ? Number(e.target.value) : null)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select NPC</option>
          {characters.map((char) => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>

        <select
          value={tier || ""}
          onChange={(e) => setTier(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Tier</option>
          {tiers.map((t) => (
            <option key={t.id} value={t.id}>
              Level {t.level}
            </option>
          ))}
        </select>

        <select
          value={visibility || ""}
          onChange={(e) => setVisibility(e.target.value ? Number(e.target.value) : null)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Visibility</option>
          {visibilities.map((v) => (
            <option key={v.id} value={v.id}>
              {v.desc}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Update Relationship
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditRelationship);
