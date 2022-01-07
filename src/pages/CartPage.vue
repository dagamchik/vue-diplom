<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Корзина
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{productsCart.length}} товара/ов
        </span>
      </div>
    </div>
    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in productsCart" :key="item.id" :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{totalPrice | numberFormat}} ₽</span>
          </p>
          <router-link :to="{name: 'order'}">
            <button class="cart__button button button--primery" type="submit">
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import CartItem from '@/components/CartItem.vue';
import numberFormat from '@/helpers/numberFormat';
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  components: {
    CartItem,
  },
  filters: {
    numberFormat
  },
  data() {
    return {
      // productsCart: [],
    }
  },
  computed: {
    productsCart() {
      return this.$store.state.cartProductsData;
    },
    ...mapGetters({totalPrice: 'cartTotalPrice'})
  },
  methods: {
  },
  // created() {
  //   this.loadCart()
  // },
}
</script>
