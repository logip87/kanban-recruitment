import { expect, test } from '../../fixtures/test';

test('@smoke app shell loads', async ({ boardPage, page }) => {
  await boardPage.goTo();
  await boardPage.expectUrl();

  await expect(boardPage.app).toBeVisible();
  await expect(boardPage.title).toHaveText('Kanban Board');
  await expect(boardPage.boardView).toBeVisible();
  await expect(page).toHaveTitle('kanban-demo');
});
