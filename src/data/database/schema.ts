import { appSchema, tableSchema } from '@nozbe/watermelondb';
import { config } from '@/config/config';

export const taskSchema = appSchema({
  version: config.taskSchema.version,
  tables: [
    tableSchema({
      ...config.taskSchema.tables,
      columns: [...config.taskSchema.tables.columns],
    }),
  ],
});
