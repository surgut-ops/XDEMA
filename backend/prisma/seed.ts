import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin user ──────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@xdema.ru';
  const adminPass = process.env.ADMIN_PASSWORD || 'xdema2024';
  const hash = await bcrypt.hash(adminPass, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: 'Admin XDEMA', email: adminEmail, passwordHash: hash, role: Role.ADMIN },
  });
  console.log('✓ Admin user created:', adminEmail);

  // ── Courses ─────────────────────────────────────────────
  const courses = [
    {
      slug: 'basic', title: 'Базовый', tagline: 'Основы DJ за 4 занятия', price: 8000, sortOrder: 1,
      who: 'Для полных новичков. Занятия в комфортном темпе.',
      features: ['4 занятия по 1.5 часа','Теория: BPM, ритм, структура','Базовый beatmatching','Профессиональное оборудование','Переходы: cut, fade','Учебные материалы'],
      program: ['Pioneer CDJ + DJM: первое знакомство','Теория: BPM, ритм, структура трека','Кюинг, старт, стоп','Ручной beatmatching','Переходы: cut, fade','Первый самостоятельный сет'],
    },
    {
      slug: 'middle', title: 'Средний', tagline: 'Глубокая практика за 8 занятий', price: 18000, sortOrder: 2,
      who: 'Для тех, кто имеет базовые навыки или прошёл Базовый курс.',
      features: ['8 занятий по 1.5 часа','Продвинутое сведение','Эффекты и лупы','Построение сета','Запись и анализ','Итоговое выступление (видео)'],
      program: ['Продвинутый beatmatching','Переходы: echo, filter, loop roll','Эффекты и семплер','Лупы в реальном времени','Построение энергетики','Запись и анализ миксов','Разбор профессиональных сетов','Итоговое выступление'],
    },
    {
      slug: 'premium', title: 'Премиум', tagline: '16 занятий + менторство + выступление', price: 35000, sortOrder: 3,
      who: 'Для тех, кто хочет сделать DJ профессией.',
      features: ['16 занятий по 2 часа','Всё из Среднего','Создание музыки (Ableton)','Маркетинг DJ','Реальный ивент XDEMA','Сертификат DJ'],
      program: ['Всё из Среднего курса','Ableton Live — основы','Создание своего трека','Маркетинг DJ: бренд, соцсети','Технический райдер','Участие в реальном ивенте','Доступ к студии 3 месяца','Сертификат DJ'],
    },
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: { price: c.price },
      create: c,
    });
  }
  console.log('✓ Courses seeded (3)');

  // ── Default site settings ────────────────────────────────
  const defaults = [
    { key: 'hero',     value: JSON.stringify({ title:'XDEMA', sub1:'DJ · Mentor · Live Energy', sub2:'Обучение · Мероприятия · Live QR', titleSize:9, subSize:1.05 }) },
    { key: 'contacts', value: JSON.stringify({ phone:'+7 (999) 123-45-67', email:'xdema@djmail.ru', city:'Москва, Россия', insta:'#', tg:'#', yt:'#', vk:'#' }) },
    { key: 'heroBg',   value: JSON.stringify({ type:'preset', id:'orbs' }) },
    { key: 'blocks',   value: JSON.stringify({ training:true, services:true, gallery:true, reviews:true, faq:true, contacts:true }) },
    { key: 'colors',   value: JSON.stringify({ hc1:'#ffffff', hc2:'#00e5ff', hc3:'#ff2d78', ac1:'#00e5ff', ac2:'#ff2d78' }) },
    { key: 'popupSettings', value: JSON.stringify({ tag:'ОБУЧЕНИЕ', title:'Базовый курс DJ', text:'4 занятия на профессиональном оборудовании.', btnText:'Подробнее', action:'training', delay:35, enabled:true }) },
    { key: 'djPrices', value: JSON.stringify([{n:'1 час DJ',p:8000},{n:'2 часа DJ',p:14000},{n:'3 часа DJ',p:19000},{n:'Ночь (6+ часов)',p:35000},{n:'Аренда звука',p:7000},{n:'Световое оборудование',p:5000},{n:'DJ-мастер-класс',p:12000},{n:'Выезд за МКАД',p:3000}]) },
    { key: 'qrPrices', value: JSON.stringify({ track:500, dance:800, tip:200, msg:100 }) },
    { key: 'gallSettings', value: JSON.stringify({ cols:3, h:175 }) },
  ];

  for (const s of defaults) {
    await prisma.siteSetting.upsert({ where:{key:s.key}, update:{}, create:s });
  }
  console.log('✓ Default settings seeded');

  // ── Sample reviews ───────────────────────────────────────
  const rv = await prisma.review.count();
  if (rv === 0) {
    await prisma.review.createMany({ data: [
      { name:'Анна К.', rating:5, text:'XDEMA сделал корпоратив незабываемым! Все танцевали до конца.', event:'Корпоратив', approved:true },
      { name:'Максим Д.', rating:5, text:'Взял Средний курс — за 8 занятий уже делаю миксы.', event:'Обучение', approved:true },
      { name:'Светлана О.', rating:5, text:'Свадьба прошла идеально. Профессионализм на высоте.', event:'Свадьба', approved:true },
    ]});
    console.log('✓ Sample reviews seeded');
  }

  console.log('🎉 Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
