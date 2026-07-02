// Laboratory Staff kabineti uchun endpoint va forma konfiguratsiyalari.
// Super Admin'ning sections.js'idan mustaqil — boshqa token/rol bilan ishlaydi.

export const LAB_PROFILE_GET = '/api/v1/staff/laboratory-staff/my-laboratory/'
export const LAB_PROFILE_UPDATE = '/api/v1/staff/laboratory-staff/my-laboratory/update/'

export const labProfileFields = [
  { name: 'lab_name', label: 'Laboratoriya nomi', type: 'text' },
  { name: 'phone', label: 'Telefon', type: 'text' },
  { name: 'region', label: 'Viloyat', type: 'text' },
  { name: 'district', label: 'Tuman', type: 'text' },
  { name: 'address', label: 'Manzil', type: 'text' },
  { type: 'latlng', latName: 'latitude', lngName: 'longitude', label: 'Joylashuv (xaritadan tanlang)' },
  { name: 'bio', label: 'Bio', type: 'textarea' },
  { name: 'experience_years', label: 'Tajriba (yil)', type: 'number' },
  { name: 'logo', label: 'Logo', type: 'file' },
  { name: 'certificate', label: 'Sertifikat', type: 'file' },
]

export const LAB_SERVICE_CATALOG = '/api/v1/staff/laboratory-staff/service-catalog/list/'
export const LAB_SERVICE_CHOICE_LIST = '/api/v1/staff/laboratory/laboratory-service-choice/list/'
export const LAB_SERVICE_CHOICE_CREATE = '/api/v1/staff/laboratory/laboratory-service/choice/'
export const labServiceDetail = (id) => `/api/v1/staff/laboratory-staff/my-service/${id}/detail/`
export const labServiceUpdate = (id) => `/api/v1/staff/laboratory-staff/my-service/${id}/update/`

export const LAB_STAFF_LIST = '/api/v1/staff/laboratory-staff/staff/list/'
export const LAB_STAFF_CREATE = '/api/v1/staff/laboratory-staff/staff/create/'
export const labStaffCreateFields = [
  { name: 'full_name', label: 'F.I.O', type: 'text', required: true },
  { name: 'contact', label: 'Kontakt', type: 'text', required: true },
  { name: 'password', label: 'Parol (kamida 6 belgi)', type: 'text', required: true },
]
export const labStaffUpdate = (id) => `/api/v1/staff/laboratory-staff/staff/${id}/update/`

export const LAB_ORDER_LIST = '/api/v1/staff/laboratory/laboratory/order/list/'
export const labOrderAction = (orderId) => `/api/v1/staff/laboratory/laboratory/${orderId}/action/`
export const labOrderAssignStaff = (orderId) => `/api/v1/staff/laboratory-staff/order/${orderId}/assign-staff/`
// Faqat shu buyurtmaga biriktirilgan xodimning o'ziga ruxsat beriladi (backend tekshiradi).
export const labOrderUpdateStatus = (orderId) => `/api/v1/staff/laboratory-staff/order/${orderId}/update/`

export const ORDER_STATUS_OPTIONS = ['WAITING', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'FINISHED', 'CANCELLED']

// Xodim online/offline holati (barcha "staff" turlari uchun umumiy endpoint).
export const CONNECTIVITY_MAIN = '/api/v1/staff/connectivity/main/'
export const CONNECTIVITY_CHANGE = '/api/v1/staff/connectivity/change/'
