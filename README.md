# Dashboard IoT - Temperatura y Humedad

Un dashboard moderno y responsivo para visualizar datos de sensores IoT de temperatura y humedad en tiempo real.

## 🚀 Características

- **Visualización en tiempo real** de datos de temperatura y humedad
- **Gráficos interactivos** usando Chart.js
- **Tarjetas de estadísticas** con tendencias
- **Diseño responsivo** que funciona en desktop y móvil
- **Interfaz moderna** con Tailwind CSS
- **TypeScript** para mayor seguridad de tipos

## 📊 Formato de Datos

El dashboard espera datos en el siguiente formato JSON:

```json
{
  "id": "uuid-generado-automaticamente",
  "timestamp": "2025-05-28T02:00:00.000000",
  "ttl": 1750989600,
  "name": "Tu campo personalizado",
  "location": "Tu campo personalizado",
  "temperature": 25.5,
  "humidity": 60,
  "status": "active",
  "cualquier_campo": "valor personalizado"
}
```

## 🛠️ Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 📱 Funcionalidades

### Gráficos
- **Gráfico de Temperatura**: Línea temporal con datos de temperatura en °C
- **Gráfico de Humedad**: Línea temporal con datos de humedad en %

### Tarjetas de Estadísticas
- Temperatura actual con tendencia
- Humedad actual con tendencia
- Ubicación del sensor
- Estado del dispositivo

### Información del Dispositivo
- Nombre del sensor
- ID único del dispositivo
- TTL (Time To Live)

## 🏗️ Arquitectura

El proyecto implementa una **arquitectura limpia** con separación de responsabilidades:

```
src/
├── components/          # Componentes de UI
├── hooks/              # Hooks personalizados
├── services/           # Servicios para APIs
├── config/             # Configuración y constantes
└── types/              # Definiciones de TypeScript
```

### 🔧 Configuración de la API

La URL base de la API se configura en `src/config/environment.ts`:

```typescript
export const ENV = {
  API_BASE_URL: 'https://74unkrq7fj.execute-api.us-east-1.amazonaws.com/dev',
  POLLING_INTERVAL: 5000, // 5 segundos
  MAX_DATA_POINTS: 20,    // Máximo de puntos en memoria
};
```

### 🔄 Conexión Automática

El dashboard se conecta automáticamente a la API configurada y:
- ✅ Obtiene datos cada 5 segundos
- ✅ Maneja errores de conexión elegantemente  
- ✅ Muestra indicadores de carga
- ✅ Reintenta automáticamente en caso de error

### 🛠️ Personalización

Para cambiar la URL de la API, modifica `src/config/environment.ts`:

```typescript
export const ENV = {
  API_BASE_URL: 'https://tu-nueva-api.com/endpoint',
  // ... resto de configuración
};
```

### Personalizar Colores y Estilos

Los colores se pueden personalizar en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      temperature: {
        500: '#tu-color-temperatura',
      },
      humidity: {
        500: '#tu-color-humedad',
      }
    }
  }
}
```

## 📦 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

## 🌐 Tecnologías Utilizadas

- **React 18** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Chart.js** - Gráficos interactivos
- **Tailwind CSS** - Framework de CSS
- **date-fns** - Manipulación de fechas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, por favor abre un issue en el repositorio. 