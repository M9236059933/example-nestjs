import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';
import axiosInstance from "../../utils/axios";
import withAuth from "../../hoc/withAuth";

interface Profile {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
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
        <div className="text-xl text-gray-200">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-800 shadow-xl rounded-lg border border-gray-700">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Profile</h1>

      {profile && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
              <Image
                src={profile.avatar || '/images/default-avatar.png'}
                alt="Profile Avatar"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
              <p className="text-gray-200">
                <span className="font-semibold text-blue-400">Email:</span>{" "}
                {profile.email}
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
              <p className="text-gray-200">
                <span className="font-semibold text-blue-400">Member since:</span>{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors">
              <p className="text-gray-200">
                <span className="font-semibold text-blue-400">Last updated:</span>{" "}
                {new Date(profile.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <button
          onClick={() => router.push("/profile/edit")}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Edit Profile
        </button>

        <button
          onClick={() => router.push("/profile/change-password")}
          className="w-full bg-green-600 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Change Password
        </button>

        <button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-gray-600 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);
