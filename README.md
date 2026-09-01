# ⚡ MeggerX — Evaluación de Aislamiento en Transformadores

Aplicación web especializada para el diagnóstico técnico de pruebas dieléctricas de aislamiento (Megger) en frío para transformadores de distribución y potencia, conforme a los estándares internacionales **IEEE Std C57.12.90** y **ANSI/NETA MTS**.

---

## 🌐 Enlaces de Acceso y Vista Previa

- **App en Vivo (Preview / Compartida):** [https://ais-pre-rdh43o7kozkw33cuoibfhd-238508365100.us-west2.run.app](https://ais-pre-rdh43o7kozkw33cuoibfhd-238508365100.us-west2.run.app)
- **App en Desarrollo:** [https://ais-dev-rdh43o7kozkw33cuoibfhd-238508365100.us-west2.run.app](https://ais-dev-rdh43o7kozkw33cuoibfhd-238508365100.us-west2.run.app)

---

## 🚀 Características Principales

1. **Evaluación según Clase de Tensión:**
   - **34.5 kV:** Umbral Aprobado $\ge 1000\text{ M}\Omega$ (AT), Alerta $500 - 999\text{ M}\Omega$, Rechazado $< 500\text{ M}\Omega$.
   - **13.2 kV o menor:** Umbral Aprobado $\ge 500\text{ M}\Omega$ (AT), Alerta $200 - 499\text{ M}\Omega$, Rechazado $< 200\text{ M}\Omega$.
   - **Baja Tensión:** Umbrales diferenciados para pruebas hacia masa (tierra).

2. **Diagnóstico Técnico Integral:**
   - Dictamen global inmediato (**APROBADO**, **ALERTA**, **RECHAZADO**).
   - Barras de rango dieléctrico visuales de alta precisión.
   - Diagnósticos por cada prueba: **AT vs BT**, **AT vs Masa (Tierra)**, **BT vs Masa (Tierra)**.
   - Corrección por temperatura normalizada a $20^\circ\text{C}$ ($K_T$ según IEEE C57.12.90).

3. **Herramientas de Campo:**
   - **Esquemas de Conexión:** Diagramas interactivos paso a paso para la conexión de terminales Línea (L), Tierra (E) y Guarda (G).
   - **Certificado y Protocolo Técnico:** Generación de reporte imprimible / exportable a PDF con firmas de responsabilidad técnica.
   - **Historial Local:** Almacenamiento de evaluaciones y exportación a formato **CSV**.
   - **Carga de Casos Predefinidos:** Ejemplos rápidos de prueba para demostración y verificación.

---

## 🛠️ Ejecución Local

Para ejecutar el proyecto en tu entorno local:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 📋 Normas de Referencia
- **IEEE Std C57.12.90™**: *Standard Test Code for Liquid-Immersed Distribution, Power, and Regulating Transformers*.
- **ANSI/NETA MTS**: *Standard for Maintenance Testing Specifications for Electrical Power Equipment and Systems*.
