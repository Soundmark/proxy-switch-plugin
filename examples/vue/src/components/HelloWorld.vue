<template>
  <div class="hello">
  </div>
</template>

<script>
import Select from '../../../../src/ProxySelect'
import '../../../../src/ProxySelect.css'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted: () => {
    const container = document.querySelector('.hello')
    container.appendChild(Select)
  }
}
</script>
