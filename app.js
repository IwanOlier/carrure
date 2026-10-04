'use strict';
/* ============ PROGRAMME ============ */
const S_ = (id, n, sets, reps, rest, note, o = {}) => ({ id, n, sets, reps, rest, note, ...o });

const SESSIONS = {
  basA: { name: 'Bas A', sub: 'Quadriceps & force', type: 'muscu', ex: [
    S_('squat', 'Squat barre', 4, [6, 8], 150, 'Dos neutre, descends sans arrondir le bas du dos.', { alt: 'ou hack squat / goblet squat si le dos tire' }),
    S_('bulgare', 'Fente bulgare haltères', 3, [8, 10], 90, 'Jambe droite d’abord, même nombre de rép. à gauche.', { uni: true }),
    S_('stepup', 'Step-up sur box haute', 3, [10, 10], 60, 'Genou à 90°. Spécifique montée trail.', { uni: true }),
    S_('legext', 'Leg extension', 3, [12, 15], 60, 'Dernière série : 3 s de descente.'),
    S_('molletsD', 'Mollets debout (machine)', 4, [10, 15], 60, 'Pause 1 s en bas.'),
    S_('pallof', 'Pallof press', 3, [10, 10], 45, 'Anti-rotation, protège le bas du dos. Par côté.', { uni: true, nokg: false }),
  ]},
  hautA: { name: 'Haut A', sub: 'Largeur & épaules', type: 'muscu', ex: [
    S_('tractions', 'Tractions prise large', 4, [6, 10], 120, 'Pense « coudes dans les poches ». Lest ou assistance dans la colonne kg (assistance = négatif).'),
    S_('incline', 'Développé incliné haltères (30°)', 4, [8, 10], 120, 'Haut des pecs = carrure.'),
    S_('crossover', 'Écarté poulie vis-à-vis (bas → haut)', 3, [12, 15], 60, 'Mains qui se croisent au centre, serre 1 s : remplit le milieu de la poitrine.'),
    S_('rowing1', 'Rowing un bras haltère', 3, [10, 10], 75, 'Omoplate droite : tire vers la hanche. +1 série côté droit.', { uni: true }),
    S_('latraise', 'Élévations latérales haltères', 4, [12, 20], 60, 'Muscle n°1 de la silhouette en V.'),
    S_('facepull', 'Face pull poulie', 3, [15, 15], 60, 'Deltoïdes arrière + posture.'),
    S_('curlinc', 'Curl incliné haltères', 3, [10, 12], 60, ''),
    S_('tricorde', 'Extension triceps poulie (corde)', 3, [12, 15], 60, ''),
    S_('pompescap', 'Pompes scapulaires (serratus)', 2, [12, 12], 45, 'Pousse le sol, écarte les omoplates.', { bw: true }),
  ]},
  basB: { name: 'Bas B', sub: 'Chaîne postérieure & unilatéral', type: 'muscu', ex: [
    S_('rdl', 'Soulevé de terre roumain', 4, [8, 8], 120, 'Charge modérée, dos plat, arrêt à mi-tibia.', { alt: 'ou trap bar mi-hauteur' }),
    S_('hipthrust', 'Hip thrust barre', 3, [8, 12], 90, 'Fessiers = puissance en côte.'),
    S_('presse1', 'Presse à cuisses une jambe', 3, [10, 12], 75, 'Droite d’abord.', { uni: true }),
    S_('stepdown', 'Step-down lent (3 s)', 3, [8, 8], 60, 'Prépare les quadriceps aux descentes.', { uni: true }),
    S_('legcurl', 'Leg curl allongé', 3, [10, 12], 60, ''),
    S_('molletsA', 'Mollets assis', 3, [15, 15], 45, 'Soléaire = endurance course.'),
    S_('suitcase', 'Suitcase carry', 3, [30, 30], 60, 'Haltère lourd d’un côté, épaules à la même hauteur. Par côté.', { uni: true, unit: 'm' }),
  ]},
  hautB: { name: 'Haut B', sub: 'Épaisseur & pecs', type: 'muscu', ex: [
    S_('bench', 'Développé couché barre', 4, [6, 8], 150, 'Omoplates serrées, pieds au sol.', { alt: 'ou haltères' }),
    S_('tiragev', 'Tirage vertical prise neutre', 3, [10, 12], 90, ''),
    S_('militaire', 'Développé militaire haltères assis', 3, [8, 10], 90, 'Dossier incliné = dos protégé.'),
    S_('rowpoit', 'Rowing poitrine appuyée', 3, [10, 12], 75, 'Aucune charge sur les lombaires.'),
    S_('latcable', 'Élévation latérale poulie un bras', 3, [15, 15], 45, 'Droite d’abord. +1 série côté droit.', { uni: true }),
    S_('oiseau', 'Oiseau / reverse pec deck', 3, [15, 15], 45, ''),
    S_('marteau', 'Curl marteau', 3, [10, 10], 60, ''),
    S_('dips', 'Dips', 3, [8, 12], 75, 'Ou extension triceps au-dessus de la tête.'),
    S_('yraise', 'Y-raise sur banc incliné', 2, [12, 12], 45, 'Trapèzes inférieurs : abaisse l’épaule gauche.'),
  ]},
  cotes: { name: 'Tapis — côtes', sub: 'Séance clé trail', type: 'run' },
  z2: { name: 'Tapis — endurance Z2', sub: 'Inclinée, 135–150 bpm', type: 'run' },
  repos: { name: 'Repos', sub: 'Ou Z2 facile 30 min (optionnel)', type: 'rest' },
};
const WEEK = ['repos', 'basA', 'hautA', 'cotes', 'basB', 'hautB', 'z2']; // index = getDay()
const BONUS_VOL = ['tractions', 'incline', 'latraise'];
const FORCE_LIFTS = ['squat', 'bench', 'rdl', 'tractions'];

const PHASES = [
  { from: '2026-10-12', to: '2026-10-18', name: 'Semaine de récup', kind: 'recup' },
  { from: '2026-10-19', to: '2026-11-22', name: 'Bloc 1 — Fondations', kind: 'fond' },
  { from: '2026-11-23', to: '2026-11-29', name: 'Deload', kind: 'deload' },
  { from: '2026-11-30', to: '2027-01-03', name: 'Bloc 2 — Volume', kind: 'vol' },
  { from: '2027-01-04', to: '2027-01-10', name: 'Deload', kind: 'deload' },
  { from: '2027-01-11', to: '2027-02-14', name: 'Bloc 3 — Force', kind: 'force' },
  { from: '2027-02-15', to: '2027-02-21', name: 'Deload', kind: 'deload' },
  { from: '2027-02-22', to: '2027-03-28', name: 'Bloc 4 — Volume + trail', kind: 'vol' },
  { from: '2027-03-29', to: '2027-04-04', name: 'Deload', kind: 'deload' },
];
const PHASE_TIPS = {
  pre: 'Le programme démarre le 19 octobre. Semi le 11 : repos, routines et bonne course !',
  recup: 'Marche, vélo léger, routines. Pas de course avant jeudi. 1–2 séances muscu légères (50 % des charges) en fin de semaine.',
  fond: '2–3 rép. en réserve. Apprends tes charges, corrige l’asymétrie.',
  vol: '+1 série sur épaules, tractions et haut des pecs. 1–2 rép. en réserve.',
  force: 'Gros mouvements en 5–8 rép. Côtes plus longues.',
  deload: '2 séries par exercice, charges −10 %. Photos et mensurations.',
  trans: 'Trail dehors (mont Royal), muscu 3 séances par semaine.',
};

const RUNS = {
  cotes: (ph) => {
    const reps = { fond: '6 → 8 × 2 min à 8 %', vol: ph.name.includes('4') ? '4 × 6 min à 10–12 % (course + marche active)' : '6 → 8 × 3 min à 8–10 %', force: '5 × 4 min à 10 %', deload: '4 × 2 min à 8 %', recup: 'Pas de côtes cette semaine : marche ou vélo léger.', pre: 'Affûtage avant le semi : séance courte et facile.', trans: 'Côtes dehors : mont Royal.' }[ph.kind];
    return ['10 min Z2 à 1 %.', `Répétitions : <b>${reps}</b>, effort 8/10 (Z4).`, 'Récup 2 min : marche rapide ou trot à 1 %.', '8 min retour au calme.'];
  },
  z2: (ph, key) => {
    const min = ph.kind === 'deload' ? 40 : ph.kind === 'recup' || ph.kind === 'pre' ? 30 : Math.min(45 + 5 * (trainingWeek(key) - 1), 75);
    return [`<b>${min} min</b> en Z2 (135–150 bpm, tu peux parler).`, 'Inclinaison 3–5 %.', 'Toutes les 15 min : 3 min de marche active à 12–15 %.'];
  },
};

const ROUTINES = {
  matin: { name: 'Routine matin', dur: '10 min', items: [
    ['Respiration 90/90', '1 min', ['Dos au sol, pieds posés sur un lit ou un mur, genoux à 90°.', '5 respirations lentes : le bas des côtes descend, le bas du dos reste collé au sol.']],
    ['Chat-vache', '1 min', ['À quatre pattes, arrondis le dos en expirant puis creuse doucement en inspirant.', 'Lent, vertèbre par vertèbre.']],
    ['Dead bug', '1 min 30', ['Sur le dos, bras vers le plafond, genoux à 90° au-dessus des hanches.', 'Bas du dos plaqué au sol. Tends un bras et la jambe opposée en expirant, reviens, alterne.', '8 par côté. Si le dos se creuse, descends moins bas.']],
    ['Bird dog', '1 min', ['À quatre pattes, tends un bras et la jambe opposée, pause 2 s.', 'Bassin immobile, comme un verre d’eau posé sur le dos. 6 par côté.']],
    ['Pont fessier', '1 min', ['Sur le dos, pieds au sol, monte les hanches en serrant les fesses 2 s.', '15 répétitions, sans cambrer.']],
    ['Gainage latéral', '1 min 30', ['Coude sous l’épaule, corps aligné, pousse le sol avec l’avant-bras.', '30 s par côté, +10 s du côté le plus dur.']],
    ['Wall slides', '1 min', ['Avant-bras contre le mur, pousse le mur pour écarter les omoplates.', 'Fais glisser les bras vers le haut puis redescends. 10 répétitions.']],
    ['World’s greatest stretch', '1 min', ['Grande fente avant, main du même côté au sol à l’intérieur du pied.', 'Ouvre l’autre bras vers le plafond en suivant la main des yeux. 3 par côté.']],
    ['Chin tucks contre le mur', '30 s', ['Dos et tête au mur, rentre le menton (double menton) en allongeant la nuque.', '10 répétitions.']],
  ]},
  posture: { name: 'Posture express', dur: '5–10 min', intro: 'Version 5 min : exercices 1 à 5. Version 10 min : tout, ou 2 tours de 1 à 5. Pas juste avant une séance Haut.', items: [
    ['Wall angels', '10 rép.', ['Dos au mur, pieds à 15–20 cm, genoux légèrement fléchis. Fesses, haut du dos et tête touchent le mur.', 'Bras en « W » : coudes à hauteur d’épaules, avant-bras et dos des mains contre le mur.', 'Glisse vers le haut jusqu’au « Y », redescends lentement.', 'Côtes basses : le bas du dos ne se creuse pas. Si les mains décollent, monte moins haut.']],
    ['Y-T-W allongé sur le ventre', '8 de chaque', ['À plat ventre, front sur une serviette pliée, jambes tendues.', 'Y : bras tendus en diagonale devant, pouces vers le plafond, décolle de quelques cm, tiens 2 s.', 'T : bras sur les côtés, même mouvement. W : coudes pliés près du corps, tire-les vers les hanches.', 'Omoplates « dans les poches arrière », surtout l’épaule gauche vers le bas. Si la nuque travaille, monte moins.']],
    ['Pompes scapulaires', '2 × 12', ['Position de pompe (genoux ou pieds), bras tendus, mains sous les épaules, corps gainé.', 'Sans plier les coudes, laisse la poitrine descendre de quelques cm : les omoplates se rapprochent.', 'Puis pousse le sol au max : elles s’écartent. Mouvement de 3–5 cm.', 'L’omoplate droite doit rester collée aux côtes.']],
    ['Sphinx + chin tuck', '45 s', ['À plat ventre sur les avant-bras, coudes sous les épaules.', 'Pousse le sol et avance la poitrine vers l’avant, comme pour passer sous une porte basse.', 'Menton rentré, nuque longue, respire lentement.', 'Si ça pince en bas du dos : écarte les jambes et serre les fesses.']],
    ['Étirement pecs (cadre de porte)', '30 s / bras', ['Avant-bras à plat sur le montant, coude à hauteur d’épaule.', 'Avance le pied du même côté et pivote doucement le buste vers l’extérieur.', 'Épaule basse et en arrière.']],
    ['Chin tucks au sol', '10 × 5 s', ['Sur le dos, genoux pliés.', 'Rentre le menton sans lever la tête : l’arrière du crâne glisse et appuie au sol. Tiens 5 s.']],
    ['Dead bug', '8 / côté', ['Sur le dos, bras vers le plafond, genoux à 90°. Bas du dos plaqué au sol.', 'En expirant, tends un bras et la jambe opposée sans poser, reviens, alterne. Lent.']],
    ['Planche latérale', '30 s / côté', ['Coude sous l’épaule, jambes tendues (ou genoux pliés).', 'Tête, bassin et pieds alignés, pousse le sol. +10 s côté le plus dur.']],
    ['Étirement trapèze gauche', '40 s', ['Assis, main gauche sous la fesse gauche pour bloquer l’épaule.', 'Oreille droite vers l’épaule droite, nez légèrement vers l’aisselle droite.', 'Main droite posée sur la tête si besoin, sans tirer.']],
  ]},
  soir: { name: 'Routine soir', dur: '10 min', items: [
    ['Fléchisseur de hanche', '1 min 30', ['Un genou au sol, serre la fesse arrière et rentre le bassin.', 'Avance légèrement. 45 s par côté : soulage le bas du dos.']],
    ['Pigeon (ou figure 4 au sol)', '1 min 30', ['Jambe avant pliée devant toi, jambe arrière tendue. 45 s par côté.']],
    ['Ischios avec serviette', '1 min', ['Sur le dos, serviette sous le pied, jambe tendue vers le plafond. 30 s par jambe.']],
    ['Posture de l’enfant, bras sur le côté', '1 min', ['Fesses vers les talons, bras devant. 30 s mains à gauche, 30 s à droite : étire les dorsaux.']],
    ['Open book', '1 min', ['Couché sur le côté, genoux pliés, bras devant. Ouvre le bras du dessus en suivant des yeux. 5 par côté.']],
    ['Pecs dans le cadre de porte', '1 min', ['Coude à hauteur d’épaule, avance doucement. 30 s par bras.']],
    ['Trapèze supérieur', '1 min', ['Gauche 40 s, droite 20 s. Oreille vers l’épaule opposée, épaule gauche tirée vers le bas.']],
    ['Jambes au mur + respiration', '1 min', ['Fesses près du mur, jambes à la verticale. Inspire 4 s, expire 6–8 s.']],
  ]},
};

/* ============ ÉTAT ============ */
const KEY = 'carrure.v1';
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
S.logs = S.logs || {}; S.weights = S.weights || {}; S.checks = S.checks || {};
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Sauvegarde impossible sur cet appareil'); } }
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});

/* ============ DATES ============ */
const pad = (n) => String(n).padStart(2, '0');
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = parse(k); d.setDate(d.getDate() + n); return keyOf(d); };
const todayKey = () => keyOf(new Date());
const fmtLong = (k) => parse(k).toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtShort = (k) => parse(k).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' });
function phaseFor(k) {
  if (k < '2026-10-12') return { name: 'Avant le semi', kind: 'pre', to: '2026-10-11' };
  for (const p of PHASES) if (k >= p.from && k <= p.to) return p;
  return { name: 'Transition — trail dehors', kind: 'trans' };
}
function trainingWeek(k) {
  let n = 0;
  for (let w = 0; w < 40; w++) { const ws = addDays('2026-10-19', 7 * w); if (ws > k) break; if (phaseFor(ws).kind !== 'deload') n++; }
  return Math.max(1, n);
}
const mondayOf = (k) => { const d = parse(k).getDay(); return addDays(k, d === 0 ? -6 : 1 - d); };
const sessionOn = (k) => WEEK[parse(k).getDay()];

/* ============ LOGIQUE ============ */
function prescription(ex, ph) {
  let sets = ex.sets, reps = ex.reps.slice(), extra = '';
  if (ph.kind === 'deload') { sets = Math.min(sets, 2); extra = 'Charges −10 %'; }
  else if (ph.kind === 'recup') { sets = 2; extra = '50 % des charges'; }
  else if (ph.kind === 'vol' && BONUS_VOL.includes(ex.id)) { sets += 1; extra = '+1 série (bloc volume)'; }
  else if (ph.kind === 'force' && FORCE_LIFTS.includes(ex.id)) { reps = [5, 8]; }
  return { sets, reps, extra };
}
const repsTxt = (r, unit) => (r[0] === r[1] ? `${r[0]}` : `${r[0]}–${r[1]}`) + (unit ? ` ${unit}` : '');
const restTxt = (s) => (s >= 60 ? `${Math.floor(s / 60)} min${s % 60 ? ' ' + (s % 60) : ''}` : `${s} s`);
function lastPerf(exId, before) {
  const dates = Object.keys(S.logs).filter((d) => d < before).sort().reverse();
  for (const d of dates) for (const sid in S.logs[d]) {
    const e = S.logs[d][sid].ex && S.logs[d][sid].ex[exId];
    if (e) { const done = e.filter((s) => s && s.done); if (done.length) return { date: d, sets: done }; }
  }
  return null;
}
function isDone(k, sid) { const l = S.logs[k] && S.logs[k][sid]; return !!(l && l.done); }

/* ============ UI ============ */
const app = document.getElementById('app');
let view = { tab: 'today' };
function go(v) { view = v; render(); window.scrollTo(0, 0); }
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }
const checkEl = (on) => `<span class="check ${on ? 'on' : ''}">✓</span>`;

function render() {
  document.querySelectorAll('#tabs button').forEach((b) => b.setAttribute('aria-current', b.dataset.tab === view.tab ? 'page' : 'false'));
  if (view.session) return renderSession(view.session, view.date || todayKey());
  if (view.routine) return renderRoutine(view.routine, view.date || todayKey());
  ({ today: renderToday, sessions: renderSessions, weight: renderWeight, more: renderMore })[view.tab]();
}

function renderToday() {
  const k = todayKey(), ph = phaseFor(k), sid = sessionOn(k), s = SESSIONS[sid];
  const c = S.checks[k] || {};
  const mon = mondayOf(k);
  const days = [...Array(7)].map((_, i) => {
    const d = addDays(mon, i), id = sessionOn(d), lbl = { basA: 'Bas A', hautA: 'Haut A', cotes: 'Côtes', basB: 'Bas B', hautB: 'Haut B', z2: 'Z2', repos: '—' }[id];
    return `<div class="day ${d === k ? 'today' : ''}">${parse(d).toLocaleDateString('fr-CA', { weekday: 'narrow' })}<b>${parse(d).getDate()}</b>${lbl}<span class="dot ${isDone(d, id) ? 'on' : ''}"></span></div>`;
  }).join('');
  let countdown = '';
  if (ph.kind === 'pre') { const n = Math.round((parse('2026-10-11') - parse(k)) / 864e5); countdown = n > 0 ? `<span class="chip warn">Semi dans ${n} j</span>` : n === 0 ? '<span class="chip warn">Jour du semi !</span>' : ''; }
  const w = S.weights[k];
  app.innerHTML = `
    <div><div class="eyebrow">${fmtLong(k)}</div><h1>Aujourd'hui</h1></div>
    <div class="card"><div class="row between"><h2>${ph.name}</h2>${countdown || (ph.to ? `<span class="chip">jusqu'au ${fmtShort(ph.to)}</span>` : '')}</div><div class="small muted">${PHASE_TIPS[ph.kind]}</div></div>
    <button class="card hero tap-card" data-open-session="${sid}" style="text-align:left;cursor:${sid === 'repos' ? 'default' : 'pointer'}">
      <div class="eyebrow">Séance du jour</div>
      <div class="row between"><h2 style="font-size:22px">${s.name}</h2>${isDone(k, sid) ? '<span class="chip good">Faite</span>' : sid !== 'repos' ? '<span style="font-size:22px">›</span>' : ''}</div>
      <div class="muted">${s.sub}${s.ex ? ` · ${s.ex.length} exercices` : ''}</div>
    </button>
    <div class="card" style="gap:0">
      <div class="eyebrow" style="margin-bottom:4px">Routines du jour</div>
      ${['matin', 'posture', 'soir'].map((r) => `<button class="tap" data-open-routine="${r}">${checkEl(c[r])}<span class="grow"><h3>${ROUTINES[r].name}</h3><span class="small muted">${ROUTINES[r].dur}</span></span><span class="chev">›</span></button>`).join('')}
    </div>
    <div class="card">
      <div class="row between"><h2>Pesée</h2>${w ? `<span class="chip good">${w} kg</span>` : ''}</div>
      <form class="field" id="wform"><input id="wtoday" type="number" inputmode="decimal" step="0.1" min="30" max="200" placeholder="Poids du matin (kg)" value="${w || ''}"><button class="btn">OK</button></form>
      ${weightSummary()}
    </div>
    <div class="card"><div class="eyebrow">Cette semaine</div><div class="week">${days}</div></div>`;
}

function weightSummary() {
  const ks = Object.keys(S.weights).sort();
  if (!ks.length) return '<div class="small muted">Pèse-toi le matin, à jeun, après les toilettes. Objectif : +0,3 à 0,5 kg par semaine.</div>';
  const avg = (from, to) => { const v = ks.filter((x) => x >= from && x <= to).map((x) => S.weights[x]); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  const t = todayKey(), a1 = avg(addDays(t, -6), t), a0 = avg(addDays(t, -13), addDays(t, -7));
  let s = a1 ? `Moyenne 7 jours : <b>${a1.toFixed(1)} kg</b>` : '';
  if (a1 && a0) { const d = a1 - a0; s += ` · ${d >= 0 ? '+' : ''}${d.toFixed(1)} kg vs semaine passée ${d < 0.15 ? '<span class="chip warn">ajoute 250 kcal/jour</span>' : d > 0.7 ? '<span class="chip warn">un peu rapide</span>' : '<span class="chip good">bon rythme</span>'}`; }
  return `<div class="small">${s}</div>`;
}

function renderSessions() {
  const k = todayKey();
  const list = (ids) => ids.map((id) => { const s = SESSIONS[id]; return `<button class="tap" data-open-session="${id}">${checkEl(isDone(k, id))}<span class="grow"><h3>${s.name}</h3><span class="small muted">${s.sub}</span></span><span class="chev">›</span></button>`; }).join('');
  app.innerHTML = `
    <div><div class="eyebrow">${phaseFor(k).name}</div><h1>Séances</h1></div>
    <div class="card" style="gap:0"><div class="eyebrow" style="margin-bottom:4px">Muscu</div>${list(['basA', 'hautA', 'basB', 'hautB'])}</div>
    <div class="card" style="gap:0"><div class="eyebrow" style="margin-bottom:4px">Tapis</div>${list(['cotes', 'z2'])}</div>
    <div class="card" style="gap:0"><div class="eyebrow" style="margin-bottom:4px">Routines</div>${['matin', 'posture', 'soir'].map((r) => `<button class="tap" data-open-routine="${r}">${checkEl((S.checks[k] || {})[r])}<span class="grow"><h3>${ROUTINES[r].name}</h3><span class="small muted">${ROUTINES[r].dur}</span></span><span class="chev">›</span></button>`).join('')}</div>
    <div class="small muted">Une séance ouverte est enregistrée à la date du jour, même si ce n'est pas celle prévue.</div>`;
}

function renderSession(sid, k) {
  const s = SESSIONS[sid], ph = phaseFor(k);
  const log = (S.logs[k] && S.logs[k][sid]) || { ex: {} };
  let body = '';
  if (s.type === 'muscu') {
    body = s.ex.map((ex) => {
      const p = prescription(ex, ph), last = lastPerf(ex.id, k), cur = log.ex[ex.id] || [];
      const lastTxt = last ? `Dernière fois (${fmtShort(last.date)}) : ${last.sets.map((x) => (x.kg !== '' && x.kg != null ? `${x.kg}×` : '') + (x.reps || '?')).join(' · ')}` : 'Première fois : choisis une charge où tu finis avec 2–3 rép. en réserve.';
      const up = last && last.sets.length >= p.sets && last.sets.every((x) => +x.reps >= p.reps[1]) && ph.kind !== 'deload' && ph.kind !== 'recup';
      const rows = [...Array(p.sets)].map((_, i) => {
        const v = cur[i] || {}, lv = last && last.sets[i] ? last.sets[i] : {};
        return `<div class="set" data-ex="${ex.id}" data-i="${i}">
          <span class="n">S${i + 1}</span>
          <input type="number" inputmode="decimal" step="0.5" aria-label="Charge série ${i + 1}" data-f="kg" placeholder="${ex.bw ? 'PdC' : lv.kg != null && lv.kg !== '' ? lv.kg : 'kg'}" value="${v.kg ?? ''}">
          <input type="number" inputmode="numeric" aria-label="Répétitions série ${i + 1}" data-f="reps" placeholder="${lv.reps || repsTxt(p.reps)}" value="${v.reps ?? ''}">
          <button class="setbtn ${v.done ? 'on' : ''}" data-done data-rest="${ex.rest}" aria-label="Série ${i + 1} faite">✓</button>
        </div>`;
      }).join('');
      return `<div class="card ex">
        <div class="ex-head"><div style="min-width:0"><h3>${ex.n}</h3>${ex.alt ? `<div class="small muted">${ex.alt}</div>` : ''}</div><div class="presc">${p.sets} × ${repsTxt(p.reps, ex.unit)}</div></div>
        <div class="row" style="flex-wrap:wrap;gap:6px"><span class="chip">repos ${restTxt(ex.rest)}</span>${ex.uni ? '<span class="chip warn">côté droit d’abord</span>' : ''}${p.extra ? `<span class="chip">${p.extra}</span>` : ''}</div>
        ${ex.note ? `<div class="note">${ex.note}</div>` : ''}
        <div class="last">${lastTxt}</div>${up ? '<div class="hint">↑ Tu as atteint le haut de la fourchette : monte la charge de 2,5–5 %.</div>' : ''}
        <div class="set" style="margin-bottom:-4px"><span></span><span class="lbl">${ex.unit === 'm' ? 'kg / main' : 'kg'}</span><span class="lbl">${ex.unit === 'm' ? 'mètres' : 'rép.'}</span><span></span></div>
        <div class="sets">${rows}</div>
      </div>`;
    }).join('');
    body = `<div class="card"><div class="small muted">Échauffement 8 min : 5 min de vélo + 2 séries légères du 1er exercice. Règle dos : aucune douleur lombaire, sinon prends la variante.</div></div>` + body;
  } else if (s.type === 'run') {
    body = `<div class="card"><ol class="steps">${RUNS[sid](ph, k).map((x) => `<li>${x}</li>`).join('')}</ol><div class="small muted">Course facile = Z2, 135–150 bpm. Si c'est le même jour qu'une séance jambes, cours après la muscu.</div></div>`;
  } else {
    body = `<div class="card"><div>Jour de repos. Si tu te sens bien et que ton poids monte comme prévu : 25–30 min de Z2 à 1 %.</div></div>`;
  }
  const done = !!log.done;
  app.innerHTML = `
    <button class="back" data-back>‹ Retour</button>
    <div><div class="eyebrow">${fmtLong(k)} · ${ph.name}</div><h1>${s.name}</h1><div class="muted">${s.sub}</div></div>
    ${body}
    ${s.type !== 'rest' ? `<button class="btn ${done ? 'ghost' : 'good'}" data-finish="${sid}">${done ? 'Marquer comme non faite' : 'Séance terminée'}</button>` : ''}`;
  view.session = sid; view.date = k;
}

function renderRoutine(rid, k) {
  const r = ROUTINES[rid], on = (S.checks[k] || {})[rid];
  app.innerHTML = `
    <button class="back" data-back>‹ Retour</button>
    <div><div class="eyebrow">${r.dur} · sans matériel</div><h1>${r.name}</h1>${r.intro ? `<div class="muted small" style="margin-top:4px">${r.intro}</div>` : ''}</div>
    <div class="card">${r.items.map(([n, d, how], i) => `<details><summary><span class="num">${i + 1}</span><h3>${n}</h3><span class="dur">${d}</span></summary><ul class="how">${how.map((h) => `<li>${h}</li>`).join('')}</ul></details>`).join('')}</div>
    <div class="small muted">Touche un exercice pour voir comment le faire. Respire lentement : une tension oui, une douleur non.</div>
    <button class="btn ${on ? 'ghost' : 'good'}" data-routine-done="${rid}">${on ? 'Marquer comme non faite' : 'Routine faite'}</button>`;
}

function renderWeight() {
  const ks = Object.keys(S.weights).sort();
  let chart = '<div class="small muted">Ta courbe apparaîtra après 2 pesées.</div>';
  if (ks.length >= 2) {
    const W = 340, H = 180, L = 34, R = 10, T = 12, B = 24;
    const vals = ks.map((x) => S.weights[x]);
    const lo = Math.floor(Math.min(...vals, 66) - 1), hi = Math.ceil(Math.max(...vals, 75) + 0.5);
    const t0 = parse(ks[0]).getTime(), t1 = Math.max(parse(ks[ks.length - 1]).getTime(), t0 + 864e5);
    const X = (k) => L + ((parse(k).getTime() - t0) / (t1 - t0)) * (W - L - R), Y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const ticks = []; for (let v = Math.ceil(lo); v <= hi; v += hi - lo > 10 ? 2 : 1) ticks.push(v);
    const pts = ks.map((x) => `${X(x).toFixed(1)},${Y(S.weights[x]).toFixed(1)}`).join(' ');
    const lastK = ks[ks.length - 1];
    chart = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Évolution du poids">
      ${ticks.map((v) => `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${v}</text>`).join('')}
      <line x1="${L}" x2="${W - R}" y1="${Y(75)}" y2="${Y(75)}" stroke="var(--good)" stroke-dasharray="4 4" stroke-width="1.5"/><text x="${W - R}" y="${Y(75) - 5}" text-anchor="end" style="fill:var(--good)">objectif 75</text>
      <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      <circle cx="${X(lastK)}" cy="${Y(S.weights[lastK])}" r="4.5" fill="var(--accent)"/>
      <text x="${L}" y="${H - 6}">${fmtShort(ks[0])}</text><text x="${W - R}" y="${H - 6}" text-anchor="end">${fmtShort(lastK)}</text>
    </svg>`;
  }
  const rows = ks.slice().reverse().slice(0, 60).map((x) => `<tr><td>${fmtShort(x)}</td><td class="r">${S.weights[x].toFixed(1)} kg</td><td class="r"><button class="del" data-delw="${x}" aria-label="Supprimer">×</button></td></tr>`).join('');
  app.innerHTML = `
    <div><div class="eyebrow">Objectif ~75 kg en avril</div><h1>Poids</h1></div>
    <div class="card"><form class="field" id="wform2"><input id="wdate" type="date" value="${todayKey()}"><input id="wval" type="number" inputmode="decimal" step="0.1" placeholder="kg"><button class="btn">Ajouter</button></form>${weightSummary()}</div>
    <div class="card">${chart}</div>
    ${rows ? `<div class="card"><table><tr><th>Date</th><th class="r">Poids</th><th></th></tr>${rows}</table></div>` : ''}`;
}

function renderMore() {
  const nLogs = Object.values(S.logs).reduce((a, d) => a + Object.values(d).filter((x) => x.done).length, 0);
  app.innerHTML = `
    <div><div class="eyebrow">Carrure</div><h1>Plus</h1></div>
    <div class="card"><h2>Sauvegarde</h2>
      <div class="small muted">Tes données restent sur ce téléphone (${nLogs} séance${nLogs > 1 ? 's' : ''}, ${Object.keys(S.weights).length} pesée${Object.keys(S.weights).length > 1 ? 's' : ''}). Exporte une sauvegarde de temps en temps, par exemple à chaque deload.</div>
      <button class="btn" id="export">Exporter la sauvegarde</button>
      <details><summary><h3>Restaurer une sauvegarde</h3></summary>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
          <input type="file" id="importfile" accept=".json,application/json">
          <textarea id="importtxt" placeholder="…ou colle le contenu du fichier ici"></textarea>
          <button class="btn ghost" id="import">Restaurer (remplace les données actuelles)</button>
        </div></details>
    </div>
    <div class="card"><h2>Règles du programme</h2>
      <ul class="steps" style="padding-left:18px">
        <li>Double progression : haut de la fourchette sur toutes les séries → +2,5–5 % de charge.</li>
        <li>Unilatéral : côté droit d'abord, même nombre de rép. à gauche.</li>
        <li>Séance manquée : décale-la, ne la double pas.</li>
        <li>Course facile en Z2 (135–150 bpm). 2–3 courses max par semaine.</li>
        <li>Alerte : douleur lombaire > 48 h, FC de repos +5 bpm plusieurs jours → allège la semaine.</li>
        <li>~3 300 kcal/jour, 130–150 g de protéines, +400–600 kcal les jours de course.</li>
      </ul></div>
    <div class="card"><h2>Installer sur l'iPhone</h2><div class="small">Dans Safari : bouton Partager → <b>Sur l'écran d'accueil</b>. L'app s'ouvre alors en plein écran et marche hors ligne.</div></div>`;
}

/* ============ ÉVÉNEMENTS ============ */
document.getElementById('tabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-tab]'); if (b) go({ tab: b.dataset.tab }); });

app.addEventListener('click', (e) => {
  const t = e.target;
  const os = t.closest('[data-open-session]');
  if (os) { if (os.dataset.openSession !== 'repos' || view.tab !== 'today') go({ tab: view.tab, session: os.dataset.openSession, date: todayKey() }); return; }
  const or = t.closest('[data-open-routine]');
  if (or) { go({ tab: view.tab, routine: or.dataset.openRoutine, date: todayKey() }); return; }
  if (t.closest('[data-back]')) { go({ tab: view.tab }); return; }
  const db = t.closest('[data-done]');
  if (db) {
    const row = db.closest('.set'), cell = getSet(row.dataset.ex, +row.dataset.i);
    cell.done = !cell.done;
    if (cell.done) {
      row.querySelectorAll('input').forEach((inp) => { if (inp.value === '' && inp.placeholder && !isNaN(parseFloat(inp.placeholder))) { inp.value = parseFloat(inp.placeholder); cell[inp.dataset.f] = inp.value; } });
      startTimer(+db.dataset.rest);
    }
    db.classList.toggle('on', cell.done); save(); return;
  }
  const fin = t.closest('[data-finish]');
  if (fin) {
    const l = sessLog(fin.dataset.finish, view.date); l.done = !l.done; save();
    if (l.done) { toast('Séance enregistrée'); stopTimer(); go({ tab: view.tab }); } else render();
    return;
  }
  const rd = t.closest('[data-routine-done]');
  if (rd) { const k = view.date || todayKey(); S.checks[k] = S.checks[k] || {}; S.checks[k][rd.dataset.routineDone] = !S.checks[k][rd.dataset.routineDone]; save(); if (S.checks[k][rd.dataset.routineDone]) { toast('Routine cochée'); go({ tab: view.tab }); } else render(); return; }
  const dw = t.closest('[data-delw]');
  if (dw) { delete S.weights[dw.dataset.delw]; save(); render(); return; }
  if (t.id === 'export') return exportData();
  if (t.id === 'import') return importData();
});
app.addEventListener('input', (e) => {
  const inp = e.target; if (!inp.dataset.f) return;
  const row = inp.closest('.set'); getSet(row.dataset.ex, +row.dataset.i)[inp.dataset.f] = inp.value; save();
});
app.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.id === 'wform') { const v = parseFloat(document.getElementById('wtoday').value); if (v > 30 && v < 200) { S.weights[todayKey()] = v; save(); toast('Pesée enregistrée'); render(); } }
  if (e.target.id === 'wform2') { const v = parseFloat(document.getElementById('wval').value), d = document.getElementById('wdate').value; if (d && v > 30 && v < 200) { S.weights[d] = v; save(); toast('Pesée enregistrée'); render(); } }
});
function sessLog(sid, k) { S.logs[k] = S.logs[k] || {}; S.logs[k][sid] = S.logs[k][sid] || { ex: {} }; S.logs[k][sid].ex = S.logs[k][sid].ex || {}; return S.logs[k][sid]; }
function getSet(exId, i) { const l = sessLog(view.session, view.date); l.ex[exId] = l.ex[exId] || []; l.ex[exId][i] = l.ex[exId][i] || {}; return l.ex[exId][i]; }

/* ============ MINUTEUR ============ */
const tEl = document.getElementById('timer');
let tEnd = 0, tInt = null, actx = null;
function beep() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach((d) => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = 880; g.gain.value = 0.15; o.connect(g); g.connect(actx.destination); o.start(actx.currentTime + d); o.stop(actx.currentTime + d + 0.15); });
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}
function startTimer(sec) {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) {}
  tEnd = Date.now() + sec * 1000; tEl.hidden = false; tEl.classList.remove('done'); tick();
  clearInterval(tInt); tInt = setInterval(tick, 250);
}
function stopTimer() { clearInterval(tInt); tEl.hidden = true; }
function tick() {
  const left = Math.max(0, Math.round((tEnd - Date.now()) / 1000));
  tEl.innerHTML = `<span class="small">${left ? 'Repos' : 'Go !'}</span><span class="t">${Math.floor(left / 60)}:${pad(left % 60)}</span><span style="flex:1"></span><button data-t="-15">−15</button><button data-t="15">+15</button><button data-t="x">✕</button>`;
  if (!left) { clearInterval(tInt); tEl.classList.add('done'); beep(); setTimeout(() => { if (tEnd < Date.now()) stopTimer(); }, 6000); }
}
tEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-t]'); if (!b) return;
  if (b.dataset.t === 'x') return stopTimer();
  tEnd += +b.dataset.t * 1000; if (tEl.classList.contains('done')) { tEl.classList.remove('done'); clearInterval(tInt); tInt = setInterval(tick, 250); } tick();
});

/* ============ SAUVEGARDE ============ */
async function exportData() {
  const json = JSON.stringify(S), name = `carrure-${todayKey()}.json`;
  try {
    const file = new File([json], name, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Sauvegarde Carrure' }); return; }
  } catch (e) { if (e.name === 'AbortError') return; }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' })); a.download = name; a.click(); toast('Fichier téléchargé'); }
  catch (e) { try { await navigator.clipboard.writeText(json); toast('Copié dans le presse-papiers'); } catch (_) { toast('Export impossible'); } }
}
async function importData() {
  let txt = document.getElementById('importtxt').value.trim();
  const f = document.getElementById('importfile').files[0];
  if (!txt && f) txt = await f.text();
  try { const d = JSON.parse(txt); if (!d || typeof d !== 'object' || !('logs' in d)) throw 0; S = { logs: d.logs || {}, weights: d.weights || {}, checks: d.checks || {} }; save(); toast('Sauvegarde restaurée'); go({ tab: 'today' }); }
  catch (e) { toast('Fichier invalide : choisis un export Carrure'); }
}

/* ============ DÉMARRAGE ============ */
let lastDay = todayKey();
document.addEventListener('visibilitychange', () => { if (!document.hidden && todayKey() !== lastDay) { lastDay = todayKey(); if (!view.session && !view.routine) render(); } });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
render();
