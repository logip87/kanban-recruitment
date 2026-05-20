import { expect, type Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  protected abstract readonly url: string;

  constructor(page: Page) {
    this.page = page;
  }

  async goTo(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageReady();
  }

  async expectUrl(): Promise<void> {
    await expect.poll(() => new URL(this.page.url()).pathname).toBe(this.url);
  }

  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('load');
  }
}
