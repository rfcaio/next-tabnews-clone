import { join } from 'node:path'

import migrationRunner from 'node-pg-migrate'

import database from 'infra/database'

const migrations = async (req, res) => {
  const ALLOWED_METHODS = ['GET', 'POST']

  if (!ALLOWED_METHODS.includes(req.method)) {
    return res
      .status(405)
      .json({ message: `Method ${req.method} is not allowed.` })
  }

  let dbClient

  try {
    dbClient = await database.getNewClient()

    const migrationRunnerDefaultConfig = {
      dbClient,
      dir: join('infra', 'migrations'),
      direction: 'up',
      dryRun: true,
      migrationsTable: 'pgmigrations',
      verbose: true
    }

    if (req.method === 'POST') {
      const appliedMigrations = await migrationRunner({
        ...migrationRunnerDefaultConfig,
        dryRun: false
      })

      return res
        .status(appliedMigrations.length > 0 ? 201 : 200)
        .json(appliedMigrations)
    }

    // it handles `GET` method as default

    const pendingMigrations = await migrationRunner(
      migrationRunnerDefaultConfig
    )

    return res.status(200).json(pendingMigrations)
  } catch (error) {
    console.log(error)
    throw error
  } finally {
    await dbClient.end()
  }
}

export default migrations
