// Barcha Super Admin bo'limlari shu yerda boshqariladi.
// Har bir bo'lim: key (URL), title, icon (lucide), va bir yoki bir nechta "view".
// Har bir view = bitta GET list endpoint + jadval ustunlari.
// Ustun turlari: text | date | image | badge | bool | money | roles
// Ustun nomlari (key) Swagger schema'dagi haqiqiy maydonlarga mos.

export const sections = [
  {
    key: 'users',
    title: 'Users',
    icon: 'Users',
    views: [
      {
        label: 'Foydalanuvchilar',
        endpoint: '/api/v1/super-admin/users/list/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'full_name', label: 'F.I.O' },
          { key: 'contact', label: 'Kontakt' },
          { key: 'roles', label: 'Rollar', type: 'roles' },
          { key: 'gender', label: 'Jinsi', type: 'badge' },
          { key: 'birth_date', label: "Tug'ilgan", type: 'date' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'auth',
    title: 'Auth',
    icon: 'KeyRound',
    views: [
      {
        label: 'Auth foydalanuvchilari',
        endpoint: '/api/v1/super-admin/auth/list-create/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'full_name', label: 'F.I.O' },
          { key: 'contact', label: 'Kontakt' },
          { key: 'contact_type', label: 'Tur', type: 'badge' },
          { key: 'active_role', label: 'Aktiv rol', type: 'badge' },
          { key: 'gender', label: 'Jinsi', type: 'badge' },
          { key: 'is_active', label: 'Aktiv', type: 'bool' },
          { key: 'is_staff', label: 'Staff', type: 'bool' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'SMS kodlar',
        endpoint: '/api/v1/super-admin/auth/sms-code/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'contact', label: 'Kontakt' },
          { key: 'attempts', label: 'Urinishlar' },
          { key: 'verified', label: 'Tasdiqlangan', type: 'bool' },
          { key: '_type', label: 'Tur', type: 'badge' },
          { key: 'expires_at', label: 'Amal qiladi', type: 'date' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'doctor-application',
    title: 'Doctor Application',
    icon: 'ClipboardList',
    views: [
      {
        label: 'Shifokor arizalari',
        endpoint: '/api/v1/super-admin/doctor-application/list/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'full_name', label: 'F.I.O' },
          { key: 'phone_number', label: 'Telefon' },
          { key: 'region', label: 'Viloyat' },
          { key: 'district', label: 'Tuman' },
          { key: 'specialization', label: 'Mutaxassislik' },
          { key: 'experience_year', label: 'Tajriba (yil)' },
          { key: 'gender', label: 'Jinsi', type: 'badge' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Sana', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'doctor-service',
    title: 'Doctor Service',
    icon: 'Stethoscope',
    views: [
      {
        label: 'Shifokor xizmatlari',
        endpoint: '/api/v1/super-admin/doctor-medical-service/list-create/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'doctor', label: 'Shifokor' },
          { key: 'service', label: 'Xizmat' },
          { key: 'description', label: 'Tavsif' },
          { key: 'price', label: 'Narx', type: 'money' },
          { key: 'service_type', label: 'Turi', type: 'badge' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'about',
    title: 'About',
    icon: 'Info',
    views: [
      {
        label: 'Home — Banner',
        endpoint: '/api/v1/super-admin/home/banner/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'title', label: 'Sarlavha' },
          { key: 'description', label: 'Tavsif' },
          { key: '_type', label: 'Tur', type: 'badge' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Home — Service',
        endpoint: '/api/v1/super-admin/home/service/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'name', label: 'Nomi' },
          { key: 'description', label: 'Tavsif' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Home — Contact us',
        endpoint: '/api/v1/super-admin/home/contact-us/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'name', label: 'Nomi' },
          { key: 'call', label: 'Telefon' },
          { key: 'link', label: 'Havola' },
          { key: 'status', label: 'Holat', type: 'badge' },
        ],
      },
      {
        label: 'Home — Social network',
        endpoint: '/api/v1/super-admin/home/social-network/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Ikon', type: 'image' },
          { key: 'title', label: 'Nomi' },
          { key: 'link', label: 'Havola' },
          { key: 'status', label: 'Holat', type: 'badge' },
        ],
      },
      {
        label: 'Home — Share app',
        endpoint: '/api/v1/super-admin/home/share-app/',
        columns: [
          { key: 'device_id', label: 'Qurilma ID' },
          { key: 'user', label: 'Foydalanuvchi' },
        ],
      },
      {
        label: 'Services — Banner',
        endpoint: '/api/v1/super-admin/services/banner/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'title', label: 'Sarlavha' },
          { key: 'description', label: 'Tavsif' },
          { key: '_type', label: 'Tur', type: 'badge' },
          { key: 'status', label: 'Holat', type: 'badge' },
        ],
      },
      {
        label: 'Services — Service',
        endpoint: '/api/v1/super-admin/services/service/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'name', label: 'Nomi' },
          { key: 'description', label: 'Tavsif' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Services — Contact us',
        endpoint: '/api/v1/super-admin/services/contact-us/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'name', label: 'Nomi' },
          { key: 'call', label: 'Telefon' },
          { key: 'link', label: 'Havola' },
          { key: 'status', label: 'Holat', type: 'badge' },
        ],
      },
      {
        label: 'Services — Social network',
        endpoint: '/api/v1/super-admin/services/social-network/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Ikon', type: 'image' },
          { key: 'title', label: 'Nomi' },
          { key: 'link', label: 'Havola' },
          { key: 'status', label: 'Holat', type: 'badge' },
        ],
      },
      {
        label: 'Services — Share app',
        endpoint: '/api/v1/super-admin/services/share-app/',
        columns: [
          { key: 'device_id', label: 'Qurilma ID' },
          { key: 'user', label: 'Foydalanuvchi' },
        ],
      },
    ],
  },
  {
    key: 'laboratory',
    title: 'Laboratory',
    icon: 'FlaskConical',
    views: [
      {
        label: 'Laboratoriyalar',
        endpoint: '/api/v1/super-admin/laboratory/list-create/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'logo', label: 'Logo', type: 'image' },
          { key: 'lab_name', label: 'Nomi' },
          { key: 'phone', label: 'Telefon' },
          { key: 'region', label: 'Viloyat' },
          { key: 'district', label: 'Tuman' },
          { key: 'rating', label: 'Reyting' },
          { key: 'orders_count', label: 'Buyurtmalar' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Lab xizmatlari',
        endpoint: '/api/v1/super-admin/laboratory/service/list-create/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nomi' },
          { key: 'code', label: 'Kod' },
          { key: 'min_price', label: 'Min narx', type: 'money' },
          { key: 'max_price', label: 'Max narx', type: 'money' },
          { key: 'units', label: 'Birlik' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Lab buyurtmalari',
        endpoint: '/api/v1/super-admin/laboratory/order/list-create',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'order_id', label: 'Buyurtma №' },
          { key: 'payment_type', label: "To'lov", type: 'badge' },
          { key: 'summa', label: 'Summa', type: 'money' },
          { key: 'rating', label: 'Reyting' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'planned_at', label: 'Rejalashtirilgan', type: 'date' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Lab arizalari',
        endpoint: '/api/v1/super-admin/laboratory/application/document/list-create/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'logo', label: 'Logo', type: 'image' },
          { key: 'lab_name', label: 'Nomi' },
          { key: 'phone', label: 'Telefon' },
          { key: 'region', label: 'Viloyat' },
          { key: 'experience_years', label: 'Tajriba' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Tanlangan xizmatlar',
        endpoint: '/api/v1/super-admin/laboratory/choice-service/create-list/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'laboratory', label: 'Laboratoriya' },
          { key: 'service', label: 'Xizmat' },
          { key: 'price', label: 'Narx', type: 'money' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'medical-service',
    title: 'Medical Service',
    icon: 'HeartPulse',
    views: [
      {
        label: 'Tibbiy xizmatlar',
        endpoint: '/api/v1/super-admin/medical-service/list/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nomi' },
          { key: 'code', label: 'Kod' },
          { key: 'package_code', label: 'Paket kodi' },
          { key: 'min_price', label: 'Min narx', type: 'money' },
          { key: 'max_price', label: 'Max narx', type: 'money' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'notification',
    title: 'Notification',
    icon: 'Bell',
    views: [
      {
        label: 'Bildirishnomalar',
        endpoint: '/api/v1/super-admin/notif/list/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'title', label: 'Sarlavha' },
          { key: 'message', label: 'Xabar' },
          { key: 'is_read', label: "O'qilgan", type: 'bool' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: 'Qurilmalar',
        endpoint: '/api/v1/super-admin/notif/devices/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'order',
    title: 'Order',
    icon: 'ShoppingCart',
    views: [
      {
        label: 'Buyurtmalar',
        endpoint: '/api/v1/super-admin/orders/list-create/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'order_id', label: 'Buyurtma №' },
          { key: 'payment_type', label: "To'lov turi", type: 'badge' },
          { key: 'summa', label: 'Summa', type: 'money' },
          { key: 'rating', label: 'Reyting' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'planned_at', label: 'Rejalashtirilgan', type: 'date' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
      {
        label: "Qo'shilgan bemorlar",
        endpoint: '/api/v1/super-admin/orders/add-patient/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'image', label: 'Rasm', type: 'image' },
          { key: 'full_name', label: 'F.I.O' },
          { key: 'birth_date', label: "Tug'ilgan", type: 'date' },
          { key: 'gender', label: 'Jinsi', type: 'badge' },
          { key: 'is_self', label: "O'zi", type: 'bool' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'privacy-policy',
    title: 'Privacy Policy',
    icon: 'ShieldCheck',
    views: [
      {
        label: 'Huquqiy hujjatlar',
        endpoint: '/api/v1/super-admin/privacy-policy/legal-documents/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'doc_type', label: 'Hujjat turi', type: 'badge' },
          { key: 'app_type', label: 'App turi', type: 'badge' },
          { key: 'version', label: 'Versiya' },
          { key: 'link', label: 'Havola' },
          { key: 'is_active', label: 'Aktiv', type: 'bool' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'profile',
    title: 'Profile',
    icon: 'UserCircle',
    views: [
      {
        label: 'Shifokor profillari',
        endpoint: '/api/v1/super-admin/profile/doctor-profiles/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'username', label: 'Username' },
          { key: 'specialization', label: 'Mutaxassislik' },
          { key: 'experience_year', label: 'Tajriba' },
          { key: 'rating', label: 'Reyting' },
          { key: 'followers_count', label: 'Obunachilar' },
          { key: 'order_count', label: 'Buyurtmalar' },
          { key: 'is_private', label: 'Yopiq', type: 'bool' },
          { key: 'status', label: 'Holat', type: 'badge' },
        ],
      },
      {
        label: 'Bemor profillari',
        endpoint: '/api/v1/super-admin/profile/patient-profiles/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'slug', label: 'Slug' },
          { key: 'following_count', label: 'Kuzatish' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
  {
    key: 'address',
    title: 'Address',
    icon: 'MapPin',
    views: [
      {
        label: 'Manzillar',
        endpoint: '/api/v1/super-admin/address/list-create/',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'address_type', label: 'Turi', type: 'badge' },
          { key: 'region', label: 'Viloyat' },
          { key: 'district', label: 'Tuman' },
          { key: 'street', label: "Ko'cha" },
          { key: 'home', label: 'Uy' },
          { key: 'status', label: 'Holat', type: 'badge' },
          { key: 'created_at', label: 'Yaratilgan', type: 'date' },
        ],
      },
    ],
  },
]

// Dashboard kartalari uchun count olinadigan endpointlar
export const dashboardCounts = [
  { label: 'Foydalanuvchilar', endpoint: '/api/v1/super-admin/users/list/', icon: 'Users', color: '#6366f1' },
  { label: 'Buyurtmalar', endpoint: '/api/v1/super-admin/orders/list-create/', icon: 'ShoppingCart', color: '#22c55e' },
  { label: 'Shifokor arizalari', endpoint: '/api/v1/super-admin/doctor-application/list/', icon: 'ClipboardList', color: '#f59e0b' },
  { label: 'Laboratoriyalar', endpoint: '/api/v1/super-admin/laboratory/list-create/', icon: 'FlaskConical', color: '#ec4899' },
]

// List endpoint -> Detail endpoint ({id} o'rni avtomatik almashtiriladi).
// Shu orqali barcha 29 ta super-admin DETAIL GET endpointi ham ishlatiladi.
export const detailMap = {
  '/api/v1/super-admin/users/list/': '/api/v1/super-admin/users/detail/{id}/',
  '/api/v1/super-admin/auth/list-create/': '/api/v1/super-admin/auth/detail/{id}/',
  '/api/v1/super-admin/auth/sms-code/': '/api/v1/super-admin/auth/sms-code/detail/{id}/',
  '/api/v1/super-admin/doctor-application/list/': '/api/v1/super-admin/doctor-application/detail/{id}/',
  '/api/v1/super-admin/doctor-medical-service/list-create/': '/api/v1/super-admin/doctor-medical-service/detail/{id}/',
  '/api/v1/super-admin/home/banner/': '/api/v1/super-admin/home/banner/{id}/',
  '/api/v1/super-admin/home/service/': '/api/v1/super-admin/home/service/{id}/',
  '/api/v1/super-admin/home/contact-us/': '/api/v1/super-admin/home/contact-us/{id}/',
  '/api/v1/super-admin/home/social-network/': '/api/v1/super-admin/home/social-network/{id}/',
  '/api/v1/super-admin/home/share-app/': '/api/v1/super-admin/home/share-app/{id}/',
  '/api/v1/super-admin/services/banner/': '/api/v1/super-admin/services/banner/{id}/',
  '/api/v1/super-admin/services/service/': '/api/v1/super-admin/services/service/{id}/',
  '/api/v1/super-admin/services/contact-us/': '/api/v1/super-admin/services/contact-us/{id}/',
  '/api/v1/super-admin/services/social-network/': '/api/v1/super-admin/services/social-network/{id}/',
  '/api/v1/super-admin/services/share-app/': '/api/v1/super-admin/services/share-app/{id}/',
  '/api/v1/super-admin/laboratory/list-create/': '/api/v1/super-admin/laboratory/detail/{id}/',
  '/api/v1/super-admin/laboratory/service/list-create/': '/api/v1/super-admin/laboratory/service/detail/{id}/',
  '/api/v1/super-admin/laboratory/order/list-create': '/api/v1/super-admin/laboratory/order/detail/{id}/',
  '/api/v1/super-admin/laboratory/application/document/list-create/': '/api/v1/super-admin/laboratory/application/document/detail/{id}/',
  '/api/v1/super-admin/laboratory/choice-service/create-list/': '/api/v1/super-admin/laboratory/choice-service/detail/{id}/',
  '/api/v1/super-admin/medical-service/list/': '/api/v1/super-admin/medical-service/detail/{id}/',
  '/api/v1/super-admin/notif/list/': '/api/v1/super-admin/notif/detail/{id}/',
  '/api/v1/super-admin/notif/devices/': '/api/v1/super-admin/notif/devices/{id}/',
  '/api/v1/super-admin/orders/list-create/': '/api/v1/super-admin/orders/detail/{id}/',
  '/api/v1/super-admin/orders/add-patient/': '/api/v1/super-admin/orders/add-patient/{id}/',
  '/api/v1/super-admin/privacy-policy/legal-documents/': '/api/v1/super-admin/privacy-policy/legal-documents/{id}/',
  '/api/v1/super-admin/profile/doctor-profiles/': '/api/v1/super-admin/profile/doctor-profiles/{id}/',
  '/api/v1/super-admin/profile/patient-profiles/': '/api/v1/super-admin/profile/patient-profiles/{id}/',
  '/api/v1/super-admin/address/list-create/': '/api/v1/super-admin/address/detail/{id}/',
}

export function findSection(key) {
  return sections.find((s) => s.key === key)
}
