# Interview Kata — Dashboard de Tareas Colaborativas

Una aplicación de gestión de tareas construida con Expo 54 + React Native 0.81.5. Implementa un patrón **offline-first** completo usando WatermelonDB, una arquitectura Clean Architecture con MVVM + MobX + Inversify, y un componente nativo `AvatarView` creado con Expo Modules SDK (Kotlin + Swift).

---

## Stack Tecnológico

| Categoría                 | Tecnología                        |
| ------------------------- | --------------------------------- |
| Framework                 | Expo SDK 54 (bare workflow)       |
| Lenguaje                  | TypeScript (modo strict)          |
| Manejo de estado          | MobX 6 + mobx-react-lite          |
| Persistencia local        | WatermelonDB 0.28 (SQLite, JSI)   |
| Inyección de dependencias | Inversify 7                       |
| HTTP                      | Axios                             |
| Navegación                | React Navigation 7 (native-stack) |
| API externa               | <https://dummyjson.com/todos>       |
| Módulo nativo             | Expo Modules SDK (Kotlin + Swift) |
| Tests                     | Jest 29 + jest-expo               |

---

## Instalación y Ejecución

### Prerequisitos

- Node.js ≥ 20
- JDK 17 (Android)
- Android Studio con un AVD configurado **o** un dispositivo físico Android
- _(iOS)_ macOS con Xcode 16+ y CocoaPods

### 1. Instalar dependencias JS

```bash
npm install
```

### 2. Compilar y ejecutar en Android

```bash
npm run android
# equivalente a: npx expo run:android
```

> El directorio `android/` ya está generado (via `expo prebuild`). No es necesario volver a correr prebuild para Android.

### 3. Compilar y ejecutar en iOS _(requiere macOS)_

```bash
# Generar el proyecto iOS (solo necesario una vez)
npx expo prebuild --platform ios

# Instalar pods
cd ios && pod install && cd ..

# Ejecutar
npm run ios
# equivalente a: npx expo run:ios
```

> El directorio `ios/` no está incluido en el repo ya que su generación requiere macOS + Xcode. El módulo nativo `AvatarView` incluye la implementación Swift completa en `modules/avatar-view/ios/`.

### 4. Scripts útiles

```bash
npm run lint            # ESLint
npm run format:check    # Prettier check
npm run test            # Jest (unit tests)
npm run test:coverage   # Jest con reporte de cobertura
```

---

## Arquitectura Offline-First

### ¿Por qué WatermelonDB?

WatermelonDB fue elegido por tres razones técnicas que encajan directamente con los requisitos de la prueba:

1. **Queries reactivas nativas**: `collection.query().observe()` devuelve un RxJS `Observable<Task[]>` que se puede conectar directamente al patrón de suscripción del ViewModel (MobX + RxJS). Cuando WatermelonDB escribe un registro, la UI se actualiza automáticamente sin polling ni callbacks manuales.

2. **SQLite con JSI**: Opera sobre SQLite usando el JavaScript Interface (JSI) de React Native, que elimina el bridge asíncrono para operaciones de base de datos. Esto lo hace considerablemente más rápido que soluciones basadas en AsyncStorage o el bridge clásico.

3. **Separación lectura/escritura**: Fuerza un modelo de escritura explícita (`database.write(async () => { ... })`) que se alinea con el patrón de repositorio de Clean Architecture — toda mutación pasa por `TaskRepositoryImpl`, nunca directamente desde la UI.

### Flujo de datos

```
API (dummyjson.com)
        │
        ▼ Solo en sync
 TaskService (Axios)
        │
        ▼
TaskRepositoryImpl ──── WatermelonDB (SQLite, local)
        │                       │
        │           observeTasks() → Observable<Task[]>
        ▼                       ▼
 SyncTasksUseCase        ObserveTasksUseCase
        │                       │
        └───────────────────────┘
                     │
              HomeViewModel
          (MobX subscription)
                     │
              HomeScreen (observer)
```

### Comportamiento offline

| Operación         | Con conexión                                   | Sin conexión                                |
| ----------------- | ---------------------------------------------- | ------------------------------------------- |
| Primera apertura  | Descarga de API → persiste en DB               | Error silencioso, UI vacía                  |
| Pull-to-refresh   | Re-descarga API, upsert en DB                  | Error notificado, datos locales intactos    |
| Toggle completado | Persiste local + refleja en API (próximo sync) | Persiste local, optimistic update inmediato |
| Lectura de lista  | Desde DB local (siempre)                       | Desde DB local (siempre)                    |

**Invariante clave**: el campo `completed` de un task **nunca** es sobreescrito por la sincronización desde la API. `TaskRepositoryImpl.syncTasks()` preserva el estado local al hacer upsert — solo actualiza `todo` y `userId` en registros existentes.

---

## Por qué MobX (y no Zustand / Redux / Context)

El stack original del proyecto usaba MobX + Inversify. Se mantuvo esta elección por las siguientes razones:

**Cómo se organiza el estado:**

- **Estado de dominio**: vive en entidades (`Task`) y repositorios (WatermelonDB)
- **Estado de UI**: vive en ViewModels (`HomeViewModel`, `TaskDetailViewModel`) — son clases MobX `@injectable()` que no conocen React
- **Estado de servidor/caché**: manejado implícitamente por WatermelonDB via `observeTasks()`

**Mantenibilidad**: Los ViewModels son clases TypeScript puras — sin hooks, sin componentes. Pueden ser instanciados y testeados sin ningún setup de React.

**Testabilidad**: Cada ViewModel recibe sus dependencias por constructor (Inversify), lo que permite inyectar mocks trivialmente en tests unitarios. Los 27 tests actuales demuestran este patrón.

---

## Arquitectura del Código

```
src/
├── config/           # DI container, symbols, app config
├── data/
│   ├── database/     # WatermelonDB schema, model, singleton
│   ├── network/      # AxiosManager, WatermelonManager
│   ├── repositories/ # Implementaciones de contratos de dominio
│   └── services/     # TaskService (HTTP transport)
├── domain/
│   ├── entities/     # Task (clase de dominio pura)
│   ├── repositories/ # Contratos (interfaces)
│   ├── services/     # HttpManager (contrato)
│   └── useCases/     # Un UseCase por acción de negocio
└── ui/
    ├── components/   # Componentes reutilizables
    ├── navigation/   # AppNavigator, tipos de rutas
    ├── screens/      # Screen + ViewModel por pantalla
    ├── store/        # NetworkStore, RootStore, SyncCoordinator
    ├── styles/       # Tokens: Colors, Fonts, Spacings, etc.
    └── utils/        # Logger, colorUtils

modules/
└── avatar-view/      # Módulo nativo Expo Modules SDK
    ├── android/      # AvatarView.kt, AvatarViewModule.kt
    ├── ios/          # AvatarView.swift, AvatarViewModule.swift
    └── src/          # Bridge JS: AvatarView.tsx, index.ts
```

**Regla de dependencias** (Clean Architecture):

```
UI → ViewModel → UseCases → Domain interfaces ← Data implementations
```

Ninguna capa importa hacia "arriba". El dominio no tiene dependencias de framework.

---

## Componente Nativo AvatarView

### Implementación

El componente `AvatarView` está implementado con **Expo Modules SDK** (`expo-modules-core`), que es el path oficial recomendado para Expo 54 con New Architecture habilitada. Es funcionalmente equivalente a implementar un `SimpleViewManager` (Android) o `RCTViewManager` (iOS) pero con una API más ergonómica y compatible con Fabric/JSI.

**Android** (`modules/avatar-view/android/`):

- `AvatarView.kt` — extiende `ExpoView`, sobreescribe `onDraw()` para pintar un círculo con `Canvas` y las iniciales centradas
- `AvatarViewModule.kt` — declara `Name("AvatarView")` y expone las props `name: String` y `size: Int`

**iOS** (`modules/avatar-view/ios/`):

- `AvatarView.swift` — extiende `ExpoView`, implementa `draw(_ rect:)` con `UIGraphicsGetCurrentContext()`
- `AvatarViewModule.swift` — declara `Name("AvatarView")` y expone las mismas props

**JS bridge** (`modules/avatar-view/src/`):

```tsx
import { AvatarView } from 'avatar-view';

<AvatarView name="Santiago Lopez" size={40} />;
// → Renderiza "SL" sobre un círculo color determinístico
```

**Algoritmo de color**: hash de la suma de char codes del nombre → índice en paleta de 6 colores. La misma lógica está implementada en Kotlin, Swift y TypeScript (fallback JS).

---

## Tests

```bash
npm run test:coverage
```

| Suite                        | Tests  |
| ---------------------------- | ------ |
| `GetAllTasksUseCase`         | 2      |
| `GetTaskByIdUseCase`         | 2      |
| `GetWelcomeMessageUseCase`   | 2      |
| `ObserveTasksUseCase`        | 2      |
| `SyncTasksUseCase`           | 2      |
| `ToggleTaskCompletedUseCase` | 2      |
| `TaskRepositoryImpl`         | 3      |
| `HomeViewModel`              | 8      |
| `TaskDetailViewModel`        | 8      |
| **Total**                    | **31** |

Cobertura actual: **~88% de statements** sobre dominio + ViewModels.

Los tests son puramente unitarios — sin red, sin DB real, sin renders de React. WatermelonDB se mockea en `TaskRepositoryImpl.test.ts`; los ViewModels reciben use cases mock por constructor.

---

## Uso de IA

### Herramientas utilizadas

**GitHub Copilot (Claude Sonnet 4.6)** fue el asistente principal durante todo el desarrollo.

### Tareas donde se usó IA

| Tarea                         | Uso de IA                                                                                                            | Supervisión aplicada                                                                                                                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planificación de arquitectura | Propuso la elección de WatermelonDB + expo-modules-core, la estructura de carpetas, y las fases de implementación    | Revisé que el plan coincidiera con Clean Architecture + los skills internos del proyecto. Ajusté el orden de fases para mantener el build compilando en cada paso.                                                                |
| Scaffolding inicial           | Generó los archivos de `src/data/database/`, use cases, y la reescritura de `TaskRepositoryImpl`                     | Verifiqué cada archivo contra las interfaces de dominio. Corregí el bug donde `syncTasks()` sobreescribía `completed` con el valor de la API.                                                                                     |
| WatermelonDB integration      | Generó el `schema.ts`, `TaskWatermelonModel.ts`, y el singleton `database.ts` con fallback `LokiJSAdapter` para Jest | Validé que el schema versioning fuera correcto y que el fallback no rompiera los tests con imports de módulos nativos.                                                                                                            |
| ViewModels                    | Generó `HomeViewModel` y `TaskDetailViewModel` completos con patrón optimistic update + rollback                     | Revisé que el patrón siguiera estrictamente el canonical MVVM definido en los skills (`updateLoadingState`, `handleError`, `reset()`). Detecté que `TaskDetailViewModel` original no tenía `reset()` ni los helpers y lo corregí. |
| Módulo nativo AvatarView      | Generó los 4 archivos nativos (Kotlin + Swift) y el bridge JS                                                        | Revisé la lógica del hash de color contra la implementación JS existente en `Avatar.tsx` para garantizar paridad visual. Verifiqué que el `expo-module.config.json` declarara correctamente ambas plataformas.                    |
| Tests unitarios               | Generó los 9 suites de tests originales                                                                              | Identifiqué que la cobertura era 67% (bajo el threshold de 70%). Pedí tests adicionales para las ramas de error y los getters computados. El agente llegó a 88%.                                                                  |
| Correcciones de lint/formato  | Detectó y corrigió automáticamente import ordering y formateo de Prettier en todos los archivos modificados          | `npm run lint` + `npm run format:check` ejecutados manualmente para verificar exit 0 antes de considerar cada fase completa.                                                                                                      |
| Este README                   | Generado por IA a partir del análisis del codebase                                                                   | Revisé que cada sección correspondiera exactamente a la implementación real (no a una implementación planeada). Verifiqué los comandos de instalación en la terminal antes de documentarlos.                                      |

### Cómo mi supervisión fue clave

El agente de IA nunca tuvo visibilidad del estado completo del proyecto en todo momento. Las intervenciones críticas que evitaron errores costosos:

1. **Bug de sincronización**: El primer borrador de `syncTasks()` sobreescribía el campo `completed` local con el valor de la API. Identifiqué que esto rompería el requisito de "modificaciones offline" al siguiente pull-to-refresh. Lo corregí explícitamente.

2. **Skill compliance**: Los skills internos del proyecto definen un patrón canónico de ViewModel (`updateLoadingState`, `handleError`, `reset()`). El primer borrador de `TaskDetailViewModel` no lo seguía. Identifiqué la desviación y pedí la refactorización.

3. **Cobertura de tests**: El agente consideró que 67% era suficiente. Yo identifiqué los paths no cubiertos (error branches en ViewModels, `reset()`, getters) y pedí los tests específicos para llegar a 88%.

4. **`ios/` en Windows**: El `expo prebuild` corrido en Windows solo generó `android/`. Identifiqué que `ios/` no existía y documenté el paso de generación en este README en lugar de ignorar el problema.
