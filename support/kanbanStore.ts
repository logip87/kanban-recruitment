import type { Page } from '@playwright/test';

const storageKey = 'kanban-store';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TestColumn = {
  id: string;
  title: string;
  description: string;
  policy: string;
  wipLimit: number | null;
  wipHardBlock: boolean;
  order: number;
  archived: boolean;
};

export type TestCard = {
  id: string;
  number: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  blocked: boolean;
  blockedReason: string;
  blockedDependency: string | null;
  columnId: string;
  swimlaneId: string | null;
  order: number;
  archived: boolean;
  createdAt: string;
};

export const columns = {
  todo: 'column-todo',
  inProgress: 'column-in-progress',
  done: 'column-done',
  review: 'column-review',
};

export const swimlanes = {
  default: 'lane-default',
  expedite: 'lane-expedite',
};

export function defaultColumns(): TestColumn[] {
  return [
    column({ id: columns.todo, title: 'To Do', order: 0 }),
    column({ id: columns.inProgress, title: 'In progress', order: 1 }),
    column({ id: columns.done, title: 'Done', order: 2 }),
  ];
}

export function column(overrides: Partial<TestColumn>): TestColumn {
  return {
    id: 'column-id',
    title: 'Column',
    description: '',
    policy: '',
    wipLimit: null,
    wipHardBlock: false,
    order: 0,
    archived: false,
    ...overrides,
  };
}

export function card(overrides: Partial<TestCard>): TestCard {
  return {
    id: `card-${overrides.number ?? 1}`,
    number: overrides.number ?? 1,
    title: `Card ${overrides.number ?? 1}`,
    description: '',
    priority: 'medium',
    dueDate: null,
    blocked: false,
    blockedReason: '',
    blockedDependency: null,
    columnId: columns.todo,
    swimlaneId: null,
    order: 0,
    archived: false,
    createdAt: '2026-05-19T00:00:00.000Z',
    ...overrides,
  };
}

export async function clearKanbanStore(page: Page): Promise<void> {
  await page.addInitScript((key) => localStorage.removeItem(key), storageKey);
}

export async function seedKanbanStore(
  page: Page,
  options: {
    boardColumns?: TestColumn[];
    boardCards?: TestCard[];
    swimlanesEnabled?: boolean;
    nextCardNumber?: number;
  } = {},
): Promise<void> {
  const boardColumns = options.boardColumns ?? defaultColumns();
  const boardCards = options.boardCards ?? [];

  const payload = {
    state: {
      boards: [
        {
          id: 'board-1',
          name: 'My Board',
          columns: boardColumns,
          cards: boardCards,
          swimlanes: [
            { id: swimlanes.default, title: 'Default', order: 0 },
            { id: swimlanes.expedite, title: 'Expedite', order: 1 },
          ],
          swimlanesEnabled: options.swimlanesEnabled ?? false,
          nextCardNumber:
            options.nextCardNumber ??
            Math.max(1, ...boardCards.map((boardCard) => boardCard.number + 1)),
        },
      ],
      activeBoardId: null,
      searchQuery: '',
      filters: {
        priorities: [],
        blocked: null,
        dueDateFrom: null,
        dueDateTo: null,
      },
      selectedCardIds: [],
    },
    version: 1,
  };

  await page.addInitScript(
    ({ key, value }) => {
      localStorage.removeItem(key);
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: storageKey, value: payload },
  );
}
