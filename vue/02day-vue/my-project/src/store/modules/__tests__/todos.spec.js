import todos from '../todos'

describe('store/modules/todos', () => {
  it('is namespaced', () => {
    expect(todos.namespaced).toBe(true)
  })

  it('SET_TODOS replaces state.todos', () => {
    const state = { todos: [] }
    todos.mutations.SET_TODOS(state, [{ id: 1, name: 'a', description: '', createdAt: 't' }])
    expect(state.todos).toEqual([{ id: 1, name: 'a', description: '', createdAt: 't' }])
  })

  it('ADD_TODO appends to state.todos', () => {
    const state = { todos: [{ id: 1, name: 'a', description: '', createdAt: 't' }] }
    todos.mutations.ADD_TODO(state, { id: 2, name: 'b', description: '', createdAt: 't2' })
    expect(state.todos).toHaveLength(2)
    expect(state.todos[1]).toEqual({ id: 2, name: 'b', description: '', createdAt: 't2' })
  })
})
