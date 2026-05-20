import { expect, test } from '../../fixtures/test';
import { card, column, columns, defaultColumns, seedKanbanStore } from '../../support/kanbanStore';

test('@regression FR3-001 default board shows required columns', async ({ boardPage }) => {
  await test.step('Open the board', async () => {
    await boardPage.goTo();
  });

  await test.step('Verify default columns', async () => {
    await expect(boardPage.columnTitles).toHaveText(['To Do', 'In progress', 'Done']);
  });
});

test('@regression FR1-001 creates a column', async ({ boardPage, page }) => {
  await test.step('Prepare clean board', async () => {
    await seedKanbanStore(page);
  });

  await test.step('Create a new column', async () => {
    await boardPage.goTo();
    await boardPage.createColumn('Review');
  });

  await test.step('Verify new column appears', async () => {
    await expect(boardPage.columnTitles).toContainText(['Review']);
  });
});

test('@regression FR1-002 renames a column', async ({ boardPage, page }) => {
  await test.step('Prepare board with a card in the column', async () => {
    await seedKanbanStore(page, {
      boardCards: [card({ id: 'card-1', number: 1, title: 'Keep me', columnId: columns.todo })],
    });
  });

  await test.step('Rename the first column', async () => {
    await boardPage.goTo();
    await boardPage.renameColumn(0, 'Ready');
  });

  await test.step('Verify rename keeps the card', async () => {
    await expect(boardPage.columnTitles).toContainText(['Ready']);
    await expect(boardPage.cardTitle('Keep me')).toBeVisible();
  });
});

test('@regression FR1-003 reorders columns', async ({ boardPage, page }) => {
  await test.step('Prepare clean board', async () => {
    await seedKanbanStore(page);
  });

  await test.step('Drag the first column after the second column', async () => {
    await boardPage.goTo();
    await boardPage.reorderColumn(0, 1);
  });

  await test.step('Verify column order changed', async () => {
    await expect(boardPage.columnTitles).toHaveText(['In progress', 'To Do', 'Done']);
  });
});

test('@regression FR1-004 archives a column', async ({ boardPage, page }) => {
  await test.step('Prepare board with an extra column', async () => {
    await seedKanbanStore(page, {
      boardColumns: [
        ...defaultColumns(),
        column({ id: columns.review, title: 'Review', order: 3 }),
      ],
    });
  });

  await test.step('Archive the extra column', async () => {
    page.on('dialog', (dialog) => dialog.accept());
    await boardPage.goTo();
    await boardPage.archiveColumn(3);
  });

  await test.step('Verify archived column is hidden', async () => {
    await expect(boardPage.columnTitles).not.toContainText(['Review']);
  });
});

test('@regression FR1-005 shows soft WIP warning without blocking cards', async ({
  boardPage,
  page,
}) => {
  await test.step('Prepare board over the soft WIP limit', async () => {
    await seedKanbanStore(page, {
      boardColumns: [
        column({
          id: columns.todo,
          title: 'To Do',
          order: 0,
          wipLimit: 1,
          wipHardBlock: false,
        }),
        ...defaultColumns().slice(1),
      ],
      boardCards: [
        card({ id: 'card-1', number: 1, title: 'First card', columnId: columns.todo, order: 0 }),
        card({ id: 'card-2', number: 2, title: 'Second card', columnId: columns.todo, order: 1 }),
      ],
    });
  });

  await test.step('Open the board', async () => {
    await boardPage.goTo();
  });

  await test.step('Verify soft WIP warning is shown', async () => {
    await expect(boardPage.columns.first()).toHaveClass(/kanban-column--wip-warn/);
    await expect(boardPage.columnCounts.first()).toHaveText('2/1');
    await expect(boardPage.wipWarnings).toContainText('WIP limit of 1 reached');
  });
});

test('@regression FR1-006 hard WIP limit blocks extra card movement', async ({
  boardPage,
  page,
}) => {
  await test.step('Prepare board with full hard-blocked column', async () => {
    await seedKanbanStore(page, {
      boardColumns: [
        defaultColumns()[0],
        column({
          id: columns.inProgress,
          title: 'In progress',
          order: 1,
          wipLimit: 1,
          wipHardBlock: true,
        }),
        defaultColumns()[2],
      ],
      boardCards: [
        card({ id: 'card-1', number: 1, title: 'Existing work', columnId: columns.inProgress }),
        card({ id: 'card-2', number: 2, title: 'New work', columnId: columns.todo }),
      ],
    });
  });

  await test.step('Try to move another card into the hard-blocked column', async () => {
    await boardPage.goTo();
    await boardPage.moveCardToColumn('New work', 1);
  });

  await test.step('Verify the move is blocked', async () => {
    await expect(boardPage.columns.first()).toContainText('New work');
    await expect(boardPage.columns.nth(1)).toContainText('Existing work');
    await expect(boardPage.columns.nth(1)).not.toContainText('New work');
  });
});

test('@regression FR2-001 column policy and description are visible on demand', async ({
  boardPage,
  page,
}) => {
  await test.step('Prepare column with policy and description', async () => {
    await seedKanbanStore(page, {
      boardColumns: [
        column({
          id: columns.todo,
          title: 'To Do',
          description: 'Definition of ready',
          policy: 'Pull only when capacity exists',
          order: 0,
        }),
        ...defaultColumns().slice(1),
      ],
    });
  });

  await test.step('Open column information', async () => {
    await boardPage.goTo();
    await boardPage.openColumnInfo(0);
  });

  await test.step('Verify policy and description are visible', async () => {
    await expect(boardPage.visibleText('Definition of ready')).toBeVisible();
    await expect(boardPage.visibleText('Pull only when capacity exists')).toBeVisible();
  });
});
