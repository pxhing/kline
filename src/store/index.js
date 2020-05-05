import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		yPrice: '', 
	},
	actions: {
		priceAction({
			commit
		}, date) {
			commit('upPrice', date)
		}
	},
	mutations: {
		upPrice(state, date) {
			state.yPrice = date;
		},
	},
})