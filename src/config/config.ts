export const config = {
  BASE_URL: 'https://dummyjson.com',
  TODOS_API: '/todos',

  taskSchema: {
    version: 1,
    tables: {
      name: 'tasks',
      columns: [
        { name: 'remote_id', type: 'string', isIndexed: true },
        { name: 'todo', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'user_id', type: 'number' },
        { name: 'attachment_uri', type: 'string', isOptional: true },
      ],
    },
  },

  DB_NAME: 'offline_tasks_db',
} as const;
