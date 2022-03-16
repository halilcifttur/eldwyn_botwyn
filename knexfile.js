module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: "./src/Data/sqllite.db3"
    }
  },
  useNullAsDefault: true,
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }
};
