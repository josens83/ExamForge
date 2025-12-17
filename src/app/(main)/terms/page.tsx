import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">이용약관</h1>
        <p className="text-muted-foreground">최종 수정일: 2024년 1월 1일</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제1조 (목적)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              이 약관은 ExamForge(이하 &quot;회사&quot;)가 제공하는 온라인 교육
              서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 회원 간의
              권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
              합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제2조 (정의)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. &quot;서비스&quot;란 회사가 제공하는 온라인 강의, 문제풀이,
              모의고사, AI 튜터 등 교육 관련 일체의 서비스를 말합니다.
            </p>
            <p>
              2. &quot;회원&quot;이란 회사와 서비스 이용계약을 체결하고 회원
              아이디를 부여받아 서비스를 이용하는 자를 말합니다.
            </p>
            <p>
              3. &quot;아이디(ID)&quot;란 회원의 식별과 서비스 이용을 위하여
              회원이 설정하고 회사가 승인한 이메일 주소를 말합니다.
            </p>
            <p>
              4. &quot;비밀번호&quot;란 회원의 동일성 확인과 회원 정보의 보호를
              위하여 회원이 설정한 문자와 숫자의 조합을 말합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제3조 (약관의 게시와 개정)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기
              화면에 게시합니다.
            </p>
            <p>
              2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을
              개정할 수 있습니다.
            </p>
            <p>
              3. 회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여
              현행 약관과 함께 서비스 초기 화면에 그 적용일자 7일 이전부터
              적용일자 전일까지 공지합니다.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제4조 (서비스의 제공)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>온라인 강의 서비스</li>
              <li>문제풀이 및 모의고사 서비스</li>
              <li>AI 튜터 학습 지원 서비스</li>
              <li>학습 분석 및 통계 서비스</li>
              <li>커뮤니티 및 스터디 그룹 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제5조 (회원가입)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. 회원가입은 이용자가 이 약관의 내용에 동의를 한 다음 회원가입
              양식에 따라 회원정보를 기입하고, &quot;가입&quot; 버튼을 누르는
              방법으로 합니다.
            </p>
            <p>
              2. 회사는 다음 각 호에 해당하는 회원가입 신청에 대해서는 승인을
              하지 않거나 사후에 이용계약을 해지할 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
              <li>허위의 정보를 기재하거나, 필수 정보를 기재하지 않은 경우</li>
              <li>이전에 회원자격을 상실한 적이 있는 경우</li>
              <li>기타 회원으로 등록하는 것이 부적절하다고 판단되는 경우</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제6조 (회원 탈퇴 및 자격 상실)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. 회원은 언제든지 서비스 내 설정 메뉴를 통해 탈퇴를 요청할 수
              있으며, 회사는 즉시 회원 탈퇴를 처리합니다.
            </p>
            <p>
              2. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원 자격을
              제한 및 정지시킬 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>가입 신청 시 허위 내용을 등록한 경우</li>
              <li>
                다른 사람의 서비스 이용을 방해하거나 정보를 도용하는 등
                전자거래질서를 위협하는 경우
              </li>
              <li>
                서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에
                반하는 행위를 하는 경우
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제7조 (결제 및 환불)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. 유료 서비스의 이용요금은 서비스 내에 명시된 금액으로 하며,
              결제는 신용카드, 계좌이체, 간편결제 등 회사가 정한 방법으로 할 수
              있습니다.
            </p>
            <p>
              2. 환불은 다음 기준에 따라 진행됩니다:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                결제 후 7일 이내, 콘텐츠 이용률 10% 미만: 전액 환불
              </li>
              <li>
                결제 후 7일 초과 또는 이용률 10% 이상: 잔여 기간 일할 계산 환불
              </li>
              <li>
                이벤트/프로모션 상품: 해당 이벤트 조건에 따름
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제8조 (저작권)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. 서비스 내 모든 콘텐츠(강의, 문제, 교재 등)의 저작권은 회사에
              귀속됩니다.
            </p>
            <p>
              2. 회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이
              복제, 전송, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로
              이용하거나 제3자에게 이용하게 할 수 없습니다.
            </p>
            <p>
              3. 회원이 작성한 게시물의 저작권은 해당 회원에게 귀속됩니다. 다만,
              회사는 서비스 운영, 개선, 홍보 등의 목적으로 회원의 게시물을
              이용할 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>제9조 (면책조항)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. 회사는 천재지변, 전쟁, 테러, 해킹 등 불가항력적인 사유로
              서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.
            </p>
            <p>
              2. 회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여는 책임을
              지지 않습니다.
            </p>
            <p>
              3. 회사는 회원이 서비스를 통해 기대하는 효용(시험 합격 등)을
              보장하지 않습니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제10조 (분쟁해결)</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              1. 회사와 회원 간에 발생한 분쟁에 관한 소송은 서울중앙지방법원을
              제1심 관할법원으로 합니다.
            </p>
            <p>
              2. 회사와 회원 간에 제기된 소송에는 대한민국 법을 적용합니다.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>부칙</p>
        <p>이 약관은 2024년 1월 1일부터 시행합니다.</p>
      </div>
    </div>
  );
}
