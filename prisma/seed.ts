import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@examforge.kr" },
    update: {},
    create: {
      email: "demo@examforge.kr",
      name: "데모 사용자",
      password: hashedPassword,
      targetExam: "gosi_9",
      membership: "premium",
      points: 1500,
      level: 15,
      experience: 12500,
      currentStreak: 7,
      longestStreak: 30,
      totalStudyDays: 45,
    },
  });
  console.log("Created demo user:", demoUser.email);

  // Create instructor
  const instructor = await prisma.instructor.upsert({
    where: { id: "instructor-1" },
    update: {},
    create: {
      id: "instructor-1",
      name: "김행정",
      title: "행정법 전문강사",
      bio: "서울대학교 법학과 졸업, 10년 경력의 행정법 전문 강사입니다. 수많은 합격생을 배출한 검증된 커리큘럼으로 여러분의 합격을 도와드리겠습니다.",
      specialties: ["행정법", "헌법"],
      totalStudents: 15000,
      totalCourses: 12,
      avgRating: 4.8,
    },
  });
  console.log("Created instructor:", instructor.name);

  // Create sample questions
  const questions = [
    {
      examType: "gosi_9",
      subject: "admin_law",
      chapter: "행정행위",
      topic: "행정행위의 부관",
      type: "multiple_choice",
      content: "행정행위의 부관에 대한 설명으로 옳지 않은 것은? (다툼이 있는 경우 판례에 의함)",
      options: [
        { id: "1", content: "부담은 독립하여 쟁송의 대상이 될 수 있다", isCorrect: false },
        { id: "2", content: "조건은 행정행위의 효력 발생을 장래의 불확실한 사실에 의존케 하는 부관이다", isCorrect: false },
        { id: "3", content: "기한은 행정행위의 효력을 장래의 확실한 사실에 의존케 하는 부관이다", isCorrect: true },
        { id: "4", content: "철회권의 유보는 사후적 부관에 해당한다", isCorrect: false },
      ],
      correctAnswer: "3",
      explanation: "기한은 행정행위의 효력을 장래의 '확실한' 사실에 의존케 하는 부관이 아니라, 도래가 확실한 사실에 의존케 하는 부관입니다. 조건은 불확실한 사실(성취 여부 불명), 기한은 확실한 사실(도래 시기만 문제)에 의존합니다.",
      difficulty: 3,
      solveTime: 90,
      source: "9급 국가직",
      year: 2023,
      tags: ["부관", "조건", "기한"],
    },
    {
      examType: "gosi_9",
      subject: "constitutional_law",
      chapter: "기본권",
      topic: "기본권의 주체",
      type: "multiple_choice",
      content: "헌법상 기본권의 주체에 관한 설명으로 옳은 것은?",
      options: [
        { id: "1", content: "법인은 성질상 법인에게 적용될 수 있는 기본권에 한하여 기본권 주체가 된다", isCorrect: true },
        { id: "2", content: "외국인은 모든 기본권의 주체가 될 수 없다", isCorrect: false },
        { id: "3", content: "태아는 어떠한 경우에도 기본권의 주체가 될 수 없다", isCorrect: false },
        { id: "4", content: "공법인은 어떠한 경우에도 기본권의 주체가 될 수 없다", isCorrect: false },
      ],
      correctAnswer: "1",
      explanation: "법인도 성질상 법인에게 적용될 수 있는 기본권에 한하여 기본권의 주체가 됩니다. 외국인도 인간의 존엄과 가치, 신체의 자유 등 인간의 권리에 해당하는 기본권의 주체가 됩니다.",
      difficulty: 4,
      solveTime: 120,
      source: "7급 국가직",
      year: 2023,
      tags: ["기본권 주체", "법인", "외국인"],
    },
    {
      examType: "gosi_9",
      subject: "korean",
      chapter: "맞춤법",
      topic: "띄어쓰기",
      type: "multiple_choice",
      content: "밑줄 친 부분의 띄어쓰기가 옳은 것은?",
      options: [
        { id: "1", content: "너 밖에 없어", isCorrect: false },
        { id: "2", content: "그것 만큼 좋은 게 없다", isCorrect: false },
        { id: "3", content: "공부하는 것 외에는 관심이 없다", isCorrect: true },
        { id: "4", content: "네가 오기전에 떠났다", isCorrect: false },
      ],
      correctAnswer: "3",
      explanation: "'밖에'는 조사이므로 붙여 쓰고, '만큼'은 의존명사이므로 띄어 씁니다. '것 외에'는 의존명사 '것'과 조사 '외에'이므로 띄어 씁니다. '-기 전에'는 어미와 의존명사이므로 띄어 씁니다.",
      difficulty: 2,
      solveTime: 60,
      source: "9급 지방직",
      year: 2022,
      tags: ["띄어쓰기", "조사", "의존명사"],
    },
    {
      examType: "gosi_9",
      subject: "english",
      chapter: "독해",
      topic: "주제 찾기",
      type: "multiple_choice",
      content: "다음 글의 주제로 가장 적절한 것은?\n\nThe concept of emotional intelligence has gained significant attention in recent years. Unlike traditional IQ, which measures cognitive abilities, emotional intelligence focuses on one's ability to recognize, understand, and manage emotions—both one's own and those of others.",
      options: [
        { id: "1", content: "The definition of emotional intelligence", isCorrect: true },
        { id: "2", content: "How to improve traditional IQ", isCorrect: false },
        { id: "3", content: "The history of cognitive testing", isCorrect: false },
        { id: "4", content: "Managing workplace stress", isCorrect: false },
      ],
      correctAnswer: "1",
      explanation: "이 글은 감성 지능(emotional intelligence)의 개념을 정의하고 전통적인 IQ와 비교하여 설명하고 있습니다. 따라서 주제는 '감성 지능의 정의'입니다.",
      difficulty: 3,
      solveTime: 150,
      source: "9급 국가직",
      year: 2023,
      tags: ["주제 찾기", "감성 지능"],
    },
    {
      examType: "gosi_9",
      subject: "history",
      chapter: "조선시대",
      topic: "조선 후기",
      type: "multiple_choice",
      content: "조선 후기 사회 변화에 대한 설명으로 옳지 않은 것은?",
      options: [
        { id: "1", content: "신분제가 점차 동요하였다", isCorrect: false },
        { id: "2", content: "상품 화폐 경제가 발달하였다", isCorrect: false },
        { id: "3", content: "서민 문화가 성장하였다", isCorrect: false },
        { id: "4", content: "중앙 집권 체제가 강화되었다", isCorrect: true },
      ],
      correctAnswer: "4",
      explanation: "조선 후기에는 세도 정치로 인해 중앙 집권 체제가 오히려 약화되었습니다. 신분제 동요, 상품 화폐 경제 발달, 서민 문화 성장은 모두 조선 후기의 특징입니다.",
      difficulty: 3,
      solveTime: 90,
      source: "9급 국가직",
      year: 2023,
      tags: ["조선 후기", "사회 변화"],
    },
  ];

  for (const questionData of questions) {
    const question = await prisma.question.upsert({
      where: { id: `question-${questionData.examType}-${questionData.subject}-${questions.indexOf(questionData)}` },
      update: {},
      create: {
        id: `question-${questionData.examType}-${questionData.subject}-${questions.indexOf(questionData)}`,
        ...questionData,
        totalAttempts: Math.floor(Math.random() * 15000) + 5000,
        correctCount: Math.floor(Math.random() * 10000) + 3000,
        aiHints: [],
        relatedQuestions: [],
      },
    });
    console.log("Created question:", question.id);
  }

  // Create sample course
  const course = await prisma.course.upsert({
    where: { id: "course-1" },
    update: {},
    create: {
      id: "course-1",
      title: "2024 행정법 기본이론 완성",
      subtitle: "기초부터 심화까지 체계적인 강의",
      description: "행정법의 기본 개념부터 심화 내용까지 체계적으로 학습할 수 있는 강의입니다. 풍부한 판례와 함께 실전에서 필요한 내용을 완벽하게 정리해드립니다.",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      examType: "gosi_9",
      subject: "admin_law",
      level: "intermediate",
      instructorId: instructor.id,
      totalLessons: 48,
      totalDuration: 2400,
      originalPrice: 350000,
      salePrice: 249000,
      courseType: "recorded",
      enrollmentCount: 5678,
      rating: 4.8,
      reviewCount: 1234,
      completionRate: 78.5,
      includes: ["PDF 교재", "문제집", "1:1 질문"],
      isPublished: true,
    },
  });
  console.log("Created course:", course.title);

  // Create sample mock exam
  const mockExam = await prisma.mockExam.upsert({
    where: { id: "mock-exam-1" },
    update: {},
    create: {
      id: "mock-exam-1",
      title: "2024년 9급 공무원 모의고사 1회",
      examType: "gosi_9",
      year: 2024,
      round: 1,
      totalQuestions: 100,
      totalTime: 100,
      totalScore: 100,
      passingScore: 60,
      type: "practice",
      difficulty: "medium",
      isFree: true,
      participantCount: 3456,
      avgScore: 67.8,
    },
  });
  console.log("Created mock exam:", mockExam.title);

  // Create leagues
  const leagues = [
    { id: "league-bronze", name: "브론즈", tier: 1, minXP: 0, icon: "🥉", color: "#CD7F32" },
    { id: "league-silver", name: "실버", tier: 2, minXP: 500, icon: "🥈", color: "#C0C0C0" },
    { id: "league-gold", name: "골드", tier: 3, minXP: 1500, icon: "🥇", color: "#FFD700" },
    { id: "league-platinum", name: "플래티넘", tier: 4, minXP: 3000, icon: "💎", color: "#E5E4E2" },
    { id: "league-diamond", name: "다이아몬드", tier: 5, minXP: 5000, icon: "💠", color: "#B9F2FF" },
    { id: "league-master", name: "마스터", tier: 6, minXP: 8000, icon: "🏆", color: "#9400D3" },
    { id: "league-champion", name: "챔피언", tier: 7, minXP: 12000, icon: "👑", color: "#FF4500" },
  ];

  for (const leagueData of leagues) {
    await prisma.league.upsert({
      where: { id: leagueData.id },
      update: {},
      create: leagueData,
    });
  }
  console.log("Created leagues");

  // Create achievements
  const achievements = [
    { code: "streak_7", name: "일주일 전사", description: "7일 연속 학습", icon: "🔥", category: "streak", requirement: { type: "streak", value: 7 }, xpReward: 100, badgeColor: "bronze" },
    { code: "streak_30", name: "한달 마스터", description: "30일 연속 학습", icon: "⚡", category: "streak", requirement: { type: "streak", value: 30 }, xpReward: 500, badgeColor: "silver" },
    { code: "streak_100", name: "백일장", description: "100일 연속 학습", icon: "💫", category: "streak", requirement: { type: "streak", value: 100 }, xpReward: 2000, badgeColor: "gold" },
    { code: "solve_100", name: "백문백답", description: "100문제 풀기", icon: "📝", category: "quantity", requirement: { type: "total_solved", value: 100 }, xpReward: 100, badgeColor: "bronze" },
    { code: "solve_1000", name: "천문일답", description: "1,000문제 풀기", icon: "📚", category: "quantity", requirement: { type: "total_solved", value: 1000 }, xpReward: 500, badgeColor: "silver" },
    { code: "accuracy_80", name: "정확 사수", description: "정답률 80% 달성", icon: "🎯", category: "accuracy", requirement: { type: "accuracy", value: 80 }, xpReward: 200, badgeColor: "bronze" },
    { code: "first_exam", name: "첫 도전", description: "첫 모의고사 응시", icon: "🎪", category: "special", requirement: { type: "mock_exam", value: 1 }, xpReward: 100, badgeColor: "bronze" },
    { code: "early_bird", name: "얼리버드", description: "오전 6시 이전 학습", icon: "🌅", category: "special", requirement: { type: "early_study", value: 6 }, xpReward: 50, badgeColor: "bronze" },
  ];

  for (const achievementData of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievementData.code },
      update: {},
      create: achievementData,
    });
  }
  console.log("Created achievements");

  // Create daily challenge
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyChallenge.upsert({
    where: { date: today },
    update: {},
    create: {
      date: today,
      title: "50문제 챌린지",
      description: "오늘 50문제를 풀어보세요",
      type: "questions",
      requirement: { count: 50, subject: "all" },
      xpReward: 200,
      bonusReward: { type: "streak_freeze", count: 1 },
    },
  });
  console.log("Created daily challenge");

  // Create study group
  const studyGroup = await prisma.studyGroup.upsert({
    where: { id: "study-group-1" },
    update: {},
    create: {
      id: "study-group-1",
      name: "9급 공무원 합격반",
      description: "함께 공부하고 합격을 목표로 하는 스터디 그룹입니다. 매일 인증과 질문을 공유해요!",
      examType: "gosi_9",
      isPublic: true,
      maxMembers: 50,
      creatorId: demoUser.id,
    },
  });
  console.log("Created study group:", studyGroup.name);

  // Create user inventory
  await prisma.userInventory.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      streakFreezes: 2,
      doubleXPHours: 5,
      premiumDays: 0,
    },
  });
  console.log("Created user inventory");

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
