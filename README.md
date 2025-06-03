
<p align="center">
  <img src="https://img.shields.io/badge/angular-v16-red"/>
  <img src="https://img.shields.io/badge/typescript-v5.2-blue"/>
  <img src="https://img.shields.io/badge/coverage-80%25-brightgreen"/>
  <img src="https://img.shields.io/badge/prueba-100%25%20cubierta-blueviolet"/>
</p>


# Financial Products App

Aplicación web para la gestión de productos financieros, desarrollada con Angular siguiendo Clean Code y principios SOLID.

## 📚 Tabla de Contenidos
- [📝 Descripción](#descripción)
- [✨ Características](#características)
- [🖥️ Demo Visual](#demo-visual)
- [📂 Estructura del Proyecto](#estructura-del-proyecto)
- [🚀 Instalación](#instalación)
- [💻 Uso](#uso)
- [🧪 Scripts Disponibles](#scripts-disponibles)
- [📐 Buenas Prácticas](#buenas-prácticas)
- [📦 Dependencias Principales](#dependencias-principales)
- [👨‍💻 Autor](#autor)

---

## 📝 Descripción
> **Nota:** Esta aplicación fue desarrollada como challenge técnico, cuidando la mantenibilidad, escalabilidad y experiencia de usuario.

Gestiona productos financieros: listar, crear, editar y eliminar, todo con validaciones avanzadas y diseño responsive.

---

## ✨ Características
- 📋 Listado y búsqueda de productos
- ➕ Creación y edición con formularios reactivos
- 🗑️ Eliminación con confirmación modal
- ⚡️ Pantallas de precarga (Skeletons)
- 🛡️ Manejo centralizado de errores
- 💎 Código limpio y 100% documentado

---


## 📂 Estructura del Proyecto
<details>
  <summary>Ver estructura</summary>

```bash
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


