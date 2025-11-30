# Guía Rápida - Sistema de Contratos

## 🚀 Inicio Rápido

### Para Usuarios (Organizadores)

1. **Crear Campaña**
   - Ve a `/admin/campanas/crear`
   - Completa el formulario en 4 pasos
   - Click "Publicar Campaña"

2. **Firmar Contrato**
   - En el modal de éxito, click "Firmar Contrato Legal"
   - Click "Generar Mi Contrato"
   - Revisa el PDF completo
   - Marca checkbox "He leído y acepto"
   - Click "Aceptar y Firmar"

3. **Esperar Aprobación**
   - Tu campaña queda en estado "Pendiente de Aprobación"
   - Recibirás email cuando sea aprobada (24-48 horas)

---

## 🛠️ Para Desarrolladores

### Rutas Creadas

```
/admin/campanas/[id]/contrato  → Página principal del contrato
```

### Componentes Reutilizables

```typescript
// Hook principal
import { useContractFlow } from '@/hooks/campaigns/useContractFlow'

const {
  step,                    // Estado actual: 'generate' | 'view' | 'accept' | 'success'
  loading,                 // Estado de carga
  contractUrl,             // URL del PDF del contrato
  hasReadCheckbox,         // Estado del checkbox
  error,                   // Mensaje de error
  generateContract,        // Función para generar contrato
  acceptContract,          // Función para aceptar contrato
  setHasReadCheckbox,      // Setter del checkbox
  validateOrganizerData,   // Validar datos del organizador
} = useContractFlow(campaignId, organizerId)

// Componente de visor PDF
import { PDFViewer } from '@/components/contract/PDFViewer'
<PDFViewer url={contractUrl} onLoad={() => console.log('loaded')} />

// Pantalla de éxito
import { ContractSuccess } from '@/components/contract/ContractSuccess'
<ContractSuccess campaignId={campaignId} />

// Formulario de datos de organizador
import { OrganizerDataForm } from '@/components/contract/OrganizerDataForm'
<OrganizerDataForm
  missingFields={['email', 'phone']}
  organizerData={organizer}
  onComplete={(data) => console.log(data)}
/>
```

### API Endpoints

```typescript
// Generar contrato
POST /api/campaigns/{id}/contract/generate
Headers: { Authorization: Bearer {token} }
Response: { message: string, contract_url: string }

// Obtener contrato existente
GET /api/campaigns/{id}/contract
Response: Contract object

// Aceptar contrato
POST /api/campaigns/{id}/contract/accept
Body: { organizer_id: string }
Response: { message: string, status: "pending_approval" }
```

### Variables de Entorno

```bash
NEXT_PUBLIC_API_URL=http://localhost:9999
```

---

## 🐛 Troubleshooting

### Problema: PDF no carga
**Solución**: Verificar que la URL del PDF sea accesible. El backend debe retornar una URL pública de S3.

### Problema: Error "organizer must have email"
**Solución**: El formulario inline debería aparecer automáticamente. Si no, verificar que `organizerId` esté siendo pasado correctamente.

### Problema: Contrato ya existe
**Solución**: El hook automáticamente carga el contrato existente. Si el contrato ya fue aceptado, va directo al estado "success".

### Problema: Error 401
**Solución**: El sistema automáticamente intenta refrescar el token. Si falla, redirige a login.

---

## 📝 Notas Importantes

1. **Status de Campaña**: Después de firmar el contrato, la campaña queda en `pending_approval`, NO en `active`. Solo un admin puede cambiarla a `active`.

2. **Datos de Organizador**: El organizador DEBE tener email y phone para generar el contrato. Si faltan, se muestra un formulario inline.

3. **Firma Digital**: La firma consiste en: timestamp, IP, user agent, y hash del PDF. Se registra automáticamente en el backend.

4. **Contrato Único**: Solo puede haber un contrato por campaña. Si se intenta generar dos veces, se carga el existente.

---

## 🔍 Verificación Rápida

```bash
# Backend debe estar corriendo en puerto 9999
curl http://localhost:9999/health

# Frontend debe estar corriendo en puerto 3000
curl http://localhost:3000

# Verificar que no hay errores de linting
npm run lint
```

---

## 📞 Soporte

Para dudas sobre el backend, revisar `/docs/CONTRACT_SYSTEM.md`  
Para dudas sobre el frontend, revisar `/docs/CONTRACT_IMPLEMENTATION_SUMMARY.md`

