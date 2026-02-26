import { Collection, Database, Model, Q, Query } from '@nozbe/watermelondb';
import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';

type PrimitiveWhereValue = string | number | boolean | null;

@injectable()
export class WatermelonManager {
  constructor(@inject(TYPES.WatermelonDatabase) private readonly db: Database) {}

  getCollection<TRecord extends Model>(tableName: string): Collection<TRecord> {
    return this.db.collections.get<TRecord>(tableName);
  }

  getQuery<TRecord extends Model>(tableName: string): Query<TRecord> {
    return this.getCollection<TRecord>(tableName).query();
  }

  async getAll<TRecord extends Model>(tableName: string): Promise<TRecord[]> {
    return this.getQuery<TRecord>(tableName).fetch();
  }

  async findWhere<TRecord extends Model>(tableName: string, columnName: string, value: PrimitiveWhereValue): Promise<TRecord[]> {
    return this.getCollection<TRecord>(tableName).query(Q.where(columnName, value)).fetch();
  }

  async write<TResponse>(operation: () => Promise<TResponse> | TResponse): Promise<TResponse> {
    return this.db.write(async () => operation());
  }

  async create<TRecord extends Model>(tableName: string, updater: (record: TRecord) => void): Promise<TRecord> {
    const collection = this.getCollection<TRecord>(tableName);

    return this.write(() => collection.create(updater));
  }

  async update<TRecord extends Model>(record: TRecord, updater: (record: TRecord) => void): Promise<TRecord> {
    return this.write(() => record.update(updater));
  }

  async unsafeResetDatabase(): Promise<void> {
    await this.db.write(async () => {
      await this.db.unsafeResetDatabase();
    });
  }
}
