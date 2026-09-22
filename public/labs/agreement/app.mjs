import {CONDITIONS, FOOTER_PROMPT, METRICS, makeSession, advance, undoAdjustment, checkArtifact, validateRun, summarize, handoff, buildPacket} from './core.mjs';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state={tasks:[],sessions:{},taskId:'demo-creative',panel:'agreement',view:'playground',previewTab:'render',revision:null,runs:[],reviews:[],pair:null,prompt:''};
const newId=()=>Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
let toastTimer;
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4200);}
function download(name,text,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function copy(text,name='stratos-handoff.txt'){try{await navigator.clipboard.writeText(text);toast('Copied. Nothing was installed or saved to account memory.');}catch{download(name,text);toast('Clipboard unavailable. Downloaded the text instead.');}}
const task=()=>state.tasks.find(t=>t.id===state.taskId), session=()=>state.sessions[state.taskId];
const latest=()=>session().artifacts.at(-1);
function options(rows,key='id',label='name'){return rows.map(x=>`<option value="${esc(x[key])}">${esc(x[label])}</option>`).join('');}
function render(){
  const t=task(),s=session();
  $('#tasks').innerHTML=state.tasks.map(t=>`<button data-task="${t.id}" aria-pressed="${t.id===state.taskId}"><span class="task-number">${t.icon}</span>${esc(t.short)}</button>`).join('');
  $('#task-kind').textContent=t.kind.toUpperCase();$('#task-title').textContent=t.title;$('#turn-count').textContent=`${s.step} / ${t.turns.length} TURNS`;
  $('#source-packet').innerHTML=t.sources?`<details class="source-packet"><summary>Fixed fictional source packet · A & B</summary>${t.sources.map(x=>`<p><strong>${x.id}</strong> — ${esc(x.text)}</p>`).join('')}</details>`:'';
  $('#messages').innerHTML=s.step?t.turns.slice(0,s.step).map((turn,i)=>`${i?`<div class="turn-divider">TURN ${i+1}</div>`:''}<article class="message user"><div class="avatar" aria-hidden="true">DU</div><div class="message-body"><div class="role"><strong>Demo user</strong><small>scripted input</small></div><pre>${esc(turn.user)}</pre></div></article><article class="message assistant"><div class="avatar" aria-hidden="true">S7</div><div class="message-body"><div class="role"><strong>Assistant example</strong><small>authored, not a model run</small></div><pre>${esc(turn.answer)}</pre>${turn.adjustment && !['demo-format','demo-casual'].includes(t.id)?`<div class="optimization"><strong>[Task Optimization]</strong><br>Adjustment: ${esc(turn.adjustment)}<br>Basis: ${esc(turn.basis)}<br>Check: Illustrative wording; no model outcome was measured.</div>`:''}</div></article>`).join(''):`<div class="empty-chat"><h3>A conversation before the work begins.</h3><p>Play the first authored turn to explore this case. Build Preview is empty until an artifact is actually present.</p></div>`;
  $('#advance').disabled=s.step===t.turns.length;$('#advance').innerHTML=s.step===t.turns.length?'Demonstration complete':s.step?'Play next turn <span aria-hidden="true">→</span>':'Play first turn <span aria-hidden="true">→</span>';
  $('#step-note').textContent=s.step?'No live model is running.':'Start without a build.';
  $('#preview-state').textContent=latest()?`Revision ${latest().revision} available · authored artifact`:t.artifact?'Nothing built in this chat':'No artifact requested';
  renderInspector();renderMetrics();
}
function renderInspector(){
  const t=task(),s=session(),a=latest();
  document.querySelectorAll('[data-panel]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.panel===state.panel)));
  let html='';
  if(state.panel==='agreement') html=`<section class="agreement-group"><h3>Goal</h3><p>${esc(t.goal)}</p></section><section class="agreement-group"><h3>Hard constraints</h3>${t.constraints.map(c=>`<div class="constraint"><span aria-hidden="true">⌑</span>${esc(c)}</div>`).join('')}</section><section class="agreement-group"><h3>Keep intact</h3><div class="approved"><small>FIXTURE REQUIREMENT</small>${esc(t.approved)}</div></section><section class="agreement-group"><h3>Adjustments <span class="muted">/ ${s.changes.length}</span></h3>${s.changes.length?s.changes.map(c=>`<article class="change-card" data-status="${c.status}"><div class="meta"><span>${esc(c.scope.toUpperCase())}</span><span>· ${esc(c.status)}</span><span>· turn ${c.turn}</span></div><p>${esc(c.text)}</p><small>Basis: ${esc(c.basis)}</small></article>`).join(''):'<p class="muted">No adaptation yet. A prepared task brief is not a saved preference.</p>'}<button data-undo ${s.changes.some(c=>c.status==='active')?'':'disabled'}>Undo latest adjustment</button></section><section class="agreement-group"><h3>Unresolved</h3><p>Subjective acceptance and comparative model performance remain unknown.</p></section>`;
  if(state.panel==='checks') html=`<section class="agreement-group"><h3>Check the work, not the persona</h3><p>${esc(t.check)}</p><div class="check-card"><span class="pill ${a?.check?.status||'unknown'}">${a?.check?esc(a.check.status.toUpperCase()):'NOT CHECKED'}</span><p>${esc(a?.check?.detail||'No check has been run for the latest artifact.')}</p><button data-check="latest" class="check-button" ${a?'':'disabled'}>Run local artifact check</button></div><p>Produced: ${a?`revision ${a.revision}`:'nothing'}<br>Checked: ${a?.check?`revision ${a.revision}; narrow criterion only`:'not yet'}<br>Confirmed model improvement: unknown</p></section>`;
  if(state.panel==='history') html=`<section class="agreement-group"><h3>Observable events only</h3>${s.journal.length?s.journal.map(j=>`<div class="journal-card"><span class="eyebrow">${esc(j.type)}</span><p>${esc(j.detail)}</p></div>`).join(''):'<p>No events in this task yet.</p>'}<p class="muted">This timeline is temporary page state, not hidden reasoning or durable account memory.</p></section>`;
  $('#inspector-body').innerHTML=html;
}
function check(revision){const s=session(),a=s.artifacts.find(a=>a.revision===revision);if(!a)return;a.check=checkArtifact(task(),a);s.journal.push({type:'local-check',detail:`Revision ${revision}: ${a.check.status}. ${a.check.detail}`});renderInspector();if($('#preview-dialog').open)renderPreview();toast(`Revision ${revision}: ${a.check.status}. Only the named criterion was inspected.`);}
function renderPreview(){
  const s=session(),t=task();if(!s.artifacts.some(a=>a.revision===state.revision))state.revision=s.acceptedRevision||latest()?.revision||null;
  const a=s.artifacts.find(a=>a.revision===state.revision);
  $('#preview-revision').innerHTML=s.artifacts.length?s.artifacts.map(a=>`<option value="${a.revision}">Revision ${a.revision}${a.revision===s.acceptedRevision?' · accepted':''}</option>`).join(''):'<option>No artifact</option>';
  if(a)$('#preview-revision').value=String(a.revision);$('#preview-revision').disabled=!a;
  $('#preview-pin').disabled=!a;$('#preview-pin').textContent=a&&s.acceptedRevision===a.revision?'Unpin accepted revision':'Accept this revision';
  $('#failure-toggle').disabled=!a;$('#failure-toggle').textContent=s.failedUpdate?'Clear simulated failure':'Simulate interrupted update';
  $('#preview-badge').textContent=s.failedUpdate?'SIMULATED FAILURE · LAST COMPLETE ARTIFACT':a?`AUTHORED FIXTURE · ${a.revision===s.acceptedRevision?'PINNED':'NOT ACCEPTED'}`:'EMPTY';
  document.querySelectorAll('[data-preview]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preview===state.previewTab)));
  const content=$('#preview-content');
  if(!a){content.innerHTML='<div class="preview-empty"><span aria-hidden="true">▣</span><h3>Nothing built in this chat.</h3><p>This window is ready. It does not create work just by being opened.</p></div>';}
  else if(state.previewTab==='render'){
    content.replaceChildren();const frame=document.createElement('iframe');frame.title=`${t.short} artifact revision ${a.revision}`;frame.setAttribute('sandbox','');frame.setAttribute('referrerpolicy','no-referrer');
    frame.srcdoc=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><style>body{margin:0;padding:38px;color:#292632;background:#faf9f6;font:15px/1.9 system-ui}small{font:10px system-ui;letter-spacing:1.8px;color:#77717d}h1{font:24px/1.3 Georgia,serif;margin:18px 0 25px}pre{font:15px/1.9 ${['demo-format','demo-implementation'].includes(t.id)?'monospace':'Georgia,serif'};white-space:pre-wrap;overflow-wrap:anywhere}</style></head><body><small>STRATOS · AUTHORED ARTIFACT · R${a.revision}</small><h1>${esc(t.title)}</h1><pre>${esc(a.text)}</pre></body></html>`;content.append(frame);
  }else if(state.previewTab==='changes'){
    const prev=s.artifacts.find(x=>x.revision===a.revision-1);content.innerHTML=`<p class="muted">Complete revision comparison, not a line-level diff. Older artifact text is never rewritten by undoing an adjustment.</p><div class="diff-grid"><div><h3>${prev?'Previous revision '+prev.revision:'Before the first artifact'}</h3><pre>${esc(prev?.text||'No artifact.')}</pre></div><div><h3>Viewing revision ${a.revision}</h3><pre>${esc(a.text)}</pre></div></div>`;
  }else content.innerHTML=`<div class="check-card"><h3>Revision ${a.revision} · <span class="${a.check?.status||'unknown'}">${esc(a.check?.status||'not checked')}</span></h3><p>${esc(a.check?.detail||t.check)}</p><button data-check="${a.revision}">Run local artifact check</button></div><p class="muted">A local check is not model-evaluation evidence. Acceptance is a separate user action. Runtime integration and remote deployment are not connected.</p>`;
  $('#preview-receipt').textContent=a?`Chat ${t.short} · revision ${a.revision}${latest()?.revision!==a.revision?` · latest is ${latest().revision}`:''} · ${a.check?'local check: '+a.check.status:'not checked'}${s.failedUpdate?' · simulated update did not replace this artifact':''}`:'No run, artifact, check, or deployment is implied.';
}
function renderMetrics(){
  const labels={taskSuccess:'Task success',repeatedCorrection:'Repeated corrections',unintendedChange:'Unintended changes',extraTurns:'Extra turns',inspectionSeconds:'Meta inspection seconds',honestVerification:'Honest verification'};
  $('#run-total').textContent=`${state.runs.length} observed runs`;
  $('#metrics').innerHTML=`<table><thead><tr><th>Whole-interaction metric</th>${CONDITIONS.map(c=>`<th>${esc(c.name)}</th>`).join('')}</tr></thead><tbody>${METRICS.map(m=>`<tr><td>${labels[m]}</td>${CONDITIONS.map(c=>{const v=summarize(state.runs,c.id,m),binary=['taskSuccess','honestVerification'].includes(m);return `<td>${v.value===null?'—':binary?Math.round(v.value*100)+'%':v.value.toFixed(1)}<small>${v.n} known / ${v.total} runs${v.n?' · '+(binary?'pass rate':'mean'):''}</small></td>`;}).join('')}</tr>`).join('')}</tbody></table>`;
  $('#run-list').innerHTML=state.runs.map((r,i)=>`<details class="run-record"><summary>${esc(r.runId)} · ${esc(r.condition)} · ${esc(r.taskId)} · user-reported</summary><p class="muted">Model: ${esc(r.model)} · memory isolation: ${esc(r.memoryIsolation)}</p><pre>${esc(r.transcript)}</pre><h3>Evidence</h3><pre>${esc(r.evidence)}</pre><button data-remove-run="${i}">Remove this local record</button></details>`).join('');
}
function view(name){state.view=name;for(const el of document.querySelectorAll('.view'))el.hidden=el.id!==name;for(const b of document.querySelectorAll('[data-view]')){if(b.dataset.view===name)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');}}
function packet(){const t=state.tasks.find(t=>t.id===$('#packet-task').value);return buildPacket(t,$('#packet-condition').value,state.prompt);}
const handlers={
 'advance':()=>{state.sessions[state.taskId]=advance(session(),task());state.revision=session().acceptedRevision||latest()?.revision||null;render();},
 'handoff':()=>download(`${task().id}-handoff.md`,handoff(task(),session())),
 'preview-open':()=>{state.revision=session().acceptedRevision||latest()?.revision||null;renderPreview();$('#preview-dialog').showModal();},
 'preview-layout':()=>{const dock=$('#preview-dialog').classList.toggle('docked');$('#preview-layout').textContent=dock?'Center window':'Dock right';},
 'preview-pin':()=>{const s=session();if(!state.revision)return;s.acceptedRevision=s.acceptedRevision===state.revision?null:state.revision;s.journal.push({type:'preview-pin',detail:s.acceptedRevision?`Accepted fixture revision ${s.acceptedRevision}. This does not verify correctness.`:'Accepted-version pin removed. Artifact history preserved.'});renderPreview();renderInspector();},
 'failure-toggle':()=>{session().failedUpdate=!session().failedUpdate;session().journal.push({type:'simulation',detail:session().failedUpdate?'Interrupted-update scenario activated; last complete artifact preserved. No remote build failed.':'Simulated failure cleared; no remote retry occurred.'});renderPreview();renderInspector();},
 'prompt-open':()=>$('#prompt-dialog').showModal(),
 'prompt-copy':()=>copy(state.prompt,'working-agreement.txt'),
 'packet-copy':()=>copy(packet(),'pilot-packet.md'),
 'packet-download':()=>download('pilot-packet.md',packet()),
 'run-open':()=>{$('#run-task').value=state.taskId;$('#run-dialog').showModal();},
 'ledger-export':()=>{download('stratos-review-session.json',JSON.stringify({schemaVersion:1,notice:'May contain private transcripts. Review before sharing. Observations are user-reported, not independently verified.',runs:state.runs,reviews:state.reviews},null,2),'application/json');toast('Exported the review session. Review transcripts before sharing.');},
 'ledger-import':()=>$('#import-file').click(),
 'pair-start':()=>{const a=$('#pair-a').value.trim(),b=$('#pair-b').value.trim();if(!a||!b)return toast('Paste two observed interactions first.');const flip=crypto.getRandomValues(new Uint8Array(1))[0]%2===1;state.pair={left:flip?b:a,right:flip?a:b,leftSource:flip?'B':'A',rightSource:flip?'A':'B'};$('#pair-left').textContent=state.pair.left;$('#pair-right').textContent=state.pair.right;$('#pair-reason').value='';$('#pair-dialog').showModal();}
};
document.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return;
  try{
    if(b.dataset.close){document.getElementById(b.dataset.close).close();return;}
    if(b.dataset.view){view(b.dataset.view);return;}
    if(b.dataset.task){state.taskId=b.dataset.task;state.revision=null;view('playground');render();return;}
    if(b.dataset.panel){state.panel=b.dataset.panel;renderInspector();return;}
    if(b.dataset.preview){state.previewTab=b.dataset.preview;renderPreview();return;}
    if(b.hasAttribute('data-undo')){state.sessions[state.taskId]=undoAdjustment(session());renderInspector();toast('Adjustment reverted. Approved work and artifact versions are unchanged.');return;}
    if(b.dataset.check){check(b.dataset.check==='latest'?latest()?.revision:Number(b.dataset.check));return;}
    if(b.hasAttribute('data-remove-run')){state.runs.splice(Number(b.dataset.removeRun),1);renderMetrics();return;}
    if(b.dataset.vote){const reason=$('#pair-reason').value.trim();if(!reason)return toast('Record the observable basis for your judgment first.');const choice=b.dataset.vote;state.reviews.push({id:newId(),provenance:'user-reported-pairwise-review',left:state.pair.left,right:state.pair.right,leftSource:state.pair.leftSource,rightSource:state.pair.rightSource,choice,reason});$('#pair-dialog').close();toast(`Pairwise judgment recorded locally: ${choice}. Included in review-session exports.`);return;}
    if(handlers[b.id])await handlers[b.id]();
  }catch(err){toast(`Action not completed: ${err.message}`);}
});
$('#preview-revision').addEventListener('change',e=>{state.revision=Number(e.target.value);renderPreview();});
$('#run-form').addEventListener('submit',e=>{
  e.preventDefault();const data=Object.fromEntries(new FormData(e.target));
  const r={...data,runId:newId(),provenance:'observed-run'};
  for(const k of ['repeatedCorrection','unintendedChange','extraTurns','inspectionSeconds'])r[k]=data[k]===''?null:Number(data[k]);
  const errors=validateRun(r,state.tasks.map(t=>t.id));if(errors.length)return toast(errors.join(' '));
  state.runs.push(r);e.target.reset();$('#run-dialog').close();renderMetrics();toast('Observed run added to this page’s memory. Export before reloading.');
});
$('#import-file').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    if(file.size>2000000)throw new Error('Import limited to 2 MB.');
    const data=JSON.parse(await file.text());if(data.schemaVersion!==1||!Array.isArray(data.runs)||data.runs.length>100)throw new Error('Expected schemaVersion 1 and at most 100 runs.');
    const ids=new Set(state.runs.map(r=>r.runId));for(const r of data.runs){const errors=validateRun(r,state.tasks.map(t=>t.id));if(errors.length)throw new Error(errors.join(' '));if(ids.has(r.runId))throw new Error('Duplicate run ID; no import was applied.');ids.add(r.runId);}
    const reviews=data.reviews??[];if(!Array.isArray(reviews)||reviews.length>100)throw new Error('Invalid pairwise review collection.');
    for(const r of reviews){if(!r||r.provenance!=='user-reported-pairwise-review'||!['left','right','tie','insufficient'].includes(r.choice)||!['A','B'].includes(r.leftSource)||!['A','B'].includes(r.rightSource)||r.leftSource===r.rightSource||['id','left','right','reason'].some(k=>typeof r[k]!=='string'||!r[k].trim()))throw new Error('Invalid pairwise review.');}
    // All validation completes before any session state is mutated.
    state.runs.push(...data.runs);state.reviews.push(...reviews);renderMetrics();toast(`Imported ${data.runs.length} runs and ${reviews.length} pairwise reviews into this page only.`);
  }catch(err){toast(`Import rejected: ${err.message}`);}finally{e.target.value='';}
});
async function init(){
  const [f,p]=await Promise.all([fetch('./fixtures.json'),fetch('./prompt.txt')]);if(!f.ok||!p.ok)throw new Error('Lab files could not be loaded.');
  const fixture=await f.json();state.tasks=fixture.tasks;state.prompt=(await p.text()).trimEnd();state.tasks.forEach(t=>state.sessions[t.id]=makeSession(t));
  for(const id of ['packet-task','run-task'])document.getElementById(id).innerHTML=options(state.tasks,'id','short');
  for(const id of ['packet-condition','run-condition'])document.getElementById(id).innerHTML=options(CONDITIONS);
  $('#condition-cards').innerHTML=CONDITIONS.map(c=>`<article class="condition-card"><strong>${esc(c.name)}</strong><p>${esc(c.detail)}</p>${c.id==='footer'?`<details><summary>Frozen footer prompt</summary><p>${esc(FOOTER_PROMPT)}</p></details>`:''}</article>`).join('');
  $('#prompt-text').textContent=state.prompt;render();
}
init().catch(err=>{$('#main').innerHTML=`<h1>Lab unavailable</h1><p>${esc(err.message)} Serve the public directory over HTTP rather than opening this file directly.</p><a href="./prompt.txt">Read the working prompt</a>`;});
