// Shared class catalog for Luna Art Studio

export type ClassTypeId = "creative" | "drawing" | "oil-painting" | "handcraft";

export const classTypes = [
  {
    id: "creative" as const,
    number: "01",
    title: "Creative Class",
    titleZh: "创意课",
    subtitle: "Imagination & Exploration",
    description:
      "Open-ended projects that spark ideas through mixed media, color play, and storytelling. Ideal for building confidence and creative thinking.",
    durationMinutes: 60,
    durationLabel: "60 min",
    level: "All Ages",
    color: "#c9a96e",
  },
  {
    id: "drawing" as const,
    number: "02",
    title: "Drawing Class",
    titleZh: "素描课",
    subtitle: "Line, Form & Observation",
    description:
      "Build strong foundations in line, proportion, value, and perspective. Students learn to see carefully and draw with clarity and confidence.",
    durationMinutes: 90,
    durationLabel: "90 min",
    level: "All Levels",
    color: "#9ba8b0",
  },
  {
    id: "oil-painting" as const,
    number: "03",
    title: "Oil Painting",
    titleZh: "油画",
    subtitle: "Color, Light & Technique",
    description:
      "Explore color mixing, brushwork, and classical painting methods. Students develop patience, observation, and a personal painting voice.",
    durationMinutes: 90,
    durationLabel: "90 min",
    level: "All Levels",
    color: "#c4785a",
  },
  {
    id: "handcraft" as const,
    number: "04",
    title: "Handcraft Class",
    titleZh: "手工课",
    subtitle: "Making by Hand",
    description:
      "Hands-on making through fiber arts, sewing, mixed media, and studio crafts. Creativity grows through skill and tactile practice.",
    durationMinutes: 60,
    durationLabel: "60 min",
    level: "All Ages",
    color: "#7a8c7e",
  },
] as const;

export type ClassType = (typeof classTypes)[number];

export function getClassType(id: ClassTypeId): ClassType {
  const found = classTypes.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown class type: ${id}`);
  return found;
}
