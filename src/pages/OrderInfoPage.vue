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
          <a class="breadcrumbs__link" href="cart.html">
            Корзина
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{products.id}}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{products.name}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{products.address}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{products.phone}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{products.email}}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{products.paymentType}}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in products.basket.items" :key="item.id">
              <h3>{{item.product.title}}</h3>
              <b>{{item.product.price | numberFormat}} ₽</b>
              <span>Артикул: {{item.product.id}}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{products.deliveryType.title}}</b></p>
            <p>Итого: <b>{{products.basket.items.length}}</b> товара/ов на сумму <b>{{products.totalPrice | numberFormat}} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import { mapState, mapGetters, mapActions } from 'vuex';
import { API_BASE_URL } from '../config';
import axios from "axios";

export default {
  filter: {
    numberFormat,
  },
  computed: {
    products() {
      return this.$store.state.orderInfoData;
    },
  },
  methods: {
    ...mapActions(['loadOrderInfo']),
    // loadOrderInfo() {
    //   axios.get(`${API_BASE_URL}/api/orders/${this.$route.params.id}`)
    // }
  },
  created() {
    this.loadOrderInfo(this.$route.params.id);
  }
}
</script>
