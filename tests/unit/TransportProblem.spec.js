import { shallowMount } from '@vue/test-utils'
import TransportProblem from "@/views/TransportProblem";
import GLPK from 'glpk.js'

describe('TransportProblem.vue', () => {
  it('calculate not closed matrix correct', async () => {
    const matrix = [[{"name":"","count":0},{"name":"B1","count":220},{"name":"B2","count":150},{"name":"B3","count":250},{"name":"B4","count":180}],[{"name":"A1","count":300},{"price":4},{"price":5},{"price":3},{"price":6}],[{"name":"A2","count":250},{"price":7},{"price":2},{"price":1},{"price":5}],[{"name":"A3","count":200},{"price":6},{"price":1},{"price":4},{"price":2}]]
    const output = [{"from":"A1","to":"B1","count":220},{"from":"A1","to":"B3","count":80},{"from":"A2","to":"B2","count":80},{"from":"A2","to":"B3","count":170},{"from":"A3","to":"B2","count":70},{"from":"A3","to":"B4","count":130},{"from":"Fictitious Supplier","to":"B4","count":50}]
    const wrapper = shallowMount(TransportProblem, {
      mocks: {
        GLPK
      }
    })
    await wrapper.setData({ matrix })
    expect(wrapper.vm.matrix).toBe(matrix)

    const button = wrapper.find('.btn-white:last-child')
    expect(button.isVisible()).toBe(true)
    expect(button.text()).toBe('solve')
    await button.trigger('click')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.output).toEqual(output)
  })

})
