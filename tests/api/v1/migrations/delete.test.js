test('when DELETE to api/v1/migrations then returns 405', async () => {
  const response = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'DELETE'
  })

  expect(response.status).toBe(405)

  let body = await response.json()

  expect(body.message).toBe('Method DELETE is not allowed.')
})
