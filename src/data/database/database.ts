import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { TaskWatermelonModel } from '@/data/database/TaskWatermelonModel';
import { taskSchema } from '@/data/database/schema';

const adapter = new SQLiteAdapter({
  dbName: 'offline_tasks_db',
  schema: taskSchema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [TaskWatermelonModel],
});
