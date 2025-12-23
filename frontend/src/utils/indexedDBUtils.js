// utils/indexedDBUtils.js
// Konfigurasi IndexedDB untuk offline storage
const DB_NAME = 'rkm_offline_db'
const DB_VERSION = 1

// Inisialisasi database IndexedDB
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Store untuk pengguna (cache)
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' })
        userStore.createIndex('username', 'username', { unique: true })
        userStore.createIndex('lastSync', 'lastSync', { unique: false })
      }

      // Store untuk anggota
      if (!db.objectStoreNames.contains('members')) {
        const memberStore = db.createObjectStore('members', { keyPath: 'id' })
        memberStore.createIndex('syncStatus', 'syncStatus', { unique: false })
        memberStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Store untuk pembayaran
      if (!db.objectStoreNames.contains('payments')) {
        const paymentStore = db.createObjectStore('payments', { keyPath: 'id' })
        paymentStore.createIndex('syncStatus', 'syncStatus', { unique: false })
        paymentStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Store untuk pengeluaran
      if (!db.objectStoreNames.contains('expenses')) {
        const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' })
        expenseStore.createIndex('syncStatus', 'syncStatus', { unique: false })
        expenseStore.createIndex('createdAt', 'createdAt', { unique: false })
      }

      // Store untuk antrian sync
      if (!db.objectStoreNames.contains('sync_queue')) {
        const queueStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
        queueStore.createIndex('operation', 'operation', { unique: false })
        queueStore.createIndex('entityType', 'entityType', { unique: false })
        queueStore.createIndex('createdAt', 'createdAt', { unique: false })
        queueStore.createIndex('nextAttempt', 'nextAttempt', { unique: false })
      }
    }
  })
}

// Fungsi untuk menyimpan data ke IndexedDB
export const saveToIndexedDB = async (storeName, data) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    // Jika data adalah array, tambahkan semua item
    if (Array.isArray(data)) {
      for (const item of data) {
        await store.put(item)
      }
    } else {
      // Tambahkan ID jika belum ada
      if (!data.id) {
        data.id = Date.now().toString()
      }
      await store.put(data)
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(data)
      transaction.onerror = () => reject(transaction.error)
    })
  } catch (error) {
    console.error(`Error saving to IndexedDB store ${storeName}:`, error)
    throw error
  }
}

// Fungsi untuk mengambil data dari IndexedDB
export const getFromIndexedDB = async (storeName, key = null) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      let request
      if (key) {
        request = store.get(key)
      } else {
        request = store.getAll()
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error(`Error getting from IndexedDB store ${storeName}:`, error)
    throw error
  }
}

// Fungsi untuk menghapus data dari IndexedDB
export const deleteFromIndexedDB = async (storeName, key) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onsuccess = () => resolve(key)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error(`Error deleting from IndexedDB store ${storeName}:`, error)
    throw error
  }
}

// Fungsi untuk menambahkan item ke antrian sync
export const addToSyncQueue = async (operation, entityType, entityId, data) => {
  const queueItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    operation,
    entityType,
    entityId,
    data,
    priority: 1, // 1=highest
    attempts: 0,
    createdAt: new Date().toISOString(),
    nextAttempt: new Date().toISOString()
  }

  await saveToIndexedDB('sync_queue', queueItem)
  return queueItem
}

// Fungsi untuk mendapatkan item dari antrian sync
export const getSyncQueue = async () => {
  return await getFromIndexedDB('sync_queue')
}

// Fungsi untuk menghapus item dari antrian sync
export const removeFromSyncQueue = async (queueId) => {
  return await deleteFromIndexedDB('sync_queue', queueId)
}