diff --git a/tests/logic.test.js b/tests/logic.test.js
index 1b0f2e0938e437909ee15ac173fed4d5afec0569..de551c562b9cae7c4cbaa06a32c6d5a3b34f636a 100644
--- a/tests/logic.test.js
+++ b/tests/logic.test.js
@@ -1,42 +1,56 @@
 const assert = require('node:assert/strict');
 const {
   strategyPillars,
   classifyScore,
   calculateWeightedScore,
   competitorGap,
-  getPriority
+  getPriority,
+  buildPriorityActions,
+  estimateRoiPotential
 } = require('../logic.js');
 
 function values(fill) {
   return Object.fromEntries(strategyPillars.map((p) => [p.key, fill]));
 }
 
 assert.deepEqual(classifyScore(82), { label: 'Maturidade alta', className: 'level-ok' });
 assert.deepEqual(classifyScore(60), { label: 'Maturidade média', className: 'level-warn' });
 assert.deepEqual(classifyScore(20), { label: 'Maturidade baixa', className: 'level-bad' });
 
 assert.equal(calculateWeightedScore(values(10)), 100);
 assert.equal(calculateWeightedScore(values(0)), 0);
 
 const mixed = {
   profileCompleteness: 8,
   categories: 7,
   reviews: 6,
   reviewReplies: 5,
   posts: 4,
   media: 7,
   qa: 3,
   conversion: 6,
   monitoring: 2
 };
 assert.equal(calculateWeightedScore(mixed), 55);
 
 assert.equal(competitorGap({ reviews: 5 }, 20, 50), 40);
 assert.equal(competitorGap({ reviews: 10 }, 120, 50), 0);
 
 assert.deepEqual(getPriority(40), { level: 'Alta', text: 'Intervenção imediata' });
 assert.deepEqual(getPriority(70), { level: 'Média', text: 'Otimização contínua' });
 assert.deepEqual(getPriority(90), { level: 'Baixa', text: 'Manutenção e escala' });
 
+const topActions = buildPriorityActions(mixed);
+assert.equal(topActions.length, 3);
+assert.match(topActions[0], /Monitoramento e rotina/);
+
+assert.deepEqual(estimateRoiPotential(45, 30, 4.2), {
+  level: 'Médio',
+  text: 'Há oportunidade relevante com consistência operacional.'
+});
+assert.deepEqual(estimateRoiPotential(100, 1, 5), {
+  level: 'Moderado',
+  text: 'O perfil já está avançado; foco em manutenção e incremento fino.'
+});
+
 console.log('All logic tests passed.');
-  
