import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../../utils/axios";
import withAuth from "../../../hoc/withAuth";
import { AxiosError } from "axios";

interface World {
  id: number;
  name: string;
}

interface CharType {
  id: number;
  desc: string;
}

interface Class {
  id: number;
  desc: string;
}

interface Species {
  id: number;
  desc: string;
}

interface Gender {
  id: number;
  desc: string;
}

interface Visibility {
  id: number;
  desc: string;
}

interface Character {
  id: number;
  name: string;
  nickname: string;
  type: { desc: string };
  world: { id: number; name: string };
  class: { id: number; desc: string };
  subclass: string;
  secondClass: { id: number; desc: string };
  secondSubclass: string;
  species: { id: number; desc: string };
  customSpecies: string;
  subSpecies: string;
  gender: { id: number; desc: string };
  customGender: string;
  hair: string;
  eyes: string;
  height: string;
  appearance: string;
  visibility: { id: number; desc: string };
  createdBy: {
    id: number;
    username: string;
    email: string;
  };
  avatar: string;
}

const EditCharacter: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [type, setType] = useState<number | null>(null);
  const [world, setWorld] = useState<number | null>(null);
  const [classType, setClassType] = useState<number | null>(null);
  const [subclass, setSubclass] = useState("");
  const [secondClass, setSecondClass] = useState<number | null>(null);
  const [secondSubclass, setSecondSubclass] = useState("");
  const [species, setSpecies] = useState<number | null>(null);
  const [customSpecies, setCustomSpecies] = useState("");
  const [subSpecies, setSubSpecies] = useState("");
  const [gender, setGender] = useState<number | null>(null);
  const [customGender, setCustomGender] = useState("");
  const [hair, setHair] = useState("");
  const [eyes, setEyes] = useState("");
  const [height, setHeight] = useState("");
  const [appearance, setAppearance] = useState("");
  const [visibility, setVisibility] = useState<number | null>(null);
  const [avatar, setAvatar] = useState("");

  // Lists for dropdowns
  const [worldList, setWorldList] = useState<World[]>([]);
  const [charTypeList, setCharTypeList] = useState<CharType[]>([]);
  const [classList, setClassList] = useState<Class[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [genderList, setGenderList] = useState<Gender[]>([]);
  const [visibilityList, setVisibilityList] = useState<Visibility[]>([]);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const [
            characterRes,
            worldsRes,
            charTypesRes,
            classesRes,
            speciesRes,
            gendersRes,
            visibilitiesRes
          ] = await Promise.all([
            axiosInstance.get(`/character/${id}`),
            axiosInstance.get("/world"),
            axiosInstance.get("/char-type"),
            axiosInstance.get("/classes"),
            axiosInstance.get("/species"),
            axiosInstance.get("/gender"),
            axiosInstance.get("/visibility")
          ]);

          const characterData = characterRes.data;
          setCharacter(characterData);
          
          // Check if current user is the creator
          const token = localStorage.getItem('token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (characterData.createdBy?.id !== payload.sub) {
              alert("You don't have permission to edit this character");
              router.push("/dashboard");
              return;
            }
          }

          setName(characterData.name);
          setNickname(characterData.nickname || "");
          setType(characterData.type?.id || null);
          setWorld(characterData.world?.id || null);
          setClassType(characterData.class?.id || null);
          setSubclass(characterData.subclass || "");
          setSecondClass(characterData.secondClass?.id || null);
          setSecondSubclass(characterData.secondSubclass || "");
          setSpecies(characterData.species?.id || null);
          setCustomSpecies(characterData.customSpecies || "");
          setSubSpecies(characterData.subSpecies || "");
          setGender(characterData.gender?.id || null);
          setCustomGender(characterData.customGender || "");
          setHair(characterData.hair || "");
          setEyes(characterData.eyes || "");
          setHeight(characterData.height || "");
          setAppearance(characterData.appearance || "");
          setVisibility(characterData.visibility?.id || null);
          setAvatar(characterData.avatar || "");

          setWorldList(worldsRes.data);
          setCharTypeList(charTypesRes.data);
          setClassList(classesRes.data);
          setSpeciesList(speciesRes.data);
          setGenderList(gendersRes.data);
          setVisibilityList(visibilitiesRes.data);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 403) {
          alert("You don't have permission to edit this character");
          router.push("/dashboard");
        } else {
          console.error("Failed to fetch data:", axiosError);
          router.push("/dashboard");
        }
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/character/${id}`, {
        name,
        nickname,
        type,
        world,
        class: classType,
        subclass,
        secondClass,
        secondSubclass,
        species,
        customSpecies,
        subSpecies,
        gender,
        customGender,
        hair,
        eyes,
        height,
        appearance,
        visibility,
        avatar,
      });
      router.push("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 403) {
        alert("You don't have permission to edit this character");
      } else {
        console.error("Failed to update character:", axiosError);
      }
    }
  };

  if (!character) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Edit Character</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">
          <span className="font-semibold">Created By:</span>{" "}
          {character.createdBy?.username || character.createdBy?.email || "N/A"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar URL
          </label>
          <input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter avatar URL"
          />
          {avatar && (
            <div className="mt-2">
              <img
                src={avatar}
                alt="Avatar preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        {/* Name */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Nickname */}
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Character Type */}
        <select
          value={type || ""}
          onChange={(e) => setType(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Character Type</option>
          {charTypeList.map((charType) => (
            <option key={charType.id} value={charType.id}>
              {charType.desc}
            </option>
          ))}
        </select>

        {/* World */}
        <select
          value={world || ""}
          onChange={(e) => setWorld(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select World</option>
          {worldList.map((worldItem) => (
            <option key={worldItem.id} value={worldItem.id}>
              {worldItem.name}
            </option>
          ))}
        </select>

        {/* Class */}
        <select
          value={classType || ""}
          onChange={(e) => setClassType(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Class</option>
          {classList.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.desc}
            </option>
          ))}
        </select>

        {/* Subclass */}
        <input
          type="text"
          placeholder="Subclass"
          value={subclass}
          onChange={(e) => setSubclass(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Second Class */}
        <select
          value={secondClass || ""}
          onChange={(e) => setSecondClass(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Second Class</option>
          {classList.map((classItem) => (
            <option key={classItem.id} value={classItem.id}>
              {classItem.desc}
            </option>
          ))}
        </select>

        {/* Second Subclass */}
        <input
          type="text"
          placeholder="Second Subclass"
          value={secondSubclass}
          onChange={(e) => setSecondSubclass(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Species */}
        <select
          value={species || ""}
          onChange={(e) => setSpecies(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Species</option>
          {speciesList.map((speciesItem) => (
            <option key={speciesItem.id} value={speciesItem.id}>
              {speciesItem.desc}
            </option>
          ))}
        </select>

        {/* Custom Species */}
        {species === speciesList.find(s => s.desc === 'Custom')?.id && (
          <input
            type="text"
            placeholder="Custom Species"
            value={customSpecies}
            onChange={(e) => setCustomSpecies(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* Subspecies */}
        <input
          type="text"
          placeholder="Subspecies"
          value={subSpecies}
          onChange={(e) => setSubSpecies(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Gender */}
        <select
          value={gender || ""}
          onChange={(e) => setGender(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Gender</option>
          {genderList.map((genderItem) => (
            <option key={genderItem.id} value={genderItem.id}>
              {genderItem.desc}
            </option>
          ))}
        </select>

        {/* Custom Gender */}
        {gender === genderList.find(g => g.desc === 'Custom')?.id && (
          <input
            type="text"
            placeholder="Custom Gender"
            value={customGender}
            onChange={(e) => setCustomGender(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {/* Other fields */}
        <input
          type="text"
          placeholder="Hair"
          value={hair}
          onChange={(e) => setHair(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Eyes"
          value={eyes}
          onChange={(e) => setEyes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Height"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          placeholder="Appearance"
          value={appearance}
          onChange={(e) => setAppearance(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />

        {/* Visibility */}
        <select
          value={visibility || ""}
          onChange={(e) => setVisibility(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Visibility</option>
          {visibilityList.map((visibilityItem) => (
            <option key={visibilityItem.id} value={visibilityItem.id}>
              {visibilityItem.desc}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded shadow-md transition duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Update Character
        </button>
      </form>
    </div>
  );
};

export default withAuth(EditCharacter);
