# Sinon Super Admin Panel

React + Vite asosida qurilgan **Super Admin boshqaruv paneli**.
API: https://api.sinon.uz (faqat GET so'rovlar — ma'lumotlarni ko'rish uchun).

## Ishga tushirish

Terminal (PowerShell) ochib, quyidagilarni yozing:

```powershell
cd C:\Users\User\sinon-admin
npm install      # faqat birinchi marta
npm run dev
```

So'ng brauzerda ochiladi: **http://localhost:5173**

## Kirish (Login)

Super Admin **foydalanuvchi nomi** va **parol**ingizni kiriting.
Tizim `POST /api/v1/super-admin/login/` orqali token oladi va saqlaydi.
Token bo'lmasa yoki muddati tugasa — avtomatik login sahifasiga qaytaradi.

## Bo'limlar (barchasi GET)

Chap menyuda 12 ta Super Admin bo'limi bor. Har biri jadval ko'rinishida:

| Bo'lim | Endpoint |
|--------|----------|
| Users | `/api/v1/super-admin/users/list/` |
| Auth | `/api/v1/super-admin/auth/list-create/` |
| Doctor Application | `/api/v1/super-admin/doctor-application/list/` |
| Doctor Service | `/api/v1/super-admin/doctor-medical-service/list-create/` |
| About | `home/banner`, `home/service`, `services/banner` ... (tablar) |
| Laboratory | `/api/v1/super-admin/laboratory/list-create/` (+ xizmat, buyurtma) |
| Medical Service | `/api/v1/super-admin/medical-service/list/` |
| Notification | `/api/v1/super-admin/notif/list/` (+ qurilmalar) |
| Order | `/api/v1/super-admin/orders/list-create/` (+ bemorlar) |
| Privacy Policy | `/api/v1/super-admin/privacy-policy/legal-documents/` |
| Profile | doctor / patient profillari (tablar) |
| Address | `/api/v1/super-admin/address/list-create/` |

Har bir jadvalda: **qidiruv**, **sahifalash** (pagination) va **yangilash** tugmasi bor.

## Imkoniyatlar

- 📊 Dashboard — statistik kartalar, donut va chiziqli grafiklar
- 📱 To'liq **responsive** (telefon, planshet, kompyuter)
- 🔐 JWT token bilan avtorizatsiya
- 🔄 Avtomatik 401 ishlovi (token tugasa login'ga qaytaradi)

## Yangi bo'lim yoki ustun qo'shish

Hammasi bitta faylda boshqariladi: **`src/config/sections.js`**.
Yangi endpoint qo'shish yoki jadval ustunlarini o'zgartirish uchun shu faylni tahrirlang.

## Qurilish (production)

```powershell
npm run build      # natija: dist/ papkasi
npm run preview    # tayyor versiyani ko'rish
```
# Sinon
