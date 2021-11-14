export type CloudWaterMark = {
  appid: string,
  /** 以秒为单位 */
  timestamp: number,
}

export type CloudIdSource<T=object> = { 
  cloudID: string, 
  data: T & { watermark?: CloudWaterMark },
  errCode?: number,
  
}

/**
 * 0: 未知
 * 1: 男性
 * 2: 女性
 */
export type WxGender = 0 | 1 | 2
export type WxLanguage = "en" | "zh_CN" | "zh_TW"

export interface WxUserInfo {
  nickName: string,
  avatarUrl: string,
  gender: WxGender,
  country: string,
  province: string,
  city: string,
  language: WxLanguage,
}

export interface WxUserPhone {
  phoneNumber: string,
  purePhoneNumber: string,
  countryCode: string,
}
