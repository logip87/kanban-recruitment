import type { Locator, Page } from '@playwright/test';

import { BasePage } from './BasePage';

type CardFields = {
  description?: string;
  priority?: string;
  dueDate?: string;
};

type BlockedFields = {
  reason: string;
  dependency?: string;
};

export class BoardPage extends BasePage {
  protected readonly url = '/';

  readonly app: Locator;
  readonly title: Locator;
  readonly boardView: Locator;
  readonly toolbar: Locator;
  readonly searchInput: Locator;
  readonly filtersButton: Locator;
  readonly filtersPanel: Locator;
  readonly filterChips: Locator;
  readonly filterDateInputs: Locator;
  readonly selectAllCheckbox: Locator;
  readonly swimlanesToggleButton: Locator;
  readonly swimlaneRows: Locator;
  readonly swimlaneTitles: Locator;
  readonly columns: Locator;
  readonly columnCards: Locator;
  readonly columnTitles: Locator;
  readonly columnCounts: Locator;
  readonly columnDragHandles: Locator;
  readonly columnInfoButtons: Locator;
  readonly wipWarnings: Locator;
  readonly columnSettingsButtons: Locator;
  readonly columnSettingsMenu: Locator;
  readonly wipLimitInput: Locator;
  readonly wipHardBlockCheckbox: Locator;
  readonly saveWipButton: Locator;
  readonly columnDescriptionTextarea: Locator;
  readonly columnPolicyTextarea: Locator;
  readonly archiveColumnButton: Locator;
  readonly deleteColumnButton: Locator;
  readonly toDoColumnTitle: Locator;
  readonly inProgressColumnTitle: Locator;
  readonly doneColumnTitle: Locator;
  readonly addColumnButton: Locator;
  readonly columnNameInput: Locator;
  readonly addColumnSubmitButton: Locator;
  readonly addCardButtons: Locator;
  readonly addCardTextarea: Locator;
  readonly addCardSubmitButton: Locator;
  readonly addCardCancelButton: Locator;
  readonly cards: Locator;
  readonly cardTitles: Locator;
  readonly cardNumbers: Locator;
  readonly cardCheckboxes: Locator;
  readonly cardDragHandles: Locator;
  readonly blockedCards: Locator;
  readonly blockedBadges: Locator;
  readonly cardDueDates: Locator;
  readonly cardPriorityBadges: Locator;
  readonly modal: Locator;
  readonly modalTitleInput: Locator;
  readonly modalDescriptionTextarea: Locator;
  readonly modalBlockedCheckbox: Locator;
  readonly modalBlockedReasonTextarea: Locator;
  readonly modalBlockedDependencyInput: Locator;
  readonly modalPrioritySelect: Locator;
  readonly modalColumnSelect: Locator;
  readonly modalDueDateInput: Locator;
  readonly modalSaveButton: Locator;
  readonly modalCancelButton: Locator;
  readonly modalDeleteButton: Locator;
  readonly bulkActions: Locator;
  readonly bulkMoveSelect: Locator;
  readonly bulkArchiveButton: Locator;
  readonly bulkClearButton: Locator;
  readonly liveRegions: Locator;

  constructor(page: Page) {
    super(page);

    this.app = page.locator('.app');
    this.title = page.locator('.app__title');
    this.boardView = page.locator('.board-view');
    this.toolbar = page.locator('.board-view__toolbar');
    this.searchInput = page.locator('.search-filter__input');
    this.filtersButton = page.locator('.search-filter__bar button');
    this.filtersPanel = page.locator('.search-filter__panel');
    this.filterChips = page.locator('.filter-chip');
    this.filterDateInputs = page.locator('.filter-section__date');
    this.selectAllCheckbox = page.locator('.board-view__toggle input');
    this.swimlanesToggleButton = page.locator('.board-view__actions button').filter({
      hasText: 'Swimlanes',
    });
    this.swimlaneRows = page.locator('.board__swimlane-row');
    this.swimlaneTitles = page.locator('.board__swimlane-title');
    this.columns = page.locator('.kanban-column');
    this.columnCards = page.locator('.kanban-column__cards');
    this.columnTitles = page.locator('.kanban-column__title');
    this.columnCounts = page.locator('.kanban-column__count');
    this.columnDragHandles = page.locator('.kanban-column__drag-handle');
    this.columnInfoButtons = page.locator('.kanban-column__info');
    this.wipWarnings = page.locator('.kanban-column__wip-warning');
    this.columnSettingsButtons = page.locator('.kanban-column__icon-btn');
    this.columnSettingsMenu = page.locator('.kanban-column__settings-menu');
    this.wipLimitInput = page.locator('.settings-menu__input');
    this.wipHardBlockCheckbox = page.locator('.settings-menu__label--row input');
    this.saveWipButton = page.locator('.settings-menu__btn--primary');
    this.columnDescriptionTextarea = page.locator(
      '.settings-menu__textarea[placeholder="Column description..."]',
    );
    this.columnPolicyTextarea = page.locator(
      '.settings-menu__textarea[placeholder="Column policy..."]',
    );
    this.archiveColumnButton = page.locator('.settings-menu__btn').filter({
      hasText: 'Archive column',
    });
    this.deleteColumnButton = page.locator('.settings-menu__btn').filter({
      hasText: 'Delete column',
    });
    this.toDoColumnTitle = this.columnTitles.filter({ hasText: 'To Do' });
    this.inProgressColumnTitle = this.columnTitles.filter({ hasText: 'In progress' });
    this.doneColumnTitle = this.columnTitles.filter({ hasText: 'Done' });
    this.addColumnButton = page.locator('.board-view__add-col-btn');
    this.columnNameInput = page.locator('.modal__input[placeholder="Column name..."]');
    this.addColumnSubmitButton = page.locator('button.btn--primary').filter({
      hasText: 'Add column',
    });
    this.addCardButtons = page.locator('.kanban-column__add-btn');
    this.addCardTextarea = page.locator('.kanban-column__add-input');
    this.addCardSubmitButton = page.locator('button.btn--primary').filter({
      hasText: 'Add card',
    });
    this.addCardCancelButton = page.locator('button.btn--ghost').filter({ hasText: 'Cancel' });
    this.cards = page.locator('.kanban-card');
    this.cardTitles = page.locator('.kanban-card__title');
    this.cardNumbers = page.locator('.kanban-card__number');
    this.cardCheckboxes = page.locator('.kanban-card__checkbox');
    this.cardDragHandles = page.locator('.kanban-card__drag-handle');
    this.blockedCards = page.locator('.kanban-card--blocked');
    this.blockedBadges = page.locator('.kanban-card__blocked-badge');
    this.cardDueDates = page.locator('.kanban-card__due');
    this.cardPriorityBadges = page.locator('.kanban-card__priority-badge');
    this.modal = page.locator('.modal');
    this.modalTitleInput = page.locator('.modal__input[placeholder="Card title"]');
    this.modalDescriptionTextarea = page.locator(
      '.modal__textarea[placeholder="Add a detailed description..."]',
    );
    this.modalBlockedCheckbox = page.locator('.modal__label--row input[type="checkbox"]');
    this.modalBlockedReasonTextarea = page.locator(
      '.modal__textarea[placeholder="Reason for being blocked..."]',
    );
    this.modalBlockedDependencyInput = page.locator(
      '.modal__input[placeholder="Dependency link (URL or card #)"]',
    );
    this.modalPrioritySelect = page.locator('.modal__select').first();
    this.modalColumnSelect = page.locator('.modal__select').nth(1);
    this.modalDueDateInput = page.locator('.modal__input[type="date"]');
    this.modalSaveButton = page.locator('button.btn--primary').filter({
      hasText: 'Save changes',
    });
    this.modalCancelButton = page.locator('button.btn--ghost').filter({ hasText: 'Cancel' });
    this.modalDeleteButton = page.locator('button.btn--danger').filter({ hasText: 'Delete' });
    this.bulkActions = page.locator('.bulk-actions');
    this.bulkMoveSelect = page.locator('.bulk-actions__select');
    this.bulkArchiveButton = page.locator('.bulk-actions button').filter({ hasText: 'Archive' });
    this.bulkClearButton = page.locator('.bulk-actions button').filter({ hasText: 'Clear' });
    this.liveRegions = page.locator('[aria-live]');
  }

  async createColumn(columnName: string): Promise<void> {
    await this.addColumnButton.click();
    await this.columnNameInput.fill(columnName);
    await this.addColumnSubmitButton.click();
  }

  async renameColumn(columnIndex: number, columnName: string): Promise<void> {
    await this.openColumnSettings(columnIndex);
    await this.columnNameInput.fill(columnName);
    await this.addColumnSubmitButton.click();
  }

  async reorderColumn(columnIndex: number, targetColumnIndex: number): Promise<void> {
    await this.columnDragHandles
      .nth(columnIndex)
      .dragTo(this.columns.nth(targetColumnIndex), { steps: 25 });
  }

  async archiveColumn(columnIndex: number): Promise<void> {
    await this.openColumnSettings(columnIndex);
    await this.archiveColumnButton.click();
  }

  async openColumnSettings(columnIndex: number): Promise<void> {
    await this.columnSettingsButtons.nth(columnIndex).click();
  }

  async openColumnInfo(columnIndex: number): Promise<void> {
    await this.columnInfoButtons.nth(columnIndex).click();
  }

  async setColumnWipLimit(
    columnIndex: number,
    limit: number,
    options: { hardBlock?: boolean } = {},
  ): Promise<void> {
    await this.openColumnSettings(columnIndex);
    await this.wipLimitInput.fill(String(limit));
    await this.wipHardBlockCheckbox.setChecked(options.hardBlock ?? false);
    await this.saveWipButton.click();
  }

  async moveCardToColumn(cardTitle: string, targetColumnIndex: number): Promise<void> {
    await this.cardDragHandle(cardTitle).dragTo(this.columnCards.nth(targetColumnIndex), {
      steps: 25,
    });
  }

  async reorderCard(cardTitle: string, targetCardTitle: string): Promise<void> {
    await this.cardDragHandle(cardTitle).dragTo(this.card(targetCardTitle), {
      steps: 25,
      targetPosition: { x: 20, y: 10 },
    });
  }

  async createCard(columnIndex: number, cardTitle: string): Promise<void> {
    await this.addCardButtons.nth(columnIndex).click();
    await this.addCardTextarea.fill(cardTitle);
    await this.addCardSubmitButton.click();
  }

  async openCard(cardTitle: string): Promise<void> {
    await this.cardTitle(cardTitle).click();
  }

  async updateOpenCard(fields: CardFields): Promise<void> {
    if (fields.description !== undefined) {
      await this.modalDescriptionTextarea.fill(fields.description);
    }

    if (fields.priority !== undefined) {
      await this.modalPrioritySelect.selectOption(fields.priority);
    }

    if (fields.dueDate !== undefined) {
      await this.modalDueDateInput.fill(fields.dueDate);
    }

    await this.modalSaveButton.click();
  }

  async updateCardTitle(cardTitle: string, newTitle: string): Promise<void> {
    await this.openCard(cardTitle);
    await this.modalTitleInput.fill(newTitle);
    await this.modalSaveButton.click();
  }

  async updateCardDueDate(cardTitle: string, dueDate: string): Promise<void> {
    await this.openCard(cardTitle);
    await this.modalDueDateInput.fill(dueDate);
    await this.modalSaveButton.click();
  }

  async markCardBlocked(cardTitle: string, fields: BlockedFields): Promise<void> {
    await this.openCard(cardTitle);
    await this.modalBlockedCheckbox.check();
    await this.modalBlockedReasonTextarea.fill(fields.reason);

    if (fields.dependency !== undefined) {
      await this.modalBlockedDependencyInput.fill(fields.dependency);
    }

    await this.modalSaveButton.click();
  }

  async selectCards(cardIndexes: number[]): Promise<void> {
    for (const cardIndex of cardIndexes) {
      await this.cardCheckboxes.nth(cardIndex).check();
    }
  }

  async moveSelectedCards(columnId: string): Promise<void> {
    await this.bulkMoveSelect.selectOption(columnId);
  }

  async archiveSelectedCards(): Promise<void> {
    await this.bulkArchiveButton.click();
  }

  async openFilters(): Promise<void> {
    await this.filtersButton.click();
  }

  async applyFilter(label: string): Promise<void> {
    await this.filterChip(label).click();
  }

  async setDueDateFilter(from: string, to: string): Promise<void> {
    await this.filterDateInputs.first().fill(from);
    await this.filterDateInputs.nth(1).fill(to);
  }

  async isColumnSettingsMenuClipped(): Promise<boolean> {
    return this.columnSettingsMenu.evaluate((menu) => {
      const column = menu.closest('.kanban-column');

      if (!column) {
        return false;
      }

      const menuBounds = menu.getBoundingClientRect();
      const columnBounds = column.getBoundingClientRect();

      return menuBounds.bottom > columnBounds.bottom || menuBounds.right > columnBounds.right;
    });
  }

  visibleText(text: string): Locator {
    return this.app.filter({ hasText: text });
  }

  card(cardTitle: string): Locator {
    return this.cards.filter({ hasText: cardTitle });
  }

  cardTitle(cardTitle: string): Locator {
    return this.cardTitles.filter({ hasText: cardTitle });
  }

  cardPriorityBadge(priority: string): Locator {
    return this.cardPriorityBadges.filter({ hasText: priority });
  }

  cardDueDate(dueDate: string): Locator {
    return this.cardDueDates.filter({ hasText: dueDate });
  }

  filterChip(label: string): Locator {
    return this.filterChips.filter({ hasText: label });
  }

  cardDragHandle(cardTitle: string): Locator {
    return this.card(cardTitle).locator('.kanban-card__drag-handle');
  }

  cardTitlesInColumn(columnIndex: number): Locator {
    return this.columns.nth(columnIndex).locator('.kanban-card__title');
  }

  cardNumberInColumn(columnIndex: number, cardTitle: string): Locator {
    return this.columns
      .nth(columnIndex)
      .locator('.kanban-card')
      .filter({ hasText: cardTitle })
      .locator('.kanban-card__number');
  }
}
