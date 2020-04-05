<template>
  <div>
    Response: {{ res }}
  </div>
</template>

<script>
export default {
  async asyncData ({ $doclify }) {
    const res = await $doclify.documents()
      .collection('pages')
      .first()

    return {
      res
    }
  }
}
</script>
