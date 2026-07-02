import type { FieldConfig } from "../types/filter.types";

export const userFilterConfig: FieldConfig[] = [
  { type: "text", key: "name", label: "Name" },
  { type: "text", key: "email", label: "Email" },
  { type: "select", key: "department", label: "Department", options: ["Engineering", "Sales", "Design", "Marketing", "Support"] },
  { type: "number", key: "salary", label: "Salary" },
  { type: "date", key: "joinDate", label: "Join Date" },
  { type: "boolean", key: "isActive", label: "Active" },
  { type: "multiselect", key: "skills", label: "Skills", options: ["React", "TypeScript", "Node.js", "GraphQL", "Python", "Figma", "SEO", "SQL", "AWS", "Docker", "Vue", "Angular"] },
  { type: "text", key: "address.city", label: "City" },
  { type: "number", key: "performanceRating", label: "Performance Rating" },
];