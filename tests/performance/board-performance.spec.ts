import { expect, test } from '../../fixtures/test';
import { card, columns, seedKanbanStore } from '../../support/kanbanStore';

test('@performance PERF-001 initial board load stays under 2s for 1,000 cards', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page, {
    boardCards: Array.from({ length: 1000 }, (_, index) =>
      card({
        id: `card-${index + 1}`,
        number: index + 1,
        title: `Performance card ${index + 1}`,
        columnId: columns.todo,
        order: index,
      }),
    ),
    nextCardNumber: 1001,
  });

  const startedAt = performance.now();
  await boardPage.goTo();
  await expect(boardPage.cards).toHaveCount(1000);
  const loadMs = performance.now() - startedAt;

  expect(loadMs).toBeLessThan(2000);
});

test('@performance PERF-002 card creation P95 latency stays under 150ms', async ({
  boardPage,
  page,
}) => {
  await seedKanbanStore(page);
  const samples: number[] = [];

  await boardPage.goTo();

  for (let index = 0; index < 10; index += 1) {
    await boardPage.addCardButtons.first().click();
    await boardPage.addCardTextarea.fill(`Timed card ${index + 1}`);

    const startedAt = performance.now();
    await boardPage.addCardSubmitButton.click();
    await expect(boardPage.cardTitle(`Timed card ${index + 1}`)).toBeVisible();
    samples.push(performance.now() - startedAt);
  }

  const p95 = [...samples].sort((left, right) => left - right)[
    Math.ceil(samples.length * 0.95) - 1
  ];

  expect(p95).toBeLessThan(150);
});
