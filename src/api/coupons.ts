import api from './client'

export type CouponStatus = 'active' | 'inactive' | 'redeemed' | 'expired'

export interface Coupon {
  id: number
  code: string
  description: string
  value: number
  expirationDate: string
  status: CouponStatus
}

export interface CreateCouponInput {
  code: string
  description: string
  value: number
  expirationDate: string
  status?: CouponStatus
}

export interface UpdateCouponInput {
  code?: string
  description?: string
  value?: number
  expirationDate?: string
  status?: CouponStatus
}

export async function listCoupons(params?: { status?: CouponStatus; minValue?: number; maxValue?: number; expiresBefore?: string }) {
  const { data } = await api.get<Coupon[]>('/coupons', { params })
  return data
}

export async function getCoupon(id: number) {
  const { data } = await api.get<Coupon>(`/coupons/${id}`)
  return data
}

export async function createCoupon(input: CreateCouponInput) {
  const { data } = await api.post<Coupon>('/coupons', input)
  return data
}

export async function updateCoupon(id: number, input: UpdateCouponInput) {
  const { data } = await api.put<Coupon>(`/coupons/${id}`, input)
  return data
}

export async function deleteCoupon(id: number) {
  const { data } = await api.delete<Coupon>(`/coupons/${id}`)
  return data
}

// Redemptions (opcionales)
export interface RedeemInput { code: string }
export async function redeemCoupon(input: RedeemInput) {
  const { data } = await api.post('/redeem', input)
  return data
}
