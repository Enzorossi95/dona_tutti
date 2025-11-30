# Requerimientos Frontend - Sistema de Contratos Legales

## 📋 Historia de Usuario

**HU-003**: Generación y aceptación del contrato legal simplificado por parte del organizador

### Descripción
Como organizador quiero recibir y firmar digitalmente el contrato legal simplificado generado por el sistema para asegurar la aceptación de las condiciones éticas y legales antes de que mi campaña sea publicada.

---

## ✅ Criterios de Aceptación

### CA1: Generación Automática del Contrato
**Dado que** el organizador haya completado la creación de su campaña  
**Cuando** acceda al paso final del flujo  
**Entonces** el sistema debe mostrar un mensaje indicando que debe generar el contrato legal

### CA2: Visualización del Contrato
**Dado que** el contrato ha sido generado  
**Cuando** el organizador lo abra  
**Entonces** podrá visualizar su contenido completo (PDF) antes de aceptar

### CA3: Firma y Aceptación Digital
**Dado que** el organizador acepte el contrato  
**Cuando** presione "Firmar y Aceptar"  
**Entonces** el sistema registrará la aceptación digital (IP, timestamp, user agent) y la campaña quedará en estado "pending_approval"

### CA4: Validación de Firma Obligatoria
**Dado que** el organizador no haya firmado el contrato  
**Cuando** intente salir o ver su campaña  
**Entonces** el sistema debe recordarle que la firma es obligatoria para publicación

### CA5: Confirmación Final
**Dado que** el contrato ha sido firmado  
**Cuando** se complete el proceso  
**Entonces** mostrar mensaje de éxito indicando que la campaña está pendiente de aprobación por admin

---

## 🎯 Flujo de Usuario (UX)

### Paso 1: Finalización de Creación de Campaña
```
Usuario completa formulario de campaña
  ↓
Click en "Crear Campaña"
  ↓
Backend crea campaña con status: "draft"
  ↓
Redirigir a página de contrato
```

### Paso 2: Generación de Contrato
```
Mostrar pantalla:
  ┌─────────────────────────────────────┐
  │  ✓ Campaña Creada Exitosamente     │
  │                                     │
  │  📄 Paso Final: Contrato Legal     │
  │                                     │
  │  Para publicar tu campaña necesitas │
  │  aceptar el contrato legal.         │
  │                                     │
  │  [Generar Contrato]                 │
  └─────────────────────────────────────┘

Click en "Generar Contrato"
  ↓
Llamar: POST /api/campaigns/{id}/contract/generate
  ↓
Mostrar loading...
  ↓
Recibir URL del PDF
```

### Paso 3: Visualización del Contrato
```
Mostrar pantalla:
  ┌─────────────────────────────────────┐
  │  📄 Contrato Legal                  │
  │                                     │
  │  [PDF Viewer con iframe o modal]    │
  │                                     │
  │  ☐ He leído el contrato completo   │
  │                                     │
  │  [Ver PDF Completo] [Aceptar]      │
  └─────────────────────────────────────┘
```

### Paso 4: Aceptación
```
Usuario marca checkbox + Click "Aceptar"
  ↓
Llamar: POST /api/campaigns/{id}/contract/accept
  ↓
Mostrar loading...
  ↓
Recibir confirmación
```

### Paso 5: Confirmación Final
```
Mostrar pantalla de éxito:
  ┌─────────────────────────────────────┐
  │  ✅ ¡Contrato Aceptado!             │
  │                                     │
  │  Tu campaña ha sido enviada para    │
  │  revisión del equipo de Dona Tutti  │
  │                                     │
  │  Estado: Pendiente de Aprobación    │
  │                                     │
  │  Recibirás un email cuando sea      │
  │  aprobada y publicada.              │
  │                                     │
  │  [Ver Mi Campaña] [Ir al Dashboard] │
  └─────────────────────────────────────┘
```

---

## 🔌 API Endpoints Disponibles

### 1. Generar Contrato PDF

```http
POST /api/campaigns/{campaign_id}/contract/generate
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**: Ninguno (el backend obtiene toda la info de BD)

**Response Success (200)**:
```json
{
  "message": "Contract generated successfully",
  "contract_url": "https://s3.../contracts/uuid/contract-123456.pdf"
}
```

**Response Error (400)**:
```json
{
  "error": "contract already exists for campaign {id}"
}
```

**Response Error (404)**:
```json
{
  "error": "campaign not found"
}
```

**Response Error (500)**:
```json
{
  "error": "organizer must have an email"
}
```

---

### 2. Visualizar Contrato

```http
GET /api/campaigns/{campaign_id}/contract
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "id": "uuid-contract",
  "campaign_id": "uuid-campaign",
  "organizer_id": "uuid-organizer",
  "contract_pdf_url": "https://s3.../contract.pdf",
  "contract_hash": "sha256hash...",
  "accepted_at": "0001-01-01T00:00:00Z",
  "acceptance_metadata": {
    "ip": "",
    "user_agent": ""
  },
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Nota**: Si `accepted_at` es `0001-01-01` significa que NO ha sido aceptado aún.

**Response Error (404)**:
```json
{
  "error": "Contract not found"
}
```

---

### 3. Aceptar Contrato (Firma Digital)

```http
POST /api/campaigns/{campaign_id}/contract/accept
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "organizer_id": "uuid-organizer"
}
```

**Response Success (200)**:
```json
{
  "message": "Contract accepted successfully",
  "status": "pending_approval"
}
```

**Response Error (400)**:
```json
{
  "error": "contract already accepted for campaign {id}"
}
```

**Response Error (404)**:
```json
{
  "error": "contract not found - must generate contract first"
}
```

---

### 4. Verificar Estado de Campaña

```http
GET /api/campaigns/{campaign_id}
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "id": "uuid",
  "title": "Mi Campaña",
  "status": "pending_approval",  // draft, pending_approval, active
  "contract_signed": true,
  ...
}
```

---

## 🎨 Componentes Sugeridos

### 1. Página: `/campaigns/admin/crear/contract`

**Ruta**: `/campaigns/{id}/contract`

**Props necesarios**:
- `campaignId`: UUID de la campaña recién creada
- `organizerId`: UUID del organizador (del contexto/auth)

**Estado local**:
```typescript
interface ContractState {
  loading: boolean;
  contractUrl: string | null;
  hasAccepted: boolean;
  hasReadCheckbox: boolean;
  error: string | null;
  step: 'generate' | 'view' | 'accept' | 'success';
}
```

**Funciones**:
```typescript
async function generateContract() {
  setLoading(true);
  try {
    const response = await fetch(
      `/api/campaigns/${campaignId}/contract/generate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    setContractUrl(data.contract_url);
    setStep('view');
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

async function acceptContract() {
  if (!hasReadCheckbox) {
    alert('Debes confirmar que has leído el contrato');
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch(
      `/api/campaigns/${campaignId}/contract/accept`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organizer_id: organizerId
        })
      }
    );
    const data = await response.json();
    setHasAccepted(true);
    setStep('success');
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
```

---

### 2. Componente: `<PDFViewer>`

**Props**:
```typescript
interface PDFViewerProps {
  url: string;
  onLoad?: () => void;
  className?: string;
}
```

**Implementación sugerida**:
```tsx
// Opción 1: iframe simple
<iframe 
  src={contractUrl} 
  width="100%" 
  height="600px"
  title="Contrato Legal"
/>

// Opción 2: Modal con PDF
<Dialog open={showPDF}>
  <DialogContent>
    <embed 
      src={contractUrl} 
      type="application/pdf"
      width="100%" 
      height="800px"
    />
  </DialogContent>
</Dialog>

// Opción 3: react-pdf (más control)
import { Document, Page } from 'react-pdf';
<Document file={contractUrl}>
  <Page pageNumber={1} />
</Document>
```

---

### 3. Componente: `<ContractSteps>`

Stepper/wizard para guiar al usuario:

```tsx
<Steps current={currentStep}>
  <Step title="Generar" icon="📄" />
  <Step title="Revisar" icon="👁️" />
  <Step title="Aceptar" icon="✍️" />
  <Step title="Confirmado" icon="✅" />
</Steps>
```

---

## 🎨 Diseño UX Detallado

### Pantalla 1: Generar Contrato

```
┌────────────────────────────────────────────┐
│  PASO 4 de 4                        [X]   │
├────────────────────────────────────────────┤
│                                            │
│    ✅ ¡Campaña Creada Exitosamente!       │
│                                            │
│    📄 Contrato Legal                       │
│                                            │
│    Antes de publicar tu campaña, debes    │
│    revisar y aceptar nuestro contrato     │
│    legal que establece:                   │
│                                            │
│    • Compromiso de veracidad              │
│    • Uso correcto de fondos               │
│    • Transparencia                        │
│    • Procedimiento ante denuncias         │
│                                            │
│    Este proceso toma menos de 2 minutos   │
│                                            │
│         [Generar Mi Contrato]             │
│                                            │
│         [← Volver a Editar]               │
│                                            │
└────────────────────────────────────────────┘
```

### Pantalla 2: Revisar Contrato

```
┌────────────────────────────────────────────┐
│  📄 Contrato Legal - Dona Tutti            │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │                                      │ │
│  │  [PDF VIEWER - Contrato completo]   │ │
│  │                                      │ │
│  │  Scroll para ver todo el documento  │ │
│  │                                      │ │
│  │  - Compromiso de veracidad          │ │
│  │  - Uso de fondos                    │ │
│  │  - Transparencia                    │ │
│  │  ...                                │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [📥 Descargar PDF]                        │
│                                            │
│  ☐ He leído y acepto los términos del     │
│     contrato legal                         │
│                                            │
│  Nota: Al aceptar, registraremos tu       │
│  firma digital con fecha, hora e IP.       │
│                                            │
│  [← Atrás]  [Aceptar y Firmar →]         │
│                                            │
└────────────────────────────────────────────┘
```

### Pantalla 3: Confirmación

```
┌────────────────────────────────────────────┐
│                                            │
│              ✅                            │
│                                            │
│      ¡Contrato Firmado Exitosamente!      │
│                                            │
│    Tu campaña ha sido enviada para        │
│    revisión de nuestro equipo.            │
│                                            │
│    Estado: 🟡 Pendiente de Aprobación     │
│                                            │
│    📧 Te notificaremos por email cuando   │
│       sea aprobada y publicada            │
│                                            │
│    ⏱️  Tiempo estimado: 24-48 horas       │
│                                            │
│                                            │
│    [Ver Mi Campaña] [Ir al Dashboard]    │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🔄 Estados de Campaña

| Estado | Descripción | Siguiente Paso |
|--------|-------------|----------------|
| `draft` | Campaña creada, sin contrato | Generar contrato |
| `pending_approval` | Contrato firmado, esperando admin | Admin aprueba |
| `active` | Campaña publicada | Recibir donaciones |
| `rejected` | Rechazada por admin | Editar y reenviar |

---

## ⚠️ Validaciones Frontend

### Antes de Generar Contrato:
- ✅ Usuario autenticado
- ✅ Campaign ID válido
- ✅ Organizer ID válido

### Antes de Aceptar:
- ✅ Checkbox "He leído" marcado
- ✅ PDF cargado completamente
- ✅ Contrato generado previamente

### Manejo de Errores:
```typescript
// Error: Contrato ya existe
if (error.includes('already exists')) {
  message.warning('Ya generaste el contrato para esta campaña');
  // Cargar contrato existente
  fetchExistingContract();
}

// Error: Campaña no encontrada
if (error.includes('not found')) {
  message.error('Campaña no encontrada');
  router.push('/campaigns');
}

// Error: Organizador sin datos completos
if (error.includes('must have')) {
  message.error('Completa tu perfil de organizador primero');
  router.push('/profile/organizer');
}
```

---

## 📱 Responsive

### Mobile:
- PDF en modal fullscreen
- Botones grandes y táctiles
- Scroll vertical para todo el contrato
- Confirmar lectura al llegar al final

### Desktop:
- PDF en iframe grande (800px height)
- Botones en parte inferior fija
- Sidebar con índice del contrato

---

## 🧪 Testing Frontend

### Casos de Prueba:

1. **Happy Path**:
   - Crear campaña → Generar contrato → Ver PDF → Aceptar → Ver confirmación ✅

2. **Contrato ya existe**:
   - Intentar generar dos veces → Mostrar error ⚠️

3. **Sin marcar checkbox**:
   - Click "Aceptar" sin marcar → Mostrar alerta ⚠️

4. **PDF no carga**:
   - Error de S3 → Mostrar error + reintento 🔄

5. **Session expira**:
   - Token inválido → Redirigir a login 🔐

6. **Campaña sin organizador completo**:
   - Faltan datos → Redirigir a completar perfil 📝

---

## 🎯 Objetivos de UX

1. **Claridad**: El usuario debe entender QUÉ está firmando
2. **Transparencia**: Mostrar todos los términos ANTES de aceptar
3. **Simplicidad**: Proceso en máximo 3 clicks
4. **Confianza**: Diseño profesional que genere seguridad
5. **Feedback**: Confirmación clara de cada acción

---

## 📚 Recursos Adicionales

- **Backend Docs**: `/docs/CONTRACT_SYSTEM.md`
- **Swagger API**: `http://localhost:9999/swagger/index.html`
- **Tests Backend**: `/tests/test_contracts.sh`

---

## 🚀 Para Empezar

1. **Crear las rutas**:
   - `/campaigns/new` (ya existe)
   - `/campaigns/:id/contract` (nueva)
   - `/campaigns/:id/success` (nueva)

2. **Crear los componentes**:
   - `<ContractPage>` (página principal)
   - `<PDFViewer>` (visor de PDF)
   - `<ContractAcceptance>` (checkbox + botón)
   - `<ContractSuccess>` (confirmación)

3. **Integrar con API**:
   - Agregar funciones al servicio de campañas
   - Manejar estados de loading/error
   - Implementar redireccionamientos

4. **Testing**:
   - Probar flujo completo
   - Validar errores
   - Verificar responsive

---

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si cierro la ventana sin aceptar?**  
R: La campaña queda en `draft`, puede volver más tarde a aceptar.

**P: ¿Puedo editar la campaña después de firmar?**  
R: No, una vez firmado y en `pending_approval` solo admin puede modificar.

**P: ¿Cuánto tarda la aprobación?**  
R: 24-48 horas hábiles.

**P: ¿Puedo ver el contrato después de firmarlo?**  
R: Sí, en el dashboard de la campaña habrá un botón "Ver Contrato".

---

**Versión**: 1.0  
**Fecha**: Noviembre 2024  
**Backend Ready**: ✅ Sí  
**Endpoints Tested**: ✅ Sí

