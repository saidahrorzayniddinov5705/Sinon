import { getEditConfig } from './editForms'

// Maxsus create endpointlari (POST /create/) — edit'dan farqli schema (UserCreate, ...).
const customCreate = {
  '/api/v1/super-admin/users/list/': {
    url: '/api/v1/super-admin/users/create/',
    fields: [
      { name: 'full_name', label: 'F.I.O', type: 'text', required: true },
      { name: 'contact', label: 'Kontakt', type: 'text', required: true },
      { name: 'password', label: 'Parol', type: 'text', required: true },
      { name: 'birth_date', label: "Tug'ilgan sana", type: 'date', required: true },
      { name: 'gender', label: 'Jinsi', type: 'select', options: ['erkak', 'ayol'] },
      { name: 'status', label: 'Holat', type: 'bool' },
      { name: 'image', label: 'Rasm', type: 'file' },
    ],
  },
  '/api/v1/super-admin/doctor-application/list/': {
    url: '/api/v1/super-admin/doctor-application/create/',
    fields: [
      { name: 'full_name', label: 'F.I.O', type: 'text', required: true },
      { name: 'phone_number', label: 'Telefon', type: 'text' },
      { name: 'region', label: 'Viloyat', type: 'text', required: true },
      { name: 'district', label: 'Tuman', type: 'text', required: true },
      { name: 'address', label: 'Manzil', type: 'text', required: true },
      { name: 'birth_date', label: "Tug'ilgan sana", type: 'date', required: true },
      { name: 'gender', label: 'Jinsi', type: 'select', required: true, options: ['erkak', 'ayol'] },
      { name: 'passport', label: 'Passport', type: 'text', required: true },
      { name: 'specialization', label: 'Mutaxassislik', type: 'text', required: true },
      { name: 'experience_year', label: 'Tajriba (yil)', type: 'number', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'image', label: 'Rasm', type: 'file', required: true },
      { name: 'passport_image', label: 'Passport rasmi', type: 'file', required: true },
      { name: 'passport_image2', label: 'Passport rasmi (2)', type: 'file', required: true },
      { name: 'diplom_images', label: 'Diplom rasmlari', type: 'files', required: true },
    ],
  },
  '/api/v1/super-admin/medical-service/list/': {
    url: '/api/v1/super-admin/medical-service/create/',
    fields: [
      { name: 'name', label: 'Nomi', type: 'text' },
      { name: 'description', label: 'Tavsif', type: 'textarea' },
      { name: 'min_price', label: 'Min narx', type: 'decimal' },
      { name: 'max_price', label: 'Max narx', type: 'decimal' },
      { name: 'units', label: 'Birlik', type: 'number' },
      { name: 'code', label: 'Kod', type: 'text' },
      { name: 'package_code', label: 'Paket kodi', type: 'text' },
      { name: 'vat_percent', label: 'QQS (%)', type: 'number' },
      { name: 'status', label: 'Holat', type: 'bool' },
    ],
  },
}

// Create (POST) yo'q bo'lgan bo'limlar (backend list endpoint'ida POST yo'q)
const noCreate = new Set([
  '/api/v1/super-admin/profile/doctor-profiles/',
  '/api/v1/super-admin/profile/patient-profiles/',
  '/api/v1/super-admin/address/list/',
  '/api/v1/super-admin/auth/users/list/',
  '/api/v1/super-admin/notif/list/',
  '/api/v1/super-admin/notif/device/list/',
])

// Berilgan list endpoint uchun create konfiguratsiyasi: { url, fields } yoki null.
// Standart bo'limlarda POST list URL'ning o'ziga ketadi va maydonlar edit bilan bir xil
// (*Request schema POST va PUT/PATCH'da bir xil).
export function getCreateConfig(listEndpoint) {
  if (noCreate.has(listEndpoint)) return null
  if (customCreate[listEndpoint]) return customCreate[listEndpoint]
  const editCfg = getEditConfig(listEndpoint)
  if (!editCfg) return null
  const fields = editCfg.targets.flatMap((t) => t.fields)
  return { url: listEndpoint, fields }
}
