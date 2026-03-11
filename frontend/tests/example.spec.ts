import { test, expect } from '@playwright/test';

test.use({
    locale: 'en-US'
});

test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page.locator('span')).toContainText('Gratitude Journal');


    await page.getByRole('link', { name: 'Journal' }).click();
    await expect(page.getByRole('main')).toContainText('JanuaryFebruaryMarchAprilMayJuneJulyAugustSeptemberOctoberNovemberDecember');

    await page.getByRole('link', { name: 'Stats' }).click();
    await expect(page).toHaveScreenshot({ 
        animations: 'disabled',
        fullPage: true,
        mask: [
            page.locator('.recharts-wrapper'),
            page.locator('span[class^="_cardValue_"]'),
        ],
    });
    await page.getByRole('button', { name: 'FI' }).click();
    await page.getByRole('heading', { name: 'Merkinnät kuukausittain' }).click();
});