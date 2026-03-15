#!/bin/sh
set -e

echo "=============================="
echo "DATABASE_URL prefix: $(echo $DATABASE_URL | cut -c1-30)..."
echo "=============================="

echo "=== STEP 1: Prisma db push ==="
npx prisma db push --accept-data-loss --skip-generate
echo "=== DB PUSH DONE ==="

echo "=== STEP 2: Seed ==="
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const p = new PrismaClient();
async function run() {
  const email = process.env.ADMIN_EMAIL || 'admin@xdema.ru';
  const pass = process.env.ADMIN_PASSWORD || 'xdema2024';
  const hash = await bcrypt.hash(pass, 12);
  await p.user.upsert({ where:{email}, update:{}, create:{name:'Admin XDEMA',email,passwordHash:hash,role:'ADMIN'} });
  console.log('admin ok');
  const cs = [{slug:'basic',title:'Базовый',tagline:'Основы DJ за 4 занятия',price:8000,sortOrder:1,features:['4 занятия','Теория BPM','Оборудование'],program:['CDJ знакомство','BPM теория','Первый сет']},{slug:'middle',title:'Средний',tagline:'8 занятий практики',price:18000,sortOrder:2,features:['8 занятий','Эффекты','Запись'],program:['Beatmatching','Эффекты','Запись']},{slug:'premium',title:'Премиум',tagline:'16 занятий + ивент',price:35000,sortOrder:3,features:['16 занятий','Ableton','Ивент'],program:['Всё из среднего','Ableton','Ивент']}];
  for(const c of cs) await p.course.upsert({where:{slug:c.slug},update:{price:c.price},create:c});
  console.log('courses ok');
  const sets = [{key:'hero',value:JSON.stringify({title:'XDEMA',sub1:'DJ · Mentor · Live Energy',sub2:'Обучение · Мероприятия · Live QR'})},{key:'contacts',value:JSON.stringify({phone:'+7 (999) 123-45-67',email:'xdema@djmail.ru',city:'Москва'})},{key:'heroBg',value:JSON.stringify({type:'preset',id:'orbs'})},{key:'blocks',value:JSON.stringify({training:true,services:true,gallery:true,reviews:true,faq:true,contacts:true})},{key:'djPrices',value:JSON.stringify([{n:'1 час',p:8000},{n:'2 часа',p:14000}])},{key:'qrPrices',value:JSON.stringify({track:500,dance:800,tip:200,msg:100})},{key:'gallSettings',value:JSON.stringify({cols:3,h:175})}];
  for(const s of sets) await p.siteSetting.upsert({where:{key:s.key},update:{},create:s});
  console.log('settings ok');
  await p.\$disconnect();
  console.log('SEED COMPLETE');
}
run().catch(e=>{console.error('seed error:',e.message);process.exit(0);});
"
echo "=== SEED DONE ==="

echo "=== STEP 3: Start app ==="
exec node dist/main
