export type ProgramType = "semester" | "summer" | "faculty-led" | "shadowing";
export type Relevance = "high" | "moderate" | "low" | "unknown";
export type DetailLevel = "verified" | "partial" | "listing-only";

export interface Program {
  id: string;
  name: string;
  provider: string;
  country: string;
  continent: string;
  city: string | null;
  type: ProgramType;
  term: string;
  durationWeeks: number | null;
  durationText: string;
  credits: number | null;
  creditsText: string;
  costUsd: number | null;
  costText: string;
  minGpa: number | null;
  eligibility: string;
  language: string;
  preMedRelevance: Relevance;
  preMedNotes: string;
  shadowingHours: number | null;
  housing: string;
  deadline: string;
  applicationFee: string | null;
  included: string[];
  notes: string[];
  detailLevel: DetailLevel;
  sourceUrl: string;
}

export interface Dataset {
  meta: {
    title: string;
    lastVerified: string;
    disclaimer: string;
    oneontaStudyAbroadUrl: string;
    sunyProgramSearchUrl: string;
  };
  programs: Program[];
}

/** A selectable destination: one country, never merged across countries. */
export interface Location {
  slug: string;
  country: string;
  continent: string;
  cities: string[];
  programs: Program[];
}
