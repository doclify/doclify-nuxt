<template>
  <div>
    Response: {{ res }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      res: ''
    }
  },

  async mounted () {
    // Request with full url becasue we are in JSDom env
    try {
      this.res = await this.$doclify.documents()
        .collection('pages')
        .first()
    } catch (err) {

    }
  }
}
</script>
