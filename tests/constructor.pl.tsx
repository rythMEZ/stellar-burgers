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
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await page.getByTestId('modal-close').click();
    await expect(modal).not.toBeVisible();
  });
  test('Закрытие модального окна по оверлею', async ({ page }) => {
    await page.getByTestId(`ingredient-${bunId}`).getByRole('link').click();
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await page.getByTestId('modal-overlay').click({
      position: { x: 5, y: 5 }
    });
    await expect(modal).not.toBeVisible();
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

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.routeFromHAR('tests/hars/orders.har', {
      url: '**/orders',
      update: false
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false
    });

    await page.goto('/');

    await expect(page.getByTestId(`ingredient-${bunId}`)).toBeVisible();
  });

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

    //  Оформляем заказ
    await page.getByTestId('order-button').click();

    // Открытие модального окна
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('107844');

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
