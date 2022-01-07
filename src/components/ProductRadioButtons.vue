<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="color in colors" :key="color.id">
      <label class="colors__label" v-if="color.color.code !== null">
        <input class="colors__radio sr-only" type="radio" name="color-1" :value="color" v-model="computedColor">
        <span class="colors__value" :class="{ colors__select: computedColor === color.color}" :style="{ 'background-color': color.color.code }" v-if="color.color !== null">
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['colors', 'currentColor'],
  computed: {
    computedColor: {
      get() {
        return this.currentColor;
      },
      set(color) {
        this.$emit('update:currentColor', color);
      },
    },
  },
}
</script>
