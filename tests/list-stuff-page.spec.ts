import { test, expect } from './auth-utils';

test("List Stuff page shows John's items", async ({ getUserPage }) => {
  const page = await getUserPage('john@foo.com', 'changeme');
  await page.goto('http://localhost:3000/list');

  // navigation links + logged in user
  const navToggle = page.getByRole('button', { name: /toggle navigation/i });
  if (await navToggle.isVisible()) {
    await navToggle.click();
  }
  await expect(page.getByRole('link', { name: 'Next.js Application Template' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Add Stuff' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'List Stuff' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'john@foo.com' })).toBeVisible();

  // table should render with expected headers
  await expect(page.getByRole('heading', { name: 'Stuff' })).toBeVisible();
  const table = page.getByRole('table');
  await expect(table).toBeVisible();
  await expect(table.locator('thead th')).toHaveText(['Name', 'Quantity', 'Condition', 'Actions']);

  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(2);

  // john@foo.com should see Basket and Bicycle entries seeded in the DB
  const basketRow = page.getByRole('row', { name: /Basket/ });
  await expect(basketRow).toContainText(['Basket', '3', 'excellent']);
  await expect(basketRow.getByRole('link', { name: 'Edit' })).toBeVisible();

  const bicycleRow = page.getByRole('row', { name: /Bicycle/ });
  await expect(bicycleRow).toContainText(['Bicycle', '2', 'poor']);
  await expect(bicycleRow.getByRole('link', { name: 'Edit' })).toBeVisible();
});
