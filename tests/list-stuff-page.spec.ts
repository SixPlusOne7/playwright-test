import { test, expect } from './auth-utils';

test("List Stuff page shows John's items", async ({ getUserPage }) => {
  const page = await getUserPage('john@foo.com', 'changeme');
  await page.waitForLoadState('networkidle');

  const openNavIfCollapsed = async () => {
    const navToggle = page.getByRole('button', { name: /toggle navigation/i });
    if (await navToggle.isVisible()) {
      await navToggle.click();
    }
  };

  // navigation links + logged in user (from any page)
  await openNavIfCollapsed();
  await expect(page.getByRole('link', { name: 'Next.js Application Template' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add Stuff' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'List Stuff' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'john@foo.com' })).toBeVisible();

  // navigate to the List Stuff page through the navbar
  await page.getByRole('link', { name: 'List Stuff' }).click();
  await page.waitForURL(/\/list$/);
  await page.waitForLoadState('networkidle');
  await openNavIfCollapsed();

  // table should render with expected headers
  await expect(page.getByRole('heading', { name: 'Stuff' })).toBeVisible();
  const table = page.getByRole('table');
  await expect(table).toBeVisible();
  await expect(table.locator('thead th')).toHaveText(['Name', 'Quantity', 'Condition', 'Actions']);

  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(2);

  // john@foo.com should see Basket and Bicycle entries seeded in the DB
  const basketRow = page.getByRole('row', { name: /Basket/ });
  const basketCells = basketRow.getByRole('cell');
  await expect(basketCells.nth(0)).toHaveText('Basket');
  await expect(basketCells.nth(1)).toHaveText('3');
  await expect(basketCells.nth(2)).toHaveText('excellent');
  await expect(basketRow.getByRole('link', { name: 'Edit' })).toBeVisible();

  const bicycleRow = page.getByRole('row', { name: /Bicycle/ });
  const bicycleCells = bicycleRow.getByRole('cell');
  await expect(bicycleCells.nth(0)).toHaveText('Bicycle');
  await expect(bicycleCells.nth(1)).toHaveText('2');
  await expect(bicycleCells.nth(2)).toHaveText('poor');
  await expect(bicycleRow.getByRole('link', { name: 'Edit' })).toBeVisible();
});
