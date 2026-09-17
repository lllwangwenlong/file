import { fetchTodos, createTodo } from '../todos'

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { data: [{ id: 1, name: 'a', description: 'b', createdAt: '2026-09-17T00:00:00.000Z' }] } })),
  post: jest.fn(() => Promise.resolve({ data: { data: { id: 2, name: 'x', description: 'y', createdAt: '2026-09-17T00:00:00.000Z' } } }))
}))

describe('api/todos', () => {
  it('fetchTodos returns the data array', async () => {
    const result = await fetchTodos()
    expect(result).toEqual([{ id: 1, name: 'a', description: 'b', createdAt: '2026-09-17T00:00:00.000Z' }])
  })

  it('createTodo posts name and description and returns the created todo', async () => {
    const result = await createTodo({ name: 'x', description: 'y' })
    expect(result).toEqual({ id: 2, name: 'x', description: 'y', createdAt: '2026-09-17T00:00:00.000Z' })
  })
})
