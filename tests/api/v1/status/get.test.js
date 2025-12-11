test('when GET to api/v1/status then returns 200', async () => {
  const response = await fetch('http://localhost:3000/api/v1/status')

  expect(response.status).toBe(200)

  const body = await response.json()

  expect(body.updated_at).toBe(new Date(body.updated_at).toISOString())
  expect(body.dependencies.database.active_connections).toBe(1)
  expect(body.dependencies.database.max_connections).toBe(100)
  expect(body.dependencies.database.version).toBe('16.0')
})
