// app/modular-test/modules.ts
export interface ModuleData {
  id: string;
  title: string;
  color: string;
  icon: string;
  defaultContent: string;
}

export const ALL_MODULES: ModuleData[] = [
  { id: 'char', title: 'Character Sheet', color: 'bg-red-900/40 border-red-500', icon: '👤', defaultContent: 'Str: 16 | Dex: 14 | Con: 12 ... HP: 45/45' },
  { id: 'tarot', title: 'Tarot Cards', color: 'bg-purple-900/40 border-purple-500', icon: '🃏', defaultContent: '✦ Draw: The Fool (Upright) — New beginnings, optimism.' },
  { id: 'dice', title: 'Dice Roller', color: 'bg-blue-900/40 border-blue-500', icon: '🎲', defaultContent: '[ d20 ] Result: 18 + 4 = 22!' },
  { id: 'loot', title: 'Loot Generator', color: 'bg-amber-900/40 border-amber-500', icon: '🪙', defaultContent: 'Found: Glimmering Trinket, 14 Gold Pieces' },
  { id: 'npc', title: 'NPC Gen', color: 'bg-emerald-900/40 border-emerald-500', icon: '🧙‍♂️', defaultContent: 'Barnaby Cliff: Eccentric blacksmith, hates crows.' },
];