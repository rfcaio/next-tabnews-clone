import { join } from 'node:path'

import migrationRunner from 'node-pg-migrate'

import database from 'infra/database'

const migrations = async (req, res) => {
  const dbClient = await database.getNewClient()

  const migrationRunnerDefaultConfig = {
    dbClient,
    dir: join('infra', 'migrations'),
    direction: 'up',
    dryRun: true,
    migrationsTable: 'pgmigrations',
    verbose: true
  }

  if (req.method === 'GET') {
    const pendingMigrations = await migrationRunner(
      migrationRunnerDefaultConfig
    )
    await dbClient.end()

    return res.status(200).json(pendingMigrations)
  }

  if (req.method === 'POST') {
    const appliedMigrations = await migrationRunner({
      ...migrationRunnerDefaultConfig,
      dryRun: false
    })
    await dbClient.end()

    return res
      .status(appliedMigrations.length > 0 ? 201 : 200)
      .json(appliedMigrations)
  }
  await dbClient.end()

  return res.status(405).end()
}

export default migrations
