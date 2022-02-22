import Doclify from '@doclify/javascript'
import { useNuxtApp } from '#app'

export const useDoclify = (): Doclify => {
  const nuxtApp = useNuxtApp()
  const doclify: Doclify = nuxtApp.$doclify

  return doclify
}
