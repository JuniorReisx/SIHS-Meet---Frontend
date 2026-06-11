export const EQUIPMENT_LABELS: Record<string, string> = {
  projetor: "Projetor",
  tv: "TV",
  som: "Sistema de Som",
};

export function formatEquipment(
  equipment?: string[] | null,
  otherEquipment?: string | null,
): string | null {
  const items = (equipment ?? []).map((id) => EQUIPMENT_LABELS[id] ?? id);
  if (otherEquipment?.trim()) items.push(otherEquipment.trim());
  return items.length > 0 ? items.join(", ") : null;
}
