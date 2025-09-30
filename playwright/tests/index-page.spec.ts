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
});
