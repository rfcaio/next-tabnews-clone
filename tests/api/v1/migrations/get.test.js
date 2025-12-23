import database from 'infra/database.js'

const cleanDatabase = async () => {
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
}

beforeAll(cleanDatabase)

test('when GET to api/v1/migrations then returns 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations')
  await database.query('SELECT 1 + 1;')
  expect(response.status).toBe(200)

  const body = await response.json()

  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBeGreaterThan(0)
})
