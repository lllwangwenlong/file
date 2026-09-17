import { shallowMount } from '@vue/test-utils'
import TodoList from '../TodoList.vue'

describe('TodoList.vue', () => {
  it('renders one item per todo keyed by id', () => {
    const todos = [
      { id: 1, name: '吃饭', description: '', createdAt: '2026-09-17T10:00:00.000Z' },
      { id: 2, name: '睡觉', description: '早点睡', createdAt: '2026-09-17T23:00:00.000Z' }
    ]
    const wrapper = shallowMount(TodoList, { propsData: { todos } })
    expect(wrapper.findAll('.todo-item')).toHaveLength(2)
  })

  it('shows empty state when todos is empty', () => {
    const wrapper = shallowMount(TodoList, { propsData: { todos: [] } })
    expect(wrapper.find('.empty').exists()).toBe(true)
  })

  it('hides description when not provided', () => {
    const todos = [{ id: 1, name: '吃饭', description: '', createdAt: '2026-09-17T10:00:00.000Z' }]
    const wrapper = shallowMount(TodoList, { propsData: { todos } })
    expect(wrapper.find('.todo-desc').exists()).toBe(false)
  })

  it('formatTime returns YYYY-MM-DD HH:mm', () => {
    const wrapper = shallowMount(TodoList, { propsData: { todos: [] } })
    const result = wrapper.vm.formatTime('2026-09-17T10:05:00.000Z')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  })
})
