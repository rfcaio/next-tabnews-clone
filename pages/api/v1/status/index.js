import database from 'infra/database'

const status = async (_, res) => {
  const updatedAt = new Date().toISOString()

  const databaseActiveConnectionsQueryResult = await database.query({
    text: 'SELECT count(*)::int AS active_connections FROM pg_stat_activity WHERE datname = $1;',
    values: [process.env.POSTGRES_DB]
  })
  const [{ active_connections }] = databaseActiveConnectionsQueryResult.rows

  const databaseMaxConnectionsQueryResult = await database.query(
    "SELECT current_setting('max_connections')::int AS max_connections;"
  )
  const [{ max_connections }] = databaseMaxConnectionsQueryResult.rows

  const databaseVersionQueryResult = await database.query(
    "SELECT current_setting('server_version') AS version;"
  )
  const [{ version }] = databaseVersionQueryResult.rows

  return res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        active_connections,
        max_connections,
        version
      }
    }
  })
}

export default status
