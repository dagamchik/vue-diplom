<template>
<div>
  <router-link class="header__cart" :to="{name: 'cart'}" aria-label="Корзина с товарами">
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">{{totalCartProducts}}</span>
  </router-link>
</div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState({
      totalCartProducts: (state) => state.cartProductsData.length,
    })
  }
}
</script>
