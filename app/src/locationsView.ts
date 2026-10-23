import { dataset, locations } from "./data";
import { el } from "./dom";
import type { Location } from "./types";

function countHighRelevance(location: Location): number {
  return location.programs.filter((p) => p.preMedRelevance === "high").length;
}

function locationCard(location: Location, onSelect: (slug: string) => void): HTMLElement {
  const card = el("button", "location-card");
  card.type = "button";
  card.setAttribute("aria-label", `View programs in ${location.country}`);
  card.addEventListener("click", () => onSelect(location.slug));

  card.append(el("h3", "location-country", location.country));

  const where = location.cities.length > 0 ? location.cities.join(", ") : "City to be confirmed";
  card.append(el("p", "location-cities", where));

  const count = location.programs.length;
  card.append(el("p", "location-count", `${count} program${count === 1 ? "" : "s"}`));

  const high = countHighRelevance(location);
  if (high > 0) {
    card.append(el("span", "badge badge-high", `${high} with clinical shadowing`));
  }
  return card;
}

/** View 1: pick a destination. Calls onSelect with the location slug. */
export function renderLocationsView(root: HTMLElement, onSelect: (slug: string) => void): void {
  root.replaceChildren();

  const header = el("header", "page-header");
  header.append(el("h1", undefined, "Pre-Med Study Abroad Finder"));
  header.append(
    el(
      "p",
      "lede",
      "Biology (Pre-Medicine) students: choose a destination to see internships, shadowing and study abroad programs there.",
    ),
  );
  root.append(header);

  const controls = el("div", "controls");
  const search = el("input", "search");
  search.type = "search";
  search.placeholder = "Search by country or city";
  search.setAttribute("aria-label", "Search destinations");
  controls.append(search);
  root.append(controls);

  const results = el("div", "results");
  root.append(results);

  const renderResults = (): void => {
    const query = search.value.trim().toLowerCase();
    const matches = locations.filter(
      (l) =>
        query === "" ||
        l.country.toLowerCase().includes(query) ||
        l.cities.some((c) => c.toLowerCase().includes(query)),
    );

    results.replaceChildren();
    if (matches.length === 0) {
      results.append(el("p", "empty", "No destinations match your search."));
      return;
    }

    const continents = [...new Set(matches.map((l) => l.continent))].sort();
    for (const continent of continents) {
      const section = el("section", "continent");
      section.append(el("h2", undefined, continent));
      const grid = el("div", "location-grid");
      for (const location of matches.filter((l) => l.continent === continent)) {
        grid.append(locationCard(location, onSelect));
      }
      section.append(grid);
      results.append(section);
    }
  };

  search.addEventListener("input", renderResults);
  renderResults();

  root.append(el("p", "disclaimer", dataset.meta.disclaimer));
}
