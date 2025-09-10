"use server"

import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
// 간단한 인메모리 저장소 (실제 구현에서는 데이터베이스 사용)
let recommendations: any[] = [
  // 초기 더미 데이터
  {
    id: "initial-1",
    timestamp: new Date().toISOString(),
    foodName: "김치찌개",
    category: "한식",
    reason: "매콤하고 얼큰한 국물 요리로 한국인이 가장 사랑하는 음식 중 하나입니다.",
    ingredients: ["김치", "돼지고기", "두부", "파"],
    recipe: "1. 김치와 돼지고기를 볶다가 2. 물을 붓고 끓인 후 3. 두부와 파를 넣고 조금 더 끓입니다.",
    imageUrl: null, // 이미지 URL 필드 추가
  },
  {
    id: "initial-2",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 하루 전
    foodName: "샐러드",
    category: "다이어트",
    reason: "신선한 채소로 만든 가벼운 식사로 건강에 좋습니다.",
    ingredients: ["양상추", "토마토", "오이", "올리브 오일"],
    recipe: "1. 채소를 씻어서 썰고 2. 올리브 오일과 소금, 후추로 간을 합니다.",
    imageUrl: null, // 이미지 URL 필드 추가
  },
]

// 일반 음식 추천을 위한 데이터
const regularFoods = [
  // 한식 (25개)
  {
    foodName: "갈비찜",
    category: "한식",
    reason: "달콤한 양념에 푹 조려진 부드러운 갈비의 맛이 일품인 한국의 대표 요리입니다.",
    ingredients: ["소갈비", "간장", "설탕", "배", "당근"],
    recipe: "1. 갈비를 양념에 재우고 2. 채소와 함께 조려 완성합니다.",
    imageUrl: null, // 이미지 URL 필드 추가
  },
  {
    foodName: "육개장",
    category: "한식",
    reason: "매콤하고 얼큰한 국물과 소고기의 조화가 일품인 한국의 대표 탕 요리입니다.",
    ingredients: ["소고기", "고사리", "대파", "고춧가루", "마늘"],
    recipe: "1. 소고기를 삶아 육수를 내고 2. 채소와 양념을 넣어 끓입니다.",
    imageUrl: null, // 이미지 URL 필드 추가
  },
  {
    foodName: "해물파전",
    category: "한식",
    reason: "바삭한 반죽과 신선한 해물의 조화가 일품인 비 오는 날 생각나는 음식입니다.",
    ingredients: ["밀가루", "해물", "대파", "계란", "식용유"],
    recipe: "1. 반죽에 해물과 파를 섞고 2. 팬에 부쳐 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "닭갈비",
    category: "한식",
    reason: "매콤달콤한 양념과 닭고기, 채소의 조화가 일품인 인기 메뉴입니다.",
    ingredients: ["닭고기", "양배추", "고구마", "떡", "고추장"],
    recipe: "1. 닭고기를 양념에 재우고 2. 채소와 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "감자탕",
    category: "한식",
    reason: "돼지 등뼈의 깊은 맛과 감자의 조화가 일품인 해장 요리입니다.",
    ingredients: ["돼지 등뼈", "감자", "깻잎", "대파", "고춧가루"],
    recipe: "1. 등뼈를 삶아 육수를 내고 2. 감자와 양념을 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "제육볶음",
    category: "한식",
    reason: "매콤한 양념과 부드러운 돼지고기의 조화가 일품인 한국의 대표 볶음 요리입니다.",
    ingredients: ["돼지고기", "양파", "당근", "고추장", "고춧가루"],
    recipe: "1. 고기를 양념에 재우고 2. 채소와 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "순대국",
    category: "한식",
    reason: "담백한 국물과 순대의 조화가 일품인 한국의 대표 해장 음식입니다.",
    ingredients: ["순대", "돼지고기", "대파", "마늘", "고춧가루"],
    recipe: "1. 육수를 끓이고 2. 순대와 고기를 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "콩나물국밥",
    category: "한식",
    reason: "시원하고 담백한 국물과 아삭한 콩나물의 조화가 일품인 한국의 대표 해장 음식입니다.",
    ingredients: ["쌀", "콩나물", "대파", "마늘", "국간장"],
    recipe: "1. 콩나물을 볶다가 2. 물을 붓고 끓인 후 3. 밥을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "설렁탕",
    category: "한식",
    reason: "소뼈를 오랜 시간 끓여 만든 진하고 담백한 국물이 일품인 보양식입니다.",
    ingredients: ["소뼈", "소고기", "대파", "소금", "후추"],
    recipe: "1. 소뼈를 오래 끓여 육수를 내고 2. 고기와 함께 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "보쌈",
    category: "한식",
    reason: "부드럽게 삶은 돼지고기와 신선한 쌈 채소의 조화가 일품인 한국의 대표 요리입니다.",
    ingredients: ["돼지고기", "상추", "배추", "쌈장", "마늘"],
    recipe: "1. 돼지고기를 삶고 2. 쌈 채소와 함께 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "칼국수",
    category: "한식",
    reason: "담백한 국물과 쫄깃한 면발의 조화가 일품인 한국의 대표 면 요리입니다.",
    ingredients: ["밀가루", "바지락", "애호박", "대파", "마늘"],
    recipe: "1. 육수를 끓이고 2. 반죽한 면을 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "닭도리탕",
    category: "한식",
    reason: "매콤달콤한 양념과 닭고기, 감자의 조화가 일품인 한국의 대표 찜 요리입니다.",
    ingredients: ["닭고기", "감자", "당근", "양파", "고추장"],
    recipe: "1. 닭고기를 양념에 재우고 2. 채소와 함께 조려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "김치찌개",
    category: "한식",
    reason: "된장찌개의 영원한 숙적.",
    ingredients: ["김치", "두부", "참치/고기", "양파", "대파"],
    recipe: "1. 채소를 썰어 물에 끓이고 2. 김치를 넣어 끓입니다.",
    weatherTags: ["cold", "rainy", "cloudy", "snow"],
    imageUrl: null,
  },
  {
    foodName: "김치볶음밥",
    category: "한식",
    reason: "한국인의 소울푸드.",
    ingredients: ["김치", "파", "간장", "설탕", "밥"],
    recipe: "1. 파를 기름에 볶습니다. 2. 채소와 함께 볶아 완성합니다.",
    weatherTags: ["cold", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "덮밥",
    category: "한식",
    reason: "간편하면서도 든든한 한 끼를 해결할 수 있는 한 그릇 요리입니다.",
    ingredients: ["고기", "양파", "간장", "설탕", "밥"],
    recipe: "1. 파를 기름에 볶습니다. 2. 채소와 함께 볶아 완성합니다.",
    weatherTags: ["sunny", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "불고기",
    category: "한식",
    reason: "달콤하고 짭짤한 맛이 일품인 한국의 대표 음식입니다.",
    ingredients: ["소고기", "양파", "당근", "간장", "설탕"],
    recipe: "1. 소고기를 얇게 썰어 양념에 재웁니다. 2. 채소와 함께 볶아 완성합니다.",
    weatherTags: ["sunny", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "된장찌개",
    category: "한식",
    reason: "김치찌개의 영원한 숙적.",
    ingredients: ["된장", "두부", "애호박", "양파", "대파"],
    recipe: "1. 채소를 썰어 물에 끓이고 2. 된장을 풀어 넣어 끓입니다.",
    weatherTags: ["cold", "rainy", "cloudy", "snow"],
    imageUrl: null,
  },
  {
    foodName: "비빔밥",
    category: "한식",
    reason: "다양한 나물과 고기, 계란이 어우러진 영양 만점의 한국 대표 음식입니다.",
    ingredients: ["밥", "나물", "소고기", "계란", "고추장"],
    recipe: "1. 나물과 고기를 준비하고 2. 밥 위에 올려 비벼 먹습니다.",
    weatherTags: ["sunny", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "삼겹살",
    category: "한식",
    reason: "바삭하고 육즙 가득한 돼지고기의 풍미를 즐길 수 있는 인기 메뉴입니다.",
    ingredients: ["삼겹살", "상추", "쌈장", "마늘", "고추"],
    recipe: "1. 삼겹살을 구워 2. 상추에 싸서 먹습니다.",
    weatherTags: ["sunny", "cloudy", "cold"],
    imageUrl: null,
  },
  {
    foodName: "떡볶이",
    category: "한식",
    reason: "매콤달콤한 맛이 일품인 한국의 대표적인 분식 메뉴입니다.",
    ingredients: ["떡", "고추장", "어묵", "양파", "대파"],
    recipe: "1. 양념장을 만들고 2. 떡과 어묵을 넣어 끓입니다.",
    weatherTags: ["rainy", "cloudy", "cold", "snow"],
    imageUrl: null,
  },
  {
    foodName: "부대찌개",
    category: "한식",
    reason: "다양한 재료가 어우러진 매콤하고 풍부한 맛의 찌개입니다.",
    ingredients: ["햄", "소시지", "김치", "라면", "채소"],
    recipe: "1. 재료를 넣고 끓이다가 2. 라면을 넣어 완성합니다.",
    weatherTags: ["cold", "rainy", "cloudy", "snow"],
    imageUrl: null,
  },
  {
    foodName: "갈비탕",
    category: "한식",
    reason: "소갈비의 깊은 맛이 우러난 진한 국물이 일품인 보양식입니다.",
    ingredients: ["소갈비", "무", "대파", "마늘", "생강"],
    recipe: "1. 갈비를 삶아 육수를 내고 2. 무를 넣어 함께 끓입니다.",
    weatherTags: ["cold", "rainy", "cloudy", "snow"],
    imageUrl: null,
  },
  {
    foodName: "냉면",
    category: "한식",
    reason: "시원한 육수와 쫄깃한 면발의 조화가 일품인 여름철 대표 음식입니다.",
    ingredients: ["냉면", "육수", "오이", "배", "계란"],
    recipe: "1. 육수를 차갑게 식히고 2. 삶은 면과 고명을 올려 완성합니다.",
    weatherTags: ["hot", "sunny"],
    imageUrl: null,
  },
  {
    foodName: "순두부찌개",
    category: "한식",
    reason: "부드러운 순두부와 매콤한 국물이 어우러진 건강한 찌개입니다.",
    ingredients: ["순두부", "고춧가루", "조개", "대파", "마늘"],
    recipe: "1. 육수를 끓이고 2. 순두부와 재료를 넣어 끓입니다.",
    weatherTags: ["cold", "rainy", "cloudy", "snow"],
    imageUrl: null,
  },
  {
    foodName: "치킨",
    category: "한식",
    reason: "바삭한 튀김옷과 부드러운 닭고기의 조화가 일품입니다.",
    ingredients: ["닭고기", "튀김가루", "양념"],
    recipe: "1. 닭을 튀김옷을 입혀 튀기고 2. 원하는 소스를 발라 완성합니다.",
    weatherTags: ["rainy", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "김밥",
    category: "한식",
    reason: "다양한 재료를 김과 밥으로 감싼 한국의 대표적인 간편식입니다.",
    ingredients: ["쌀", "김", "단무지", "계란", "햄"],
    recipe: "1. 밥에 양념을 하고 2. 김 위에 재료를 올려 말아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "죽",
    category: "한식",
    reason: "부드럽고 소화가 잘 되는 한국의 대표적인 보양식입니다.",
    ingredients: ["쌀", "닭고기", "인삼", "대추", "마늘"],
    recipe: "1. 쌀을 불리고 2. 재료와 함께 오래 끓여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "수육",
    category: "한식",
    reason: "담백하게 삶은 돼지고기의 풍미를 즐길 수 있는 한국의 대표 요리입니다.",
    ingredients: ["돼지고기", "된장", "마늘", "생강", "대파"],
    recipe: "1. 돼지고기를 향신료와 함께 삶고 2. 얇게 썰어 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "잡채",
    category: "한식",
    reason: "다양한 채소와 당면이 어우러진 달콤한 맛의 한국 대표 명절 음식입니다.",
    ingredients: ["당면", "소고기", "당근", "시금치", "표고버섯"],
    recipe: "1. 채소와 고기를 볶고 2. 삶은 당면과 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "곱창",
    category: "한식",
    reason: "쫄깃한 식감과 고소한 풍미가 매력적인 별미 요리입니다.",
    ingredients: ["소곱창", "대파", "양파", "마늘", "고추장"],
    recipe: "1. 곱창을 깨끗이 손질하고 2. 양념과 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "순댓국",
    category: "한식",
    reason: "진한 국물에 푸짐한 순대와 고기가 어우러진 든든한 국밥입니다.",
    ingredients: ["순대", "돼지고기", "대파", "들깨가루", "다진 마늘"],
    recipe: "1. 돼지고기를 삶아 육수를 만들고 2. 순대와 양념을 넣어 끓여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "콩나물국밥",
    category: "한식",
    reason: "개운한 국물과 아삭한 콩나물의 조화로 해장에 좋은 음식입니다.",
    ingredients: ["콩나물", "대파", "마늘", "고춧가루", "멸치 육수"],
    recipe: "1. 멸치 육수를 끓이고 2. 콩나물과 양념을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "칼국수",
    category: "한식",
    reason: "쫄깃한 면발과 깊은 국물 맛이 어우러진 정겨운 면 요리입니다.",
    ingredients: ["밀가루 면", "멸치 육수", "애호박", "양파", "다진 마늘"],
    recipe: "1. 멸치 육수를 끓이고 2. 면과 채소를 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "백반",
    category: "한식",
    reason: "다양한 반찬과 함께 즐길 수 있는 정갈한 한식 한상차림입니다.",
    ingredients: ["쌀밥", "국", "나물 반찬", "김치", "생선구이"],
    recipe: "1. 쌀밥과 국을 준비하고 2. 다양한 반찬을 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "생선구이",
    category: "한식",
    reason: "겉은 바삭하고 속은 촉촉한 식감이 일품인 고소한 생선 요리입니다.",
    ingredients: ["고등어", "소금", "식용유", "레몬", "마늘"],
    recipe: "1. 생선에 소금을 뿌리고 2. 기름에 노릇하게 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "해장국",
    category: "한식",
    reason: "진한 국물과 부드러운 고기가 어우러져 속을 달래주는 국 요리입니다.",
    ingredients: ["소고기", "우거지", "된장", "마늘", "대파"],
    recipe: "1. 소고기를 삶아 육수를 만들고 2. 우거지와 양념을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "멸치국수",
    category: "한식",
    reason: "멸치 육수의 감칠맛이 가득한 담백한 국수 요리입니다.",
    ingredients: ["소면", "멸치", "다시마", "대파", "간장"],
    recipe: "1. 멸치 육수를 끓이고 2. 삶은 소면을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "비빔국수",
    category: "한식",
    reason: "새콤달콤한 양념장이 쫄깃한 면과 어우러진 상큼한 국수 요리입니다.",
    ingredients: ["소면", "고추장", "식초", "설탕", "오이"],
    recipe: "1. 소면을 삶아 헹구고 2. 양념장과 함께 버무려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "쌈밥",
    category: "한식",
    reason: "각종 쌈 채소와 고기, 된장찌개가 곁들여진 건강한 한식 한상입니다.",
    ingredients: ["쌀밥", "상추", "깻잎", "삼겹살", "된장"],
    recipe: "1. 쌀밥과 반찬을 준비하고 2. 고기와 함께 쌈을 싸서 즐깁니다.",
    imageUrl: null,
  },
  {
    foodName: "삼계탕",
    category: "한식",
    reason: "부드러운 닭고기와 진한 국물이 몸을 따뜻하게 해주는 보양식입니다.",
    ingredients: ["닭", "찹쌀", "대추", "마늘", "인삼"],
    recipe: "1. 닭 속에 찹쌀과 대추를 넣고 2. 푹 끓여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "메밀 막국수",
    category: "한식",
    reason: "구수한 메밀면과 새콤달콤한 양념이 조화를 이루는 시원한 국수 요리입니다.",
    ingredients: ["메밀면", "동치미 육수", "고추장", "�������이", "김가루"],
    recipe: "1. 메밀면을 삶아 헹구고 2. 육수와 양념을 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "낙지볶음",
    category: "한식",
    reason: "매콤한 양념과 쫄깃한 낙지가 어우러진 별미 볶음 요리입니다.",
    ingredients: ["낙지", "고추장", "양파", "당근", "마늘"],
    recipe: "1. 낙지를 손질한 후 2. 양념과 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "쭈꾸미",
    category: "한식",
    reason: "매콤달콤한 양념이 쭈꾸미의 쫄깃한 식감을 더욱 살려주는 요리입니다.",
    ingredients: ["쭈꾸미", "고추장", "양파", "대파", "마늘"],
    recipe: "1. 쭈꾸미를 손질하고 2. 양념과 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "샤브샤브",
    category: "한식",
    reason: "얇게 썬 고기와 각종 채소를 육수에 살짝 익혀 먹는 건강한 요리입니다.",
    ingredients: ["소고기", "배추", "버섯", "당면", "육수"],
    recipe: "1. 육수를 끓이고 2. 고기와 채소를 데쳐 완성합니다.",
    imageUrl: null,
  },
  // 나머지 음식들도 weatherTags 추가...
  // 양식 (일부만 표시)
  {
    foodName: "피자",
    category: "양식",
    reason: "다양한 토핑으로 즐길 수 있는 만족감 높은 음식입니다.",
    ingredients: ["밀가루", "토마토 소스", "치즈", "토핑"],
    recipe: "1. 도우를 펴고 소스를 바릅니다. 2. 토핑을 올리고 치즈를 뿌려 오븐에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "치킨",
    category: "양식",
    reason: "바삭한 튀김옷과 부드러운 닭고기의 조화가 일품입니다.",
    ingredients: ["닭고기", "튀김가루", "양념"],
    recipe: "1. 닭을 튀김옷을 입혀 튀기고 2. 원하는 소스를 발라 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "스테이크",
    category: "양식",
    reason: "육즙이 풍부하고 풍미가 깊은 고급 요리입니다.",
    ingredients: ["소고기", "소금", "후추", "허브", "버터"],
    recipe: "1. 고기에 간을 하고 2. 팬에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "파스타",
    category: "양식",
    reason: "다양한 소스와 토핑으로 즐길 수 있는 이탈리아 대표 요리입니다.",
    ingredients: ["파스타면", "소스", "올리브 오일", "마늘", "허브"],
    recipe: "1. 파스타를 삶고 2. 소스와 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "햄버거",
    category: "패스트푸드",
    reason: "육즙 가득한 패티와 다양한 토핑의 조합이 매력적인 대표적인 패스트푸드입니다.",
    ingredients: ["소고기 패티", "빵", "치즈", "양상추", "토마토"],
    recipe: "1. 패티를 굽고 2. 빵에 토핑과 함께 쌓아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "리조또",
    category: "양식",
    reason: "크리미한 식감과 풍부한 맛이 일품인 이탈리아 쌀 요리입니다.",
    ingredients: ["쌀", "버섯", "양파", "화이트 와인", "파마산 치즈"],
    recipe: "1. 쌀을 볶고 2. 육수를 조금씩 넣어가며 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "라자냐",
    category: "양식",
    reason: "여러 층의 파스타와 소스, 치즈가 어우러진 풍미 가득한 이탈리아 요리입니다.",
    ingredients: ["라자냐 면", "미트 소스", "베샤멜 소스", "모짜렐라 치즈", "파마산 치즈"],
    recipe: "1. 소스와 면을 층층이 쌓고 2. 치즈를 뿌려 오븐에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "그라탕",
    category: "양식",
    reason: "크리미한 소스와 치즈의 조화가 일품인 프랑스 오븐 요리입니다.",
    ingredients: ["감자", "양파", "베이컨", "크림", "치즈"],
    recipe: "1. 재료를 그릇에 담고 2. 소스와 치즈를 뿌려 오븐에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "샐러드",
    category: "양식",
    reason: "신선한 채소와 다양한 토핑, 드레싱의 조화가 일품인 건강한 요리입니다.",
    ingredients: ["양상추", "토마토", "오이", "올리브 오일", "발사믹 식초"],
    recipe: "1. 채소를 씻어 썰고 2. 드레싱을 뿌려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "오믈렛",
    category: "양식",
    reason: "부드러운 계란과 다양한 속재료의 조화가 일품인 프랑스 요리입니다.",
    ingredients: ["계란", "우유", "치즈", "햄", "버섯"],
    recipe: "1. 계란을 풀어 재료를 섞고 2. 팬에 부어 익힙니다.",
    imageUrl: null,
  },
  {
    foodName: "비프 스튜",
    category: "양식",
    reason: "부드러운 소고기와 채소가 어우러진 진한 맛의 서양식 찜 요리입니다.",
    ingredients: ["소고기", "감자", "당근", "양파", "토마토"],
    recipe: "1. 고기를 볶고 2. 채소와 함께 오래 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "시저 샐러드",
    category: "양식",
    reason: "로메인 상추와 크루통, 시저 드레싱의 조화가 일품인 클래식 샐러드입니다.",
    ingredients: ["로메인 상추", "크루통", "파마산 치즈", "베이컨", "시저 드레싱"],
    recipe: "1. 상추를 씻어 썰고 2. 재료와 드레싱을 섞어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "필라프",
    category: "양식",
    reason: "향신료와 채소, 고기가 어우러진 풍미 가득한 쌀 요리입니다.",
    ingredients: ["쌀", "양파", "당근", "완두콩", "향신료"],
    recipe: "1. 쌀을 볶고 2. 채소와 함께 끓여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "크림 스프",
    category: "양식",
    reason: "부드럽고 크리미한 식감이 일품인 서양식 수프입니다.",
    ingredients: ["양파", "감자", "크림", "버터", "소금"],
    recipe: "1. 채소를 볶고 2. 물을 붓고 끓인 후 3. 믹서에 갈아 크림을 넣습니다.",
    imageUrl: null,
  },
  {
    foodName: "랍스터 비스크",
    category: "양식",
    reason: "랍스터의 풍미가 가득한 고급스러운 크림 수프입니다.",
    ingredients: ["랍스터", "양파", "당근", "토마토", "크림"],
    recipe: "1. 랍스터 껍질로 육수를 내고 2. 채소를 넣어 끓인 후 3. 믹서에 갈아 크림을 넣습니다.",
    imageUrl: null,
  },
  {
    foodName: "비프 웰링턴",
    category: "양식",
    reason: "페이스트리로 감싼 소고기 필레의 풍미가 일품인 영국의 고급 요리입니다.",
    ingredients: ["소고기 필레", "버섯", "페이스트리", "프로슈토", "머스타드"],
    recipe: "1. 고기를 굽고 2. 버섯 페이스트를 바른 후 3. 페이스트리로 감싸 오븐에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "라따뚜이",
    category: "양식",
    reason: "다양한 채소의 풍미가 어우러진 프랑스 프로방스 지방의 전통 요리입니다.",
    ingredients: ["가지", "호박", "토마토", "파프리카", "허브"],
    recipe: "1. 채소를 썰어 2. 허브와 함께 오래 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "퀘사디아",
    category: "양식",
    reason: "토르티야에 치즈와 다양한 속재료를 넣어 구운 멕시코 요리입니다.",
    ingredients: ["토르티야", "치즈", "닭고기", "파프리카", "할라피뇨"],
    recipe: "1. 토르티야에 재료를 올리고 2. 접어서 팬에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "프렌치 토스트",
    category: "양식",
    reason: "달콤하고 부드러운 맛이 일품인 클래식한 아침 메뉴입니다.",
    ingredients: ["식빵", "계란", "우유", "설탕", "시나몬"],
    recipe: "1. 빵을 계란물에 적시고 2. 팬에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "치킨 파르미지아나",
    category: "양식",
    reason: "바삭한 치킨과 토마토 소스, 치즈의 조화가 일품인 이탈리아-미국식 요리입니다.",
    ingredients: ["닭가슴살", "토마토 소스", "모짜렐라 치즈", "파마산 치즈", "바질"],
    recipe: "1. 닭고기를 튀기고 2. 소스와 치즈를 올려 오븐에 굽습니다.",
    imageUrl: null,
  },
  // 일식 (일부만 표시)
  {
    foodName: "스시",
    category: "일식",
    reason: "신선한 생선과 밥이 어우러진 대표적인 일본 요리입니다.",
    ingredients: ["생선회", "초밥용 밥", "와사비", "간장"],
    recipe: "1. 초밥용 밥을 준비하고 2. 생선회를 얹어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "사시미",
    category: "일식",
    reason: "신선한 해산물을 얇게 저며 생으로 즐기는 요리입니다.",
    ingredients: ["참치", "연어", "광어", "간장", "와사비"],
    recipe: "1. 신선한 해산물을 얇게 저며 2. 간장과 와사비와 함께 제공합니다.",
    imageUrl: null,
  },
  {
    foodName: "라멘",
    category: "일식",
    reason: "진한 국물과 쫄깃한 면발이 특징인 일본식 국수 요리입니다.",
    ingredients: ["라멘 면", "돼지뼈 육수", "차슈", "계란", "파"],
    recipe: "1. 육수를 끓이고 2. 면과 토핑을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "우동",
    category: "일식",
    reason: "굵은 면발과 담백한 국물이 특징인 일본식 국수 요리입니다.",
    ingredients: ["우동 면", "다시마 육수", "튀김 부스러기", "파"],
    recipe: "1. 육수를 끓이고 2. 면과 토핑을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "돈카츠",
    category: "일식",
    reason: "바삭한 튀김옷과 부드러운 돼지고기가 어우러진 인기 메뉴입니다.",
    ingredients: ["돼지 등심", "빵가루", "계란", "밀가루", "양배추"],
    recipe: "1. 돼지고기에 밀가루, 계란, 빵가루를 입혀 2. 튀겨서 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "가츠동",
    category: "일식",
    reason: "돈카츠와 달걀, 양파를 밥 위에 올린 덮밥 요리입니다.",
    ingredients: ["돈카츠", "밥", "양파", "계란", "덮밥 소스"],
    recipe: "1. 돈카츠를 양파와 함께 소스에 끓이고 2. 밥 위에 올립니다.",
    imageUrl: null,
  },
  {
    foodName: "텐동",
    category: "일식",
    reason: "바삭한 튀김과 밥이 조화를 이루는 덮밥 요리입니다.",
    ingredients: ["새우", "채소", "튀김 반죽", "밥", "덮밥 소스"],
    recipe: "1. 재료를 튀겨 밥 위에 올리고 2. 소스를 뿌려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "오코노미야키",
    category: "일식",
    reason: "다양한 재료를 반죽에 섞어 부쳐낸 일본식 부침개입니다.",
    ingredients: ["밀가루", "양배추", "돼지고기", "계란", "소스"],
    recipe: "1. 재료를 섞어 반죽을 만들고 2. 팬에 부쳐 소스를 바릅니다.",
    imageUrl: null,
  },
  {
    foodName: "타코야키",
    category: "일식",
    reason: "쫄깃한 문어와 부드러운 반죽이 어우러진 간식입니다.",
    ingredients: ["밀가루 반죽", "문어", "파", "가쓰오부시", "소스"],
    recipe: "1. 반죽에 문어를 넣어 구워 2. 소스와 토핑을 올립니다.",
    imageUrl: null,
  },
  {
    foodName: "야키토리",
    category: "일식",
    reason: "숯불에 구워낸 닭꼬치로, 간단하게 즐길 수 있는 요리입니다.",
    ingredients: ["닭고기", "파", "소금", "타레 소스"],
    recipe: "1. 재료를 꼬치에 끼워 2. 숯불에 구워 소스를 바릅니다.",
    imageUrl: null,
  },
  {
    foodName: "샤부샤부",
    category: "일식",
    reason: "얇은 고기와 채소를 끓는 육수에 살짝 데쳐 먹는 건강식입니다.",
    ingredients: ["소고기", "채소", "육수", "소스"],
    recipe: "1. 육수를 끓이고 2. 재료를 데쳐 소스에 찍어 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "스키야키",
    category: "일식",
    reason: "얇게 저민 소고기와 채소를 달콤한 소스에 조리한 전골 요리입니다.",
    ingredients: ["소고기", "두부", "버섯", "배추", "스키야키 소스"],
    recipe: "1. 재료를 냄비에 넣고 2. 소스를 부어 조리합니다.",
    imageUrl: null,
  },
  {
    foodName: "오니기리",
    category: "일식",
    reason: "간단하게 즐길 수 있는 주먹밥으로, 다양한 속재료를 활용합니다.",
    ingredients: ["밥", "소금", "김", "속재료 (연어, 매실 등)"],
    recipe: "1. 밥에 속재료를 넣고 삼각형 모양으로 만들어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "니쿠자가",
    category: "일식",
    reason: "소고기와 감자를 달콤한 간장 소스에 조린 가정식 요리입니다.",
    ingredients: ["소고기", "감자", "양파", "당근", "간장"],
    recipe: "1. 재료를 냄비에 넣고 2. 간장 소스로 조립니다.",
    imageUrl: null,
  },
  {
    foodName: "야끼소바",
    category: "일식",
    reason: "볶음면과 채소, 고기를 함께 볶아 만든 일본식 볶음면입니다.",
    ingredients: ["면", "양배추", "돼지고기", "소스", "가쓰오부시"],
    recipe: "1. 재료를 볶고 2. 면을 넣어 소스와 함께 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "스테키동",
    category: "일식",
    reason: "구운 스테이크와 달콤한 소스를 곁들인 일본식 덮밥입니다.",
    ingredients: ["소고기", "밥", "소스", "마늘", "파"],
    recipe: "1. 스테이크를 구워 밥 위에 올리고 2. 소스를 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "덴푸라",
    category: "일식",
    reason: "바삭하고 가벼운 튀김옷의 식감이 일품인 일본의 대표 튀김 요리입니다.",
    ingredients: ["새우", "채소", "밀가루", "계란", "얼음물"],
    recipe: "1. 재료에 튀김옷을 입히고 2. 기름에 튀겨 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "차슈라멘",
    category: "일식",
    reason: "부드러운 차슈와 진한 국물, 쫄깃한 면의 조화가 일품인 일본의 대표 라멘입니다.",
    ingredients: ["돼지고기", "간장", "설탕", "라멘면", "육수"],
    recipe: "1. 돼지고기를 조려 차슈를 만들고 2. 육수와 면, 토핑을 함께 담습니다.",
    imageUrl: null,
  },
  {
    foodName: "규카츠",
    category: "일식",
    reason: "바삭한 튀김옷과 부드러운 소고기의 조화가 일품인 일본식 소고기 튀김입니다.",
    ingredients: ["소고기", "빵가루", "밀가루", "계란", "소스"],
    recipe: "1. 고기에 튀김옷을 입히고 2. 기름에 튀겨 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "나베",
    category: "일식",
    reason: "다양한 재료를 함�� 끓��� 먹는 일본식 전골 요리로 깊은 맛이 일품입니다.",
    ingredients: ["육수", "고기", "해산물", "채소", "두부"],
    recipe: "1. 육수를 끓이고 2. 재료를 넣어 함께 끓여 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "에비후라이",
    category: "일식",
    reason: "바삭하게 튀긴 새우튀김으로 바다의 풍미를 느낄 수 있는 요리입니다.",
    ingredients: ["새우", "빵가루", "밀가루", "계란", "타르타르 소스"],
    recipe: "1. 새우에 밀가루, 계란, 빵가루를 입히고 2. 튀긴 후 소스를 곁들입니다.",
    imageUrl: null,
  },
  {
    foodName: "규동",
    category: "일식",
    reason: "달콤하고 짭짤한 소스로 조린 소고기를 밥 위에 올린 덮밥 요리입니다.",
    ingredients: ["소고기", "밥", "양파", "달걀", "덮밥 소스"],
    recipe: "1. 소고기와 양파를 소스에 조리고 2. 밥 위에 올려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "히츠마부시",
    category: "일식",
    reason: "장어구이를 세 가지 방식으로 즐길 수 있는 나고야의 명물 요리입니다.",
    ingredients: ["장어", "밥", "간장 소스", "고추냉이", "다시 국물"],
    recipe: "1. 장어를 구워 밥 위에 올리고 2. 다양한 스타일로 즐깁니다.",
    imageUrl: null,
  },
  {
    foodName: "가이센동",
    category: "일식",
    reason: "신선한 해산물을 밥 위에 듬뿍 올려 먹는 해산물 덮밥입니다.",
    ingredients: ["연어", "참치", "성게", "밥", "간장"],
    recipe: "1. 신선한 해산물을 얹고 2. 간장을 뿌려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "함박스테이크",
    category: "일식",
    reason: "부드럽고 촉촉한 고기 패티를 데미글라스 소스와 함께 즐기는 요리입니다.",
    ingredients: ["소고기", "돼지고기", "양파", "계란", "데미글라스 소스"],
    recipe: "1. 고기 반죽을 만들어 구운 후 2. 소스를 끼얹어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "돈부리",
    category: "일식",
    reason: "다양한 재료를 밥 위에 올려 간편하게 즐길 수 있는 일본식 덮밥입니다.",
    ingredients: ["밥", "고기", "채소", "달걀", "소스"],
    recipe: "1. 다양한 재료를 조리하여 2. 밥 위에 올려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "스파이시 마요 연어덮밥",
    category: "일식",
    reason: "매콤한 마요네즈 소스와 신선한 연어가 어우러진 덮밥 요리입니다.",
    ingredients: ["연어", "밥", "마요네즈", "고추장", "쪽파"],
    recipe: "1. 연어를 썰어 밥 위에 올리고 2. 소스를 뿌려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "고로케",
    category: "일식",
    reason: "바삭한 빵가루 속에 부드러운 감자와 다양한 속재료가 들어간 튀김 요리입니다.",
    ingredients: ["감자", "소고기", "양파", "빵가루", "밀가루"],
    recipe: "1. 감자와 속재료를 섞어 반죽을 만들고 2. 튀겨서 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "야키니쿠",
    category: "일식",
    reason: "신선한 고기를 직접 구워 먹는 일본식 바비큐 요리입니다.",
    ingredients: ["소고기", "돼지고기", "양파", "소스", "파"],
    recipe: "1. 고기를 손질하여 2. 불판에 구워 소스와 함께 즐깁니다.",
    imageUrl: null,
  },
  {
    foodName: "나베모노",
    category: "일식",
    reason: "다양한 채소와 고기를 넣고 끓여 먹는 따뜻한 전골 요리입니다.",
    ingredients: ["배추", "버섯", "소고기", "두부", "육수"],
    recipe: "1. 육수를 끓이고 2. 다양한 재료를 넣어 완성합니다.",
    imageUrl: null,
  },
  // 중식 (일부만 표시)
  {
    foodName: "짜장면",
    category: "중식",
    reason: "달콤하고 짭조름한 춘장 소스가 쫄깃한 면과 잘 어우러지는 대표적인 중식 요리입니다.",
    ingredients: ["중화면", "춘장", "돼지고기", "양파", "감자"],
    recipe: "1. 춘장을 볶아 소스를 만들고 2. 면과 함께 비벼 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "짬뽕",
    category: "중식",
    reason: "얼큰하고 깊은 맛의 국물과 해산물이 조화를 이루는 인기 있는 중국식 국수 요리입니다.",
    ingredients: ["중화면", "해산물", "고추기름", "양배추", "대파"],
    recipe: "1. 고추기름에 해산물과 채소를 볶고 2. 육수를 넣어 면과 함께 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "탕수육",
    category: "중식",
    reason: "겉은 바삭하고 속은 촉촉한 튀김과 새콤달콤한 소스가 어우러지는 인기 요리입니다.",
    ingredients: ["돼지고기", "전분", "식초", "설탕", "간장"],
    recipe: "1. 돼지고기를 튀긴 후 2. 새콤달콤한 소스를 부어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "마파두부",
    category: "중식",
    reason: "부드러운 두부와 매콤한 소스가 어우러진 중국 사천식 대표 요리입니다.",
    ingredients: ["두부", "다진 돼지고기", "고추기름", "두반장", "대파"],
    recipe: "1. 고기를 볶고 2. 두부와 양념을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "깐풍기",
    category: "중식",
    reason: "바삭하게 튀긴 닭고기에 매콤달콤한 소스를 입혀 감칠맛이 뛰어난 요리입니다.",
    ingredients: ["닭고기", "전분", "간장", "고추", "마늘"],
    recipe: "1. 닭고기를 튀긴 후 2. 양념 소스를 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "유린기",
    category: "중식",
    reason: "바삭하게 튀긴 닭고기에 상큼한 간장소스를 부어 감칠맛을 더한 요리입니다.",
    ingredients: ["닭고기", "전분", "간장", "식초", "대파"],
    recipe: "1. 닭고기를 튀긴 후 2. 간장 소스를 부어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "멘보샤",
    category: "중식",
    reason: "새우 반죽을 바삭한 식빵 사이에 넣어 튀긴 고소하고 바삭한 중식 요리입니다.",
    ingredients: ["새우", "식빵", "전분", "달걀", "마요네즈"],
    recipe: "1. 새우 반죽을 빵 사이에 넣고 2. 기름에 바삭하게 튀겨 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "고추잡채",
    category: "중식",
    reason: "매콤한 고추와 돼지고기를 볶아 쫄깃한 만두피와 함께 먹는 인기 요리입니다.",
    ingredients: ["돼지고기", "피망", "목이버섯", "간장", "굴소스"],
    recipe: "1. 돼지고기와 채소를 볶고 2. 만두피와 함께 싸서 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "양장피",
    category: "중식",
    reason: "다양한 채소와 해산물이 조화를 이루는 새콤한 겨자 소스가 매력적인 요리입니다.",
    ingredients: ["해파리", "돼지고기", "계란", "오이", "당근"],
    recipe: "1. 모든 재료를 채 썰어 준비하고 2. 겨자 소스를 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "마라탕",
    category: "중식",
    reason: "매운 마라 소스와 다양한 재료가 어우러진 중국식 얼얼한 국물 요리입니다.",
    ingredients: ["마라소스", "훠궈 재료", "고추기름", "두부", "중국 당면"],
    recipe: "1. 육수에 마라 소스를 넣고 2. 다양한 재료를 넣어 끓여 완성합니다.",
    imageUrl: null,
  },
  // 다양한 나라 음식
  {
    foodName: "타코",
    category: "멕시코 음식",
    reason: "바삭한 또띠아와 풍미 가득한 속재료의 조합이 매력적인 멕시코 요리입니다.",
    ingredients: ["또띠아", "고기", "양상추", "토마토", "아보카도"],
    recipe: "1. 고기를 볶고 2. 또띠아에 속재료를 넣어 말아 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "쌀국수",
    category: "베트남 음식",
    reason: "깔끔하고 깊은 육수와 쫄깃한 쌀국수의 조화가 일품인 베트남 요리입니다.",
    ingredients: ["쌀국수", "소고기", "숙주나물", "고수", "라임"],
    recipe: "1. 육수를 끓이고 2. 쌀국수와 고기, 채소를 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "카레",
    category: "인도 음식",
    reason: "다양한 향신료의 풍미가 어우러진 깊은 맛의 대표적인 인도 요리입니다.",
    ingredients: ["카레 가루", "고기", "양파", "당근", "감자"],
    recipe: "1. 재료를 볶고 2. 카레 가루와 물을 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "파에야",
    category: "스페인 음식",
    reason: "사프란으로 맛을 낸 쌀과 해산물, 고기의 조화가 일품인 스페인의 대표 요리입니다.",
    ingredients: ["쌀", "해산물", "닭고기", "사프란", "올리브 오일"],
    recipe: "1. 고기와 해산물을 볶고 2. 쌀과 육수를 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "팟타이",
    category: "태국 음식",
    reason: "새콤달콤한 소스와 쫄깃한 쌀국수의 조화가 일품인 태국의 대표 요리입니다.",
    ingredients: ["쌀국수", "새우", "두부", "콩나물", "땅콩"],
    recipe: "1. 면을 볶고 2. 재료와 소스를 넣어 함께 볶습니다.",
    imageUrl: null,
  },
  {
    foodName: "케밥",
    category: "터키 음식",
    reason: "향신료로 양념한 고기와 신선한 채소의 조화가 일품인 터키의 대표 요리입니다.",
    ingredients: ["양고기", "빵", "양파", "토마토", "요거트 소스"],
    recipe: "1. 고기를 구워 썰고 2. 빵에 채소와 함께 싸서 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "타진",
    category: "모로코 음식",
    reason: "향신료의 풍미가 가득한 모로코의 대표적인 찜 요리입니다.",
    ingredients: ["양고기", "감자", "당근", "올리브", "향신료"],
    recipe: "1. 재료를 타진 냄비에 넣고 2. 오래 끓여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "쿠스쿠스",
    category: "북아프리카 음식",
    reason: "찐 세몰리나 가루와 다양한 채소, 고기의 조화가 일품인 북아프리카의 대표 요리입니다.",
    ingredients: ["쿠스쿠스", "양고기", "당근", "호박", "병아리콩"],
    recipe: "1. 쿠스쿠스를 찌고 2. 고기와 채소를 끓인 소스와 함께 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "비프 스트로가노프",
    category: "러시아 음식",
    reason: "부드러운 소고기와 크림 소스의 조화가 일품인 러시아의 대표 요리입니다.",
    ingredients: ["소고기", "양파", "버섯", "사워크림", "파프리카"],
    recipe: "1. 고기를 볶고 2. 버섯과 양파를 넣어 볶은 후 3. 사워크림을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "그리스 샐러드",
    category: "그리스 음식",
    reason: "신선한 채소와 페타 치즈의 조화가 일품인 그리스의 대표 샐러드입니다.",
    ingredients: ["토마토", "오이", "올리브", "페타 치즈", "올리브 오일"],
    recipe: "1. 채소를 썰고 2. 치즈와 올리브를 올려 드레싱을 뿌립니다.",
    imageUrl: null,
  },
  {
    foodName: "비리야니",
    category: "인도 음식",
    reason: "향신료가 풍부한 쌀과 고기의 조화가 일품인 인도-파키스탄 요리입니다.",
    ingredients: ["바스마티 쌀", "고기", "양파", "향신료", "요거트"],
    recipe: "1. 고기를 양념해 볶고 2. 쌀과 함께 찌듯이 익힙니다.",
    imageUrl: null,
  },
  {
    foodName: "피타 브레드",
    category: "중동 음식",
    reason: "포켓 형태의 빵에 다양한 속재료를 넣어 먹는 중동의 대표 음식입니다.",
    ingredients: ["밀가루", "이스트", "올리브 오일", "소금", "후무스"],
    recipe: "1. 반죽을 발효시키고 2. 오븐에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "팔라펠",
    category: "중동 음식",
    reason: "병아리콩으로 만든 바삭한 튀김 요리로 중동의 대표적인 채식 음식입니다.",
    ingredients: ["병아리콩", "양파", "마늘", "파슬리", "쿠민"],
    recipe: "1. 재료를 갈아서 반죽하고 2. 동그랗게 빚어 튀깁니다.",
    imageUrl: null,
  },
  {
    foodName: "무사카",
    category: "그리스 음식",
    reason: "가지와 고기, 베샤멜 소스의 조화가 일품인 그리스의 대표 오븐 요리입니다.",
    ingredients: ["가지", "소고기", "토마토 소스", "베샤멜 소스", "치즈"],
    recipe: "1. 가지를 구워 깔고 2. 고기 소스를 올린 후 3. 베샤멜 소스와 치즈를 뿌려 오븐에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "쇠고기 스트로가노프",
    category: "러시아 음식",
    reason: "부드러운 소고기와 크림 소스의 조화가 일품인 러시아의 대표 요리입니다.",
    ingredients: ["소고기", "양파", "버섯", "사워크림", "파프리카"],
    recipe: "1. 고기를 볶고 2. 버섯과 양파를 넣어 볶은 후 3. 사워크림을 넣어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "치킨 티카 마살라",
    category: "인도 음식",
    reason: "탄두리 치킨과 토마토 크림 소스의 조화가 일품인 인도의 대표 요리입니다.",
    ingredients: ["닭고기", "요거트", "토마토", "크림", "향신료"],
    recipe: "1. 닭고기를 양념해 구우고 2. 토마토 크림 소스를 만들어 함께 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "엠파나다",
    category: "남미 음식",
    reason: "바삭한 반죽 안에 다양한 속재료를 넣어 구운 남미의 대표 음식입니다.",
    ingredients: ["밀가루", "버터", "고기", "양파", "올리브"],
    recipe: "1. 반죽을 만들고 2. 속재료를 넣어 접어 오븐에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "쌀국수 볶음",
    category: "베트남 음식",
    reason: "쫄깃한 쌀국수와 다양한 재료를 볶아 만든 베트남 요리입니다.",
    ingredients: ["쌀국수", "새우", "콩나물", "계란", "피시소스"],
    recipe: "1. 면을 삶고 2. 재료와 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "탄두리 치킨",
    category: "인도 음식",
    reason: "요거트와 향신료에 재운 닭고기를 탄두르 오븐에서 구운 인도의 대표 요리입니다.",
    ingredients: ["닭고기", "요거트", "레몬즙", "향신료", "마늘"],
    recipe: "1. 닭고기를 양념에 재우고 2. 오븐에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "파니니",
    category: "이탈리아 음식",
    reason: "바삭하게 구운 빵 사이에 다양한 속재료를 넣은 이탈리아식 샌드위치입니다.",
    ingredients: ["치아바타", "햄", "치즈", "토���토", "바질"],
    recipe: "1. 빵 사이에 재료를 넣고 2. 그릴에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "타말레",
    category: "멕시코 음식",
    reason: "옥수수 반죽으로 감싼 속재료를 옥수수 껍질에 싸서 찐 멕시코의 전통 음식입니다.",
    ingredients: ["옥수수 가루", "라드", "고기", "칠리", "옥수수 껍질"],
    recipe: "1. 반죽을 만들고 2. 속재료를 넣어 옥수수 껍질에 싸서 찝니다.",
    imageUrl: null,
  },
  {
    foodName: "보르시치",
    category: "동유럽 음식",
    reason: "비트의 선명한 색과 풍부한 맛이 특징인 동유럽의 대표 수프입니다.",
    ingredients: ["비트", "양배추", "감자", "소고기", "사워크림"],
    recipe: "1. 육수를 끓이고 2. 채소를 넣어 함께 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "코코넛 커리",
    category: "태국 음식",
    reason: "코코넛 밀크의 부드러움과 향신료의 풍미가 어우러진 태국의 대표 커리입니다.",
    ingredients: ["코코넛 밀크", "고기", "양파", "고추", "향신료"],
    recipe: "1. 향신료를 볶고 2. 고기와 채소를 넣어 볶은 후 3. 코코넛 밀크를 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "후무스",
    category: "중동 음식",
    reason: "병아리콩과 타히니의 부드러운 조화가 일품인 중동의 대표 디핑 소스입니다.",
    ingredients: ["병아리콩", "타히니", "레몬즙", "올리브 오일", "마늘"],
    recipe: "1. 재료를 믹서에 갈고 2. 올리브 오일을 뿌려 완성합니다.",
    imageUrl: null,
  },
]
// 채식주의자를 위한 음식 (일부만 표시)
const vegetarianFoods = [
  {
    foodName: "야채 볶음밥",
    category: "채식",
    reason: "다양한 채소로 만든 건강한 채식 요리입니다.",
    ingredients: ["쌀", "각종 채소", "간장", "참기름"],
    recipe: "1. 밥과 채소를 볶고 2. 간장과 참기름으로 간을 합니다.",
    weatherTags: ["sunny", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "콩고기 버거",
    category: "비건",
    reason: "동물성 재료 없이 맛있게 즐길 수 있는 비건 버거입니다.",
    ingredients: ["콩고기 패티", "채소", "비건 소스", "번"],
    recipe: "1. 콩고기 패티를 굽고 2. 채소와 소스를 넣어 완성합니다.",
    weatherTags: ["sunny", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "토마토 파스타",
    category: "채식",
    reason: "신선한 토마토의 상큼함이 느껴지는 건강한 파스타입니다.",
    ingredients: ["파스타면", "토마토", "마늘", "올리브 오일", "바질"],
    recipe: "1. 파스타를 삶고 2. 토마토 소스를 만들어 함께 볶습니다.",
    imageUrl: null,
  },
  {
    foodName: "버섯 리소토",
    category: "채식",
    reason: "버섯의 풍미가 가득한 크리미한 이탈리아 요리입니다.",
    ingredients: ["쌀", "버섯", "양파", "화이트 와인", "파마산 치즈"],
    recipe: "1. 쌀을 볶고 2. 육수를 조금씩 넣어가며 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "팔라펠",
    category: "비건",
    reason: "중동의 대표적인 비건 음식으로 바삭하고 향긋한 맛이 특징입니다.",
    ingredients: ["병아리콩", "양파", "마늘", "파슬리", "쿠민"],
    recipe: "1. 재료를 갈아서 반죽하고 2. 동그랗게 빚어 튀깁니다.",
    imageUrl: null,
  },
  {
    foodName: "채소 카레",
    category: "채식",
    reason: "다양한 채소와 향신료의 조화가 일품인 건강한 카레입니다.",
    ingredients: ["감자", "당근", "양파", "카레 가루", "코코넛 밀크"],
    recipe: "1. 채소를 볶고 2. 카레 가루와 코코넛 밀크를 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "두부 김치",
    category: "채식",
    reason: "부드러운 두부와 매콤한 김치의 조화가 일품인 한국식 채식 요리입니다.",
    ingredients: ["두부", "김치", "파", "참기름", "깨"],
    recipe: "1. 두부를 썰고 2. 김치와 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "아보카도 샐러드",
    category: "비건",
    reason: "영양가 높은 아보카도와 신선한 채소의 조합이 일품인 건강한 샐러드입니다.",
    ingredients: ["아보카도", "토마토", "양파", "레몬즙", "올리브 오일"],
    recipe: "1. 재료를 썰고 2. 레몬즙과 올리브 오일로 간을 합니다.",
    imageUrl: null,
  },
  {
    foodName: "렌틸 수프",
    category: "비건",
    reason: "단백질이 풍부한 렌틸콩으로 만든 영양가 높은 수프입니다.",
    ingredients: ["렌틸콩", "당근", "양파", "토마토", "향신료"],
    recipe: "1. 채소를 볶고 2. 렌틸콩과 물을 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "가지 구이",
    category: "채식",
    reason: "구운 가지의 부드러운 식감과 풍부한 맛이 일품인 건강한 채식 요리입니다.",
    ingredients: ["가지", "올리브 오일", "마늘", "레몬즙", "파슬리"],
    recipe: "1. 가지를 썰어 2. 올리브 오일을 발라 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "비건 라자냐",
    category: "비건",
    reason: "동물성 재료 없이 만든 풍미 가득한 이탈리아 오븐 요리입니다.",
    ingredients: ["라자냐 면", "토마토 소스", "두부 리코타", "시금치", "버섯"],
    recipe: "1. 소스와 면을 층층이 쌓고 2. 오븐에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "채소 탕수",
    category: "채식",
    reason: "바삭하게 튀긴 채소와 새콤달콤한 소스의 조화가 일품인 중국식 채식 요리입니다.",
    ingredients: ["브로콜리", "당근", "양파", "식초", "설탕"],
    recipe: "1. 채소를 튀기고 2. 소스를 만들어 부어 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "비건 초밥",
    category: "비건",
    reason: "동물성 재료 없이 다양한 채소로 만든 건강한 비건 초밥입니다.",
    ingredients: ["쌀", "식초", "아보카도", "오이", "당근"],
    recipe: "1. 밥에 식초를 섞고 2. 채소를 올려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "호박 스프",
    category: "채식",
    reason: "호박의 자연스러운 단맛과 부드러운 식감이 일품인 건강한 스프입니다.",
    ingredients: ["호박", "양파", "마늘", "우유", "향신료"],
    recipe: "1. 채소를 볶고 2. 물을 넣어 끓인 후 3. 믹서에 갈아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "비건 쿠키",
    category: "비건",
    reason: "동물성 재료 없이 만든 바삭하고 달콤한 디저트입니다.",
    ingredients: ["밀가루", "식물성 버터", "설탕", "바닐라 추출물", "초콜릿 칩"],
    recipe: "1. 반죽을 만들고 2. 동그랗게 빚어 오븐에 굽습니다.",
    imageUrl: null,
  },
]
// 다이어트를 위한 음식 (일부만 표시)
const dietFoods = [
  {
    foodName: "닭가슴살 샐러드",
    category: "다이어트",
    reason: "고단백 저지방의 건강한 다이어트 식단입니다.",
    ingredients: ["닭가슴살", "양상추", "토마토", "오이", "발사믹 드레싱"],
    recipe: "1. 닭가슴살을 삶아서 찢고 2. 채소와 함께 드레싱을 뿌려 먹습니다.",
    weatherTags: ["sunny", "hot"],
    imageUrl: null,
  },
  {
    foodName: "두부 스테이크",
    category: "다이어트",
    reason: "고단백 저칼로리의 건강한 식단입니다.",
    ingredients: ["두부", "양념", "올리브 오일", "채소"],
    recipe: "1. 두부를 으깨서 양념과 섞고 2. 패티 모양으로 만들어 구워 먹습니다.",
    weatherTags: ["sunny", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "닭가슴살 샐러드",
    category: "다이어트",
    reason: "저지방 고단백 닭가슴살과 신선한 채소가 어우러져 가볍게 즐기기 좋은 음식입니다.",
    ingredients: ["닭가슴살", "양상추", "방울토마토", "아보카도", "올리브오일"],
    recipe: "1. 닭가슴살을 구워 한입 크기로 자르고 2. 채소와 함께 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "고구마",
    category: "다이어트",
    reason: "식이섬유가 풍부하고 포만감이 높아 다이어트 간식으로 적합한 식품입니다.",
    ingredients: ["고구마"],
    recipe: "1. 고구마를 찌거나 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "오트밀",
    category: "다이어트",
    reason: "식이섬유가 풍부해 포만감을 주고 소화에 좋은 건강식입니다.",
    ingredients: ["오트밀", "우유", "견과류", "바나나", "꿀"],
    recipe: "1. 오트밀을 우유에 불려 2. 견과류와 과일을 올려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "두부 샐러드",
    category: "다이어트",
    reason: "부드러운 두부와 신선한 채소가 어우러져 단백질 보충에 좋은 음식입니다.",
    ingredients: ["두부", "양상추", "방울토마토", "올리브오일", "참깨 드레싱"],
    recipe: "1. 두부를 한입 크기로 썰고 2. 채소와 함께 접시에 담아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "현미밥",
    category: "다이어트",
    reason: "식이섬유가 풍부하고 혈당을 천천히 올려 다이어트에 좋은 곡물입니다.",
    ingredients: ["현미"],
    recipe: "1. 현미를 물에 불려 2. 밥을 지어 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "연어 샐러드",
    category: "다이어트",
    reason: "오메가-3가 풍부한 연어와 신선한 채소가 균형 잡힌 영양을 제공합니다.",
    ingredients: ["훈제 연어", "양상추", "아보카도", "올리브오일", "레몬즙"],
    recipe: "1. 연어를 채소와 함께 섞고 2. 드레싱을 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "그릭 요거트",
    category: "다이어트",
    reason: "단백질이 풍부하고 장 건강에 좋은 유산균이 함유된 건강 간식입니다.",
    ingredients: ["그릭 요거트", "블루베리", "아몬드", "꿀", "치아씨드"],
    recipe: "1. 요거트에 과일과 견과류를 올려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "닭가슴살 스테이크",
    category: "다이어트",
    reason: "고단백 저지방 닭가슴살을 맛있게 즐길 수 있는 다이어트 요리입니다.",
    ingredients: ["닭가슴살", "양파", "계란", "올리브오일", "후추"],
    recipe: "1. 닭가슴살을 다져 양념한 후 2. 팬에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "아보카도 토스트",
    category: "다이어트",
    reason: "불포화지방산이 풍부한 아보카도와 통곡물 빵이 건강한 포만감을 줍니다.",
    ingredients: ["아보카도", "호밀빵", "방울토마토", "올리브오일", "레몬즙"],
    recipe: "1. 아보카도를 으깨 빵 위에 올리고 2. 토마토를 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "메밀국수",
    category: "다이어트",
    reason: "칼로리가 낮고 포만감이 높은 메밀면으로 만든 가벼운 한 끼 식사입니다.",
    ingredients: ["메밀면", "간장", "무즙", "쪽파", "김가루"],
    recipe: "1. 메밀면을 삶아 찬물에 헹군 후 2. 간장 소스를 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "채소 스틱과 허머스",
    category: "다이어트",
    reason: "신선한 채소와 병아리콩으로 만든 허머스가 영양 균형을 맞춰 줍니다.",
    ingredients: ["당근", "오이", "파프리카", "병아리콩", "올리브오일"],
    recipe: "1. 허머스를 만들고 2. 채소를 스틱 형태로 잘라 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "스무디 볼",
    category: "다이어트",
    reason: "신선한 과일과 견과류를 곁들인 한 끼 대용 스무디입니다.",
    ingredients: ["바나나", "블루베리", "그릭 요거트", "치아씨드", "그래놀라"],
    recipe: "1. 재료를 블렌더에 갈고 2. 토핑을 올려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "브로콜리 볶음",
    category: "다이어트",
    reason: "식이섬유와 항산화 성분이 풍부한 브로콜리를 간단하게 조리한 요리입니다.",
    ingredients: ["브로콜리", "마늘", "올리브오일", "소금", "후추"],
    recipe: "1. 브로콜리를 데친 후 2. 마늘과 함께 볶아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "콩 샐러드",
    category: "다이어트",
    reason: "단백질과 식이섬유가 풍부한 콩을 활용한 가벼운 샐러드입니다.",
    ingredients: ["병아리콩", "렌틸콩", "양상추", "방울토마토", "발사믹 소스"],
    recipe: "1. 콩을 삶아 채소와 함께 섞고 2. 소스를 뿌려 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "가지구이",
    category: "다이어트",
    reason: "칼로리가 낮고 풍미가 좋은 가지를 활용한 건강식입니다.",
    ingredients: ["가지", "올리브오일", "간장", "마늘", "파슬리"],
    recipe: "1. 가지를 썰어 팬에 굽고 2. 양념을 곁들여 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "새우 아보카도 샐러드",
    category: "다이어트",
    reason: "고단백 새우와 건강한 지방이 함유된 아보카도를 함께 즐기는 샐러드입니다.",
    ingredients: ["새우", "아보카도", "양상추", "방울토마토", "올리브오일"],
    recipe: "1. 새우를 익히고 2. 채소와 함께 곁들여 완성합니다.",
    imageUrl: null,
  },
]
// 할랄 음식 (일부만 표시)
const halalFoods = [
  {
    foodName: "할랄 치킨 커리",
    category: "할랄",
    reason: "할랄 인증된 재료로 만든 맛있는 커리 요리입니다.",
    ingredients: ["할랄 치킨", "양파", "토마토", "향신료", "코코넛 밀크"],
    recipe: "1. 할랄 치킨을 향신료와 함께 볶고 2. 코코넛 밀크를 넣어 끓입니다.",
    weatherTags: ["cold", "rainy", "cloudy"],
    imageUrl: null,
  },
  {
    foodName: "쿠스쿠스 샐러드",
    category: "할랄",
    reason: "신선한 채소와 쿠스쿠스로 만든 건강한 할랄 요리입니다.",
    ingredients: ["쿠스쿠스", "토마토", "오이", "올리브 오일", "레몬즙"],
    recipe: "1. 쿠스쿠스를 삶고 2. 채소와 함께 올리브 오일과 레몬즙을 뿌려 먹습니다.",
    weatherTags: ["sunny", "hot"],
    imageUrl: null,
  },
  {
    foodName: "할랄 치킨 커리",
    category: "할랄",
    reason: "할랄 인증된 재료로 만든 맛있는 커리 요리입니다.",
    ingredients: ["할랄 치킨", "양파", "토마토", "향신료", "코코넛 밀크"],
    recipe: "1. 할랄 치킨을 향신료와 함께 볶��� 2. 코코넛 밀크를 넣어 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "쿠스쿠스 샐러드",
    category: "할랄",
    reason: "신선한 채소와 쿠스쿠스로 만든 건강한 할랄 요리입니다.",
    ingredients: ["쿠스쿠스", "토마토", "오이", "올리브 오일", "레몬즙"],
    recipe: "1. 쿠스쿠스를 삶고 2. 채소와 함께 올리브 오일과 레몬즙을 뿌려 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "케밥",
    category: "할랄",
    reason: "할랄 인증된 고기와 신선한 채소가 어우러진 중동의 대표적인 요리입니다.",
    ingredients: ["할랄 고기", "양파", "토마토", "요거트 소스", "피타 빵"],
    recipe: "1. 고기를 구워 썰고 2. 피타 빵에 채소와 함께 싸서 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "비리야니",
    category: "할랄",
    reason: "향신료가 풍부한 쌀과 할랄 고기의 조화가 일품인 인도-파키스탄 요리입니다.",
    ingredients: ["바스마티 쌀", "할랄 고기", "양파", "향신료", "요거트"],
    recipe: "1. 고기를 양념해 볶고 2. 쌀과 함께 찌듯이 익힙니다.",
    imageUrl: null,
  },
  {
    foodName: "무사카",
    category: "할랄",
    reason: "가지와 할랄 고기의 조화가 일품인 중동 및 지중해 요리입니다.",
    ingredients: ["가지", "할랄 고기", "토마토 소스", "양파", "향신료"],
    recipe: "1. 가지를 구워 깔고 2. 고기 소스를 올려 오븐에 굽습니다.",
    imageUrl: null,
  },
  {
    foodName: "할랄 햄버거",
    category: "할랄",
    reason: "할랄 인증된 고기로 만든 패티와 신선한 채소의 조화가 일품인 패스트푸드입니다.",
    ingredients: ["할랄 소고기", "빵", "양상추", "토마토", "치즈"],
    recipe: "1. 패티를 구워 2. 빵에 채소와 함께 쌓아 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "할랄 쇠고기 스튜",
    category: "할랄",
    reason: "할랄 인증된 쇠고기와 채소로 만든 진한 맛의 스튜입니다.",
    ingredients: ["할랄 쇠고기", "감자", "당근", "양파", "토마토"],
    recipe: "1. 고기를 볶고 2. 채소와 함께 오래 끓입니다.",
    imageUrl: null,
  },
  {
    foodName: "할랄 치킨 샤워마",
    category: "할랄",
    reason: "할랄 인증된 닭고기와 향신료의 조화가 일품인 중동의 대표 요리입니다.",
    ingredients: ["할랄 닭고기", "향신료", "피타 빵", "양파", "토마토"],
    recipe: "1. 닭고기를 양념해 구우고 2. 피타 빵에 채소와 함께 싸서 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "할랄 양고기 탕수",
    category: "할랄",
    reason: "할랄 인증된 양고기와 새콤달콤한 소스의 조화가 일품인 중국식 할랄 요리입니다.",
    ingredients: ["할랄 양고기", "튀김가루", "파인애플", "피망", "식초"],
    recipe: "1. 고기를 튀기고 2. 소스를 만들어 부어 먹습니다.",
    imageUrl: null,
  },
  {
    foodName: "할랄 치킨 티카",
    category: "할랄",
    reason: "할랄 인증된 닭고기와 요거트, 향신료의 조화가 일품인 인도의 대표 요리입니다.",
    ingredients: ["할랄 닭고기", "요거트", "레몬즙", "향신료", "마늘"],
    recipe: "1. 닭고기를 양념에 재우고 2. 오븐에 구워 완성합니다.",
    imageUrl: null,
  },
  {
    foodName: "할랄 만두",
    category: "할랄",
    reason: "할랄 인증된 고기와 채소로 속을 채운 아시아식 만두입니다.",
    ingredients: ["할랄 고기", "양배추", "부추", "마늘", "생강"],
    recipe: "1. 소를 만들고 2. 만두피에 싸서 찌거나 굽습니다.",
    imageUrl: null,
  },
]

type RecommendationInput = {
  mood?: string
  weather?: string
  dietaryPreferences: string[]
  withWhom?: string
  allergies?: string[]
  clientApiKey?: string
}
// 날씨에 맞는 음식 필터링 함수
function filterFoodsByWeather(foods: any[], weather: string): any[] {
  if (!weather) return foods

  return foods.filter((food) => {
    // weatherTags가 없는 경우 모든 날씨에 적합하다고 가정
    if (!food.weatherTags) return true

    return food.weatherTags.includes(weather)
  })
}
// 최적화된 추천 함수 - 식이제한과 날씨 고려
export async function getRecommendation(input: RecommendationInput) {
  // 즉시 ID 생성
  const id = uuidv4()
  const timestamp = new Date().toISOString()

  // 식이 제한 사항 확인 (단순화된 로직)
  let foodPool

  // 식이 제한에 따른 음식 선택 (우선순위 적용)
  if (input.dietaryPreferences.includes("vegan")) {
    // 비건 음식 선택
    foodPool = vegetarianFoods.filter((food) => food.category === "비건")
  } else if (input.dietaryPreferences.includes("vegetarian")) {
    // 채식 음식 선택
    foodPool = vegetarianFoods
  } else if (input.dietaryPreferences.includes("halal")) {
    // 할랄 음식 선택
    foodPool = halalFoods
  } else if (input.dietaryPreferences.includes("diet")) {
    // 다이어트 음식 선택
    foodPool = dietFoods
  } else {
    // 일반 음식 선택
    foodPool = regularFoods
  }
  // 날씨에 맞는 음식 필터링
  if (input.weather) {
    const weatherFilteredFoods = filterFoodsByWeather(foodPool, input.weather)
    // 날씨에 맞는 음식이 있으면 그 중에서 선택, 없으면 전체 풀에서 선택
    if (weatherFilteredFoods.length > 0) {
      foodPool = weatherFilteredFoods
    }
  }
  // 랜덤 선택
  const foodData = foodPool[Math.floor(Math.random() * foodPool.length)]
  // 추천 객체 생성
  const recommendation = {
    id,
    timestamp,
    ...foodData,
    input,
  }
  // 추천 목록에 추가
  recommendations.unshift(recommendation)

  // 최대 10개만 유지
  if (recommendations.length > 10) {
    recommendations = recommendations.slice(0, 10)
  }
  // 경로 갱신
  revalidatePath("/")

  // 전체 추천 객체 반환 (ID만 반환하지 않고)
  return recommendation
}

// 별점 평가 저장을 위한 인메모리 저장소
const ratings: { id: string; rating: number; timestamp: string }[] = []

// 별점 평가 저장 함수
export async function saveRating(id: string, rating: number, feedback?: string) {
  const timestamp = new Date().toISOString()

  // 이미 평가한 항목인지 확인
  const existingRatingIndex = ratings.findIndex((r) => r.id === id)

  if (existingRatingIndex >= 0) {
    // 기존 평가 업데이트
    ratings[existingRatingIndex] = { id, rating, feedback, timestamp }
  } else {
    // 새 평가 추가
    ratings.push({ id, rating, feedback, timestamp })
  }

  // 추천 객체에도 평가 정보 추가
  const recommendation = recommendations.find((rec) => rec.id === id)
  if (recommendation) {
    recommendation.rating = rating
    recommendation.feedback = feedback
  }

  // 경로 갱신
  revalidatePath("/recommendation")

  return { success: true }
}

// 다시 추천받기 함수 개선
export async function getNewRecommendation(previousInput: RecommendationInput) {
  // 이전 입력값을 그대로 사용하여 새로운 추천 생성
  return getRecommendation(previousInput)
}

export async function getRecentRecommendations() {
  // 최근 추천 목록 반환 (최대 5개)
  return recommendations.slice(0, 5).map((rec) => ({
    id: rec.id,
    foodName: rec.foodName,
    timestamp: rec.timestamp,
  }))
}

export async function getRecommendationById(id: string) {
  // ID로 추천 결과 찾기
  return recommendations.find((rec) => rec.id === id)
}
