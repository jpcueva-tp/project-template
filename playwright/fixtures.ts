import { test as base } from '@playwright/test';
import { IndexPage } from './pages/index-page';

type Pages = {
    indexPage: IndexPage;
};

export const test = base.extend<Pages>({
    indexPage: async ({ page }, use) => {
        await use(new IndexPage(page));
    },
});
export { expect, Locator, Page } from '@playwright/test';
