<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <!-- <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="#">
            {{product.category.title}}
          </a>
        </li> -->
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{product.title}}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img :src="currentImage" :alt="currentImage">
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="image in product.colors" :key="image.name">
            <a href="#" @click.prevent="selectImage(image)">
              <img
                class="pics__gallery"
                :src="image.gallery ? image.gallery[0].file.url : noPhoto"
                :alt="image.gallery ? image.gallery[0].file.url : noPhoto"
                :class="{
                  'pics__link pics__link--current':
                    currentImage === (image.gallery ? image.gallery[0].file.url : noPhoto),
                }"
              />
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{product.id}}</span>
        <h2 class="item__title">
          {{product.title}}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click.prevent="deleteCount">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" value="1" name="count" v-model.number="quantity">

                <button type="button" aria-label="Добавить один товар" @click.prevent="addCount">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price">
                {{product.price | numberFormat}} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ProductRadioButtons :colors="product.colors" :currentColor.sync="currentColor">
                </ProductRadioButtons>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="category" v-model="currentSizeId">
                    <option value="0">Выберите размер</option>
                    <option :value="size.id" v-for="size in allSizes" :key="size.id">{{size.title}}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit">
              В корзину
            </button>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link tabs__link--current">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content">
          <h3>Состав:</h3>

          <p>
            60% хлопок<br>
            30% полиэстер<br>
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>
      </div>
    </section>
  </main>
</template>

<script>
import ProductRadioButtons from '@/components/ProductRadioButtons.vue';
import noPhoto from '@/assets/noPhoto.jpg';
import numberFormat from '@/helpers/numberFormat';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      currentSizeId: 0,
      currentColor: null,
      allSizes: [],
      product: [],
      currentImage: null,
      noPhoto,
      quantity: 1,
    }
  },
  components: {
    ProductRadioButtons,
  },
  filters: {
    numberFormat,
  },
  computed: {

  },
  methods: {
    ...mapActions(['addProductToCart']),
    loadProduct() {
      axios.get(API_BASE_URL + `/api/products/${this.$route.params.id}`)
        .then((res) => {
          this.product = res.data;
          this.currentImage = res.data.colors[0].gallery[0].file.url;
          this.currentColor = this.product.colors[0].color;
          console.log(this.product)
        })
    },
    loadSizes() {
      axios.get(API_BASE_URL + `/api/products/${this.$route.params.id}`)
        .then((res) => {
          this.allSizes = res.data.sizes;
        })
    },
    selectImage(value) {
      this.$emit('update:currentImage', value);
    },
    addToCart() {
      if (this.currentSizeId > 0) {
        this.addProductToCart({
          productId: this.product.id,
          colorId: this.currentColor,
          sizeId: this.currentSizeId,
          quantity: this.quantity,
        })
      }
    },
    addCount() {
      this.quantity++
    },
    deleteCount() {
      if (this.quantity > 0) {
        this.quantity--
      }
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
        this.loadSizes();
      }
    },
    product: {
      handler() {
        this.currentColor = this.product.colors[0].color;
        this.currentImage = this.product.colors[0].gallery
          ? this.product.colors[0].gallery[0].file.url
          : noPhoto;
      },
    },
    currentColor: {
      handler(value) {
        if (value.color) this.currentColor = value.color;
        if (typeof value.gallery !== 'undefined') {
          if (value.gallery) {
            this.currentImage = value.gallery[0].file.url;
          } else {
            this.currentImage = noPhoto;
          }
        }
      },
    },
    currentImage: {
      handler(value) {
        if (typeof value.gallery !== 'undefined') {
          if (value.gallery) {
            this.currentImage = value.gallery[0].file.url;
          } else {
            this.currentImage = noPhoto;
          }
        }
        if (value.color) this.currentColor = value.color;
      },
    },
  },
  created() {
    this.loadProduct();
    this.loadSizes();
  }
}
</script>
