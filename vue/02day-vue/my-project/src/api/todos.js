import axios from 'axios'

const BASE_URL = 'http://localhost:3000/todos'

export function fetchTodos() {
  return axios.get(BASE_URL).then(res => res.data.data)
}

export function createTodo({ name, description }) {
  return axios.post(BASE_URL, { name, description }).then(res => res.data.data)
}