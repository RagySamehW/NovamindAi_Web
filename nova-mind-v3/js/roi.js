/* ─────────────────────────────────────────
   Nova Mind — ROI Calculator
   Defaults to Data Pipeline Efficiency
   ───────────────────────────────────────── */

const ROI_MULTIPLIERS = {
  data:       { efficiency: 0.60, projectCost: 12000 },
  automation: { efficiency: 0.72, projectCost: 18000 },
  ecommerce:  { efficiency: 0.50, projectCost: 8000  },
  app:        { efficiency: 0.45, projectCost: 15000 }
};

function calcROI() {
  const usecase = document.getElementById('roi-usecase')?.value || 'data';
  const team    = parseInt(document.getElementById('sl-team')?.value  || 20,  10);
  const hours   = parseInt(document.getElementById('sl-hours')?.value || 15,  10);
  const rate    = parseInt(document.getElementById('sl-rate')?.value  || 45,  10);
  const eff     = parseInt(document.getElementById('sl-error')?.value || 30,  10);

  // Update display values
  const sv = id => document.getElementById(id);
  if (sv('sv-team'))  sv('sv-team').textContent  = team;
  if (sv('sv-hours')) sv('sv-hours').textContent = hours;
  if (sv('sv-rate'))  sv('sv-rate').textContent  = '€' + rate;
  if (sv('sv-error')) sv('sv-error').textContent = eff + '%';

  const m = ROI_MULTIPLIERS[usecase] || ROI_MULTIPLIERS.data;

  const annualHoursSaved = Math.round(team * hours * 52 * m.efficiency * (eff / 100));
  const timeSaving       = annualHoursSaved * rate;
  const totalSaving      = Math.round(timeSaving * 1.15); // +15% for error reduction & quality gains

  const monthlySaving  = totalSaving / 12;
  const paybackMonths  = monthlySaving > 0 ? Math.max(1, Math.round(m.projectCost / monthlySaving)) : 0;
  const threeYearROI   = m.projectCost > 0 ? (totalSaving * 3 / m.projectCost).toFixed(1) : '0';

  const fmt = n => '€' + Math.round(n).toLocaleString('fr-FR');

  animateValue('roi-saving',  totalSaving,           v => fmt(v));
  animateValue('roi-hours',   annualHoursSaved,       v => Math.round(v).toLocaleString('fr-FR') + ' hrs');
  animateValue('roi-payback', paybackMonths,          v => Math.round(v) + ' mo');
  animateValue('roi-3yr',     parseFloat(threeYearROI), v => v.toFixed(1) + '×');
}

function animateValue(id, target, format) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  const dur   = 600;
  requestAnimationFrame(function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = format(target * (1 - Math.pow(1 - p, 2)));
    if (p < 1) requestAnimationFrame(tick);
  });
}

document.addEventListener('DOMContentLoaded', () => { calcROI(); });
