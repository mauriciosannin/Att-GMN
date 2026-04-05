 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index 4c6b41bdaed41247907ad41a468505112508c9fc..6651e5f64add4c3bb95d48219e7fe830f588d983 100644
--- a/README.md
+++ b/README.md
@@ -1,42 +1,37 @@
-README.md
-# Laudo GMN Pro (versão final)
+# Laudo GMN Pro
 
 Ferramenta de laudos para Google Meu Negócio com foco em estratégias práticas de SEO Local, pronta para uso em Android.
 
-## Recursos finais
+## Recursos
 
 - **Pré-análise e análise completa** para prospecção e gestão ativa.
-- **Checklist visual estratégico** (9 pilares) com score ponderado.
+- **Checklist técnico estratégico** (9 pilares) com score ponderado.
+- **Radar dos pilares** com visualização rápida por critério.
 - **Benchmark competitivo** com estimativa de gap de avaliações.
+- **Top 3 prioridades automáticas** para os próximos 15 dias.
 - **Plano de ação de 30 dias** + **rotina recorrente mensal**.
+- **Indicador de potencial de ROI local** para apoiar propostas comerciais.
 - **Exportação do laudo** em JSON, compartilhamento nativo e impressão em PDF.
 - **Persistência local** do último laudo gerado para continuar o atendimento rapidamente.
 
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
 
EOF
)
