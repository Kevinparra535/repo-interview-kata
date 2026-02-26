import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { NativeModules } from 'react-native';

import { TaskWatermelonModel } from '@/data/database/TaskWatermelonModel';
import { taskSchema } from '@/data/database/schema';

const watermelonBridge = NativeModules.WMDatabaseBridge as
  | {
      initializeJSI?: () => void;
    }
  | undefined;

const adapter = watermelonBridge
  ? new SQLiteAdapter({
      dbName: 'offline_tasks_db',
      schema: taskSchema,
      jsi: true,
      onSetUpError: (error) => {
        console.error('WatermelonDB setup error', error);
      },
    })
  : new LokiJSAdapter({
      dbName: 'offline_tasks_db_fallback',
      schema: taskSchema,
      useWebWorker: false,
      useIncrementalIndexedDB: true,
      onSetUpError: (error) => {
        console.error('WatermelonDB fallback setup error', error);
      },
    });

export const database = new Database({
  adapter,
  modelClasses: [TaskWatermelonModel],
});
