import { dataset } from "./data";
import { el } from "./dom";
import type { Location, Program, ProgramType, Relevance } from "./types";

const TYPE_LABELS: Record<ProgramType, string> = {
  semester: "Semester / year",
  summer: "Summer",
  "faculty-led": "Faculty-led",
  shadowing: "Clinical shadowing",
};

const RELEVANCE_LABELS: Record<Relevance, string> = {
  high: "Strong pre-med fit",
  moderate: "Some pre-med value",
  low: "Limited pre-med fit",
  unknown: "Pre-med fit unconfirmed",
};

const RELEVANCE_ORDER: Record<Relevance, number> = { high: 0, moderate: 1, unknown: 2, low: 3 };

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function stat(label: string, value: string): HTMLElement {
  const box = el("div", "stat");
  box.append(el("dt", undefined, label), el("dd", undefined, value));
  return box;
}

function detailRow(label: string, value: string): HTMLElement {
  const row = el("div", "detail-row");
  row.append(el("dt", undefined, label), el("dd", undefined, value));
  return row;
}

function programCard(program: Program): HTMLElement {
  const card = el("article", "program-card");

  const head = el("div", "program-head");
  head.append(el("h3", undefined, program.name));
  head.append(el("p", "program-provider", program.provider));
  const badges = el("div", "badges");
  badges.append(el("span", `badge badge-${program.preMedRelevance}`, RELEVANCE_LABELS[program.preMedRelevance]));
  badges.append(el("span", "badge badge-type", TYPE_LABELS[program.type]));
  if (program.detailLevel === "listing-only") {
    badges.append(el("span", "badge badge-warn", "Details limited"));
  }
  head.append(badges);
  card.append(head);

  // Key facts a student needs first: city, term, length, credits, cost.
  const stats = el("dl", "stats");
  stats.append(
    stat("City", program.city ?? "To be confirmed"),
    stat("When", program.term),
    stat("Length", program.durationText),
    stat("Credits", program.creditsText),
    stat("Cost", program.costUsd !== null ? `${formatUsd(program.costUsd)} - ${program.costText}` : program.costText),
  );
  card.append(stats);

  card.append(el("p", "premed-notes", program.preMedNotes));

  // Additional important information is collapsed to keep the list scannable.
  const more = el("details", "more");
  more.append(el("summary", undefined, "More details: eligibility, housing, deadlines"));
  const rows = el("dl", "detail-rows");
  rows.append(
    detailRow("Eligibility", program.eligibility),
    detailRow("Minimum GPA", program.minGpa !== null ? program.minGpa.toFixed(1) : "See program page"),
    detailRow("Language", program.language),
    detailRow("Clinical shadowing", program.shadowingHours !== null ? `${program.shadowingHours} hours` : "Not part of this program"),
    detailRow("Housing", program.housing),
    detailRow("Deadline", program.deadline),
    detailRow("Application fee", program.applicationFee ?? "See program page"),
  );
  more.append(rows);

  if (program.included.length > 0) {
    more.append(el("h4", undefined, "Included in the program fee"));
    const list = el("ul");
    for (const item of program.included) list.append(el("li", undefined, item));
    more.append(list);
  }
  if (program.notes.length > 0) {
    more.append(el("h4", undefined, "Good to know"));
    const list = el("ul");
    for (const note of program.notes) list.append(el("li", undefined, note));
    more.append(list);
  }
  card.append(more);

  const link = el("a", "source-link", "Open official program page");
  link.href = program.sourceUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  card.append(link);

  return card;
}

/** View 2: all programs for one location. */
export function renderProgramsView(root: HTMLElement, location: Location, onBack: () => void): void {
  root.replaceChildren();

  const back = el("button", "back-button", "Back to all destinations");
  back.type = "button";
  back.addEventListener("click", onBack);
  root.append(back);

  const header = el("header", "page-header");
  header.append(el("h1", undefined, location.country));
  const where = location.cities.length > 0 ? `${location.cities.join(", ")} - ` : "";
  header.append(el("p", "lede", `${where}${location.continent}. ${location.programs.length} program${location.programs.length === 1 ? "" : "s"} found.`));
  root.append(header);

  const sorted = [...location.programs].sort(
    (a, b) => RELEVANCE_ORDER[a.preMedRelevance] - RELEVANCE_ORDER[b.preMedRelevance] || a.name.localeCompare(b.name),
  );
  const list = el("div", "program-list");
  for (const program of sorted) list.append(programCard(program));
  root.append(list);

  const links = el("p", "disclaimer");
  links.append(`${dataset.meta.disclaimer} Last reviewed: ${dataset.meta.lastVerified}. `);
  const sunySearch = el("a", undefined, "Search all SUNY programs");
  sunySearch.href = dataset.meta.sunyProgramSearchUrl;
  sunySearch.target = "_blank";
  sunySearch.rel = "noopener noreferrer";
  links.append(sunySearch);
  root.append(links);
}
