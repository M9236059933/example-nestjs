import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../../../utils/axios";
import withAuth from "../../../hoc/withAuth";

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

const EditCharacter: React.FC = () => {
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

          const character = characterRes.data;
          setName(character.name);
          setNickname(character.nickname || "");
          setType(character.type?.id || null);
          setWorld(character.world?.id || null);
          setClassType(character.class?.id || null);
          setSubclass(character.subclass || "");
          setSecondClass(character.secondClass?.id || null);
          setSecondSubclass(character.secondSubclass || "");
          setSpecies(character.species?.id || null);
          setCustomSpecies(character.customSpecies || "");
          setSubSpecies(character.subSpecies || "");
          setGender(character.gender?.id || null);
          setCustomGender(character.customGender || "");
          setHair(character.hair || "");
          setEyes(character.eyes || "");
          setHeight(character.height || "");
          setAppearance(character.appearance || "");
          setVisibility(character.visibility?.id || null);

          setWorldList(worldsRes.data);
          setCharTypeList(charTypesRes.data);
          setClassList(classesRes.data);
          setSpeciesList(speciesRes.data);
          setGenderList(gendersRes.data);
          setVisibilityList(visibilitiesRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        router.push("/character");
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
      });
      router.push("/character");
    } catch (error) {
      console.error("Failed to update character:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6">Edit Character</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
