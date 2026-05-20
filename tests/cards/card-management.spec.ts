import { expect, test } from '../../fixtures/test';
import { card, columns, seedKanbanStore } from '../../support/kanbanStore';

test('@regression FR6-001 requires a title when creating a card', async ({ boardPage, page }) => {
  await test.step('Prepare clean board', async () => {
    await seedKanbanStore(page);
  });

  await test.step('Try to create a card without title', async () => {
    await boardPage.goTo();
    await boardPage.addCardButtons.first().click();
    await boardPage.addCardSubmitButton.click();
  });

  await test.step('Verify title validation prevents creation', async () => {
    await expect(boardPage.visibleText('Title is required')).toBeVisible();
    await expect(boardPage.cards).toHaveCount(0);
  });
});

test('@regression FR6-002 creates a card with title, description, priority, and due date', async ({
  boardPage,
  page,
}) => {
  await test.step('Prepare clean board', async () => {
    await seedKanbanStore(page);
  });

  await test.step('Create and enrich a card', async () => {
    await boardPage.goTo();
    await boardPage.createCard(0, 'Complete profile');
    await boardPage.openCard('Complete profile');
    await boardPage.updateOpenCard({
      description: 'Gather requirements and acceptance criteria.',
      priority: 'high',
      dueDate: '2026-06-15',
    });
  });

  await test.step('Verify card fields are visible on the board', async () => {
    await expect(boardPage.cardTitle('Complete profile')).toBeVisible();
    await expect(
      boardPage.visibleText('Gather requirements and acceptance criteria.'),
    ).toBeVisible();
    await expect(boardPage.cardPriorityBadge('High')).toBeVisible();
    await expect(boardPage.cardDueDate('2026-06-15')).toBeVisible();
  });
});

test('@regression FR7-001 edits card title in a modal', async ({ boardPage, page }) => {
  await test.step('Prepare board with one card', async () => {
    await seedKanbanStore(page, {
      boardCards: [card({ id: 'card-1', number: 1, title: 'Old title', columnId: columns.todo })],
    });
  });

  await test.step('Update the card title', async () => {
    await boardPage.goTo();
    await boardPage.updateCardTitle('Old title', 'New title');
  });

  await test.step('Verify title changed', async () => {
    await expect(boardPage.cardTitle('New title')).toBeVisible();
    await expect(boardPage.cardTitle('Old title')).toHaveCount(0);
  });
});

test('@regression FR7-002 edits card due date in a modal', async ({ boardPage, page }) => {
  await test.step('Prepare board with one card', async () => {
    await seedKanbanStore(page, {
      boardCards: [card({ id: 'card-1', number: 1, title: 'Due soon', columnId: columns.todo })],
    });
  });

  await test.step('Update the due date', async () => {
    await boardPage.goTo();
    await boardPage.updateCardDueDate('Due soon', '2026-07-01');
  });

  await test.step('Verify due date changed', async () => {
    await expect(boardPage.cardDueDate('2026-07-01')).toBeVisible();
  });
});

test('@regression FR9-001 bulk moves selected cards', async ({ boardPage, page }) => {
  await test.step('Prepare board with two cards', async () => {
    await seedKanbanStore(page, {
      boardCards: [
        card({ id: 'card-1', number: 1, title: 'Bulk one', columnId: columns.todo, order: 0 }),
        card({ id: 'card-2', number: 2, title: 'Bulk two', columnId: columns.todo, order: 1 }),
      ],
    });
  });

  await test.step('Bulk move both cards to In progress', async () => {
    await boardPage.goTo();
    await boardPage.selectCards([0, 1]);
    await boardPage.moveSelectedCards(columns.inProgress);
  });

  await test.step('Verify both cards moved', async () => {
    await expect(boardPage.columns.first()).not.toContainText('Bulk one');
    await expect(boardPage.columns.first()).not.toContainText('Bulk two');
    await expect(boardPage.columns.nth(1)).toContainText('Bulk one');
    await expect(boardPage.columns.nth(1)).toContainText('Bulk two');
  });
});

test('@regression FR9-002 bulk archives selected cards', async ({ boardPage, page }) => {
  await test.step('Prepare board with two cards', async () => {
    await seedKanbanStore(page, {
      boardCards: [
        card({ id: 'card-1', number: 1, title: 'Archive one', columnId: columns.todo, order: 0 }),
        card({ id: 'card-2', number: 2, title: 'Archive two', columnId: columns.todo, order: 1 }),
      ],
    });
  });

  await test.step('Bulk archive both cards', async () => {
    await boardPage.goTo();
    await boardPage.selectCards([0, 1]);
    await boardPage.archiveSelectedCards();
  });

  await test.step('Verify both cards are hidden', async () => {
    await expect(boardPage.cardTitle('Archive one')).toHaveCount(0);
    await expect(boardPage.cardTitle('Archive two')).toHaveCount(0);
  });
});

test('@regression FR10-001 marks a card blocked with a reason', async ({ boardPage, page }) => {
  await test.step('Prepare board with one card', async () => {
    await seedKanbanStore(page, {
      boardCards: [
        card({ id: 'card-1', number: 1, title: 'Blocked work', columnId: columns.todo }),
      ],
    });
  });

  await test.step('Mark card blocked with a reason', async () => {
    await boardPage.goTo();
    await boardPage.markCardBlocked('Blocked work', { reason: 'Waiting for API access' });
  });

  await test.step('Verify blocked state and reason', async () => {
    await expect(boardPage.blockedCards).toContainText('Blocked work');
    await expect(boardPage.visibleText('Blocked: Waiting for API access')).toBeVisible();
  });
});

test('@regression FR10-002 saves an optional blocked dependency link', async ({
  boardPage,
  page,
}) => {
  await test.step('Prepare board with one card', async () => {
    await seedKanbanStore(page, {
      boardCards: [
        card({ id: 'card-1', number: 1, title: 'Dependency work', columnId: columns.todo }),
      ],
    });
  });

  await test.step('Save a blocked dependency link', async () => {
    await boardPage.goTo();
    await boardPage.markCardBlocked('Dependency work', {
      reason: 'Depends on another card',
      dependency: '#42',
    });
    await boardPage.openCard('Dependency work');
  });

  await test.step('Verify dependency link persists', async () => {
    await expect(boardPage.modalBlockedDependencyInput).toHaveValue('#42');
  });
});

test('@regression FR11-001 blocked cards are visually prominent', async ({ boardPage, page }) => {
  await test.step('Prepare board with a blocked card', async () => {
    await seedKanbanStore(page, {
      boardCards: [
        card({
          id: 'card-1',
          number: 1,
          title: 'Visibly blocked',
          columnId: columns.todo,
          blocked: true,
          blockedReason: 'Legal approval',
        }),
      ],
    });
  });

  await test.step('Open the board', async () => {
    await boardPage.goTo();
  });

  await test.step('Verify blocked card prominence', async () => {
    await expect(boardPage.blockedCards).toHaveCount(1);
    await expect(boardPage.blockedCards).toContainText('Visibly blocked');
    await expect(boardPage.blockedBadges).toBeVisible();
    await expect(boardPage.visibleText('Blocked: Legal approval')).toBeVisible();
  });
});
