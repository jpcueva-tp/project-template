import { test } from '../fixtures';

test.describe('Index Page', () => {
    test('should display all the index elements correctly', async ({ indexPage }) => {
        await indexPage.goto();
        await indexPage.assertPageElementsLoaded();
    });

    test('should visually display all the index elements correctly', async ({ indexPage }) => {
        await indexPage.goto();
        await indexPage.assertPageScreenshot();
    });
    test('should display message after clicking action button', async ({ indexPage }) => {
        await indexPage.goto();
        await indexPage.clickActionButton();
        await indexPage.assertMessageVisible('Button clicked!');
    });
});
