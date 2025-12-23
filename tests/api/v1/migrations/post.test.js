import database from 'infra/database.js'

const cleanDatabase = async () => {
  await database.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
}

beforeAll(cleanDatabase)

test('given no migrations are applied when POST to api/v1/migrations then returns 201', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST'
  })

  expect(response.status).toBe(201)

  let body = await response.json()

  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBeGreaterThan(0)
})

test('given all migrations are applied when POST to api/v1/migrations then returns 200', async () => {
  await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST'
  })

  const response = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST'
  })

  expect(response.status).toBe(200)

  const body = await response.json()

  expect(Array.isArray(body)).toBe(true)
  expect(body.length).toBe(0)
})
