import { pad } from './math';

test('Test pad', async () => {
  expect(pad(12, 5)).toEqual('00012');
  expect(pad(112, 15)).toEqual('000000000000112');
  expect(pad(112, 2)).toEqual('12');
});
