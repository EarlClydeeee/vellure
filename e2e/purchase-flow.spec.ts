import { test, expect } from '@playwright/test';
import { TEST_CUSTOMER } from './fixtures';

async function loginAsCustomer(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('#email').fill(TEST_CUSTOMER.email);
  await page.locator('#password').fill(TEST_CUSTOMER.password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
}

async function addInStockProductFromListing(page: import('@playwright/test').Page) {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: 'Shop', level: 1 })).toBeVisible();

  const productLinks = page.locator('article h3');
  const count = await productLinks.count();

  for (let i = 0; i < count; i++) {
    const link = productLinks.nth(i);
    const productName = (await link.textContent())?.trim() ?? '';
    await link.click();
    await expect(page).toHaveURL(/\/products\/.+/);

    const addButton = page
      .getByRole('button', { name: 'Add to Cart' })
      .filter({ has: page.locator('svg') });

    if (await addButton.isEnabled()) {
      await addButton.click();
      await page.waitForTimeout(500);
      return productName;
    }

    await page.goto('/products');
  }

  throw new Error('No in-stock product found on /products');
}

test.describe('Customer purchase flow', () => {
  test('add to cart, checkout, and place order (COD)', async ({ page }) => {
    test.setTimeout(90_000);

    await loginAsCustomer(page);
    const productName = await addInStockProductFromListing(page);

    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Shopping Cart', level: 1 })).toBeVisible();
    await expect(page.getByText(productName)).toBeVisible();

    await page.getByRole('link', { name: 'Proceed to Checkout' }).click();
    await expect(page.getByRole('heading', { name: 'Checkout', level: 1 })).toBeVisible();

    await page.locator('#fullName').fill('Test Customer');
    await page.locator('#contactNumber').fill('09918054458');
    await page.locator('#deliveryAddress').fill('123 Test Street, Manila, NCR');

    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page).toHaveURL(/\/account\/orders\//, { timeout: 30_000 });
    await expect(page.getByText(/Order #\d+/)).toBeVisible();
  });

  test('guest checkout redirects to login', async ({ page }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });
});
