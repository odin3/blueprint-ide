export const TabIcons = [
  'tab',
  'code-braces',
  'tags',
  'target'
];

export function getTabIcon(tabType: number): string {
  return TabIcons[tabType];
}
