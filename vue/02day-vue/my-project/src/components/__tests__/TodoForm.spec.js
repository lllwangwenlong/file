import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import TodoForm from '../TodoForm.vue'

function nextTick () {
  return new Promise(resolve => Vue.nextTick(resolve))
}

describe('TodoForm.vue', () => {
  it('emits submit with trimmed name and description on button click', async () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '  写周报  ', description: '  周五前提交  ' })
    await nextTick()
    wrapper.find('button').trigger('click')
    await nextTick()
    expect(wrapper.emitted().submit).toBeTruthy()
    expect(wrapper.emitted().submit[0][0]).toEqual({ name: '写周报', description: '周五前提交' })
  })

  it('clears name and description after submit', async () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '写周报', description: '周五前提交' })
    await nextTick()
    wrapper.find('button').trigger('click')
    await nextTick()
    expect(wrapper.vm.name).toBe('')
    expect(wrapper.vm.description).toBe('')
  })

  it('does not emit submit and shows error when name is empty', async () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '   ', description: '' })
    await nextTick()
    wrapper.vm.handleSubmit()
    await nextTick()
    expect(wrapper.emitted().submit).toBeFalsy()
    expect(wrapper.vm.errorMsg).toBe('事项名称不能为空')
  })

  it('disables the button when name is empty', () => {
    const wrapper = shallowMount(TodoForm)
    wrapper.setData({ name: '' })
    expect(wrapper.find('button').attributes().disabled).toBeDefined()
  })
})
