import { TConstructorIngredient, TIngredient } from '@utils-types';
import reducer, {
  addIngredient,
  clearConstructor,
  initialState,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient,
  setBun,
  TConstructorState
} from '../constructorSlice';

const bun: TIngredient = {
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
};

const ingredient: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

const makeItem = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id
});

const createState = (
  ingredients: TConstructorIngredient[] = [],
  bunValue: TIngredient | null = null
): TConstructorState => ({
  ...initialState,
  bun: bunValue,
  ingredients
});

const setup = () => {
  const first = makeItem(ingredient, '1');
  const second = makeItem(sauce, '2');

  const state = createState([first, second], bun);

  return { first, second, state };
};

// Установка булок бургера
test('Установка булок бургера - setBun', () => {
  expect(reducer(initialState, setBun(bun))).toEqual({
    ...initialState,
    bun
  });
});

// Установка начинок бургера
test('Установка начинок бургера - addIngredient', () => {
  const item = makeItem(ingredient, '1');
  expect(reducer(initialState, addIngredient(item))).toEqual({
    ...initialState,
    ingredients: [item]
  });
});

// Тесты перемещения ингредиентов в конструкторе
describe('Тесты перемещения ингредиентов в конструкторе', () => {
  const { first, second, state } = setup();

  test('Тест перемещения ингредиента вверх - moveIngredientUp', () => {
    const result = reducer(state, moveIngredientUp('2'));
    expect(result).toEqual({
      ...initialState,
      bun,
      ingredients: [second, first]
    });
  });

  test('Игредиент остается на месте если он первый в списке', () => {
    const result = reducer(state, moveIngredientUp('1'));
    expect(result.ingredients).toEqual(state.ingredients);
  });

  test('Тест перемешщения ингредиента вниз - moveIngredientDown', () => {
    const result = reducer(state, moveIngredientDown('1'));
    expect(result).toEqual({
      ...initialState,
      bun,
      ingredients: [second, first]
    });
  });

  test('Игредиент остается на месте если он последний в списке', () => {
    const result = reducer(state, moveIngredientDown('2'));
    expect(result.ingredients).toEqual(state.ingredients);
  });
});

test('Удаление ингредиента - removeIngredient', () => {
  const { second, state } = setup();
  const result = reducer(state, removeIngredient('1'));
  expect(result.ingredients).toEqual([second]);
});

test('Очистка конструктора - clearConstructor', () => {
  const { state } = setup();
  const result = reducer(state, clearConstructor());
  expect(result).toEqual(initialState);
});

test('Экшен, несуществующий в приложении', () => {
  const result = reducer(undefined, { type: 'UNKNOWN' });

  expect(result).toEqual({ ...initialState });
});
