# 🌴 GUÍA DE PERSONALIZACIÓN Y EXPANSIÓN DE LA HISTORIA
## *Vice Dynasty: Neon Syndicate*

Toda la narrativa, cinemáticas, decisiones, atracos y diálogos del juego están desacoplados en el archivo:
📁 **[`src/data/storyGraph.ts`](file:///C:/Users/nahue/OneDrive/Escritorio/UCU/Proyectos/GTA6/src/data/storyGraph.ts)**

A continuación se explica paso a paso cómo modificar la historia existente, añadir nuevos capítulos o crear bifurcaciones personalizadas.

---

### 1. Estructura de un Nodo de Historia (`StoryNode`)

Cada escena del juego se define como un objeto con este formato:

```typescript
export const STORY_NODES: Record<string, StoryNode> = {
  // ID único del nodo
  node_mi_nueva_escena: {
    id: 'node_mi_nueva_escena',
    act: 1, // 1 | 2 | 3
    actTitle: 'ACTO I: EL BARRO Y EL NEÓN',
    chapterTitle: 'Capítulo X: Nombre de tu Escena',
    location: 'OCEAN DRIVE — CALLEJÓN TRASERO',
    
    // Configuración del video o shader
    video: {
      id: 'vid_mi_clip',
      title: 'Título del Video',
      url: 'nombre_de_tu_video', // Buscará /public/videos/nombre_de_tu_video.mp4
      durationSec: 10,           // Duración en segundos
      themeStyle: 'sunset_drive', // Estilo de shader si no hay video MP4
      dialogueSubtitle: 'Jason: "Tenemos que tomar una decisión rápido."',
      speaker: 'MATEO CRUZ'
    },

    // Ventana de decisión (Heartbeat Timer de 3 a 5 segundos)
    decisionWindow: {
      startTimeSec: 4.0,           // Momento en que aparecen las opciones
      durationSec: 4.5,            // Cuánto dura la cuenta regresiva
      defaultChoiceId: 'choice_opcion_a' // Opción automática si expira el tiempo
    },

    // Lista de opciones para el jugador
    choices: [
      {
        id: 'choice_opcion_a',
        label: '🏎️ Pisar el Acelerador',
        sublabel: 'Escapar a toda velocidad hacia los muelles',
        dangerLevel: 'HIGH', // SAFE | LOW | MEDIUM | HIGH | EXTREME | FATAL
        targetNodeId: 'node_siguiente_escena_a', // Nodo al que salta
        effects: [
          { action: 'ADD_HEAT', value: 1 },        // Aumenta 1 estrella
          { action: 'ADD_DIRTY_CASH', value: 50000 }, // Gana $50k sucios
          { action: 'ADD_LOYALTY', target: 'lucia', value: 10 } // Sube lealtad de Lucia
        ]
      },
      {
        id: 'choice_opcion_b',
        label: '🕶️ Apagar las Luces y Esconderse',
        sublabel: 'Esperar a que pasen las patrullas en silencio',
        dangerLevel: 'LOW',
        targetNodeId: 'node_siguiente_escena_b',
        effects: [
          { action: 'SET_HEAT', value: 0 } // Despeja la policía
        ]
      }
    ]
  }
};
```

---

### 2. Cómo Añadir Eventos Quick-Time (QTE)
Si quieres que una escena tenga una acción de reflejos (esquivar un choque, hackear una puerta, disparar):

```typescript
qte: {
  id: 'qte_esquivar_patrulla',
  triggerTimeSec: 3.5, // Segundo en que aparece el botón QTE
  durationSec: 2.0,    // Tiempo para reaccionar
  type: 'SWIPE_UP',
  keyRequired: 'SPACE', // Tecla requerida en PC (ESPACIO, W o ENTER)
  instructionText: '¡PULSA ESPACIO PARA ESQUIVAR EL BLOQUEO!',
  successNodeId: 'node_escape_exitoso', // Si acierta
  failNodeId: 'node_choque_policial',    // Si falla
  failEffects: [
    { action: 'ADD_HEAT', value: 2 }
  ]
}
```

---

### 3. Notificaciones Telefónicas Automáticas (*ViceOS*)
Puedes hacer que al llegar a un nodo, el teléfono reciba un mensaje o alerta de *Signal*, *DarkPay* o *InstaVice*:

```typescript
phoneNotification: {
  app: 'signal', // 'signal' | 'darkpay' | 'instavice'
  sender: 'Lucia Caminos',
  message: 'Jason, las cámaras térmicas están apagadas. Entra ahora.',
  audioDurationSec: 4
}
```

---

### 4. Lista de Efectos Disponibles (`StateEffect`):
- `ADD_CLEAN_CASH`: Suma dinero limpio bancarizado (ej. `{ action: 'ADD_CLEAN_CASH', value: 100000 }`).
- `ADD_DIRTY_CASH`: Suma dinero sucio que requiere lavado.
- `SET_HEAT`: Fija el nivel de búsqueda policial de 0 a 5.
- `ADD_HEAT`: Suma estrellas de policía (ej. `+1`, `+2`).
- `ADD_RESPECT`: Aumenta el respeto del sindicato (0 a 100).
- `ADD_LOYALTY`: Modifica la lealtad de un personaje (`target: 'lucia'`, `'cal'`, `'drequan'`, `'raul'`).
- `SET_FLAG`: Guarda una decisión para el efecto mariposa (ej. `{ action: 'SET_FLAG', target: 'salvo_al_rehen', value: true }`).
- `ADD_INVENTORY`: Otorga un objeto al inventario (ej. `'llave_boveda'`, `'explosivo_c4'`).

---

### 5. Cómo Probar Nodos en Tiempo Real:
Durante el juego, presiona la tecla **`P`** (o toca el botón de Pausa en el HUD) para abrir el **Selector de Escenas**. Podrás hacer clic en cualquier nodo y saltar a él de inmediato para verificar cómo se ve tu nueva escena.
