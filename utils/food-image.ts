// 지도 앱 URL 생성 함수
export function getMapAppUrl(foodName: string, mapType: "naver" | "kakao" | "google"): string {
  const query = encodeURIComponent(`${foodName} 맛집`)

  switch (mapType) {
    case "naver":
      return `https://map.naver.com/v5/search/${query}`
    case "kakao":
      return `https://map.kakao.com/?q=${query}`
    case "google":
      return `https://www.google.com/maps/search/${query}`
    default:
      return ""
  }
}

// 배달 앱 URL 생성 함수
export function getDeliveryAppUrl(foodName: string, appType: "baemin" | "coupang" | "yogiyo"): string {
  const query = encodeURIComponent(foodName)

  switch (appType) {
    case "baemin":
      return `https://m.baemin.com/search/searchResult?query=${query}`
    case "coupang":
      return `https://www.coupangeats.com/search?keyword=${query}`
    case "yogiyo":
      return `https://www.yogiyo.co.kr/mobile/#/search?keyword=${query}`
    default:
      return ""
  }
}

// 음식 이미지 URL을 생성하는 함수 - 사용자가 직접 구현할 예정
export async function getFoodImageUrl(foodName: string, category?: string): Promise<string> {
  // 기본 플레이스홀더 이미지 반환
  return `/placeholder.svg?height=400&width=500&text=${encodeURIComponent(foodName)}`
}
