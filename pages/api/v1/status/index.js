import database from 'infra/database'

const status = async (_, res) => {
  await database.query('SELECT 1 + 1;')

  return res.status(200).json({ message: 'Welcome to TabNews!' })
}

export default status
