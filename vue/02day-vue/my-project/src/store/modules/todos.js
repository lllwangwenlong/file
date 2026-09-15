import { fetchTodos, createTodo } from '@/api/todos'

const state = {
  todos: []
}

const mutations = {
  SET_TODOS(state, todos) {
    state.todos = todos
  },
  ADD_TODO(state, todo) {
    state.todos.push(todo)
  }
}

const actions = {
  async fetchTodos({ commit }) {
    const todos = await fetchTodos()
    commit('SET_TODOS', todos)
  },
  async createTodo({ commit }, { name, description }) {
    const todo = await createTodo({ name, description })
    commit('ADD_TODO', todo)
    return todo
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}