/**
 * 验证工具函数
 */

/**
 * 验证手机号
 */
export function isPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证身份证号
 */
export function isIdCard(idCard: string): boolean {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

/**
 * 验证邮箱
 */
export function isEmail(email: string): boolean {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
}

/**
 * 验证未来日期
 */
export function isFutureDate(date: string): boolean {
  const targetDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return targetDate > today
}

/**
 * 验证空值
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}
