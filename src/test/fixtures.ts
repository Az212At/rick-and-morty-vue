import {
  CharacterGender,
  CharacterStatus,
  type Character,
} from "@/entities/character/model/types";
import type { Episode } from "@/entities/episode/model/types";

export const rick: Character = {
  id: 1,
  name: "Rick Sanchez",
  status: CharacterStatus.Alive,
  species: "Human",
  type: "",
  gender: CharacterGender.Male,
  origin: { name: "Earth (C-137)", url: "https://example.test/location/1" },
  location: {
    name: "Citadel of Ricks",
    url: "https://example.test/location/3",
  },
  image: "https://example.test/character/1.jpeg",
  episode: ["https://example.test/episode/1", "https://example.test/episode/2"],
};

export const morty: Character = {
  ...rick,
  id: 2,
  name: "Morty Smith",
  origin: { name: "Earth (Replacement Dimension)", url: "" },
};

export const pilot: Episode = {
  id: 1,
  name: "Pilot",
  air_date: "December 2, 2013",
  episode: "S01E01",
  characters: ["https://example.test/character/1"],
};

export function page<T>(results: T[], current = 1, pages = 1) {
  return {
    info: {
      count: results.length,
      pages,
      next:
        current < pages ? `https://example.test/api?page=${current + 1}` : null,
      prev: current > 1 ? `https://example.test/api?page=${current - 1}` : null,
    },
    results,
  };
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
