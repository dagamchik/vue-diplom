<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="item.color.gallery[0].file.url" width="120" height="120" srcset="img/product-square-4@2x.jpg 2x" alt="Название товара">
    </div>
    <h3 class="product__title">
      {{item.product.title}}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{'background-color': item.color.color.code}"></i>
        {{item.color.color.title}}
      </span>
      Размер:
      <span style="padding-left: 10px">
        {{ item.size.title }}
      </span>
    </p>
    <span class="product__code">
      Артикул: {{item.product.id}}
    </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click.prevent="deleteCount(item)">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" :value="item.quantity" name="count" @input="changeQuantity({$event, item})">

      <button type="button" aria-label="Добавить один товар" @click.prevent="addCount(item)">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{item.product.price * item.quantity | numberFormat}} ₽
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click.prevent="deleteProduct(item)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
export default {
  data() {
    return {

    }
  },
  props: {
    item: Object,
  },
  filters: {
    numberFormat
  },
  methods: {
    deleteCount(item) {
      if (item.quantity > 1) {
        item.quantity--
        this.$store.dispatch('updateCartProductQuantity', {
          basketItemId: item.id,
          quantity: item.quantity,
        })
      }
    },
    addCount(item) {
      item.quantity++
      this.$store.dispatch('updateCartProductQuantity', {
        basketItemId: item.id,
        quantity: item.quantity,
      })
    },
    deleteProduct(item) {
      this.$store.dispatch('deleteProductFromCart', {
        basketItemId: item.id
      })
    },
    changeQuantity({$event, item}) {
      let newQuantity = $event.target.value;
      console.log(item.id)
      this.$store.dispatch('updateCartProductQuantity', {
        basketItemId: item.id,
        quantity: Number(newQuantity),
      })
    }
  }
  // created() {
  //   console.log(this.$store.state.cartProductsData)
  // }
}
</script>
