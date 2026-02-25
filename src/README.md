# Arquitectura base (RN Expo)

Esta carpeta quedó preparada siguiendo las skills de Clean Architecture + MVVM + MobX + Inversify.

## Estructura

- `src/config`: contenedor DI y tokens (`types.ts`, `di.ts`)
- `src/domain`
  - `entities`
  - `repositories` (contratos)
  - `services` (contratos)
  - `useCases` (`UseCase.ts` + casos por carpeta con `index.ts`)
- `src/data`
  - `models`
  - `services`
  - `repositories` (implementaciones)
- `src/ui`
  - `screens`
  - `components`
  - `styles`
  - `utils`
- `src/navigation`: setup explícito de React Navigation
- `src/__test__`: base para pruebas de use cases y view models

## Flujo ejemplo incluido

`HomeScreen -> HomeViewModel -> GetWelcomeMessageUseCase -> HomeRepository`

## Notas

- Decorators/metadata habilitados para Inversify.
- Alias configurados: `@/*` y `@src/*`.
- La app inicia desde `App.tsx` usando `AppNavigator` (React Navigation, sin Expo Router).
