// PATCH (tahrirlash) formalari. Kalit = LIST endpoint.
// Faqat detail PATCH/update qo'llab-quvvatlaydigan resurslar uchun.
// (orders, laboratory/order — detail faqat GET, shuning uchun tahrirlash yo'q.)

export const editForms = {
  '/api/v1/super-admin/address/list/': [
    { name: 'address_type', label: 'Manzil turi', type: 'select', options: ['work', 'home', 'other'] },
    { name: 'region', label: 'Viloyat', type: 'text' },
    { name: 'district', label: 'Tuman', type: 'text' },
    { name: 'street', label: "Ko'cha", type: 'text' },
    { name: 'home', label: 'Uy', type: 'number' },
    { name: 'building_number', label: 'Bino raqami', type: 'text' },
    { name: 'entrance', label: 'Kirish', type: 'number' },
    { name: 'floor', label: 'Qavat', type: 'number' },
    { name: 'longitude', label: 'Longitude', type: 'text' },
    { name: 'latitude', label: 'Latitude', type: 'text' },
    { name: 'notes', label: 'Izoh', type: 'textarea' },
    { name: 'patient', label: 'Bemor ID', type: 'number' },
    { name: 'status', label: 'Holat (aktiv)', type: 'bool' },
  ],
  '/api/v1/super-admin/auth/users/list/': [
    { name: 'full_name', label: 'F.I.O', type: 'text' },
    { name: 'contact', label: 'Kontakt', type: 'text', required: true },
    { name: 'contact_type', label: 'Kontakt turi', type: 'select', options: ['phone', 'email'] },
    { name: 'registration_type', label: "Ro'yxatdan o'tish", type: 'select', options: ['google', 'facebook', 'apple'] },
    { name: 'active_role', label: 'Aktiv rol', type: 'text' },
    { name: 'birth_date', label: "Tug'ilgan sana", type: 'date' },
    { name: 'gender', label: 'Jinsi', type: 'select', options: ['erkak', 'ayol'] },
    { name: 'status', label: 'Holat', type: 'bool' },
    { name: 'is_active', label: 'Aktiv', type: 'bool' },
    { name: 'is_staff', label: 'Staff', type: 'bool' },
  ],
  '/api/v1/super-admin/doctor-medical-service/list/': [
    { name: 'addition', label: "Qo'shimcha", type: 'text' },
    { name: 'description', label: 'Tavsif', type: 'textarea' },
    { name: 'price', label: 'Narx', type: 'decimal', required: true },
    { name: 'service_type', label: 'Xizmat turi', type: 'select', options: ['standard', 'addition'] },
    { name: 'status', label: 'Holat', type: 'bool' },
  ],
  '/api/v1/super-admin/home/banner/': [
    { name: 'title', label: 'Sarlavha', type: 'text' },
    { name: 'description', label: 'Tavsif', type: 'textarea' },
    { name: 'url', label: 'Havola', type: 'text' },
    { name: '_type', label: 'Tur', type: 'select', options: ['elon', 'link'] },
    { name: 'status', label: 'Holat', type: 'bool' },
  ],
  '/api/v1/super-admin/home/service/': [
    { name: 'name', label: 'Nomi', type: 'text', required: true },
    { name: 'description', label: 'Tavsif', type: 'textarea' },
    { name: 'status', label: 'Holat', type: 'bool' },
  ],
  '/api/v1/super-admin/home/contact-us/': [
    { name: 'name', label: 'Nomi', type: 'text' },
    { name: 'link', label: 'Havola', type: 'text' },
    { name: 'call', label: 'Telefon', type: 'text' },
    { name: 'status', label: 'Holat', type: 'bool' },
  ],
  '/api/v1/super-admin/home/social-network/': [
    { name: 'title', label: 'Nomi', type: 'text' },
    { name: 'link', label: 'Havola', type: 'text' },
    { name: 'description', label: 'Tavsif', type: 'textarea' },
    { name: 'status', label: 'Holat', type: 'bool' },
  ],
  '/api/v1/super-admin/home/share-app/': [
    { name: 'device_id', label: 'Qurilma ID', type: 'text', required: true },
  ],
  '/api/v1/super-admin/notif/list/': [
    { name: 'title', label: 'Sarlavha', type: 'text' },
    { name: 'message', label: 'Xabar', type: 'textarea' },
    { name: 'is_read', label: "O'qilgan", type: 'bool' },
    { name: 'read_at', label: "O'qilgan vaqt", type: 'datetime' },
    { name: 'device', label: 'Qurilma ID', type: 'number' },
  ],
  '/api/v1/super-admin/notif/device/list/': [
    { name: 'token', label: 'Token', type: 'text' },
    { name: 'device_type', label: 'Qurilma turi', type: 'select', options: ['ios', 'android'] },
    { name: 'is_active', label: 'Aktiv', type: 'bool' },
    { name: 'user', label: 'Foydalanuvchi ID', type: 'number' },
  ],
  '/api/v1/super-admin/privacy-policy/legal-documents/': [
    { name: 'doc_type', label: 'Hujjat turi', type: 'select', required: true, options: ['PRIVACY_POLICY', 'TERMS_OF_SERVICE', 'COOKIE_POLICY', 'USER_AGREEMENT'] },
    { name: 'app_type', label: 'App turi', type: 'select', required: true, options: ['patient', 'doctor'] },
    { name: 'link', label: 'Havola', type: 'text' },
    { name: 'version', label: 'Versiya', type: 'text' },
    { name: 'is_active', label: 'Aktiv', type: 'bool' },
  ],

  // --- Maxsus PATCH (/update/, /status/) ---
  '/api/v1/super-admin/users/list/': {
    patch: '/api/v1/super-admin/users/detail/{id}/update/',
    fields: [
      { name: 'full_name', label: 'F.I.O', type: 'text' },
      { name: 'contact', label: 'Kontakt', type: 'text' },
      { name: 'passport', label: 'Passport', type: 'text' },
      { name: 'birth_date', label: "Tug'ilgan sana", type: 'date' },
      { name: 'gender', label: 'Jinsi', type: 'select', options: ['erkak', 'ayol'] },
      { name: 'active_role', label: 'Aktiv rol', type: 'text' },
      { name: 'status', label: 'Holat', type: 'bool' },
      { name: 'is_active', label: 'Aktiv', type: 'bool' },
      { name: 'is_staff', label: 'Staff', type: 'bool' },
    ],
  },
  '/api/v1/super-admin/doctor-application/list/': {
    targets: [
      {
        patch: '/api/v1/super-admin/doctor-application/detail/{id}/status/',
        fields: [
          { name: 'status', label: 'Holat', type: 'select', options: ['pending', 'approved', 'cancelled', 'finished'] },
        ],
      },
      {
        patch: '/api/v1/super-admin/doctor-application/detail/{id}/update/',
        fields: [
          { name: 'full_name', label: 'F.I.O', type: 'text' },
          { name: 'phone_number', label: 'Telefon', type: 'text' },
          { name: 'region', label: 'Viloyat', type: 'text' },
          { name: 'district', label: 'Tuman', type: 'text' },
          { name: 'address', label: 'Manzil', type: 'text' },
          { name: 'birth_date', label: "Tug'ilgan sana", type: 'date' },
          { name: 'gender', label: 'Jinsi', type: 'select', options: ['erkak', 'ayol'] },
          { name: 'passport', label: 'Passport', type: 'text' },
          { name: 'specialization', label: 'Mutaxassislik', type: 'text' },
          { name: 'experience_year', label: 'Tajriba (yil)', type: 'number' },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'image', label: 'Rasm', type: 'file' },
          { name: 'passport_image', label: 'Passport rasmi', type: 'file' },
          { name: 'passport_image2', label: 'Passport rasmi (2)', type: 'file' },
          { name: 'diplom_images', label: 'Diplom rasmlari', type: 'files' },
        ],
      },
    ],
  },
  '/api/v1/super-admin/medical-service/list/': {
    patch: '/api/v1/super-admin/medical-service/detail/{id}/update/',
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
  '/api/v1/super-admin/profile/doctor-profiles/': {
    patch: '/api/v1/super-admin/profile/doctor-profiles/{id}/update/',
    fields: [
      { name: 'username', label: 'Username', type: 'text' },
      { name: 'specialization', label: 'Mutaxassislik', type: 'text' },
      { name: 'experience_year', label: 'Tajriba (yil)', type: 'number' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'is_private', label: 'Yopiq', type: 'bool' },
      { name: 'status', label: 'Holat', type: 'bool' },
    ],
  },
  '/api/v1/super-admin/profile/patient-profiles/': {
    patch: '/api/v1/super-admin/profile/patient-profiles/{id}/update/',
    fields: [
      { name: 'status', label: 'Holat', type: 'bool' },
    ],
  },
}

// Forma konfiguratsiyasini bir xil `targets` ko'rinishiga keltiradi.
export function getEditConfig(listEndpoint) {
  const entry = editForms[listEndpoint]
  if (!entry) return null
  if (Array.isArray(entry)) return { targets: [{ patch: null, fields: entry }] }
  if (entry.targets) return { targets: entry.targets }
  return { targets: [{ patch: entry.patch || null, fields: entry.fields }] }
}
