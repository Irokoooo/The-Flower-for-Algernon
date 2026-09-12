const el = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {planned:'待开发',in_progress:'开发中',blocked:'阻塞',review:'待集成 / 验收',verified:'已验证',complete:'已完成',decided:'已决定',deferred:'后续阶段',prototype:'原型素材',missing:'待制作',available:'可用',ready:'就绪'};
const status = s => `<span class="tag ${escape(s)}">${escape(labels[s] || s)}</span>`;
const percent = n => Math.max(0, Math.min(100, Number(n) || 0));
async function json(path, optional=false) {
  const response = await fetch(`${path}?t=${Date.now()}`, {cache:'no-store'});
  if(!response.ok) { if(optional) return null; throw Error(`${path}: ${response.status}`); }
  return response.json();
}
let loading=false;
async function load() {
  if(loading) return;
  loading=true;
  try {
    const [data,manifest] = await Promise.all([json('project-status.json'),json('ASSET_MANIFEST.json')]);
    const workers = await Promise.all(data.agents.map(a => json(`status/${a.id}.json`,true).catch(()=>null)));
    const agents = data.agents.map((a,i)=>({...a,...(workers[i]||{})}));
    const requirements=data.coverage.filter(x=>x.kind==='experience');
    const finished=requirements.filter(x=>['verified','complete'].includes(x.status)).length;
    const rate=requirements.length ? Math.round(100*finished/requirements.length) : 0;
    el('overall').textContent=`${rate}%`;
    el('overallBar').style.width=`${rate}%`;
    el('overall').parentNode.querySelector('p').textContent=`完整体验：${finished}/${requirements.length} 项已验收。Agent 百分比只代表本次分工；文档与原型不计作游戏完成。`;
    el('meta').textContent=`读取时间 ${new Date().toLocaleTimeString()} · 每 15 秒读取任务状态文件 · ${data.milestone || 'Wave 1 — 首个可玩切片'}`;
    let production=el('production');
    if(!production){production=document.createElement('section');production.id='production';production.className='card';el('agents').before(production);}
    production.innerHTML=data.production ? `<b>素材制作与阻塞</b><p>${escape(data.production.art)}</p><p>${escape(data.production.music)}</p><p class="blocked">${escape(data.production.voice)}</p><small>授权上限 $${escape(data.production.budgetLimitUSD)} · 预留额度 $${escape(data.production.reservationUSD)}（不是已扣费）· 实际账单待服务商确认</small>` : '';
    el('agents').innerHTML=agents.map(a=>`<article class="card"><div class="label">${escape(a.name)} · ${escape(a.nickname)}</div><h3>${status(a.status)} <small>${percent(a.progress)}%</small></h3><div class="bar"><div class="fill" style="width:${percent(a.progress)}%"></div></div><p>${escape(a.note)}</p><small>${a.updatedAt ? escape(new Date(a.updatedAt).toLocaleString()) : '等待首次任务汇报'}</small>${a.blockers?.length?`<p class="blocked">${escape(Array.isArray(a.blockers)?a.blockers.join(' / '):a.blockers)}</p>`:''}</article>`).join('');
    el('coverage').innerHTML=['experience','constraint'].map(kind=>`<details ${kind==='experience'?'open':''}><summary>${kind==='experience'?'场景、剧情与交互':'全 PRD 规范索引'} (${data.coverage.filter(x=>x.kind===kind).length})</summary>${data.coverage.filter(x=>x.kind===kind).map(x=>`<div class="row"><div><small>§${escape(x.section)} · ${escape(x.priority)}</small><br>${escape(x.title)}${x.evidence?`<p>${escape(x.evidence)}</p>`:''}</div>${status(x.status)}</div>`).join('')}</details>`).join('');
    el('decisions').innerHTML=(data.designDecisions||[]).map(x=>`<div class="card"><b>${escape(x.title)}</b><p>${status(x.status)}</p></div>`).join('');
    el('assets').innerHTML=manifest.assets.length ? manifest.assets.map(a=>{
      const rawPath=a.filename||a.path;
      const safePath=rawPath && !rawPath.includes('..') && !/[:\\]/.test(rawPath) && /^(assets|public)\//.test(rawPath) ? rawPath : null;
      const preview=safePath&&/\.(png|jpg|jpeg|webp|svg)$/i.test(safePath)?`<img src="${escape(safePath)}" alt="${escape(a.id)}" loading="lazy" style="max-width:180px;max-height:120px;object-fit:contain">`:safePath&&/\.(mp3|wav|ogg)$/i.test(safePath)?`<audio controls preload="none" src="${escape(safePath)}"></audio>`:'';
      return `<article class="row"><div><strong>${escape(a.id)}</strong><p>${escape(a.description||a.type||a.kind)}</p>${preview}<small>${escape(a.license||'授权待核实')} · ${escape(a.source||'来源待登记')}</small></div>${status(a.status)}</article>`;
    }).join('') : '<p>素材库尚无已登记成品。计划、程序原型和正式美术会分别标注。</p>';
  } catch(error) {
    el('meta').textContent=`状态读取失败：${error.message}。保留上次数据，15 秒后重试。`;
  } finally { loading=false; }
}
load();setInterval(load,15000);
