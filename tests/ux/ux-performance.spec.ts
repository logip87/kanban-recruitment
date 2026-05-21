import { expect, test } from '../../fixtures/test';
import { card, columns, seedKanbanStore } from '../../support/kanbanStore';

test('@regression UX-001 compact layout shows 12-16 cards per column at 1080p', async ({
  boardPage,
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await seedKanbanStore(page, {
    boardCards: Array.from({ length: 16 }, (_, index) =>
      card({
        id: `card-${index + 1}`,
        number: index + 1,
        title: `Dense card ${index + 1}`,
        columnId: columns.todo,
        order: index,
      }),
    ),
    nextCardNumber: 17,
  });

  await boardPage.goTo();

  const visibleCards = await boardPage.cards.evaluateAll((cards) => {
    const viewportHeight = window.innerHeight;

    return cards.filter((cardElement) => {
      const bounds = cardElement.getBoundingClientRect();

      return bounds.top >= 0 && bounds.bottom <= viewportHeight;
    }).length;
  });

  expect(visibleCards).toBeGreaterThanOrEqual(12);
  expect(visibleCards).toBeLessThanOrEqual(16);
});

test('@regression UX-002 keyboard shortcuts trigger expected controls', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page, {
    boardCards: [card({ id: 'card-1', number: 1, title: 'Shortcut target' })],
  });

  await boardPage.goTo();
  await page.keyboard.press('N');
  await expect(boardPage.addCardTextarea).toBeVisible();

  await page.keyboard.press('Escape');
  await page.keyboard.press('F');
  await expect(boardPage.filtersPanel).toBeVisible();

  await boardPage.openCard('Shortcut target');
  await page.keyboard.press('E');
  await expect(boardPage.modal).toBeVisible();
});

test('@regression UX-003 command palette discovers shortcuts', async ({ boardPage, page }) => {
  await seedKanbanStore(page);

  await boardPage.goTo();
  await page.keyboard.press('?');

  await expect(boardPage.visibleText('N')).toBeVisible();
  await expect(boardPage.visibleText('E')).toBeVisible();
  await expect(boardPage.visibleText('F')).toBeVisible();
  await expect(boardPage.visibleText('S')).toBeVisible();
});

test('@regression UX-004 keyboard reorder announces changes with aria-live', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page, {
    boardCards: [
      card({ id: 'card-1', number: 1, title: 'Keyboard first', order: 0 }),
      card({ id: 'card-2', number: 2, title: 'Keyboard second', order: 1 }),
    ],
  });

  await boardPage.goTo();
  await boardPage.cardDragHandles.first().focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');

  await expect(boardPage.cardTitles).toHaveText(['Keyboard second', 'Keyboard first']);
  await expect(boardPage.liveRegions).toContainText('Keyboard first');
});

test('@regression UX-005 empty states show guided tips and sample template cards', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page);

  await boardPage.goTo();

  await expect(boardPage.visibleText('Create your first card')).toBeVisible();
  await expect(boardPage.visibleText('Use a sample template')).toBeVisible();
});

test('@regression UX-006 column settings form is not clipped for empty columns', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page);

  await boardPage.goTo();
  await boardPage.openColumnSettings(0);

  await expect(boardPage.columnSettingsMenu).toBeVisible();
  expect(await boardPage.isColumnSettingsMenuClipped()).toBe(false);
});
