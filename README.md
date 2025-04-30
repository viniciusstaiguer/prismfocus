# PrismFocus – Closed‑Loop Attention Assistant (MVP)

> **Estado:** Sprint A concluído | **Stack:** React / Vite / MediaPipe FaceMesh  
> **Meta atual:** detectar lapsos de atenção em **< 300 ms** e reagir (toast + áudio) durante o fluxo de trabalho.

---

## ✨ Visão Geral

PrismFocus é um experimento *open‑source* que transforma a câmera do seu laptop em um
**monitor de atenção em tempo real** pensado para pessoas com TDAH:

1. **Detecção** – usa MediaPipe FaceMesh (WebAssembly) para rastrear a íris.
2. **Heurística leve** – calcula a razão “íris × cantos do olho” e decide se você desviou o olhar.
3. **Feedback instantâneo** – toca um *chime* e exibe um toast **< 300 ms** após a distração.
4. **Hook genérico** – tudo encapsulado em `useAttention`, plug‑and‑play em qualquer componente.
5. **Telemetria local** – eventos e latência ficam em IndexedDB (privado) para análise futura.

Roadmap completo em [`projects/roadmap.md`](./projects/roadmap.md) → Task Atomizer, bloqueio de redes, HRV wearable, etc.

---

## 📂 Estrutura do Repositório

```
prismfocus/
├─ apps/
│  └─ desktop-electron/        # frontend React (Vite dev server)
├─ packages/
│  └─ core-sdk/
│      ├─ src/
│      │   ├─ useAttention.ts   # 🎯 hook principal
│      │   ├─ config.ts         # limiares salvos no localStorage
│      │   ├─ log.ts            # IndexedDB logger
│      │   └─ hotkey.ts         # toggle Ctrl+Shift+A
│      └─ package.json
└─ public/
    └─ alert.wav               # áudio de feedback
```

---

## 🚀 Como Rodar Localmente

```bash
# Instala todas as dependências (root + workspaces)
pnpm install

# Inicia Vite em modo dev
pnpm dev -F apps/desktop-electron
```

> Na primeira execução o navegador pedirá permissão de câmera.  
> Desvie o olhar para qualquer lado → você deve ouvir o *chime* e ver **⚡ Back to work!** no topo.

### Build de Produção

```bash
pnpm build -F apps/desktop-electron
```

O output fica em `apps/desktop-electron/dist/`.  
Próximo passo será empacotar com Electron/Tauri (não incluso neste MVP).

---

## ⚙️ Configurações

| Opção | Onde | Padrão | Notas |
|-------|------|--------|-------|
| **Limiar min/max** | `localStorage.pf_threshold` | `{min:0.25,max:0.75}` | Ajustável via slider futuramente |
| **Hotkey Toggle** | `Ctrl + Shift + A` | — | Liga/desliga detecção sem recarregar |
| **Áudio** | `public/alert.wav` | *chime* curto | Substitua por qualquer `.wav` |

---

## 🗒️ Estrutura de Logs (IndexedDB)

Cada evento salvo contém:

```jsonc
{
  "id": 17,
  "type": "lost" | "restored" | "latency",
  "ts": 1714500863123,
  "ms": 128                  // apenas para latency
}
```

Acesse pelo DevTools → *Application* → *IndexedDB* → `pf_logs/events` ou via função `logEvent()`.

---

## ✅ Sprint A – Checklist Concluído

- [x] `useAttention` extraído para SDK
- [x] Limiar persistente em `localStorage`
- [x] Logging (`attentionLost`, `attentionRestored`, `latency`)
- [x] Medição de latência com `performance.now()`
- [x] Toggle global `Ctrl + Shift + A`

**Próximos Sprints**: Task Atomizer, Site‑Blocker (Manifest v3), HRV baseline, Dashboard Recharts.

## 📄 Licença

MIT © 2025 Vinicius Staiguer
