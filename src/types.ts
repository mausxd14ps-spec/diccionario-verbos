export type VerbType = "regular" | "irregular";

export type FormKey = "base" | "third" | "past" | "participle" | "gerund";

export interface VerbForms {
  base: string;
  third: string;
  past: string;
  participle: string;
  gerund: string;
}

export interface VerbExample {
  en: string;
  es: string;
}

export interface Verb {
  id: string;
  base: string;
  es: string;
  type: VerbType;
  popular: boolean;
  detailed: boolean;
  forms: VerbForms;
  definition: string;
  usage: string;
  examples: Record<FormKey, VerbExample>;
}

export const FORM_LABELS: Record<FormKey, string> = {
  base: "Base / Inf",
  past: "Past Simple",
  participle: "Past Participle",
  gerund: "Gerund (-ing)",
  third: "3rd Person (-s)",
};

export const FORM_ORDER: FormKey[] = ["base", "past", "participle", "gerund", "third"];

export const FORM_SHORT_LABELS: Record<FormKey, string> = {
  base: "Base / Infinitive",
  past: "Past Simple",
  participle: "Past Participle",
  gerund: "Gerund (-ing)",
  third: "Third Person (-s)",
};
