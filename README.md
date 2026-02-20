# Simulador CPE (Next.js + Azure Static Web Apps)

## Como publicar no Azure Static Web Apps
No Azure, crie um Static Web App (Free) e aponte para este repositório.

**Build preset:** Next.js  
**App location:** `/`  
**Output location:** `out`

Este projeto usa `output: "export"` (Next.js) e gera o site estático em `out/`.

## Banco de dados
O arquivo `public/db.json` contém a base CPE (extraída do HTML original).

## Rodar localmente (opcional)
```bash
npm install
npm run dev
```
