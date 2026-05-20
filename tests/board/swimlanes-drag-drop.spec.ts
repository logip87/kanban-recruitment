import { expect, test } from '../../fixtures/test';
import { card, columns, seedKanbanStore, swimlanes } from '../../support/kanbanStore';

test('@regression FR4-001 toggles swimlanes on and off without losing cards', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page, {
    boardCards: [card({ id: 'card-1', number: 1, title: 'Lane card', columnId: columns.todo })],
    swimlanesEnabled: false,
  });

  await boardPage.goTo();
  await expect(boardPage.swimlaneTitles).toHaveCount(0);

  await boardPage.swimlanesToggleButton.click();

  await expect(boardPage.swimlaneTitles).toContainText(['Default', 'Expedite']);
  await expect(boardPage.cardTitle('Lane card')).toBeVisible();
});

test('@regression FR5-001 moves a card across columns', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [card({ id: 'card-1', number: 1, title: 'Move across', columnId: columns.todo })],
  });

  await boardPage.goTo();
  await boardPage.moveCardToColumn('Move across', 1);

  await expect(boardPage.columns.first()).not.toContainText('Move across');
  await expect(boardPage.columns.nth(1)).toContainText('Move across');
});

test('@regression FR5-002 moves a card between swimlanes', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    swimlanesEnabled: true,
    boardCards: [
      card({
        id: 'card-1',
        number: 1,
        title: 'Lane transfer',
        columnId: columns.todo,
        swimlaneId: swimlanes.default,
      }),
    ],
  });

  await boardPage.goTo();
  await boardPage.moveCardToColumn('Lane transfer', 3);

  await expect(boardPage.swimlaneRows.first()).not.toContainText('Lane transfer');
  await expect(boardPage.swimlaneRows.nth(1)).toContainText('Lane transfer');
});

test('@regression FR8-001 reorders cards inside a column', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({ id: 'card-1', number: 1, title: 'First', columnId: columns.todo, order: 0 }),
      card({ id: 'card-2', number: 2, title: 'Second', columnId: columns.todo, order: 1 }),
    ],
  });

  await boardPage.goTo();
  await boardPage.reorderCard('Second', 'First');

  await expect(boardPage.cardTitlesInColumn(0)).toHaveText(['Second', 'First']);
});

test('@regression FR8-002 card number stays stable across moves', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({ id: 'card-7', number: 7, title: 'Stable number', columnId: columns.todo, order: 0 }),
    ],
    nextCardNumber: 8,
  });

  await boardPage.goTo();
  await boardPage.moveCardToColumn('Stable number', 1);

  await expect(boardPage.cards).toHaveCount(1);
  await expect(boardPage.cardNumberInColumn(1, 'Stable number')).toHaveText('#7');
});
