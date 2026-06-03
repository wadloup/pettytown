export type ZoneId = "town_center" | "interior_cafe";

export type ZoneDefinition = {
  id: ZoneId;
  name: string;
  subtitle: string;
  kind: "outdoor" | "interior";
};
