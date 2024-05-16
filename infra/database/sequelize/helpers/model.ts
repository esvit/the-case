import { Model, Attributes, FindOptions } from '@sequelize/core';

export async function *getModelsPager<T extends Model>(model: any, params: Omit<FindOptions<Attributes<T>>, 'group'> = {}, limit = 50):AsyncGenerator<T, void> {
  const { count, rows } = await model.findAndCountAll({ ...params, limit });
  for (const item of rows) {
    yield item as T;
  }
  const totalPages = Math.ceil(count / limit);
  for (let page = 2; page <= totalPages; page++) {
    const offset = (page - 1) * limit;
    const models = await model.findAll({ ...params, limit, offset });
    for (const item of models) {
      yield item as T;
    }
  }
}
