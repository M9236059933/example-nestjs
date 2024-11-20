import { useState } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../utils/axios";
import withAuth from "../../hoc/withAuth";

const ChangePasswordPage: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      await axiosInstance.put("/users/me/password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      router.push("/profile");
    } catch (error) {
      console.error("Failed to change password:", error);
      setError("Failed to change password. Please check your current password.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Change Password</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          >
            Change Password
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex-1 bg-gray-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(ChangePasswordPage); 