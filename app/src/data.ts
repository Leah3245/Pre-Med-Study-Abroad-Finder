import raw from "./data/programs.json";
import type { Dataset, Location, Program } from "./types";

export const dataset = raw as Dataset;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Group programs by country. Countries are only ever listed together under a
 * shared continent heading; they are never merged into a single location.
 */
export function buildLocations(programs: Program[]): Location[] {
  const byCountry = new Map<string, Location>();
  for (const program of programs) {
    let location = byCountry.get(program.country);
    if (!location) {
      location = {
        slug: slugify(program.country),
        country: program.country,
        continent: program.continent,
        cities: [],
        programs: [],
      };
      byCountry.set(program.country, location);
    }
    location.programs.push(program);
    if (program.city && !location.cities.includes(program.city)) {
      location.cities.push(program.city);
    }
  }
  return [...byCountry.values()].sort((a, b) => a.country.localeCompare(b.country));
}

export const locations: Location[] = buildLocations(dataset.programs);
