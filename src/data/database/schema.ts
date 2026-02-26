import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const taskSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'remote_id', type: 'string', isIndexed: true },
        { name: 'todo', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'user_id', type: 'number' },
        { name: 'attachment_uri', type: 'string', isOptional: true },
      ],
    }),
  ],
});
