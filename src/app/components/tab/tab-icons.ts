export const TabIcons = [
  'tab',
  'braces',
  'tags',
  'target'
];

export function getTabIcon(tabType: number): string {
  return TabIcons[tabType];
}
