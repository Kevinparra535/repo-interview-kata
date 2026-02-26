import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { NativeModules } from 'react-native';

import { config } from '@/config/config';
import { TaskWatermelonModel } from '@/data/database/TaskWatermelonModel';
import { taskSchema } from '@/data/database/schema';
import Logger from '@/utils/Logger';

const logger = new Logger('database');

const watermelonBridge = NativeModules.WMDatabaseBridge as
  | {
      initializeJSI?: () => void;
    }
  | undefined;

const adapter = watermelonBridge
  ? new SQLiteAdapter({
      dbName: config.DB_NAME,
      schema: taskSchema,
      jsi: true,
      onSetUpError: (error) => {
        logger.error(`WatermelonDB setup error: ${String(error)}`);
      },
    })
  : new LokiJSAdapter({
      dbName: `${config.DB_NAME}_fallback`,
      schema: taskSchema,
      useWebWorker: false,
      useIncrementalIndexedDB: true,
      onSetUpError: (error) => {
        logger.error(`WatermelonDB fallback setup error: ${String(error)}`);
      },
    });

export const database = new Database({
  adapter,
  modelClasses: [TaskWatermelonModel],
});
