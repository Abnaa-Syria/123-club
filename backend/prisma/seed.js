const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { generateMemberId, generateReferralCode, generateOrderNumber, addDays } = require("../src/utils/helpers");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FULL seed for 123 Club...");

  // 0) Clean database (order matters due to foreign keys)
  await prisma.$transaction([
    prisma.adminActivityLog.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.pointsTransaction.deleteMany(),
    prisma.pointsWallet.deleteMany(),
    prisma.membershipCard.deleteMany(),
    prisma.membershipPlan.deleteMany(), // Added this!
    prisma.userAvatar.deleteMany(),
    prisma.avatar.deleteMany(),
    prisma.contentItem.deleteMany(),
    prisma.contentCategory.deleteMany(),
    prisma.product.deleteMany(),
    prisma.productCategory.deleteMany(),
    prisma.banner.deleteMany(),
    prisma.referral.deleteMany(),
    prisma.staticPage.deleteMany(),
    prisma.fAQ.deleteMany(),
    prisma.appSetting.deleteMany(),
    prisma.deviceToken.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // 1) Membership plans
  const plansData = [
    {
      name: "Bronze Plan",
      slug: "bronze-plan",
      level: "BRONZE",
      price: 0,
      durationDays: 365,
      benefits: "Basic access to all content, 100 signup points",
      pointsBonus: 100,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Silver Plan",
      slug: "silver-plan",
      level: "SILVER",
      price: 9.99,
      durationDays: 365,
      benefits: "Enhanced access, priority support, 250 bonus points",
      pointsBonus: 250,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Gold Plan",
      slug: "gold-plan",
      level: "GOLD",
      price: 19.99,
      durationDays: 365,
      benefits: "Premium access, exclusive content, 500 bonus points",
      pointsBonus: 500,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "Platinum Plan",
      slug: "platinum-plan",
      level: "PLATINUM",
      price: 49.99,
      durationDays: 365,
      benefits: "All access, VIP features, 1000 bonus points",
      pointsBonus: 1000,
      isActive: true,
      sortOrder: 4,
    },
  ];

  const [bronzePlan, silverPlan, goldPlan, platinumPlan] = await Promise.all(
    plansData.map((p) =>
      prisma.membershipPlan.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      })
    )
  );

  // 2) Avatars
  const avatars = await prisma.$transaction([
    prisma.avatar.create({ data: { name: "Cool Cat", imageUrl: "/uploads/avatars/cool-cat.png", description: "A cool cat character", isActive: true, sortOrder: 1 } }),
    prisma.avatar.create({ data: { name: "Smart Owl", imageUrl: "/uploads/avatars/smart-owl.png", description: "A wise owl character", isActive: true, sortOrder: 2 } }),
    prisma.avatar.create({ data: { name: "Happy Dog", imageUrl: "/uploads/avatars/happy-dog.png", description: "A happy dog character", isActive: true, sortOrder: 3 } }),
    prisma.avatar.create({ data: { name: "Brave Lion", imageUrl: "/uploads/avatars/brave-lion.png", description: "A brave lion character", isActive: true, sortOrder: 4 } }),
  ]);

  // 3) Content categories & items
  const categoriesData = [
    { name: "Educational Videos", slug: "educational-videos", type: "VIDEO", description: "Learn through fun videos", isActive: true, sortOrder: 1 },
    { name: "Bedtime Stories", slug: "bedtime-stories", type: "BOOK_STORY", description: "Stories for bedtime reading", isActive: true, sortOrder: 2 },
    { name: "Nursery Rhymes", slug: "nursery-rhymes", type: "SONG", description: "Classic nursery rhymes", isActive: true, sortOrder: 3 },
    { name: "Puzzle Games", slug: "puzzle-games", type: "GAME", description: "Brain-teasing puzzles", isActive: true, sortOrder: 4 },
  ];
  
  const categories = await Promise.all(
    categoriesData.map((c) =>
      prisma.contentCategory.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  );

  const [videosCat, storiesCat, songsCat, gamesCat] = categories;

  const contentItemsData = [
    {
      categoryId: videosCat.id,
      title: "Learn the Alphabet",
      slug: "learn-the-alphabet",
      type: "VIDEO",
      status: "PUBLISHED",
      thumbnailUrl: "/uploads/content/alphabet.jpg",
      mediaUrl: "https://example.com/videos/alphabet.mp4",
      ageGroupMin: 3,
      ageGroupMax: 7,
      duration: 300,
      author: "123 Club Team",
      isFeatured: true,
      isRecommended: true,
    },
    {
      categoryId: storiesCat.id,
      title: "The Three Bears",
      slug: "the-three-bears",
      type: "BOOK_STORY",
      status: "PUBLISHED",
      thumbnailUrl: "/uploads/content/three-bears.jpg",
      ageGroupMin: 3,
      ageGroupMax: 8,
      author: "Classic Tales",
      isFeatured: true,
    },
    {
      categoryId: songsCat.id,
      title: "Twinkle Twinkle Little Star",
      slug: "twinkle-twinkle-little-star",
      type: "SONG",
      status: "PUBLISHED",
      thumbnailUrl: "/uploads/content/twinkle.jpg",
      mediaUrl: "https://example.com/songs/twinkle.mp3",
      ageGroupMin: 2,
      ageGroupMax: 6,
      duration: 180,
      author: "Classic Nursery",
    },
    {
      categoryId: gamesCat.id,
      title: "Shape Puzzle",
      slug: "shape-puzzle",
      type: "GAME",
      status: "PUBLISHED",
      thumbnailUrl: "/uploads/content/shapes.jpg",
      mediaUrl: "https://example.com/games/shapes",
      ageGroupMin: 4,
      ageGroupMax: 10,
      author: "123 Club Games",
    },
  ];
  
  await Promise.all(
    contentItemsData.map((item) =>
      prisma.contentItem.upsert({
        where: { slug: item.slug },
        update: {},
        create: item,
      })
    )
  );

  // 4) Product categories & products
  const prodCatsData = [
    { name: "Toys", slug: "toys", description: "Fun toys for kids", isActive: true, sortOrder: 1 },
    { name: "Books", slug: "books", description: "Physical books", isActive: true, sortOrder: 2 },
  ];
  
  const prodCats = await Promise.all(
    prodCatsData.map((c) =>
      prisma.productCategory.upsert({
        where: { slug: c.slug },
        update: {},
        create: c,
      })
    )
  );

  const [toysCat, booksCat] = prodCats;

  const productsData = [
    { categoryId: toysCat.id, name: "Teddy Bear", slug: "teddy-bear", description: "Cute cuddly teddy bear", pointsCost: 500, stockQuantity: 50, isActive: true, isFeatured: true },
    { categoryId: toysCat.id, name: "Building Blocks Set", slug: "building-blocks-set", description: "Colorful blocks", pointsCost: 800, stockQuantity: 30, isActive: true },
    { categoryId: booksCat.id, name: "Coloring Book", slug: "coloring-book", description: "Beautiful coloring pages", pointsCost: 200, stockQuantity: 100, isActive: true },
  ];
  
  const products = await Promise.all(
    productsData.map((p) =>
      prisma.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      })
    )
  );

  const [teddyBear, blocksSet, coloringBook] = products;

  // 5) Banners
  await prisma.$transaction([
    prisma.banner.create({ data: { title: "Welcome to 123 Club!", imageUrl: "/uploads/banners/welcome.jpg", type: "HOME", isActive: true, sortOrder: 1 } }),
    prisma.banner.create({ data: { title: "Earn Double Points!", imageUrl: "/uploads/banners/double-points.jpg", type: "PROMO", isActive: true, sortOrder: 2 } }),
  ]);

  // 6) Static pages & FAQs
  const staticPagesData = [
    { title: "About 123 Club", slug: "about", content: "<h1>About 123 Club</h1><p>123 Club is a fun and educational platform for kids.</p>", isActive: true, sortOrder: 1 },
    { title: "Privacy Policy", slug: "privacy-policy", content: "<h1>Privacy Policy</h1><p>Your privacy is important to us.</p>", isActive: true, sortOrder: 2 },
  ];
  
  await Promise.all(
    staticPagesData.map((p) =>
      prisma.staticPage.upsert({
        where: { slug: p.slug },
        update: {},
        create: p,
      })
    )
  );

  const faqsData = [
    { question: "How do I earn points?", answer: "By watching content, playing games and inviting friends.", isActive: true, sortOrder: 1 },
    { question: "How do I redeem points?", answer: "Go to the store and redeem for rewards.", isActive: true, sortOrder: 2 },
  ];
  
  // FAQs don't have unique constraint, so we'll use create after deleteMany
  await prisma.fAQ.deleteMany({});
  await prisma.fAQ.createMany({ data: faqsData });

  // 7) App settings
  const settingsData = [
    { key: "app_name", value: "123 Club", group: "general" },
    { key: "signup_bonus_points", value: "100", group: "points" },
    { key: "referral_bonus_points", value: "50", group: "points" },
  ];
  
  await Promise.all(
    settingsData.map((s) =>
      prisma.appSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: s,
      })
    )
  );

  // 8) Users & profiles & membership & wallets & carts
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const userPassword = await bcrypt.hash("User@123456", 12);

  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@123club.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: true,
      profile: { create: { firstName: "Super", lastName: "Admin", displayName: "Super Admin" } },
    },
  });

  const parentUser = await prisma.user.create({
    data: {
      email: "parent@123club.com",
      password: userPassword,
      role: "PARENT",
      status: "ACTIVE",
      emailVerified: true,
      profile: { create: { firstName: "Ali", lastName: "Parent", displayName: "Ali Parent" } },
      parentProfile: { create: { numberOfChildren: 1, occupation: "Engineer" } },
    },
  });

  const childUser = await prisma.user.create({
    data: {
      email: "child@123club.com",
      password: userPassword,
      role: "CHILD",
      status: "ACTIVE",
      emailVerified: true,
      profile: { create: { firstName: "Sara", lastName: "Child", displayName: "Sara" } },
      childProfile: { create: { schoolName: "123 International School", grade: "Grade 3", interests: "Math, Stories, Games", parentId: parentUser.id } },
    },
  });

  const teacherUser = await prisma.user.create({
    data: {
      email: "teacher@123club.com",
      password: userPassword,
      role: "TEACHER",
      status: "ACTIVE",
      emailVerified: true,
      profile: { create: { firstName: "Mohammed", lastName: "Teacher", displayName: "Mr. Mohammed" } },
      teacherProfile: { create: { schoolName: "123 International School", specialization: "Math", yearsOfExp: 5 } },
    },
  });

  const schoolUser = await prisma.user.create({
    data: {
      email: "school@123club.com",
      password: userPassword,
      role: "SCHOOL",
      status: "ACTIVE",
      emailVerified: true,
      profile: { create: { firstName: "123", lastName: "School", displayName: "123 School" } },
      schoolProfile: { create: { schoolName: "123 Primary School", contactPerson: "Ms. Noor", contactEmail: "contact@123school.com" } },
    },
  });

  // Wallets & membership cards & carts
  await prisma.$transaction([
    prisma.pointsWallet.create({ data: { userId: parentUser.id, currentBalance: 300, totalEarned: 300, totalRedeemed: 0 } }),
    prisma.pointsWallet.create({ data: { userId: childUser.id, currentBalance: 800, totalEarned: 800, totalRedeemed: 0 } }),
    prisma.pointsWallet.create({ data: { userId: teacherUser.id, currentBalance: 500, totalEarned: 500, totalRedeemed: 0 } }),
    prisma.pointsWallet.create({ data: { userId: schoolUser.id, currentBalance: 2000, totalEarned: 2000, totalRedeemed: 0 } }),
  ]);

  await prisma.$transaction([
    prisma.membershipCard.create({ data: { userId: parentUser.id, planId: silverPlan.id, memberId: generateMemberId(), level: silverPlan.level, startDate: new Date(), endDate: addDays(new Date(), silverPlan.durationDays) } }),
    prisma.membershipCard.create({ data: { userId: childUser.id, planId: bronzePlan.id, memberId: generateMemberId(), level: bronzePlan.level, startDate: new Date(), endDate: addDays(new Date(), bronzePlan.durationDays) } }),
    prisma.membershipCard.create({ data: { userId: teacherUser.id, planId: goldPlan.id, memberId: generateMemberId(), level: goldPlan.level, startDate: new Date(), endDate: addDays(new Date(), goldPlan.durationDays) } }),
    prisma.membershipCard.create({ data: { userId: schoolUser.id, planId: platinumPlan.id, memberId: generateMemberId(), level: platinumPlan.level, startDate: new Date(), endDate: addDays(new Date(), platinumPlan.durationDays) } }),
  ]);

  await prisma.$transaction([
    prisma.cart.create({ data: { userId: childUser.id } }),
    prisma.cart.create({ data: { userId: parentUser.id } }),
  ]);

  // Avatars selection
  await prisma.$transaction([
    prisma.userAvatar.create({ data: { userId: childUser.id, avatarId: avatars[0].id } }),
    prisma.userAvatar.create({ data: { userId: parentUser.id, avatarId: avatars[1].id } }),
  ]);

  // Points transactions examples (earn + redeem)
  const childWallet = await prisma.pointsWallet.findUnique({ where: { userId: childUser.id } });

  await prisma.pointsTransaction.create({
    data: {
      walletId: childWallet.id,
      type: "EARNED",
      amount: 200,
      balanceAfter: childWallet.currentBalance,
      description: "Completed learning game",
    },
  });

  // Cart items & order for child user
  const childCart = await prisma.cart.findUnique({ where: { userId: childUser.id } });

  await prisma.cartItem.createMany({
    data: [
      { cartId: childCart.id, productId: teddyBear.id, quantity: 1 },
      { cartId: childCart.id, productId: coloringBook.id, quantity: 2 },
    ],
  });

  const orderTotalPoints = teddyBear.pointsCost * 1 + coloringBook.pointsCost * 2;

  const order = await prisma.order.create({
    data: {
      userId: childUser.id,
      orderNumber: generateOrderNumber(),
      status: "COMPLETED",
      totalPoints: orderTotalPoints,
      itemCount: 3,
      items: {
        create: [
          { productId: teddyBear.id, quantity: 1, pointsCost: teddyBear.pointsCost },
          { productId: coloringBook.id, quantity: 2, pointsCost: coloringBook.pointsCost },
        ],
      },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: childUser.id,
        type: "ORDER_UPDATE",
        title: "Order Completed",
        body: `Your order ${order.orderNumber} has been completed.`,
        data: { orderId: order.id, status: order.status },
      },
      {
        userId: childUser.id,
        type: "POINTS_UPDATE",
        title: "Points Redeemed",
        body: `You redeemed ${orderTotalPoints} points.`,
        data: { points: orderTotalPoints },
      },
    ],
  });

  // Referral example
  const refCode = generateReferralCode(8);
  await prisma.referral.create({
    data: {
      referrerId: parentUser.id,
      referredId: childUser.id,
      referralCode: refCode,
      isUsed: true,
      rewardPoints: 50,
      usedAt: new Date(),
    },
  });

  // Device tokens
  await prisma.deviceToken.createMany({
    data: [
      { userId: childUser.id, token: "DEVICE_CHILD_IOS", platform: "iOS" },
      { userId: parentUser.id, token: "DEVICE_PARENT_ANDROID", platform: "Android" },
    ],
  });

  // Admin activity logs
  await prisma.adminActivityLog.createMany({
    data: [
      { userId: superAdmin.id, action: "LOGIN", entity: "AUTH", details: { message: "Seed login" } },
      { userId: superAdmin.id, action: "CREATE_USER", entity: "USER", entityId: parentUser.id, details: { email: parentUser.email } },
    ],
  });

  console.log("✅ FULL seed completed successfully!");
  console.log("Super Admin: admin@123club.com / Admin@123456");
  console.log("Parent: parent@123club.com / User@123456");
  console.log("Child: child@123club.com / User@123456");
  console.log("Teacher: teacher@123club.com / User@123456");
  console.log("School: school@123club.com / User@123456");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
