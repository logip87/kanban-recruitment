import * as allure from 'allure-js-commons';

const issueUrl = 'https://github.com/logip87/kanban-recruitment#known-defects';
const browser = 'Chromium';
const environment = 'Recruitment demo';

type KnownProductIssue = {
  title: string;
  test: string;
  observed: string;
  expected: string;
};

const knownProductIssues = {
  'FR1-001': {
    title: 'Create column flow does not add the requested column',
    test: '@regression FR1-001 creates a column',
    observed: 'After submitting "Review", the board still shows only To Do, In progress, and Done.',
    expected: 'The board should add and display the new Review column.',
  },
  'FR1-002': {
    title: 'Column rename input is not reachable from column settings',
    test: '@regression FR1-002 renames a column',
    observed: 'Opening column settings never exposes the expected column-name input.',
    expected: 'The settings flow should allow renaming the column while preserving its cards.',
  },
  'FR1-006': {
    title: 'Hard WIP limit does not block moving another card',
    test: '@regression FR1-006 hard WIP limit blocks extra card movement',
    observed: 'A card can be moved into a full hard-blocked column.',
    expected: 'The move should be rejected and the card should remain in the source column.',
  },
  'FR2-001': {
    title: 'Column policy and description are not exposed on demand',
    test: '@regression FR2-001 column policy and description are visible on demand',
    observed: 'The column info control is missing, so policy and description cannot be opened.',
    expected:
      'The column should expose its description and policy through an on-demand info control.',
  },
  'FR4-001': {
    title: 'Enabling swimlanes hides existing cards',
    test: '@regression FR4-001 toggles swimlanes on and off without losing cards',
    observed: 'After enabling swimlanes, the seeded Lane card is no longer visible.',
    expected: 'Existing cards should remain visible and be assigned to a swimlane.',
  },
  'FR6-001': {
    title: 'Required title validation message is missing',
    test: '@regression FR6-001 requires a title when creating a card',
    observed: 'Empty card creation is blocked, but no "Title is required" message is shown.',
    expected: 'The app should show a visible title-required validation message and create no card.',
  },
  'FR11-001': {
    title: 'Blocked cards are missing the required badge',
    test: '@regression FR11-001 blocked cards are visually prominent',
    observed: 'The card receives blocked styling, but the blocked badge element is not rendered.',
    expected: 'Blocked cards should show both prominent styling and a visible blocked badge.',
  },
  'FR13-002': {
    title: 'Blocked filter chip is ambiguous and partly untranslated',
    test: '@regression FR13-002 filters by blocked state',
    observed: 'The Blocked selector matches both app.filters.blocked_only.label and Not blocked.',
    expected: 'The blocked-only filter should have one clear, translated option.',
  },
  'FR13-004': {
    title: 'Combined filtering cannot reliably apply blocked-only filtering',
    test: '@regression FR13-004 combines priority, blocked, and date filters',
    observed: 'The blocked filter option is ambiguous inside the combined filter workflow.',
    expected:
      'Priority, blocked-only, and due-date filters should combine without ambiguous controls.',
  },
  'UX-002': {
    title: 'Keyboard shortcut N does not open the new-card control',
    test: '@regression UX-002 keyboard shortcuts trigger expected controls',
    observed: 'Pressing N does not reveal the add-card textarea.',
    expected:
      'Pressing N should open the new-card control so keyboard users can start card creation.',
  },
  'UX-004': {
    title: 'Keyboard reorder aria-live message exposes implementation ids',
    test: '@regression UX-004 keyboard reorder announces changes with aria-live',
    observed: 'The aria-live message announces draggable ids instead of the card title.',
    expected: 'The aria-live message should describe the moved card in user-facing language.',
  },
  'UX-005': {
    title: 'Empty board guidance is missing',
    test: '@regression UX-005 empty states show guided tips and sample template cards',
    observed: 'An empty board does not show guided tips or a sample template entry point.',
    expected: 'The empty state should guide first use and offer sample template cards.',
  },
  'UX-006': {
    title: 'Column settings form is clipped for empty columns',
    test: '@regression UX-006 column settings form is not clipped for empty columns',
    observed: 'The settings form is clipped when the column has no cards.',
    expected: 'The full settings form should remain visible and usable for empty columns.',
  },
} as const satisfies Record<string, KnownProductIssue>;

export type KnownProductIssueId = keyof typeof knownProductIssues;

export async function annotateKnownProductIssue(id: KnownProductIssueId): Promise<void> {
  const issue = knownProductIssues[id];

  await allure.issue(issueUrl, `${id}: ${issue.title}`);
  await allure.tag('known-product-defect');
  await allure.description(
    [
      `Known product issue: ${id} - ${issue.title}`,
      '',
      `Failing test: ${issue.test}`,
      `Observed: ${issue.observed}`,
      `Expected: ${issue.expected}`,
      `Browser: ${browser}`,
      `Environment: ${environment}`,
    ].join('\n'),
  );
}
