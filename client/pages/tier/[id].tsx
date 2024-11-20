import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axios";
import withAuth from "../../hoc/withAuth";

interface Character {
  id: number;
  name: string;
}

interface Tier {
  id: number;
  level: number;
  bonus: string | null;
  npc: Character | null;
}

const TierView: React.FC = () => {
  const [tier, setTier] = useState<Tier | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchTier = async () => {
        try {
          const response = await axiosInstance.get(`/tier/${id}`);
          setTier(response.data);
        } catch (error) {
          console.error("Failed to fetch tier:", error);
          router.push("/dashboard");
        }
      };

      fetchTier();
    }
  }, [id, router]);

  if (!tier) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Tier Level {tier.level}</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          <span className="font-semibold">Bonus:</span> {tier.bonus || "N/A"}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">NPC:</span> {tier.npc?.name || "N/A"}
        </p>
      </div>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Tiers
      </button>
    </div>
  );
};

export default withAuth(TierView);
