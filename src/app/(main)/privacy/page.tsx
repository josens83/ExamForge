import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">개인정보처리방침</h1>
        <p className="text-muted-foreground">최종 수정일: 2024년 1월 1일</p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. 개인정보의 처리 목적</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              ExamForge(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를
              처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는
              이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는
              등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>회원가입 및 관리:</strong> 회원제 서비스 이용에 따른
                본인확인, 개인식별, 불량회원의 부정이용 방지, 가입의사 확인,
                연령확인, 불만처리 등 민원처리
              </li>
              <li>
                <strong>서비스 제공:</strong> 콘텐츠 제공, 맞춤형 서비스 제공,
                본인인증, 결제 및 정산
              </li>
              <li>
                <strong>마케팅 및 광고:</strong> 신규 서비스 개발 및 특화,
                이벤트 등 광고성 정보 전달, 인구통계학적 특성에 따른 서비스 제공
                및 광고 게재
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. 수집하는 개인정보 항목</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <div>
              <p className="font-medium mb-2">필수항목</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>이메일 주소, 비밀번호, 이름</li>
                <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">선택항목</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>휴대전화번호, 프로필 사진</li>
                <li>목표 시험, 목표 시험일, 목표 점수</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">결제 시 추가 수집</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>신용카드 정보, 계좌 정보 (결제대행사를 통해 처리)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. 개인정보의 처리 및 보유기간</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터
              개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서
              개인정보를 처리·보유합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>회원정보:</strong> 회원 탈퇴 시까지 (단, 관계 법령 위반에
                따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지)
              </li>
              <li>
                <strong>계약 또는 청약철회 등에 관한 기록:</strong> 5년
              </li>
              <li>
                <strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년
              </li>
              <li>
                <strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년
              </li>
              <li>
                <strong>접속에 관한 기록:</strong> 3개월
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. 개인정보의 제3자 제공</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              회사는 원칙적으로 정보주체의 개인정보를 수집·이용 목적으로 명시한
              범위 내에서 처리하며, 정보주체의 사전 동의 없이는 본래의 목적
              범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 다만,
              다음의 경우에는 개인정보를 제3자에게 제공할 수 있습니다:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>정보주체로부터 별도의 동의를 받은 경우</li>
              <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위해
                불가피한 경우</li>
              <li>정보주체 또는 그 법정대리인이 의사표시를 할 수 없는 상태에
                있거나 주소불명 등으로 사전 동의를 받을 수 없는 경우로서
                명백히 정보주체 또는 제3자의 급박한 생명, 신체, 재산의 이익을
                위하여 필요하다고 인정되는 경우</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. 개인정보처리 위탁</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보
              처리업무를 위탁하고 있습니다:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border mt-4">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-4 py-2 text-left">수탁업체</th>
                    <th className="border px-4 py-2 text-left">위탁업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">토스페이먼츠</td>
                    <td className="border px-4 py-2">결제 처리</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">AWS</td>
                    <td className="border px-4 py-2">클라우드 서버 운영</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">Anthropic</td>
                    <td className="border px-4 py-2">AI 튜터 서비스</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. 정보주체의 권리·의무</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호
              관련 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리정지 요구</li>
            </ul>
            <p className="mt-4">
              위 권리 행사는 서비스 내 설정 메뉴를 통해 직접 하시거나, 서면,
              전화, 이메일 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체
              없이 조치하겠습니다.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. 개인정보의 안전성 확보 조치</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를
              취하고 있습니다:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <strong>관리적 조치:</strong> 내부관리계획 수립·시행, 정기적
                직원 교육
              </li>
              <li>
                <strong>기술적 조치:</strong> 개인정보처리시스템 등의 접근권한
                관리, 접근통제시스템 설치, 고유식별정보 등의 암호화,
                보안프로그램 설치
              </li>
              <li>
                <strong>물리적 조치:</strong> 전산실, 자료보관실 등의 접근통제
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. 쿠키의 사용</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해
              &apos;쿠키(cookie)&apos;를 사용합니다. 쿠키는 웹사이트를 운영하는데
              이용되는 서버가 이용자의 브라우저에게 보내는 아주 작은 텍스트
              파일로 이용자 컴퓨터의 하드디스크에 저장됩니다.
            </p>
            <p>
              이용자는 웹 브라우저의 옵션 설정을 통해 모든 쿠키를 허용하거나,
              쿠키가 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할
              수 있습니다. 다만, 쿠키의 저장을 거부할 경우 맞춤형 서비스 이용에
              어려움이 있을 수 있습니다.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. 개인정보 보호책임자</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보
              처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <p><strong>개인정보 보호책임자</strong></p>
              <p>성명: 김개인</p>
              <p>직책: CTO</p>
              <p>연락처: privacy@examforge.co.kr</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. 개인정보처리방침의 변경</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-2">
            <p>
              이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다. 법령 및 방침에
              따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의
              시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-sm text-muted-foreground">
        <p>이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.</p>
      </div>
    </div>
  );
}
