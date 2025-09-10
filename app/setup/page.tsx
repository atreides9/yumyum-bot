import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFE1C6] to-[#FFCBA4]">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-[#994D25] hover:text-[#FF6B35] mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          돌아가기
        </Link>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="bg-[#FF6B35] text-white rounded-t-lg">
            <CardTitle>환경 변수 설정 안내</CardTitle>
            <CardDescription className="text-white/80">냠냠봇을 사용하기 위한 API 키 설정 방법</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#994D25] mb-2">OpenAI API 키 설정</h2>
              <p className="mb-4">
                냠냠봇은 음식 추천을 위해 OpenAI API를 사용합니다. 다음 단계에 따라 API 키를 설정해주세요:
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>
                  <a
                    href="https://platform.openai.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    OpenAI 계정 생성
                  </a>
                  (이미 계정이 있다면 로그인)
                </li>
                <li>
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    API 키 생성 페이지
                  </a>
                  에서 새 API 키 생성
                </li>
                <li>생성된 API 키를 복사</li>
                <li>
                  다음 두 가지 방법 중 하나로 API 키 설정:
                  <ul className="list-disc list-inside pl-4 mt-2">
                    <li className="mt-1">
                      <strong>방법 1:</strong> 프로젝트 루트에{" "}
                      <code className="bg-gray-100 px-1 rounded">.env.local</code> 파일을 생성하고 다음 내용 추가:
                      <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">OPENAI_API_KEY=your_api_key_here</pre>
                    </li>
                    <li className="mt-2">
                      <strong>방법 2:</strong> 메인 페이지에서 API 키 입력 폼을 통해 브라우저에 임시 저장 (개발
                      목적으로만 사용)
                    </li>
                  </ul>
                </li>
              </ol>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#994D25] mb-2">OpenWeatherMap API 키 설정 (선택사항)</h2>
              <p className="mb-4">실시간 날씨 정보를 가져오기 위해 OpenWeatherMap API를 사용할 수 있습니다:</p>
              <ol className="list-decimal list-inside space-y-2 pl-4">
                <li>
                  <a
                    href="https://home.openweathermap.org/users/sign_up"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    OpenWeatherMap 계정 생성
                  </a>
                </li>
                <li>계정 생성 후 API 키 발급</li>
                <li>
                  <code className="bg-gray-100 px-1 rounded">.env.local</code> 파일에 다음 내용 추가:
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">OPENWEATHERMAP_API_KEY=your_api_key_here</pre>
                </li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">참고 사항</h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>API 키는 민감한 정보이므로 공개 저장소에 업로드하지 마세요.</li>
                <li>브라우저에 임시 저장된 API 키는 개발 목적으로만 사용하세요.</li>
                <li>프로덕션 환경에서는 환경 변수나 안전한 비밀 관리 서비스를 사용하세요.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
