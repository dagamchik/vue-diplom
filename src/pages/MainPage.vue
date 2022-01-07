<template>
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{countProducts}} товаров
        </span>
      </div>
    </div>


    <div class="content__catalog">
      <ProductFilter
      :price-from.sync="filterPriceFrom"
      :price-to.sync="filterPriceTo"
      :category-id.sync="filterCategoryId"
      :color-id.sync="filterColor"
      :materials-id.sync="filterMaterials"
      :seasons-id.sync="filterSeasons"
      />

      <section class="catalog">
        <ProductList :products="products"/>

        <BasePagination v-model="page" :count="countProducts" :per-page="productsPerPage"/>
      </section>
    </div>

  </main>
</template>

<script>
import BasePagination from "@/components/BasePagination.vue";
import ProductFilter from "@/components/ProductFilter.vue";
import ProductList from '@/components/ProductList.vue';
import axios from 'axios';
import { API_BASE_URL } from '../config.js';

export default {
  data() {
    return {
      page: 1,
      productsPerPage: 12,

      filterPriceFrom: 0,
      filterPriceTo: 40000,
      filterCategoryId: 0,
      filterColor: [],
      filterMaterials: [],
      filterSeasons: [],

      productsData: null,
    }
  },
  components: {
    ProductList, ProductFilter, BasePagination
  },
  computed: {
    products() {
      return this.productsData ? this.productsData.items.map(product => {
        return {
          ...product,
        }
      }) : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    }
  },
  methods: {
    loadProducts() {
      axios.get(`${API_BASE_URL}/api/products`, {
        params: {
          page: this.page,
          limit: this.productsPerPage,
          minPrice: this.filterPriceFrom,
          maxPrice: this.filterPriceTo,
          categoryId: this.filterCategoryId,
          colorIds: this.filterColor,
          materialIds: this.filterMaterials,
          seasonIds: this.filterSeasons,
        }
      })
        .then((res) => {
          this.productsData = res.data;
        })
    }
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterColor() {
      this.loadProducts();
    },
    filterMaterials() {
      this.loadProducts();
    },
    filterSeasons() {
      this.loadProducts();
    }
  },
  created() {
    this.loadProducts();
  },
}
</script>
