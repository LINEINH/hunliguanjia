/**
 * 用户信息
 */
export interface UserInfo {
  id: number
  phone: string
  nickname: string
  avatar: string
  realName?: string
  idCard?: string
  city?: string
  weddingDate?: string  // 婚期
  avatarAuditStatus: 'pending' | 'approved' | 'rejected'
}
