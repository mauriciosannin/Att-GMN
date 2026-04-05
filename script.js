diff --git a/script.js b/script.js
index 08ac908550ae7e184019740afa337e6fd19b40be..b0963feead0ef9e0a7ea9518fc29a7f11ba37146 100644
--- a/script.js
+++ b/script.js
@@ -1,43 +1,56 @@
 const form = document.getElementById('gmn-form');
 const resultCard = document.getElementById('result-card');
 const overallScoreNode = document.getElementById('overall-score');
 const priorityScoreNode = document.getElementById('priority-score');
 const priorityTextNode = document.getElementById('priority-text');
 const competitorGapNode = document.getElementById('competitor-gap');
 const competitorGapTextNode = document.getElementById('competitor-gap-text');
 const maturityLevelNode = document.getElementById('maturity-level');
 const checklistListNode = document.getElementById('checklist-list');
+const pillarBarsNode = document.getElementById('pillar-bars');
+const priorityActionsNode = document.getElementById('priority-actions');
 const actionPlanNode = document.getElementById('action-plan');
 const recurrenceListNode = document.getElementById('recurrence-list');
+const roiLevelNode = document.getElementById('roi-level');
+const roiTextNode = document.getElementById('roi-text');
 const installButton = document.getElementById('install-app');
 const downloadButton = document.getElementById('download-report');
 const shareButton = document.getElementById('share-report');
 const printButton = document.getElementById('print-report');
 
-const { strategyPillars, classifyScore, calculateWeightedScore, competitorGap, getPriority } = window.LaudoLogic;
-const STORAGE_KEY = 'laudo_gmn_latest_report_v1';
+const {
+  strategyPillars,
+  classifyScore,
+  calculateWeightedScore,
+  competitorGap,
+  getPriority,
+  buildPriorityActions,
+  estimateRoiPotential
+} = window.LaudoLogic;
+
+const STORAGE_KEY = 'laudo_gmn_latest_report_v2';
 let deferredInstallPrompt = null;
 let latestReport = null;
 
 function buildChecklist(values) {
   return strategyPillars.map(({ key, label }) => {
     const value = Number(values[key]);
 
     if (value >= 8) return `${label}: ✅ forte e consistente.`;
     if (value >= 5) return `${label}: ⚠️ regular, precisa otimização.`;
     return `${label}: ❌ crítico, tratar com prioridade.`;
   });
 }
 
 function buildActionPlan(values, analysisMode, verificationStatus) {
   const tasks = [];
 
   if (verificationStatus === 'notVerified') {
     tasks.push('Solicitar verificação do perfil e validar titularidade/administradores na primeira semana.');
   }
   if (values.categories < 8) {
     tasks.push('Revisar categoria principal e secundárias com foco em intenção local de busca.');
   }
   if (values.reviews < 8 || values.reviewReplies < 8) {
     tasks.push('Criar rotina de captação de avaliações e resposta em até 24-48h para 100% dos comentários.');
   }
@@ -47,71 +60,95 @@ function buildActionPlan(values, analysisMode, verificationStatus) {
   if (values.media < 8) {
     tasks.push('Subir novo lote de fotos reais (fachada, equipe, serviços, ambiente) com periodicidade semanal.');
   }
   if (values.monitoring < 8) {
     tasks.push('Definir rotina semanal de monitoramento de ranking local, cliques e chamadas recebidas.');
   }
 
   tasks.push(
     analysisMode === 'pre'
       ? 'Gerar versão resumida para prospecção e apresentação comercial da oportunidade de melhoria.'
       : 'Rodar reavaliação quinzenal e atualizar plano com base nas métricas de evolução do cliente.'
   );
 
   return tasks;
 }
 
 function buildRecurrence() {
   return [
     'Semanal: responder avaliações e atualizar posts.',
     'Quinzenal: revisar categorias e fotos com base em desempenho.',
     'Mensal: comparar benchmark de concorrentes e recalibrar metas.',
     'Trimestral: revisar estratégia completa de SEO local e oportunidades de expansão.'
   ];
 }
 
+function renderPillarBars(values) {
+  pillarBarsNode.innerHTML = '';
+  strategyPillars.forEach((pillar) => {
+    const score = Number(values[pillar.key]);
+    const li = document.createElement('li');
+    li.innerHTML = `
+      <div class="bar-head"><strong>${pillar.label}</strong><span>${score}/10</span></div>
+      <div class="bar-track"><span class="bar-fill" style="width:${score * 10}%"></span></div>
+    `;
+    pillarBarsNode.appendChild(li);
+  });
+}
+
 function persistReport(report) {
   localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
 }
 
 function renderReport(report) {
   overallScoreNode.textContent = String(report.score);
   priorityScoreNode.textContent = report.priority.level;
   priorityTextNode.textContent = report.priority.text;
   competitorGapNode.textContent = `${report.gap}`;
   competitorGapTextNode.textContent = 'estimativa de avaliações para reduzir diferença competitiva';
+  roiLevelNode.textContent = report.roiPotential.level;
+  roiTextNode.textContent = report.roiPotential.text;
 
   maturityLevelNode.className = report.level.className;
   maturityLevelNode.textContent = report.maturityText;
 
+  renderPillarBars(report.values);
+
   checklistListNode.innerHTML = '';
   report.checklist.forEach((line) => {
     const li = document.createElement('li');
     li.textContent = line;
     checklistListNode.appendChild(li);
   });
 
+  priorityActionsNode.innerHTML = '';
+  report.priorityActions.forEach((line) => {
+    const li = document.createElement('li');
+    li.textContent = line;
+    priorityActionsNode.appendChild(li);
+  });
+
   actionPlanNode.innerHTML = '';
   report.actionPlan.forEach((line) => {
     const li = document.createElement('li');
     li.textContent = line;
     actionPlanNode.appendChild(li);
   });
 
   recurrenceListNode.innerHTML = '';
   report.recurrence.forEach((line) => {
     const li = document.createElement('li');
     li.textContent = line;
     recurrenceListNode.appendChild(li);
   });
 
   resultCard.hidden = false;
   latestReport = report;
 }
 
 function downloadReport() {
   if (!latestReport) return;
   const blob = new Blob([JSON.stringify(latestReport, null, 2)], { type: 'application/json' });
   const url = URL.createObjectURL(blob);
   const anchor = document.createElement('a');
   anchor.href = url;
   anchor.download = `laudo-gmn-${Date.now()}.json`;
@@ -125,76 +162,84 @@ async function shareReport() {
   await navigator.share({ title: 'Laudo GMN', text });
 }
 
 function restoreLatestReport() {
   const raw = localStorage.getItem(STORAGE_KEY);
   if (!raw) return;
 
   try {
     const parsed = JSON.parse(raw);
     renderReport(parsed);
   } catch {
     localStorage.removeItem(STORAGE_KEY);
   }
 }
 
 form.addEventListener('submit', (event) => {
   event.preventDefault();
 
   const data = new FormData(form);
   const values = Object.fromEntries(strategyPillars.map(({ key }) => [key, Number(data.get(key) || 0)]));
 
   const score = calculateWeightedScore(values);
   const level = classifyScore(score);
   const gap = competitorGap(values, Number(data.get('businessReviewsCount') || 0), Number(data.get('competitorReviewsAvg') || 0));
   const priority = getPriority(score);
+  const priorityActions = buildPriorityActions(values);
+  const roiPotential = estimateRoiPotential(score, gap, Number(data.get('businessRating') || 0));
 
   const report = {
     createdAt: new Date().toISOString(),
     businessName: data.get('businessName'),
+    category: data.get('category'),
     region: data.get('region'),
     analysisMode: data.get('analysisMode'),
     score,
     gap,
+    values,
     priority,
+    priorityActions,
+    roiPotential,
     level,
     maturityText: `${level.label} para ${data.get('businessName')} (${data.get('analysisMode') === 'pre' ? 'pré-análise' : 'análise completa'}) em ${data.get('region')}.`,
     checklist: buildChecklist(values),
     actionPlan: buildActionPlan(values, data.get('analysisMode'), data.get('verificationStatus')),
     recurrence: buildRecurrence()
   };
 
   renderReport(report);
   persistReport(report);
   resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
 });
 
 downloadButton.addEventListener('click', downloadReport);
 shareButton.addEventListener('click', () => {
   shareReport().catch(() => {});
 });
 printButton.addEventListener('click', () => {
   window.print();
 });
 
 window.addEventListener('beforeinstallprompt', (event) => {
   event.preventDefault();
   deferredInstallPrompt = event;
   installButton.hidden = false;
 });
 
 installButton.addEventListener('click', async () => {
   if (!deferredInstallPrompt) return;
   deferredInstallPrompt.prompt();
   await deferredInstallPrompt.userChoice;
   deferredInstallPrompt = null;
   installButton.hidden = true;
 });
 
 if ('serviceWorker' in navigator) {
   window.addEventListener('load', () => {
     navigator.serviceWorker.register('./service-worker.js').catch((error) => {
       console.warn('Falha ao registrar service worker:', error);
     });
     restoreLatestReport();
   });
-       }
+} else {
+  restoreLatestReport();
+}
  
