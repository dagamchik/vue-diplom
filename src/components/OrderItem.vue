<template>
  <li class="cart__order">
    <h3>{{product.product.title}} ({{product.quantity}} шт.)</h3>
    <b>{{product.product.price * product.quantity | numberFormat}} ₽</b>
    <span>Артикул: {{product.product.id}}</span>
  </li>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
export default {
  props: ['product'],
  filters: {
    numberFormat
  }
}
</script>
