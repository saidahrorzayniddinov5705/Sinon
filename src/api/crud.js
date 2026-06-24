import client from './client'

// PUT — yozuvni to'liq yangilash
export function updateItem(endpoint, data) {
  return client.put(endpoint, data)
}
