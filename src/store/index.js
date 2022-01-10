import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userAccessKey: null,
    orderData: null,
    orderInfoData: null,
    cartProductsData: [],
    cartProducts: [],

  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },
    updateCartProductQuantity(state, { basketItemId, quantity }) {
      const item = state.cartProductsData.find((item) => item.id === basketItemId);
      console.log(basketItemId)
      if (item) {
        item.quantity = quantity;
      }
    },
    updateOrderData(state, orderData) {
      state.orderData = orderData;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateOrderInfoData(state, orderInfoData) {
      state.orderInfoData = [];
      state.orderInfoData = orderInfoData;
    }
  },
  getters: {
    cartDetailproducts(state) {
      return state.cartProductsData.map((item) => item);
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailproducts.reduce(
        (acc, item) => item.product.price * item.quantity + acc,
        0,
      );
    },
    cartTotalQuantity(state, getters) {
      return getters.cartDetailproducts.reduce((acc, item) => item.quantity + acc, 0);
    },
  },
  actions: {
    loadCart(context) {
      axios.get(API_BASE_URL + `/api/baskets`, {
        params: {
          userAccessKey: context.state.userAccessKey
        }
      })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey)
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          // context.commit('syncCartProducts', response.data.items);
        })
    },
    addProductToCart(context, {
      productId, colorId, sizeId, quantity,
    }) {
      return axios
        .post(`${API_BASE_URL}/api/baskets/products`,
        {
          productId,
          colorId: colorId.id,
          sizeId,
          quantity,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
    },
    updateCartProductQuantity(context, {basketItemId, quantity}) {
      context.commit('updateCartProductQuantity', {basketItemId, quantity})

      if (quantity < 1) {
        return 1;
      }

      return axios
        .put(`${API_BASE_URL}/api/baskets/products`, {
          basketItemId,
          quantity,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
      .then((response) => {

      })
    },
    deleteProductFromCart(context, {basketItemId}) {
      return axios
      .delete(`${API_BASE_URL}/api/baskets/products`, {
        data: {
          basketItemId,
        },
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
      .then((response) => {
        context.commit('updateCartProductsData', response.data.items);
      });
    },
    createOrder(context, {name, address, phone, email, deliveryTypeId, paymentTypeId, comment}) {
      return axios
        .post(`${API_BASE_URL}/api/orders`, {
          name,
          address,
          phone,
          email,
          deliveryTypeId,
          paymentTypeId,
          comment,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (response.data) {
            context.commit('updateOrderData', response.data);
          }
          context.commit('resetCart', response.data);
          router.push({name: 'order-info', params: {id: response.data.id}})
        })
    },
    loadOrderInfo(context, routeParams) {
      const paramsToNumber = Number(routeParams);
      return axios.get(API_BASE_URL + `/api/orders/${paramsToNumber}`, {
        params: {
          userAccessKey: context.state.userAccessKey,
          orderId: paramsToNumber,
        }
      })
      .then((response) => {
        console.log(response.data)
        context.commit('updateOrderInfoData', response.data)
      })
    }
  }
})
