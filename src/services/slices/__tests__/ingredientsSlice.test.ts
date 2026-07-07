import { TIngredient } from '@utils-types';
import reducer, { fetchIngredients, initialState } from '../ingredientsSlice';

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
  const state = { ...initialState };

  const nextState = reducer(state, fetchIngredients.pending(''));
  expect(nextState).toEqual({ ...state, isLoading: true, error: null });
});

test('fulfilled: должен загрузить ингредиенты, установить isLoading в false и сбросить error', () => {
  const state = { ...initialState, isLoading: true };

  const nextState = reducer(
    state,
    fetchIngredients.fulfilled(mockIngredients, '')
  );

  expect(nextState).toEqual({
    ...state,
    isLoading: false,
    ingredients: mockIngredients
  });
});

test('rejected: должен установить isLoading в false и установить сообщение об ошибке', () => {
  const errorMessage = 'Ошибка загрузки';

  const state = { ...initialState, isLoading: true };
  const nextState = reducer(
    state,
    fetchIngredients.rejected(new Error(errorMessage), '')
  );
  expect(nextState).toEqual({
    ...state,
    isLoading: false,
    error: errorMessage
  });
});

test('должен вернуть initialState при неизвестном экшене', () => {
  const state = reducer(undefined, { type: 'UNKNOWN' });
  expect(state).toEqual(initialState);
});
