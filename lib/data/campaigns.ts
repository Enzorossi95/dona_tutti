import { Campaign, CampaignUpdate, CampaignComment, CampaignDonation } from '@/types/campaign'

export const campaigns: Campaign[] = [
  {
    id: "1",
    title: "Ayuda a Luna - Cirugía de Emergencia",
    description: "Luna fue encontrada en la calle con una fractura grave en su pata trasera. Necesita cirugía urgente para poder caminar nuevamente.",
    image: "/ayuda_luna_campaing.png",
    goal: 150000,
    raised: 89500,
    donors: 47,
    daysLeft: 12,
    location: "Buenos Aires, Argentina",
    category: "Médico",
    urgency: "Alta",
    organizer: {
      name: "Fundación Patitas Felices",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    status: "active",
    animal: {
      name: "Luna",
      type: "Perrita",
      age: "2 años",
      breed: "Mestiza",
    },
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    createdAt: "2024-01-05",
    lastUpdate: "2024-01-15",
  },
  {
    id: "2",
    title: "Rescate de Max - Refugio Temporal",
    description: "Max necesita un lugar seguro mientras se recupera de desnutrición y encuentra una familia adoptiva.",
    image: "/max_campaing.png",
    goal: 75000,
    raised: 45000,
    donors: 23,
    daysLeft: 18,
    location: "Córdoba, Argentina",
    category: "Refugio",
    urgency: "Media",
    organizer: {
      name: "Rescatistas Unidos",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    status: "active",
    animal: {
      name: "Max",
      type: "Perro",
      age: "3 años",
      breed: "Mestizo",
    },
    createdAt: "2024-01-10",
    lastUpdate: "2024-01-18",
  },
  {
    id: "3",
    title: "Alimentación para 50 Gatos Callejeros",
    description: "Colonia de gatos necesita alimento y atención veterinaria básica para sobrevivir el invierno.",
    image: "/alimento_gatos_campaign.png",
    goal: 120000,
    raised: 98000,
    donors: 156,
    daysLeft: 25,
    location: "Rosario, Argentina",
    category: "Alimentación",
    urgency: "Media",
    organizer: {
      name: "Gatitos de la Calle",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    status: "active",
    createdAt: "2024-01-01",
    lastUpdate: "2024-01-20",
  },
]

export const campaignUpdates: Record<string, CampaignUpdate[]> = {
  "1": [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:30",
      type: "medical",
      title: "Consulta veterinaria completada",
      content: "Luna fue examinada por el Dr. García. La radiografía confirma que necesita cirugía en los próximos días. Su estado general es bueno y está respondiendo bien al tratamiento del dolor.",
      fullContent: "Luna fue examinada exhaustivamente por el Dr. García esta mañana. Los resultados de la radiografía confirman que la fractura en su pata trasera requiere intervención quirúrgica urgente. Afortunadamente, no hay daños en los órganos internos y su estado general de salud es bueno. Está respondiendo muy bien al tratamiento del dolor y muestra signos de mejoría en su apetito. El Dr. García recomienda proceder con la cirugía en los próximos 3-5 días para evitar complicaciones. El costo estimado de la cirugía es de $85,000 ARS, que incluye anestesia, materiales quirúrgicos y hospitalización post-operatoria.",
      images: ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"],
      documents: ["Informe_Veterinario_Luna_15012024.pdf", "Radiografia_Luna_15012024.pdf"],
      author: "Dr. García - Veterinario",
      location: "Clínica Veterinaria San Martín",
      published: true,
    },
    {
      id: 2,
      date: "2024-01-12",
      time: "09:15",
      type: "general",
      title: "Luna está mejorando",
      content: "Buenas noticias! Luna está comiendo mejor y mostrando más energía. Sigue con el tratamiento del dolor.",
      fullContent: "Queremos compartir buenas noticias sobre Luna. En los últimos días hemos notado una mejora significativa en su estado de ánimo y apetito. Está comiendo toda su comida y hasta ha mostrado interés en jugar un poco, aunque obviamente limitamos su actividad física. El tratamiento del dolor está funcionando muy bien y ella parece mucho más cómoda. Su cola no para de moverse cuando nos ve llegar, lo que es una excelente señal. Continuamos con el protocolo médico establecido por el Dr. García y estamos muy optimistas sobre su recuperación. Agradecemos profundamente todo el apoyo que hemos recibido.",
      images: ["/placeholder.svg?height=400&width=600"],
      author: "Fundación Patitas Felices",
      location: "Refugio Temporal",
      published: true,
    },
    {
      id: 3,
      date: "2024-01-10",
      time: "16:45",
      type: "expense",
      title: "Gastos médicos - Radiografías",
      content: "Se realizaron las radiografías necesarias para evaluar el estado de la fractura. Costo: $12,000 ARS",
      fullContent: "Hoy se completaron las radiografías necesarias para evaluar con precisión el estado de la fractura de Luna. Se tomaron imágenes desde múltiples ángulos para que el veterinario pueda planificar la cirugía de manera óptima. El costo total fue de $12,000 ARS, que incluye: radiografías digitales (2 placas), sedación ligera para mantener a Luna cómoda durante el procedimiento, y análisis detallado por parte del especialista. Las imágenes muestran claramente la ubicación y severidad de la fractura, confirmando que la cirugía es necesaria para una recuperación completa.",
      images: ["/placeholder.svg?height=400&width=600"],
      documents: ["Factura_Radiografias_10012024.pdf", "Presupuesto_Cirugia_Luna.pdf"],
      author: "Fundación Patitas Felices",
      location: "Centro de Diagnóstico Veterinario",
      expense: {
        total: 12000,
        breakdown: [
          { item: "Radiografías digitales (2 placas)", amount: 8000 },
          { item: "Sedación", amount: 2500 },
          { item: "Análisis especializado", amount: 1500 },
        ],
      },
      published: true,
    },
  ],
}

export const campaignComments: Record<string, CampaignComment[]> = {
  "1": [
    {
      id: 1,
      author: "María González",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "Hace 2 horas",
      content: "Acabo de donar $5,000. Espero que Luna se recupere pronto. ¡Fuerza pequeña! 💕",
    },
    {
      id: 2,
      author: "Carlos Rodríguez",
      avatar: "/placeholder.svg?height=32&width=32",
      date: "Hace 5 horas",
      content: "Qué hermosa es Luna. Ya compartí la campaña en mis redes sociales. ¡Vamos que podemos ayudarla!",
    },
  ],
}

export const campaignDonations: Record<string, CampaignDonation[]> = {
  "1": [
    {
      id: 1,
      donorName: "María González",
      donorEmail: "maria@email.com",
      amount: 15000,
      date: "2024-01-15",
      time: "14:30",
      transactionId: "TXN-001-2024",
      paymentMethod: "MercadoPago",
      status: "completed",
      message: "Espero que Luna se recupere pronto. ¡Fuerza pequeña! 💕",
      anonymous: false,
    },
  ],
}

// Funciones helper
export const getCampaignById = (id: string): Campaign | undefined => {
  return campaigns.find(campaign => campaign.id === id)
}

export const getCampaignUpdates = (campaignId: string): CampaignUpdate[] => {
  return campaignUpdates[campaignId] || []
}

export const getCampaignComments = (campaignId: string): CampaignComment[] => {
  return campaignComments[campaignId] || []
} 

export const getCampaignDonations = (campaignId: string): CampaignDonation[] => {
  return campaignDonations[campaignId] || []
}