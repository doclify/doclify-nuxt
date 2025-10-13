import type Doclify from '@doclify/javascript'
import { useNuxtApp } from '#app'

export const useDoclify = (): Doclify => {
  const nuxtApp = useNuxtApp()
  const doclify = nuxtApp.$doclify

  return doclify
}
