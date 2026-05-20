import { expect, test } from '../../fixtures/test';
import { card, columns, seedKanbanStore } from '../../support/kanbanStore';

test('@regression FR12-001 searches cards by title', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({ id: 'card-1', number: 1, title: 'Alpha title', columnId: columns.todo }),
      card({ id: 'card-2', number: 2, title: 'Beta title', columnId: columns.todo }),
    ],
  });

  await boardPage.goTo();
  await boardPage.searchInput.fill('Alpha');

  await expect(boardPage.cardTitle('Alpha title')).toBeVisible();
  await expect(boardPage.cardTitle('Beta title')).toHaveCount(0);
});

test('@regression FR12-002 searches cards by description', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({
        id: 'card-1',
        number: 1,
        title: 'Visible by description',
        description: 'needle phrase lives here',
        columnId: columns.todo,
      }),
      card({
        id: 'card-2',
        number: 2,
        title: 'Unrelated card',
        description: 'ordinary text',
        columnId: columns.todo,
      }),
    ],
  });

  await boardPage.goTo();
  await boardPage.searchInput.fill('needle phrase');

  await expect(boardPage.cardTitle('Visible by description')).toBeVisible();
  await expect(boardPage.cardTitle('Unrelated card')).toHaveCount(0);
});

test('@regression FR13-001 filters by priority', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({
        id: 'card-1',
        number: 1,
        title: 'High priority',
        priority: 'high',
        columnId: columns.todo,
      }),
      card({
        id: 'card-2',
        number: 2,
        title: 'Low priority',
        priority: 'low',
        columnId: columns.todo,
      }),
    ],
  });

  await boardPage.goTo();
  await boardPage.openFilters();
  await boardPage.applyFilter('High');

  await expect(boardPage.cardTitle('High priority')).toBeVisible();
  await expect(boardPage.cardTitle('Low priority')).toHaveCount(0);
});

test('@regression FR13-002 filters by blocked state', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({
        id: 'card-1',
        number: 1,
        title: 'Blocked card',
        blocked: true,
        blockedReason: 'Waiting',
        columnId: columns.todo,
      }),
      card({ id: 'card-2', number: 2, title: 'Open card', columnId: columns.todo }),
    ],
  });

  await boardPage.goTo();
  await boardPage.openFilters();
  await boardPage.applyFilter('Blocked');

  await expect(boardPage.cardTitle('Blocked card')).toBeVisible();
  await expect(boardPage.cardTitle('Open card')).toHaveCount(0);
});

test('@regression FR13-003 filters by due date range', async ({ boardPage, page }) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({
        id: 'card-1',
        number: 1,
        title: 'Inside range',
        dueDate: '2026-06-10',
        columnId: columns.todo,
      }),
      card({
        id: 'card-2',
        number: 2,
        title: 'Outside range',
        dueDate: '2026-07-10',
        columnId: columns.todo,
      }),
    ],
  });

  await boardPage.goTo();
  await boardPage.openFilters();
  await boardPage.setDueDateFilter('2026-06-01', '2026-06-30');

  await expect(boardPage.cardTitle('Inside range')).toBeVisible();
  await expect(boardPage.cardTitle('Outside range')).toHaveCount(0);
});

test('@regression FR13-004 combines priority, blocked, and date filters', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({
        id: 'card-1',
        number: 1,
        title: 'Matching card',
        priority: 'critical',
        blocked: true,
        blockedReason: 'External dependency',
        dueDate: '2026-06-10',
        columnId: columns.todo,
      }),
      card({
        id: 'card-2',
        number: 2,
        title: 'Wrong priority',
        priority: 'low',
        blocked: true,
        dueDate: '2026-06-10',
        columnId: columns.todo,
      }),
      card({
        id: 'card-3',
        number: 3,
        title: 'Wrong date',
        priority: 'critical',
        blocked: true,
        dueDate: '2026-08-10',
        columnId: columns.todo,
      }),
    ],
  });

  await boardPage.goTo();
  await boardPage.openFilters();
  await boardPage.applyFilter('Critical');
  await boardPage.applyFilter('Blocked');
  await boardPage.setDueDateFilter('2026-06-01', '2026-06-30');

  await expect(boardPage.cardTitle('Matching card')).toBeVisible();
  await expect(boardPage.cardTitle('Wrong priority')).toHaveCount(0);
  await expect(boardPage.cardTitle('Wrong date')).toHaveCount(0);
});
