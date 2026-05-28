/**
 * 本地存储封装
 */

/**
 * 设置存储(JSON 自动序列化)
 */
export function setStorage(key: string, value: any): void {
  try {
    const data = typeof value === 'string' ? value : JSON.stringify(value)
    uni.setStorageSync(key, data)
  } catch (error) {
    console.error('存储失败:', error)
  }
}

/**
 * 获取存储(JSON 自动反序列化)
 */
export function getStorage<T = any>(key: string): T | null {
  try {
    const data = uni.getStorageSync(key)
    if (!data) return null
    
    // 尝试 JSON 解析
    try {
      return JSON.parse(data) as T
    } catch {
      return data as unknown as T
    }
  } catch (error) {
    console.error('获取存储失败:', error)
    return null
  }
}

/**
 * 删除存储
 */
export function removeStorage(key: string): void {
  try {
    uni.removeStorageSync(key)
  } catch (error) {
    console.error('删除存储失败:', error)
  }
}

/**
 * 清空存储
 */
export function clearStorage(): void {
  try {
    uni.clearStorageSync()
  } catch (error) {
    console.error('清空存储失败:', error)
  }
}
