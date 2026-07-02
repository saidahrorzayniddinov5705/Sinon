// Avtomatik Swagger schema'dan yaratilgan filtrlar. Kalit = list endpoint.
// Tur: select | bool | text | number | daterange | numrange
export const filters = {
  "/api/v1/super-admin/users/list/": [
    {
      "key": "active_role",
      "label": "Aktiv rol",
      "type": "select",
      "options": [
        "Bemor",
        "Shifokor",
        "Laboratory",
        "PharmCompany",
        "MedBrat",
        "Menejer",
        "Admin",
        "SuperAdmin"
      ]
    },
    {
      "key": "contact_type",
      "label": "Kontakt turi",
      "type": "select",
      "options": [
        "phone",
        "email"
      ]
    },
    {
      "key": "gender",
      "label": "Jinsi",
      "type": "select",
      "options": [
        "erkak",
        "ayol"
      ]
    },
    {
      "key": "is_active",
      "label": "Aktiv",
      "type": "bool"
    },
    {
      "key": "is_staff",
      "label": "Xodim",
      "type": "bool"
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Tug'ilgan sana",
      "type": "daterange",
      "after": "birth_date_after",
      "before": "birth_date_before"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ],
  "/api/v1/super-admin/auth/users/list/": [
    {
      "key": "contact_type",
      "label": "Kontakt turi",
      "type": "select",
      "options": [
        "email",
        "phone"
      ]
    },
    {
      "key": "gender",
      "label": "Jinsi",
      "type": "select",
      "options": [
        "ayol",
        "erkak"
      ]
    },
    {
      "key": "is_active",
      "label": "Aktiv",
      "type": "bool"
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    }
  ],
  "/api/v1/super-admin/doctor-application/list/": [
    {
      "key": "district",
      "label": "Tuman",
      "type": "text"
    },
    {
      "key": "gender",
      "label": "Jinsi",
      "type": "select",
      "options": [
        "erkak",
        "ayol"
      ]
    },
    {
      "key": "region",
      "label": "Viloyat",
      "type": "text"
    },
    {
      "key": "specialization",
      "label": "Mutaxassislik",
      "type": "text"
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "select",
      "options": [
        "approved",
        "cancelled",
        "finished",
        "pending"
      ]
    },
    {
      "label": "Tug'ilgan sana",
      "type": "daterange",
      "after": "birth_date_after",
      "before": "birth_date_before"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    },
    {
      "label": "Tajriba",
      "type": "numrange",
      "min": "experience_year_min",
      "max": "experience_year_max"
    }
  ],
  "/api/v1/super-admin/doctor-medical-service/list/": [
    {
      "key": "doctor",
      "label": "Shifokor ID",
      "type": "number"
    },
    {
      "key": "price",
      "label": "Narx",
      "type": "number"
    },
    {
      "key": "service",
      "label": "Xizmat ID",
      "type": "number"
    },
    {
      "key": "service_type",
      "label": "Xizmat turi",
      "type": "select",
      "options": [
        "addition",
        "standard"
      ]
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    },
    {
      "label": "Narx",
      "type": "numrange",
      "min": "price__gte",
      "max": "price__lte"
    }
  ],
  "/api/v1/super-admin/home/banner/": [
    {
      "key": "_type",
      "label": "Turi",
      "type": "select",
      "options": [
        "elon",
        "link"
      ]
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "key": "title__icontains",
      "label": "Sarlavha",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ],
  "/api/v1/super-admin/home/service/": [
    {
      "key": "name__icontains",
      "label": "Nomi",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ],
  "/api/v1/super-admin/home/contact-us/": [
    {
      "key": "call__icontains",
      "label": "Telefon",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "key": "name__icontains",
      "label": "Nomi",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ],
  "/api/v1/super-admin/home/social-network/": [
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "key": "title__icontains",
      "label": "Sarlavha",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ],
  "/api/v1/super-admin/home/share-app/": [
    {
      "key": "device_id__icontains",
      "label": "Qurilma ID",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "key": "user",
      "label": "Foydalanuvchi ID",
      "type": "number"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ],
  "/api/v1/super-admin/laboratory/order/list/": [
    {
      "key": "status",
      "label": "Holat",
      "type": "select",
      "options": [
        "WAITING",
        "ACCEPTED",
        "ON_THE_WAY",
        "ARRIVED",
        "FINISHED",
        "CANCELLED"
      ]
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_from",
      "before": "created_to"
    },
    {
      "label": "Summa",
      "type": "numrange",
      "min": "summa_from",
      "max": "summa_to"
    }
  ],
  "/api/v1/super-admin/medical-service/list/": [
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    },
    {
      "label": "Max narx",
      "type": "numrange",
      "min": "max_price_from",
      "max": "max_price_to"
    },
    {
      "label": "Min narx",
      "type": "numrange",
      "min": "min_price_from",
      "max": "min_price_to"
    },
    {
      "label": "QQS %",
      "type": "numrange",
      "min": "vat_percent_min",
      "max": "vat_percent_max"
    }
  ],
  "/api/v1/super-admin/notif/list/": [
    {
      "key": "device_id",
      "label": "Qurilma ID",
      "type": "number"
    }
  ],
  "/api/v1/super-admin/orders/list/": [
    {
      "key": "status",
      "label": "Holat",
      "type": "select",
      "options": [
        "WAITING",
        "ACCEPTED",
        "ON_THE_WAY",
        "ARRIVED",
        "FINISHED",
        "CANCELLED"
      ]
    },
    {
      "label": "Sana",
      "type": "daterange",
      "after": "date_from",
      "before": "date_to"
    },
    {
      "label": "Summa",
      "type": "numrange",
      "min": "min_summa",
      "max": "max_summa"
    }
  ],
  "/api/v1/super-admin/privacy-policy/legal-documents/": [
    {
      "key": "app_type",
      "label": "App turi",
      "type": "text"
    },
    {
      "key": "doc_type",
      "label": "Hujjat turi",
      "type": "text"
    },
    {
      "key": "is_active",
      "label": "Aktiv",
      "type": "bool"
    },
    {
      "key": "version",
      "label": "Versiya",
      "type": "text"
    }
  ],
  "/api/v1/super-admin/profile/doctor-profiles/": [
    {
      "key": "is_private",
      "label": "Yopiq",
      "type": "bool"
    },
    {
      "key": "specialization",
      "label": "Mutaxassislik",
      "type": "text"
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    },
    {
      "label": "Tajriba",
      "type": "numrange",
      "min": "experience_min",
      "max": "experience_max"
    },
    {
      "label": "Obunachilar",
      "type": "numrange",
      "min": "followers_min",
      "max": ""
    },
    {
      "label": "Reyting",
      "type": "numrange",
      "min": "rating_min",
      "max": "rating_max"
    }
  ],
  "/api/v1/super-admin/profile/patient-profiles/": [
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ],
  "/api/v1/super-admin/laboratory-staff/list/": [
    {
      "key": "search",
      "label": "Qidiruv",
      "type": "text"
    }
  ],
  "/api/v1/super-admin/address/list/": [
    {
      "key": "address_type",
      "label": "Manzil turi",
      "type": "select",
      "options": [
        "home",
        "other",
        "work"
      ]
    },
    {
      "key": "district",
      "label": "Tuman",
      "type": "text"
    },
    {
      "key": "district__icontains",
      "label": "Tuman",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "key": "patient",
      "label": "Bemor ID",
      "type": "number"
    },
    {
      "key": "region",
      "label": "Viloyat",
      "type": "text"
    },
    {
      "key": "region__icontains",
      "label": "Viloyat",
      "type": "select",
      "options": [
        "t",
        "e",
        "x",
        "t"
      ]
    },
    {
      "key": "status",
      "label": "Holat",
      "type": "bool"
    },
    {
      "label": "Yaratilgan sana",
      "type": "daterange",
      "after": "created_at_after",
      "before": "created_at_before"
    }
  ]
}

export function getFilters(listEndpoint) {
  return filters[listEndpoint] || []
}
