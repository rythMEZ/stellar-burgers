import { TIngredient } from '@utils-types';
import reducer, { fetchIngredients } from '../ingredientsSlice';

type TIngredientState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  }
];

test('pending: должен установить isLoading в true и сбросить error', () => {
  const state = reducer(undefined, fetchIngredients.pending(''));
  expect(state.isLoading).toBe(true);
  expect(state.error).toBeNull();
});

test('fulfilled: должен загрузить ингредиенты, установить isLoading в false и сбросить error', () => {
  const state = reducer(
    undefined,
    fetchIngredients.fulfilled(mockIngredients, '')
  );
  expect(state.isLoading).toBe(false);
  expect(state.error).toBeNull();
  expect(state.ingredients).toEqual(mockIngredients);
  expect(state.ingredients).toHaveLength(3);
});

test('rejected: должен установить isLoading в false и установить сообщение об ошибке', () => {
  const errorMessage = 'Ошибка загрузки';
  const state = reducer(
    undefined,
    fetchIngredients.rejected(new Error(errorMessage), '')
  );
  expect(state.isLoading).toBe(false);
  expect(state.error).toBe(errorMessage);
});

test('должен вернуть initialState при неизвестном экшене', () => {
  const state = reducer(undefined, { type: 'UNKNOWN' });
  expect(state).toEqual(initialState);
});
