import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <main className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-300">
          Welcome to Charactier!
        </h2>

        <div className="space-y-6 text-lg leading-relaxed">
          <p className="bg-black bg-opacity-50 p-6 rounded-lg">
            This handy little web app is meant to help game masters and players
            keep track of all of their player and non-player characters in TTRPG
            games. You can store information about the characters themselves, as
            well as build and change the relationships between those characters
            - including what benefit (or detriment, if you so desire) those
            relationships lend to your players in-game!
          </p>

          <p className="bg-black bg-opacity-50 p-6 rounded-lg">
            Game Masters can create their own Worlds, which can hold Characters,
            Relationships, and Tiers - and they can then share those Worlds and
            everything inside them with their players, or keep them hidden for
            their own dark machinations.
          </p>

          <p className="text-center text-xl font-semibold mt-8 text-blue-200">
            Register and start organizing your characters today!
          </p>
        </div>
      </section>

      <div className="text-center mb-16">
        <Link
          href="/auth"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-200 transform hover:scale-105"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
};
export default Home;
