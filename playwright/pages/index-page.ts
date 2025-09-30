import { expect, Page, Locator } from '../fixtures';

// playwright/pages-screenshots/Index.png

export class IndexPage {
    constructor(
        private readonly page: Page,
        private readonly pageUrl: string = '/',
        private readonly pageScreenshotPath: string[] = ['Index.png'],
        private readonly pageTitle: string = 'Test Website',
        private readonly pageHeading: Locator = page.getByRole('heading', { name: 'Test Website' }),
        private readonly actionButton: Locator = page.locator('#actionButton'),
        private readonly message: Locator = page.locator('#message'),
        private readonly customLocator: (id: string) => Locator = (id: string) => page.locator(`#${id}`),
    ) { }

    async goto(): Promise<void> {
        await this.page.goto(this.pageUrl);
    }

    async assertPageScreenshot(): Promise<void> {
        await this.page.setViewportSize({ width: 1280, height: 720 });
        await expect(this.page).toHaveScreenshot(this.pageScreenshotPath);
    }

    async assertPageElementsLoaded(): Promise<void> {
        await expect(this.page).toHaveTitle(new RegExp(this.pageTitle));
        await expect(this.pageHeading).toBeVisible();
        await expect(this.actionButton).toBeVisible();
    }

    async clickActionButton(): Promise<void> {
        await this.actionButton.click();
    }
}
