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
}

interface Visibility {
  id: number;
  desc: string;
}

interface Relationship {
  id: number;
  pc: Character;
  npc: Character;
  tier: Tier | null;
  visibility: Visibility;
}

const RelationshipView: React.FC = () => {
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchRelationship = async () => {
        try {
          const response = await axiosInstance.get(`/relationship/${id}`);
          setRelationship(response.data);
        } catch (error) {
          console.error("Failed to fetch relationship:", error);
          router.push("/dashboard");
        }
      };

      fetchRelationship();
    }
  }, [id, router]);

  if (!relationship) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Relationship Details</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          <span className="font-semibold">PC:</span> {relationship.pc?.name || "N/A"}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">NPC:</span> {relationship.npc?.name || "N/A"}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Tier:</span>{" "}
          {relationship.tier ? `Level ${relationship.tier.level}` : "N/A"}
        </p>
        {relationship.tier?.bonus && (
          <p className="text-gray-600">
            <span className="font-semibold">Tier Bonus:</span>{" "}
            {relationship.tier.bonus}
          </p>
        )}
        <p className="text-gray-600">
          <span className="font-semibold">Visibility:</span>{" "}
          {relationship.visibility?.desc || "N/A"}
        </p>
      </div>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Relationships
      </button>
    </div>
  );
};

export default withAuth(RelationshipView);
