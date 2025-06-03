# Financial Products App

Aplicación web para la gestión de productos financieros, desarrollada con Angular siguiendo principios de Clean Code y SOLID.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Uso](#uso)
- [Scripts Disponibles](#scripts-disponibles)
- [Buenas Prácticas](#buenas-prácticas)
- [Dependencias Principales](#dependencias-principales)
- [Autor](#autor)

## Descripción
Esta aplicación permite listar, crear, editar y eliminar productos financieros, integrando validaciones avanzadas y una experiencia de usuario moderna.

## Características
- Listado y búsqueda de productos financieros
- Creación y edición con validaciones reactivas
- Eliminación con confirmación modal
- Manejo centralizado de errores
- Código documentado y limpio, sin plantillas prefabricadas

## Estructura del Proyecto
```
frontend/financial-products/
├── src/app/
│   ├── features/products/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── shared/
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── environments/
└── ...
```

## Instalación
1. Clona el repositorio:
   ```bash
   git clone <https://github.com/Edisonzm9/Angular-Tata-Test.git>
   cd frontend/financial-products
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso
1. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
2. Accede a la app en [http://localhost:4200](http://localhost:4200)

## Scripts Disponibles
- `npm start`: Inicia la app en modo desarrollo
- `npm run build`: Compila la app para producción
- `npm test`: Ejecuta las pruebas unitarias

## Buenas Prácticas
- Principios SOLID y Clean Code aplicados en todos los componentes y servicios
- Comentarios explicativos en cada archivo principal
- Separación clara de responsabilidades
- Eliminación de código prefabricado innecesario
- Uso de formularios reactivos y validaciones personalizadas

## Dependencias Principales
- Angular
- RxJS
- Angular Forms
- Angular Router

## Autor
Desarrollado por [Edison]. 
