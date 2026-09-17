import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TodoView from '../TodoView.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

function createStore(todos) {
  return new Vuex.Store({
    modules: {
      todos: {
        namespaced: true,
        state: { todos },
        actions: {
          fetchTodos: jest.fn(() => Promise.resolve()),
          createTodo: jest.fn(() => Promise.resolve())
        }
      }
    }
  })
}

describe('TodoView.vue', () => {
  it('renders TodoForm and TodoList', () => {
    const store = createStore([])
    const wrapper = shallowMount(TodoView, { store, localVue })
    expect(wrapper.find({ name: 'TodoForm' }).exists()).toBe(true)
    expect(wrapper.find({ name: 'TodoList' }).exists()).toBe(true)
  })

  it('dispatches createTodo on form submit', async () => {
    const store = createStore([])
    jest.spyOn(store, 'dispatch')
    const wrapper = shallowMount(TodoView, { store, localVue })
    await wrapper.vm.handleCreate({ name: '写周报', description: '周五前' })
    expect(store.dispatch).toHaveBeenCalledWith('todos/createTodo', { name: '写周报', description: '周五前' })
  })

  it('calls fetchTodos on mounted', () => {
    const store = createStore([])
    jest.spyOn(store, 'dispatch')
    shallowMount(TodoView, { store, localVue })
    expect(store.dispatch).toHaveBeenCalledWith('todos/fetchTodos', undefined)
  })
})
