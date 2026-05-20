import { test as base } from '@playwright/test';

import { BoardPage } from '../pages/BoardPage';
import { seedKanbanStore } from '../support/kanbanStore';

type AppFixtures = {
  boardPage: BoardPage;
  cleanBoard: void;
};

export const test = base.extend<AppFixtures>({
  cleanBoard: [
    async ({ page }, use) => {
      await seedKanbanStore(page);
      await use();
    },
    { auto: true },
  ],
  boardPage: async ({ page }, use) => {
    await use(new BoardPage(page));
  },
});

export { expect } from '@playwright/test';
