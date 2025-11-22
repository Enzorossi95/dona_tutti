# 🔧 Plan de Refactorización - Donate Me

## 📊 Problemas Identificados

### 1. Datos Hardcodeados
- ❌ IDs de campañas fijos en múltiples archivos
- ❌ Datos de ejemplo duplicados en cada componente
- ❌ Links hardcodeados como `/campana/1/comprobantes`
- ❌ Sin gestión centralizada de datos

### 2. Estructura de Rutas
- ❌ Mezcla confusa entre rutas públicas y privadas
- ❌ Duplicación de funcionalidad
- ❌ Falta de consistencia en organización

### 3. Arquitectura
- ❌ Lógica de negocio en componentes UI
- ❌ Componentes muy grandes
- ❌ Sin separación de responsabilidades

## 🎯 Objetivos de la Refactorización

1. **Eliminar datos hardcodeados**
2. **Crear una estructura de datos centralizada**
3. **Implementar arquitectura limpia**
4. **Mejorar la organización de rutas**
5. **Separar responsabilidades**

## 📁 Nueva Estructura Propuesta

```
donate_me/
├── app/
│   ├── (public)/                    # Rutas públicas
│   │   ├── page.tsx                 # Homepage
│   │   ├── campana/
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Detalle de campaña
│   │   │       └── comprobantes/
│   │   │           └── page.tsx     # Comprobantes públicos
│   │   └── como-funciona/
│   │       └── page.tsx
│   ├── admin/                       # Panel de administración
│   │   ├── layout.tsx               # Layout específico admin
│   │   ├── page.tsx                 # Dashboard admin
│   │   └── campanas/
│   │       ├── page.tsx             # Lista de campañas
│   │       ├── crear/
│   │       │   └── page.tsx         # Crear campaña
│   │       └── [id]/
│   │           ├── page.tsx         # Editar campaña
│   │           └── comprobantes/
│   │               └── page.tsx     # Gestión de comprobantes
│   ├── api/                         # API Routes
│   │   ├── campaigns/
│   │   ├── receipts/
│   │   └── donations/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                          # Componentes base (shadcn)
│   ├── campaign/                    # Componentes específicos de campañas
│   │   ├── CampaignCard.tsx
│   │   ├── CampaignDetail.tsx
│   │   ├── CampaignForm.tsx
│   │   └── CampaignFilters.tsx
│   ├── receipts/                    # Componentes de comprobantes
│   │   ├── ReceiptCard.tsx
│   │   ├── ReceiptModal.tsx
│   │   └── ReceiptForm.tsx
│   └── common/                      # Componentes comunes
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── data/                        # Datos y tipos
│   │   ├── campaigns.ts
│   │   ├── receipts.ts
│   │   └── types.ts
│   ├── hooks/                       # Custom hooks
│   │   ├── useCampaigns.ts
│   │   ├── useReceipts.ts
│   │   └── useDonations.ts
│   ├── services/                    # Servicios de API
│   │   ├── campaignService.ts
│   │   ├── receiptService.ts
│   │   └── donationService.ts
│   └── utils/                       # Utilidades
│       ├── formatters.ts
│       ├── validators.ts
│       └── constants.ts
└── types/                           # Tipos TypeScript globales
    ├── campaign.ts
    ├── receipt.ts
    └── donation.ts
```

## 🔄 Pasos de Implementación

### Fase 1: Estructura de Datos
1. ✅ Crear tipos TypeScript centralizados
2. ✅ Extraer datos a archivos separados
3. ✅ Implementar servicios de datos

### Fase 2: Componentes
1. ✅ Dividir componentes grandes
2. ✅ Crear componentes reutilizables
3. ✅ Implementar custom hooks

### Fase 3: Rutas
1. ✅ Reorganizar estructura de rutas
2. ✅ Eliminar duplicaciones
3. ✅ Implementar layouts específicos

### Fase 4: Funcionalidad
1. ✅ Implementar gestión de estado
2. ✅ Agregar validaciones
3. ✅ Mejorar UX/UI

## 🎯 Beneficios Esperados

- ✅ **Mantenibilidad**: Código más fácil de mantener y extender
- ✅ **Reutilización**: Componentes y lógica reutilizable
- ✅ **Escalabilidad**: Estructura preparada para crecimiento
- ✅ **Testabilidad**: Código más fácil de testear
- ✅ **Performance**: Mejor organización y carga de datos
- ✅ **DX**: Mejor experiencia de desarrollo

## 📝 Notas Importantes

- Mantener compatibilidad con rutas existentes
- Implementar migración gradual
- Preservar funcionalidad actual
- Mejorar progresivamente la UX 