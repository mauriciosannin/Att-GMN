diff --git a/README.md b/README.md
index 4c6b41bdaed41247907ad41a468505112508c9fc..130af73c46750a1269a1eac8273afdc8092c8a7c 100644
--- a/README.md
+++ b/README.md
@@ -1,42 +1,36 @@
-README.md
-# Laudo GMN Pro (versão final)
+# Laudo GMN Pro
 
-Ferramenta de laudos para Google Meu Negócio com foco em estratégias práticas de SEO Local, pronta para uso em Android.
+Ferramenta de captação de dados do prospecto + diagnóstico de Google Meu Negócio para acelerar reuniões comerciais.
 
-## Recursos finais
+## Recursos
 
-- **Pré-análise e análise completa** para prospecção e gestão ativa.
-- **Checklist visual estratégico** (9 pilares) com score ponderado.
+- **Ficha completa de captação** (origem do lead, decisor, canal ideal, orçamento, urgência e maturidade digital).
+- **Checklist GMN estratégico** (9 pilares) com score ponderado.
+- **Fit comercial automático** para priorização de leads.
+- **Lista de dados críticos faltantes** para qualificar melhor o prospect.
+- **Roteiro de abordagem pronto** para WhatsApp/Direct/Ligação.
 - **Plano de ação de 30 dias** + **rotina recorrente mensal**.
 - **Exportação do laudo** em JSON, compartilhamento nativo e impressão em PDF.
-- **Persistência local** do último laudo gerado para continuar o atendimento rapidamente.
 
 ## Android (PWA instalável)
 
 A ferramenta foi preparada para smartphone Android com:
 
 - `manifest.webmanifest` com ícones e modo `standalone`.
 - `service-worker.js` para cache offline dos arquivos essenciais.
 - botão **Instalar no Android** quando o navegador suportar `beforeinstallprompt`.
 
-### Como instalar no Android
-
-1. Hospede os arquivos em HTTPS (ou teste local em `localhost`).
-2. Abra o site no Chrome Android.
-3. Toque em **Instalar no Android** (ou menu do Chrome > Adicionar à tela inicial).
-4. A aplicação abrirá como app, sem barra do navegador.
-
 ## Execução local
 
 ```bash
 python3 -m http.server 8000
 ```
 
 Acesse: `http://localhost:8000`
 
 ## Testes
 
 ```bash
 node tests/logic.test.js
 ```
 
