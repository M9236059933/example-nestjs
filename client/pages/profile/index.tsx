import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axios";
import withAuth from "../../hoc/withAuth";

interface Profile {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Profile</h1>

      {profile && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold">Member since:</span>{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold">Last updated:</span>{" "}
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <button
          onClick={() => router.push("/profile/edit")}
          className="w-full bg-blue-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Edit Profile
        </button>

        <button
          onClick={() => router.push("/profile/change-password")}
          className="w-full bg-green-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-green-600 focus:ring-2 focus:ring-green-300"
        >
          Change Password
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-gray-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);
