diff --git a/logic.js b/logic.js
index 9014affb47dc69d653ea4cf766aa1a2bacc510f5..3024ae35cc74be76cb418fe7f4e98455e51f2308 100644
--- a/logic.js
+++ b/logic.js
@@ -21,40 +21,61 @@
     return { label: 'Maturidade baixa', className: 'level-bad' };
   }
 
   function calculateWeightedScore(values) {
     const totalWeight = strategyPillars.reduce((acc, item) => acc + item.weight, 0);
     const weighted = strategyPillars.reduce(
       (acc, item) => acc + clampScore(values[item.key]) * item.weight,
       0
     );
 
     return Math.round((weighted / totalWeight) * 10);
   }
 
   function competitorGap(values, businessReviewsCount, competitorReviewsAvg) {
     const reviewsGap = Math.max(0, Number(competitorReviewsAvg) - Number(businessReviewsCount));
     const scorePenalty = Math.max(0, 10 - clampScore(values.reviews)) * 2;
     return Math.round(reviewsGap + scorePenalty);
   }
 
   function getPriority(score) {
     if (score < 55) return { level: 'Alta', text: 'Intervenção imediata' };
     if (score < 80) return { level: 'Média', text: 'Otimização contínua' };
     return { level: 'Baixa', text: 'Manutenção e escala' };
   }
 
+  function buildPriorityActions(values) {
+    return strategyPillars
+      .map((pillar) => ({
+        label: pillar.label,
+        score: clampScore(values[pillar.key])
+      }))
+      .sort((a, b) => a.score - b.score)
+      .slice(0, 3)
+      .map((item) => `Elevar "${item.label}" de ${item.score}/10 para pelo menos 8/10.`);
+  }
+
+  function estimateRoiPotential(score, gap, businessRating) {
+    const ratingPenalty = Math.max(0, 4.6 - Number(businessRating || 0)) * 12;
+    const opportunity = Math.max(0, 120 - score - Math.min(gap, 80) - ratingPenalty);
+
+    if (opportunity >= 45) return { level: 'Alto', text: 'Existe espaço claro para ganho de tráfego e leads locais.' };
+    if (opportunity >= 20) return { level: 'Médio', text: 'Há oportunidade relevante com consistência operacional.' };
+    return { level: 'Moderado', text: 'O perfil já está avançado; foco em manutenção e incremento fino.' };
+  }
+
   const api = {
     strategyPillars,
     classifyScore,
     calculateWeightedScore,
     competitorGap,
-    getPriority
+    getPriority,
+    buildPriorityActions,
+    estimateRoiPotential
   };
 
   if (typeof module !== 'undefined' && module.exports) {
     module.exports = api;
   }
 
   globalScope.LaudoLogic = api;
 })(typeof window !== 'undefined' ? window : globalThis);
-     
  
