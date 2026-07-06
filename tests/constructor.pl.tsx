import { test, expect } from '@playwright/test';

const bunId = '643d69a5c3f7b9001cfa093c';
const bunName = 'Краторная булка N-200i';

const mainId = '643d69a5c3f7b9001cfa0941';
const mainName = 'Биокотлета из марсианской Магнолии';

test.describe('Интеграционные тесты для страницы конструктора бургера', () => {
  test.beforeEach(
    'получаем моковые данные для ингредиентов из HAR-файла',
    async ({ page }) => {
      await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/ingredients'
      });

      await page.goto('/');
      await expect(page.getByTestId(`ingredient-${bunId}`)).toBeVisible();
    }
  );

  test('Добавление булки в конструктор', async ({ page }) => {
    await page
      .getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();
    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${bunName} (низ)`)).toBeVisible();
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    await page
      .getByTestId(`ingredient-${mainId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText(`${mainName}`)).toBeVisible();
  });
});

test.describe('Тесты работы модальных окон', () => {
  test.beforeEach(
    'получаем моковые данные для ингредиентов из HAR-файла',
    async ({ page }) => {
      await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/ingredients'
      });

      await page.goto('/');
      await expect(page.getByTestId(`ingredient-${bunId}`)).toBeVisible();
    }
  );

  test('Открытие модального окна ингредиента', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByText(bunName)).toBeVisible();
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
  test('Закрытие модального окна по оверлею', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});

test.describe('Тестирование создания заказа', () => {
  test.beforeEach('получаем моковые данные', async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'test-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      localStorage.setItem('accessToken', 'test-token');
    });

    await context.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: '123',
            email: 'test@test.com',
            name: 'Test User'
          }
        })
      });
    });

    await context.route('**/orders', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          order: {
            number: 12345,
            name: 'test order',
            ingredients: []
          }
        })
      });
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients'
    });

    await page.goto('/');
    await expect(page.getByTestId(`ingredient-${bunId}`)).toBeVisible();
  });

  test.afterEach(
    'Очистка localStorage и sessionStorage',
    async ({ context, page }) => {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      await context.clearCookies();
    }
  );

  test('создание заказа', async ({ page }) => {
    // Добавляем ингредиенты
    await page
      .getByTestId(`ingredient-${bunId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .getByTestId(`ingredient-${mainId}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Оформляем заказ
    await page.getByTestId('order-button').click();

    // Открытие модального окна
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('12345');

    // Очистка конструктора
    const constructor = page.getByTestId('burger-constructor');
    await expect(constructor.getByText(`${bunName} (верх)`)).toHaveCount(0);
    await expect(constructor.getByText(`${bunName} (низ)`)).toHaveCount(0);
    await expect(constructor.getByText(mainName)).toHaveCount(0);

    // Закрытие модального окна
    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
});
