// Mapping de categorías UUID a nombres legibles
// Actualizar estos UUIDs según los que tengas en tu backend
export const CATEGORY_MAPPING: Record<string, string> = {
  '550e8400-e29b-41d4-a716-446655440001': 'Médico',
  '550e8400-e29b-41d4-a716-446655440002': 'Refugio', 
  '550e8400-e29b-41d4-a716-446655440003': 'Alimentación',
  '550e8400-e29b-41d4-a716-446655440004': 'Rescate'
};

export function getCategoryName(categoryUuid: string): string {
  return CATEGORY_MAPPING[categoryUuid] || 'Otra';
}

export function getUrgencyLevel(urgency: number): string {
  if (urgency >= 8) return 'Alta';
  if (urgency >= 5) return 'Media';
  return 'Baja';
}

export function getUrgencyColor(urgency: number): string {
  if (urgency >= 8) return 'bg-red-100 text-red-800';
  if (urgency >= 5) return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}