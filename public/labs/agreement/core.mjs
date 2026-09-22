/** Pure, dependency-free lab logic. No network, model execution, or account memory. */
export const CONDITIONS = [
  { id: 'baseline', name: 'A · Usual instructions', detail: 'No added experimental prompt. Freeze and record the actual baseline; do not invent a supposedly typical assistant.' },
  { id: 'footer', name: 'B · Mandatory footer', detail: 'The same baseline, plus the frozen footer prompt below. Exact-output requests still take priority.' },
  { id: 'adaptive', name: 'C · Adaptive agreement', detail: 'The same baseline, plus the supplied working agreement verbatim. Context and effort settings stay matched.' }
];
export const FOOTER_PROMPT = 'Be optimistic, compassionate, candid, and highly capable. After each response, add a section titled [Task Optimization] that briefly describes the communication style and methods used to help the user. Keep it under 60 words. Exact-output requests take precedence.';
export const ORDER = [ ['baseline','footer','adaptive'], ['footer','adaptive','baseline'], ['adaptive','baseline','footer'], ['baseline','adaptive','footer'], ['adaptive','footer','baseline'], ['footer','baseline','adaptive'] ];
export const METRICS = ['taskSuccess','repeatedCorrection','unintendedChange','extraTurns','inspectionSeconds','honestVerification'];
export function makeSession(task) {
  return { taskId: task.id, step: 0, changes: [], artifacts: [], acceptedRevision: null, failedUpdate: false, journal: [] };
}
export function advance(session, task) {
  if (session.step >= task.turns.length) return session;
  const s = structuredClone(session), turn = task.turns[s.step];
  // One-response adjustments expire; task adjustments survive until explicitly reverted.
  s.changes.forEach(c => { if(c.scope === 'response' && c.status === 'active') c.status = 'expired'; });
  if (turn.adjustment) s.changes.push({id:`${task.id}-change-${s.step+1}`, text:turn.adjustment, basis:turn.basis, scope:turn.scope, status:'active', turn:s.step+1});
  if (task.artifact && !(task.id === 'demo-implementation' && s.step === 2)) {
    s.artifacts.push({revision:s.artifacts.length+1, text:turn.answer, turn:s.step+1, check:null});
  }
  s.step += 1;
  s.failedUpdate = false;
  s.journal.push({type:'illustration-advanced', detail:`Authored turn ${s.step}; no model was called.`});
  return s;
}
export function undoAdjustment(session) {
  const s=structuredClone(session), c=s.changes.findLast(c=>c.status==='active');
  if (!c) return s;
  c.status='reverted'; s.journal.push({type:'adjustment-reverted', detail:`Reverted ${c.id}. Approved work and artifact versions were preserved.`});
  return s;
}
export function checkArtifact(task, artifact) {
  if (!artifact) return {status:'unknown', detail:'No artifact exists to inspect.'};
  const text=artifact.text;
  if(task.id==='demo-creative') return {status:text.startsWith(task.approved+' ') ? 'pass':'fail', detail:'Exact approved opening prefix compared. This does not judge the quality of the ending.'};
  if(task.id==='demo-format') {
    try { const v=JSON.parse(text), count=artifact.turn===1?3:4;
      const ok=v!==null && !Array.isArray(v) && Object.keys(v).sort().join(',')==='count,status' && v.status==='ready' && v.count===count && text===JSON.stringify(v);
      return {status:ok?'pass':'fail', detail:'Complete answer parsed; exact keys, values, compact encoding, and absence of extra text checked.'};
    } catch {return {status:'fail',detail:'The complete answer is not valid JSON.'};}
  }
  if(task.id==='demo-implementation') {
    const ok=text.startsWith(task.approved) && !/\b(import|require)\b/.test(text) && text.includes('n === 1 ? "1 file"') && (artifact.turn===1 || text.includes('if (n === 0) return "No files";'));
    return {status:ok?'pass':'fail',detail:'Static text check only: exported signature, no imports, singular branch, and required zero branch. No JavaScript was executed.'};
  }
  return {status:'unknown', detail:'This criterion requires human review. Displaying text is not evidence of factual correctness or usefulness.'};
}
export function validateRun(value, taskIds) {
  const errors=[];
  if(!value || typeof value!=='object' || Array.isArray(value)) return ['Run must be an object.'];
  if(value.provenance!=='observed-run') errors.push('Only observed-run records may enter the pilot ledger.');
  if(!taskIds.includes(value.taskId)) errors.push('Unknown taskId.');
  if(!CONDITIONS.some(c=>c.id===value.condition)) errors.push('Unknown condition.');
  for(const k of ['runId','model','transcript','evidence','baselineSnapshot','settings']) {
    if(typeof value[k]!=='string' || !value[k].trim()) errors.push(`${k} must be a nonempty string.`);
  }
  if(!['controlled','limited','unknown'].includes(value.memoryIsolation)) errors.push('Record the memory-isolation limitation.');
  for(const k of ['taskSuccess','honestVerification']) if(!['pass','fail','unknown'].includes(value[k])) errors.push(`${k} must be pass, fail, or unknown.`);
  for(const k of ['repeatedCorrection','unintendedChange','extraTurns','inspectionSeconds']) {
    if(value[k]!==null && !(Number.isFinite(value[k]) && value[k]>=0 && (k==='inspectionSeconds'||Number.isInteger(value[k])))) errors.push(`${k} must be a nonnegative number (integer for counts) or null.`);
  }
  if(value.transcript?.length>100000 || value.evidence?.length>20000) errors.push('Record exceeds the local review size limit.');
  return errors;
}
export function summarize(runs, condition, metric) {
  const rows=runs.filter(r=>r.provenance==='observed-run' && r.condition===condition);
  if(['taskSuccess','honestVerification'].includes(metric)) {
    const known=rows.filter(r=>r[metric]==='pass'||r[metric]==='fail');
    return {n:known.length, total:rows.length, value:known.length?known.filter(r=>r[metric]==='pass').length/known.length:null};
  }
  const known=rows.filter(r=>typeof r[metric]==='number' && Number.isFinite(r[metric]));
  return {n:known.length,total:rows.length,value:known.length?known.reduce((n,r)=>n+r[metric],0)/known.length:null};
}
export function handoff(task, session) {
  return `# Working agreement handoff\n\nProvenance: authored demonstration, not a model evaluation.\nGoal: ${task.goal}\n\nHard constraints:\n${task.constraints.map(x=>'- '+x).join('\n')}\n\nApproved: ${task.approved}\n\nAdaptations:\n${session.changes.map(c=>`- [${c.status}; ${c.scope}] ${c.text} Basis: ${c.basis}`).join('\n')||'None.'}\n\nChecks: ${task.check}\nLatest artifact revision: ${session.artifacts.at(-1)?.revision??'none'}\nAccepted preview revision: ${session.acceptedRevision??'none'}\nOutstanding: subjective review and real multi-condition evaluation remain unperformed.\nPersistence: current page only; this file does not save ChatGPT memory.\n`;
}
export function buildPacket(task, condition, adaptivePrompt) {
  const p=condition==='adaptive'?adaptivePrompt:condition==='footer'?FOOTER_PROMPT:'[NO ADDED EXPERIMENTAL INSTRUCTION — record the actual usual instructions separately]';
  return `# Pilot packet — ${task.short} / ${condition}\n\nVersion: AWA-0.1\nThis is a task script, not a measured result. Open a fresh, comparably configured conversation. Apply the following at the SAME instruction level in every run. Do not tell the model that a particular condition should win.\n\n## Added instruction\n${p}\n\n## Fixed supplied context\n${task.sources?task.sources.map(s=>s.id+': '+s.text).join('\n'):'No additional source packet.'}\n\n## User turns (send individually, in order)\n${task.turns.map((t,i)=>`${i+1}. ${t.user}`).join('\n\n')}\n\n## Run manifest (record outside model input)\nModel identifier/snapshot; date; effort and sampling settings; tools/permissions; baseline instructions or hash; memory/custom-instruction state; context snapshot/hash; elapsed time; prompt/completion tokens if available; reviewer; complete transcript and tool receipts. Unavailable values must say unknown. Do not supply the authored answers to the tested model.\n`;
}
