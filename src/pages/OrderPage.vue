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

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <div class="cart__data">
            <label class="form__label">
              <input class="form__input" type="text" name="name" placeholder="Введите ваше полное имя" v-model="name">
              <span class="form__value">ФИО</span>
              <span class="form__error" v-show="nameValid === true">Введите полное имя</span>
            </label>

            <label class="form__label">
              <input class="form__input" type="text" name="address" placeholder="Введите ваш адрес" v-model="address">
              <span class="form__value">Адрес доставки</span>
              <span class="form__error"  v-show="addressValid === true">Введите полный адрес</span>
            </label>

            <label class="form__label">
              <input class="form__input" type="tel" name="phone" v-model="phone" minlength="12" maxlength="12">
              <!-- <the-mask  class="form__input" type="tel" name="phone" v-model="phone" :mask="['+7##########', '+7##########']" /> -->
              <span class="form__value">Телефон</span>
              <span class="form__error" v-show="phoneValid === true">Неверный формат телефона</span>
            </label>

            <label class="form__label">
              <input class="form__input" type="email" name="email" placeholder="Введи ваш Email" v-model="email">
              <span class="form__value">Email</span>
              <span class="form__error" v-show="emailValid === true">Неверный формат email</span>
            </label>

            <label class="form__label">
              <textarea class="form__input form__input--area" name="comments" placeholder="Ваши пожелания" v-model="comment"></textarea>
              <span class="form__value">Комментарий к заказу</span>
            </label>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in deliveryTypes" :key="item.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="item.id" checked="" v-model="deliveryTypeId" @change="loadPaymentId()">
                  <span class="options__value">
                    {{item.title}} <b v-if="item.price === '0'">(бесплатно)</b><b v-else>({{item.price}} руб)</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="item in paymentTypes" :key="item.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="item.id" checked="" v-model="paymentTypeId">
                  <span class="options__value">
                    {{item.title}}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart__block">
          <ul class="cart__orders">
            <OrderItem v-for="product in products" :key="product.id" :product="product"/>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b v-if="deliveryTypeId === 1">бесплатно</b><b v-if="deliveryTypeId === 2">Курьером (1200 руб)</b></p>
            <p>Итого: <b>{{products.length}}</b> товара/ов на сумму <b>{{totalPrice | numberFormat}} ₽</b></p>
          </div>
          <button class="cart__button button button--primery" type="submit" @click.prevent="checkForm">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-show="nameValid === true || phoneValid === true || emailValid === true || addressValid === true">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import OrderItem from '@/components/OrderItem.vue'
import numberFormat from "@/helpers/numberFormat";
import { mapState, mapGetters, mapActions } from 'vuex';
import { API_BASE_URL } from '../config';
import axios from "axios";

export default {
  data() {
    return {
      // products: [],
      name: '',
      address: '',
      phone: '+7',
      email: '',
      comment: '',
      deliveryTypes: [],
      deliveryTypeId: 1,
      paymentTypes: [],
      paymentTypeId: 1,
      errors: [],
      nameValid: false,
      addressValid: false,
      phoneValid: false,
      emailValid: false
    }
  },
  components: {
    OrderItem
  },
  filters: {
    numberFormat
  },
  computed: {
    ...mapGetters({totalPrice: 'cartTotalPrice'}),
    products() {
      return this.$store.state.cartProductsData;
    },
    // isEmailValid() {
    //   return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email);
    // },
    // isPhoneValid() {
    //   return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(this.phone);
    // }
  },
  methods: {
    loadDeliveryId() {
      axios.get(`${API_BASE_URL}/api/deliveries`)
        .then((response) => {
          this.deliveryTypes = response.data;
        })
    },
    loadPaymentId() {
      axios.get(`${API_BASE_URL}/api/payments`, {
        params: {
          deliveryTypeId: this.deliveryTypeId
        }
      })
        .then((response) => {
          this.paymentTypes = response.data;
          console.log(this.paymentTypes)
        })
    },
    ...mapActions(['createOrder']),
    checkForm() {
      if (this.nameValid === false && this.addressValid === false && this.phoneValid === false && this.emailValid === false) {
        this.createOrder({
          name: this.name,
          address: this.address,
          phone: this.phone,
          email: this.email,
          deliveryTypeId: this.deliveryTypeId,
          paymentTypeId: this.paymentTypeId,
          comment: this.comment,
        })
      }
      this.nameValid = false;
      this.addressValid = false;
      this.phoneValid = false;
      this.emailValid = false;
      if (this.name.length < 3) {
        this.nameValid = true;
      }

      if (this.address.length < 7) {
        this.addressValid = true;
      }

      if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(this.phone) || this.phone.length < 12) {
        this.phoneValid = true;
      }

      if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
        this.emailValid = true;
      }


    }
  },
  created() {
    this.loadDeliveryId();
    this.loadPaymentId();
  }
}
</script>
