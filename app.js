/* ============ 个人成长工作台 · 混合版 v2 ============
   首页：V2「我的行动台」（今日提醒 + 焦虑提醒 + 来源分组 + 开始/截止日期）
   第2-5层：V1（丰富探索池 / 项目库 / 全部历史记录 / 周月汇总）
   交互：自绘月历选择日期、探索池去重、项目步骤可编辑、记录按日期归档
=================================================== */
const STORE_KEY = 'growth_workbench_v2';
const OLD_KEY = 'growth_workbench_v1';

const DIRS = { career:'职业', ai:'AI', life:'生活', other:'其他' };
const DIR_COLOR = { career:'var(--career)', ai:'var(--ai)', life:'var(--life)', other:'var(--other)' };
const STATUSES = ['想法','待安排','进行中','已完成','暂停'];

const TODAY_REMINDERS = [
  '今天不需要解决所有问题，只需要推进一个小步骤。',
  '记录不是为了监督自己，而是为了看见自己已经在前进。',
  '想法很多不是问题，先选择一个行动即可。',
  '不需要等准备完美再开始，先做出第一个版本。',
  '生活不是项目管理，不需要每一天都有成果。',
  '今天完成一点，就是积累。',
  '重要的不是做得多，而是你真的动了一步。',
  '把期待放进探索池，把今天留给一个行动。'
];
const ANX = {
  many: '看到很多想做的事情，说明你对生活有期待，不代表你落后。今天只需要选择当前最重要的一件。',
  nothing: '回顾已经完成的事情，而不是只看未完成列表。你已经走过的路，比想象的更多。',
  redesign: '先使用 7 天，再优化。真实体验比完美设计更有价值。'
};

/* ---------- 种子：探索池（V1 丰富子类）---------- */
function seedPool(){
  return {
    career: {
      '跳槽行动': ['查看 3-5 个匹配岗位 JD','投递 1-3 个匹配岗位','收藏 2 个值得后续关注的岗位','记录一个岗位高频关键词','复盘一次招聘沟通','针对高意向岗位调整一版简历','准备一个面试案例','优化一个已有案例的表达'],
      '职业资产沉淀': ['整理一个采购项目案例','总结一次需求审核中的典型问题','梳理一个供应商治理案例','总结一个流程优化案例','记录一个招投标风险处理案例','把一个零散工作整理成 STAR 案例','总结一次跨部门沟通经验','记录一个当前工作中值得复用的方法','将一个复杂问题整理成一页方法论','总结一次“从模糊任务到可执行方案”的过程'],
      '当前工作价值挖掘': ['记录一个当前工作的痛点','找出一个重复工作是否可以优化','梳理一个可以数字化的流程','总结一次新机制的形成过程','记录一次风险识别案例','把一次临时工作包装成案例草稿','找出一个可以用 AI 辅助的工作场景','总结领导临时交办事项中的结构化处理方法']
    },
    ai: {
      '发现问题': ['记录一个日常重复动作','记录一个工作中的低效流程','找一个“如果有 AI 助手会方便很多”的场景','把一个工作痛点写成简单需求'],
      '工具探索': ['测试一个 AI 工具','找一个 GitHub 项目看它解决什么问题','让 AI 解释一个看不懂的开源项目','比较两个 AI 工具解决同一问题的效果','试一个新模型完成具体任务'],
      '小应用实践': ['用 AI 搭一个简单页面','修复一个已有工作台的小 Bug','优化个人工作台一个功能','搭一个采购场景 Demo','用 AI 把一个手工流程变成半自动流程','把一个需求文档交给 AI 生成原型','根据使用反馈迭代一次已有工具'],
      '案例沉淀': ['写下一个 AI 应用的背景','记录 AI 解决了什么问题','记录一次失败尝试和原因','把一个 AI 小工具整理成面试案例','总结一次“需求 → AI 实现 → 反馈 → 迭代”的完整过程']
    },
    life: {
      '厨房创造': ['做一道从没做过的菜','尝试一个新的面包配方','改良一个已经做过的配方','用冰箱现有材料随机做一顿饭','设计下一周早餐组合','尝试一种没买过的食材','拍一组自己做的食物照片','做一次主题晚餐','复刻一家店吃过的东西'],
      '空间和独立生活': ['整理一个抽屉','优化一个桌面区域','清理一类不用的东西','找一个提升居住体验的小物','研究一个未来独居需要的物品','看 3 套感兴趣区域的租房','算一次独居成本','设计理想房间的一个区域','收拾一块属于自己的固定空间','做一次“未来独居晚餐”模拟'],
      '城市探索': ['去一个没去过的地铁站附近探索','找一家从没去过的小店','找一家特色面包店','找一家好吃的小餐馆','找一个有意思的市集','找一个周末展览','去一个以前没进去过的商场/街区','拍 5 张有主题的城市照片','用 100 元完成一次随机城市体验','找一个适合未来独处的地方'],
      '新体验': ['体验一次攀岩','体验一次射箭','体验一次陶艺','体验一次手作','参加一次市集','去一次 Livehouse','看一次脱口秀','体验一种新的运动','报一次单次体验课','一个人去一家以前觉得需要结伴才会去的地方'],
      '轻量娱乐和探索': ['找一本感兴趣的小说','看一部真正想看的电影','找一个纪录片','找一个有趣的 YouTube/B站频道','看一期完全陌生领域的内容','研究一个最近好奇的问题','随机找一个城市旅行攻略','收藏一个未来想去的地方','找 3 个以后可以买的小玩意','玩一个没玩过的小游戏'],
      '“有点野”的随机任务': ['随机坐 5 站地铁，下车完成一个探索任务','用 50 元买一个没什么实用性但自己喜欢的东西','一个人去吃一次平时不会单独吃的东西','工作日下午请半天假做一次“成年人逃课”','找一家从没注意过的小店进去看看','挑一个完全不像自己会参加的体验活动','给自己安排一次半日盲盒出行','一个人去 KTV 唱一小时','住一晚酒店模拟独居','给自己设置一个 100 元体验预算并花掉']
    }
  };
}
function flatPool(){
  const out=[]; const p=state.pool;
  Object.keys(p).forEach(dir=>{ Object.values(p[dir]).forEach(arr=>arr.forEach(it=>out.push({it,dir}))); });
  return out;
}
/* ---------- 种子：项目库（V1 预设）---------- */
function seedProjects(){
  return [
    { id:uid(), name:'AI 个人成长工作台', goal:'搭建适合自己的个人行动和反馈系统', stage:'V1 完成',
      status:'进行中', steps:[
        {id:uid(),content:'优化今日页面',status:'已完成'},
        {id:uid(),content:'增加任务池',status:'已完成'},
        {id:uid(),content:'测试手机端',status:'待安排'},
        {id:uid(),content:'增加自动汇总',status:'待安排'},
        {id:uid(),content:'根据实际使用反馈调整',status:'待安排'}
      ]},
    { id:uid(), name:'AI 采购应用探索', goal:'探索 1-2 个 AI 可以实际解决采购问题的应用场景', stage:'收集痛点中',
      status:'进行中', steps:[
        {id:uid(),content:'记录 3 个采购工作痛点',status:'待安排'},
        {id:uid(),content:'选择一个最容易实现的场景',status:'待安排'},
        {id:uid(),content:'查找已有 AI/开源工具',status:'待安排'},
        {id:uid(),content:'写一页需求',status:'待安排'},
        {id:uid(),content:'搭一个简单 Demo',status:'待安排'},
        {id:uid(),content:'记录使用反馈',status:'待安排'},
        {id:uid(),content:'整理成案例',status:'待安排'}
      ]},
    { id:uid(), name:'职业案例资产库', goal:'把已有工作经验转化成未来跳槽、晋升、加薪可以使用的职业资产', stage:'列清单',
      status:'进行中', steps:[
        {id:uid(),content:'列出 10 个值得讲的工作事项',status:'待安排'},
        {id:uid(),content:'每次选一个整理背景',status:'待安排'},
        {id:uid(),content:'补充行动和结果',status:'待安排'},
        {id:uid(),content:'提炼个人贡献',status:'待安排'},
        {id:uid(),content:'整理成面试表达',status:'待安排'}
      ]},
    { id:uid(), name:'生活体验扩容', goal:'打破长期“上班—运动—在家”的固定轨道', stage:'建清单',
      status:'进行中', steps:[
        {id:uid(),content:'建立体验候选清单',status:'待安排'},
        {id:uid(),content:'每周挑一个小体验',status:'待安排'},
        {id:uid(),content:'每月至少完成 2 次新体验',status:'待安排'},
        {id:uid(),content:'记录哪些体验值得再次尝试',status:'待安排'}
      ]},
    { id:uid(), name:'家具需求治理', goal:'用统一 AI 规则治理家具采购需求与供应商报价，形成可复用的需求审核规则', stage:'抽历史项目中',
      status:'进行中', events:[], steps:[
        {id:uid(),content:'抽 20～30 个历史家具项目',status:'待安排'},
        {id:uid(),content:'收集“原需求 Excel + 各供应商报价”',status:'待安排'},
        {id:uid(),content:'用统一 AI 规则批量拆解需求完整性、报价可比性和异常点',status:'待安排'},
        {id:uid(),content:'把每个项目结构化沉淀',status:'待安排'},
        {id:uid(),content:'从共性里形成《需求审核规则 V0.1》',status:'待安排'},
        {id:uid(),content:'新项目开始按照 V0.1 审核',status:'待安排'},
        {id:uid(),content:'每出现一个新问题，就反向更新规则',status:'待安排'}
      ]}
  ];
}

/* ---------- 工具 ---------- */
function uid(){ return 'a'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
function todayStr(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function dateLabel(d){ if(!d) return ''; const [y,m,day]=d.split('-'); return (m[0]==='0'?m[1]:m)+'月'+(day[0]==='0'?day[1]:day)+'日'; }
function isBefore(a,b){ return a && b && a < b; }
function dayOfYear(){ const d=new Date(); const start=new Date(d.getFullYear(),0,0); return Math.floor((d-start)/86400000); }
function escapeHtml(s){ return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true,1800); }
function $(s,r=document){ return r.querySelector(s); }
function $all(s,r=document){ return Array.from(r.querySelectorAll(s)); }

/* ---------- 存储 + 迁移 ---------- */
function freshState(){
  return { version:2, pool:seedPool(), projects:seedProjects(), actions:[], settings:{bodyDone:{}}, view:'home', viewDay:todayStr(), recFilter:'all', sumTab:'week' };
}
function migrateV1(){
  try{
    const raw=localStorage.getItem(OLD_KEY); if(!raw) return null;
    const o=JSON.parse(raw); const st=freshState();
    (o.history||[]).forEach(r=>{
      st.actions.push({ id:uid(), content:r.content, dir:r.dir||'other', source:r.projectId?'项目':'临时想法',
        startDate:r.date||todayStr(), dueDate:null, status:r.done?'已完成':'待安排', projectId:r.projectId||null, stepId:null,
        createdAt:r.date, completedAt:r.completedAt||null, feedback:r.feedback||'', isAchievement:!!r.isAchievement, achDetail:r.achDetail||'' });
    });
    (o.today&&o.today.items||[]).forEach(it=>{
      if(it.done) return;
      st.actions.push({ id:uid(), content:it.text, dir:it.dir||'other', source:it.projectId?'项目':'临时想法',
        startDate:o.today.date||todayStr(), dueDate:null, status:'待安排', projectId:it.projectId||null, stepId:null,
        createdAt:o.today.date, completedAt:null, feedback:'', isAchievement:false, achDetail:'' });
    });
    if(o.projects) st.projects=o.projects;
    if(o.pool) st.pool=o.pool;
    return st;
  }catch(e){ return null; }
}
function load(){
  try{ const raw=localStorage.getItem(STORE_KEY); if(raw){ const s=JSON.parse(raw);
    if(!s.actions) s.actions=[]; if(!s.pool) s.pool=seedPool(); if(!s.projects) s.projects=seedProjects();
    if(!s.settings) s.settings={bodyDone:{}}; if(!s.view) s.view='home'; if(!s.viewDay) s.viewDay=todayStr();
    // 旧数据补齐 startDate（老版本用 plannedDate / createdAt）
    s.actions.forEach(a=>{ if(!a.startDate){ a.startDate = a.plannedDate || a.createdAt || a.dueDate || todayStr(); } delete a.plannedDate; });
    if(!s.recFilter) s.recFilter='all'; if(!s.sumTab) s.sumTab='week';
    // 规范化项目步骤：兼容旧数据结构（字符串 / text/title 字段），修复 undefined
    s.projects.forEach(p=>{ if(!Array.isArray(p.steps)) p.steps=[];
      if(!Array.isArray(p.events)) p.events=[];
      p.steps=p.steps.map(ss=>{ if(typeof ss==='string') return {id:uid(),content:ss,status:'待安排'};
        if(!ss.id) ss.id=uid(); if(!ss.content) ss.content=ss.text||ss.title||ss.name||'';
        if(!ss.status) ss.status='待安排'; return ss; }); });
    if(!s.projects.some(p=>p.name==='家具需求治理')){
      s.projects.push({ id:uid(), name:'家具需求治理', goal:'用统一 AI 规则治理家具采购需求与供应商报价，形成可复用的需求审核规则', stage:'抽历史项目中',
        status:'进行中', events:[], steps:[
          {id:uid(),content:'抽 20～30 个历史家具项目',status:'待安排'},
          {id:uid(),content:'收集“原需求 Excel + 各供应商报价”',status:'待安排'},
          {id:uid(),content:'用统一 AI 规则批量拆解需求完整性、报价可比性和异常点',status:'待安排'},
          {id:uid(),content:'把每个项目结构化沉淀',status:'待安排'},
          {id:uid(),content:'从共性里形成《需求审核规则 V0.1》',status:'待安排'},
          {id:uid(),content:'新项目开始按照 V0.1 审核',status:'待安排'},
          {id:uid(),content:'每出现一个新问题，就反向更新规则',status:'待安排'}
        ] });
    }
    return s; } }catch(e){}
  const m=migrateV1(); if(m){ return m; }
  return freshState();
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); gsAutoSync(); }
let state = load();

/* ---------- 视图状态 ---------- */
let view = state.view || 'home';
let poolFilter = 'all';
let calCursor = todayStr().slice(0,7);

function go(v){ view=v; state.view=v; save(); render(); window.scrollTo(0,0); }
function render(){
  $('#topDate').textContent = dateLabel(state.viewDay);
  $('#backToday').hidden = (state.viewDay===todayStr());
  const v=$('#view');
  if(view==='home') v.innerHTML=renderHome();
  else if(view==='pool') v.innerHTML=renderPool();
  else if(view==='projects') v.innerHTML=renderProjects();
  else if(view==='records') v.innerHTML=renderRecords();
  else if(view==='summary') v.innerHTML=renderSummary();
  $all('.tab').forEach(t=>t.classList.toggle('active', t.dataset.view===view));
  updateSyncDot();
}

/* ================= 首页：我的行动台 ================= */
function renderHome(){
  const vd = state.viewDay;
  const today = todayStr();
  const isToday = (vd===today);
  const actions = state.actions;

  // 顶部提示
  let html = '';
  if(isToday){
    html += `<div class="reminder"><div class="r-title">今日提醒</div><div class="r-text">${TODAY_REMINDERS[dayOfYear()%TODAY_REMINDERS.length]}</div></div>`;
  } else {
    const past = vd < today;
    html += `<div class="reminder"><div class="r-title">${past?'回顾':'规划'} · ${dateLabel(vd)}</div>
      <div class="r-text">${past?'这是过去的一天，可查看当天行动。':'这是未来的一天，可提前规划。'}点右上角日历，或「今天」返回。</div></div>`;
  }

  // 当日行动 = 未完成 且 startDate <= 当前查看日期（从开始日起持续展示，直到完成）
  const active = actions.filter(a=>a.status!=='已完成' && a.startDate && a.startDate<=vd);
  const upcoming = actions.filter(a=>a.status!=='已完成' && a.startDate && a.startDate>vd).sort((x,y)=>x.startDate<y.startDate?-1:1);
  const doneOn = actions.filter(a=>a.status==='已完成' && (a.completedAt||'').slice(0,10)===vd);

  if(isToday){
    if(active.length>=5) html += `<div class="anx-banner">${ANX.many}</div>`;
    const bodyDone = (state.settings.bodyDone && state.settings.bodyDone[today]) ? 'on' : '';
    html += `<div class="act" style="background:var(--card)">
        <div class="act-top">
          <div class="act-check ${bodyDone}" data-act="body-toggle">${bodyDone?'✓':''}</div>
          <div class="act-main"><div class="act-content">今日身体计划已完成</div>
          <div class="act-tags"><span class="tag src">身体 · 轻量</span></div></div>
        </div></div>`;
  }

  // 分组：探索池灵感 / 项目待办 / 临时想法
  const fromPool = active.filter(a=>a.source==='探索池');
  const fromProj = active.filter(a=>a.source==='项目');
  const fromSelf = active.filter(a=>a.source!=='探索池' && a.source!=='项目');

  html += `<div class="sec"><h3>${isToday?'今日行动':'当日行动'}</h3><span class="count">${active.length} 项</span></div>`;
  if(active.length===0){
    html += `<div class="empty">这一天还没有行动。点右下角 + ，从探索池、项目下一步或自己的念头里挑一件。</div>`;
  } else {
    if(fromPool.length){ html += `<div class="sub-head">✿ 探索池灵感</div>` + fromPool.map(a=>actCard(a)).join(''); }
    if(fromProj.length){ html += `<div class="sub-head">▣ 项目待办</div>` + fromProj.map(a=>actCard(a)).join(''); }
    if(fromSelf.length){ html += `<div class="sub-head">✎ 临时想法</div>` + fromSelf.map(a=>actCard(a)).join(''); }
  }

  html += `<button class="insp" data-act="random-insp">🎲 随机挑一个灵感加进行动台</button>`;

  if(upcoming.length){
    html += `<div class="sec"><h3>即将到来（${dateLabel(upcoming[0].startDate)} 起）</h3><span class="count">${upcoming.length} 项</span></div>`;
    html += upcoming.map(a=>actCard(a)).join('');
  }
  if(doneOn.length){
    html += `<div class="sec"><h3>当天完成</h3><span class="count">${doneOn.length} 件 ✓</span></div>`;
    html += doneOn.map(a=>actCard(a,true)).join('');
  }

  if(isToday){
    html += `<div class="anx-actions">
      <button class="anx-btn" data-act="anx-nothing">我觉得什么都没做</button>
      <button class="anx-btn" data-act="anx-redesign">想重新设计系统</button>
    </div>`;
  }
  return html;
}

function actCard(a, doneReadonly){
  const done = a.status==='已完成';
  const dirColor = DIR_COLOR[a.dir]||'var(--other)';
  const DIR_ICON = { career:'💼', ai:'🤖', life:'🌿', other:'✶' };
  const dirTag = `<span class="tag dir" style="background:${dirColor}22;color:${dirColor}">${DIR_ICON[a.dir]||'✶'} ${DIRS[a.dir]||a.dir}</span>`;
  const proj = a.projectId? state.projects.find(p=>p.id===a.projectId):null;
  const projTag = proj?`<span class="tag proj">▣ ${escapeHtml(proj.name)}</span>`:'';
  const startTag = (a.startDate && a.startDate!==state.viewDay) ? `<span class="tag dim">${dateLabel(a.startDate)}起</span>`:'';
  const dueTag = a.dueDate
    ? `<span class="tag due" data-act="set-due" data-id="${a.id}">${isBefore(a.dueDate, state.viewDay)?'⚠ ':''}${dateLabel(a.dueDate)}截止</span>`
    : `<span class="tag due-add" data-act="set-due" data-id="${a.id}">＋截止日期</span>`;
  const achTag = a.isAchievement?`<span class="tag ach">★ 成果</span>`:'';
  const sub=[]; if(a.feedback) sub.push('反馈：'+a.feedback);
  return `<div class="act ${done?'done':''}" style="border-left:4px solid ${dirColor}">
    <div class="act-top">
      <div class="act-check ${done?'on':''}" data-act="toggle" data-id="${a.id}">${done?'✓':''}</div>
      <div class="act-main">
        <div class="act-content">${escapeHtml(a.content)}</div>
        <div class="act-tags">${dirTag}${projTag}${startTag}${dueTag}${achTag}</div>
        ${sub.length?`<div class="act-sub">${escapeHtml(sub.join(' · '))}</div>`:''}
      </div>
      <div class="act-menu"><button data-act="menu" data-id="${a.id}">⋯</button></div>
    </div>
  </div>`;
}

/* ================= 探索池 ================= */
function poolInActive(item){
  return state.actions.some(a=>a.source==='探索池' && a.content===item && a.status!=='已完成');
}
function renderPool(){
  const p=state.pool;
  const dirKeys = poolFilter==='all' ? ['career','ai','life'] : [poolFilter];
  const filterBar = `<div class="tabs2">`+
    ['all','career','ai','life'].map(f=>`<button class="${poolFilter===f?'on':''}" data-act="pool-filter" data-f="${f}">${f==='all'?'全部':DIRS[f]}</button>`).join('')+
    `</div>`;
  let html = filterBar + `<div class="reminder"><div class="r-title">这是探索池</div>
    <div class="r-text">不是待办，是“以后可能想做”。有感觉就加进行动台；已经加过的会显示「已在行动台」，不会重复。</div></div>`;
  dirKeys.forEach(dir=>{
    html += `<div class="sec"><h3>${DIRS[dir]}</h3></div>`;
    Object.entries(p[dir]).forEach(([cat, arr])=>{
      html += `<div class="pool-cat"><h4>${cat}</h4>`;
      html += arr.map((it,i)=>{
        const added = poolInActive(it);
        return `<div class="pool-item">
          <span class="pool-text">${escapeHtml(it)}</span>
          <div class="pool-ops">
            <button class="mini" data-act="pool-edit" data-dir="${dir}" data-cat="${encodeURIComponent(cat)}" data-i="${i}" title="编辑">✎</button>
            <button class="pool-add ${added?'added':''}" data-act="pool-add" data-dir="${dir}" data-cat="${encodeURIComponent(cat)}" data-i="${i}">${added?'已在行动台':'加入'}</button>
            <button class="mini" data-act="pool-del" data-dir="${dir}" data-cat="${encodeURIComponent(cat)}" data-i="${i}" title="删除">✕</button>
          </div>
        </div>`;
      }).join('');
      html += `<button class="link-add" data-act="pool-new" data-dir="${dir}" data-cat="${encodeURIComponent(cat)}">+ 添加一条到「${cat}」</button></div>`;
    });
  });
  return html;
}

/* ================= 项目库 ================= */
function renderProjects(){
  let head = `<div class="sec"><h3>项目库</h3><button class="mini acc" data-act="proj-new" style="margin-left:auto">＋新增项目</button></div>`;
  if(state.projects.length===0) return head + `<div class="empty">还没有项目。项目是“长期一点的事”。点「＋新增项目」建一个。</div>`;
  return head + state.projects.map(proj=>{
    const total=proj.steps.length;
    const done=proj.steps.filter(s=>s.status==='已完成').length;
    const pct= total? Math.round(done/total*100):0;
    const steps=proj.steps.map(s=>{
      const sd = s.status==='已完成';
      return `<div class="step ${sd?'done':''}">
      <div class="chk ${sd?'on':''}" data-act="step-toggle" data-pid="${proj.id}" data-sid="${s.id}">${sd?'✓':''}</div>
      <div class="txt">${escapeHtml(s.content)}</div>
      ${!sd?`<button class="step-add" data-act="step-to-today" data-pid="${proj.id}" data-sid="${s.id}">＋加入</button>`:''}
      <button class="step-ed" data-act="step-edit" data-pid="${proj.id}" data-sid="${s.id}" title="编辑">✎</button>
    </div>`;
    }).join('');
    const evs=(proj.events||[]).map(ev=>`<div class="evt">
      <div class="evt-main"><div class="evt-text">${escapeHtml(ev.text)}</div><div class="evt-date">${dateLabel(ev.date)}</div></div>
      <div class="evt-ops">
        <button class="step-ed" data-act="proj-edit-event" data-pid="${proj.id}" data-eid="${ev.id}" title="编辑">✎</button>
        <button class="step-ed" data-act="proj-del-event" data-pid="${proj.id}" data-eid="${ev.id}" title="删除">🗑</button>
      </div></div>`).join('');
    return `<div class="proj">
      <div class="proj-head"><div><div class="proj-name">${escapeHtml(proj.name)}</div>
        <div class="proj-goal">${escapeHtml(proj.goal||'')}</div></div>
        <span class="status-pill st-${proj.status}" data-act="proj-status" data-pid="${proj.id}">${proj.status}</span></div>
      <div class="proj-meta"><span>阶段：${escapeHtml(proj.stage||'—')}</span><span>进度 ${done}/${total}</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      ${steps}
      <div class="evt-list">${evs}</div>
      <button class="mini" data-act="proj-add-event" data-pid="${proj.id}">＋记录完成事件</button>
      <div class="proj-actions">
        <button class="mini" data-act="proj-add-step" data-pid="${proj.id}">+ 拆解动作</button>
        <button class="mini" data-act="proj-edit" data-pid="${proj.id}">编辑</button>
      </div>
    </div>`;
  }).join('');
}

/* ================= 记录（全部历史）================= */
function renderRecords(){
  const done = state.actions.filter(a=>a.status==='已完成').slice().sort((x,y)=>(y.completedAt||'').localeCompare(x.completedAt||''));
  let html=`<div class="sec"><h3>全部完成记录</h3><span class="count">共 ${done.length} 条 · 跨所有日期</span></div>`;
  html+=`<p style="color:var(--muted);font-size:12.5px;margin:0 0 8px">这里是你做过的所有事，按日期自动归档，只“看见”、不考核。</p>`;
  const filters=['all','career','ai','life','other'];
  html+=`<div class="tabs2">`+filters.map(f=>`<button class="${state.recFilter===f?'on':''}" data-act="recfilter" data-f="${f}">${f==='all'?'全部':DIRS[f]}</button>`).join('')+`</div>`;
  const list=done.filter(a=>state.recFilter==='all'||a.dir===state.recFilter);
  if(list.length===0){
    html+=`<div class="empty">还没有完成记录。<br>去「行动台」勾选完成一件事，它就会自动出现在这里。</div>`;
    return html;
  }
  const groups={};
  list.forEach(a=>{ const d=(a.completedAt||'').slice(0,10)||'未知'; (groups[d]=groups[d]||[]).push(a); });
  Object.keys(groups).sort((a,b)=>b.localeCompare(a)).forEach(d=>{
    html+=`<div class="rec-date">${dateLabel(d)}（${d}）</div>`;
    groups[d].forEach(a=>html+=recRow(a));
  });
  return html;
}
function recRow(a){
  const proj=a.projectId?state.projects.find(p=>p.id===a.projectId):null;
  return `<div class="rec">
    <span class="rdir" style="background:${DIR_COLOR[a.dir]}22;color:${DIR_COLOR[a.dir]}">${DIRS[a.dir]||a.dir}</span>
    <div class="rbody">
      <div class="rcontent">${escapeHtml(a.content)} ${a.isAchievement?'<span class="tag ach">成果</span>':''}</div>
      <div class="rmeta">${a.completedAt?a.completedAt.slice(11,16):''} ${proj?'· '+escapeHtml(proj.name):''} ${a.source?'· '+escapeHtml(a.source):''}</div>
      ${a.feedback?`<div class="rmeta">反馈：${escapeHtml(a.feedback)}</div>`:''}
      <div style="margin-top:4px">
        ${a.isAchievement?'':`<span class="raction" data-act="mark-ach" data-id="${a.id}">标记为成果 ›</span>`}
        <span class="raction" data-act="edit-feedback" data-id="${a.id}">写反馈</span>
      </div>
    </div>
  </div>`;
}

/* ================= 汇总 ================= */
function renderSummary(){
  const tabs=`<div class="tabs2">
    <button class="${state.sumTab==='week'?'on':''}" data-act="sumtab" data-t="week">周报</button>
    <button class="${state.sumTab==='month'?'on':''}" data-act="sumtab" data-t="month">月报</button>
    <button class="${state.sumTab==='ach'?'on':''}" data-act="sumtab" data-t="ach">成果沉淀</button>
  </div>`;
  if(state.sumTab==='month') return tabs+renderMonth();
  if(state.sumTab==='ach') return tabs+renderAch();
  return tabs+renderWeek();
}
function renderWeek(){
  const t=new Date(); const dow=(t.getDay()+6)%7; const mon=new Date(t); mon.setDate(t.getDate()-dow);
  const start=mon.toISOString().slice(0,10); const sun=new Date(mon); sun.setDate(mon.getDate()+7);
  const end=sun.toISOString().slice(0,10);
  const done=state.actions.filter(a=>a.status==='已完成'&&a.completedAt>=start&&a.completedAt<end);
  const cnt={career:0,ai:0,life:0,other:0}; done.forEach(a=>cnt[a.dir]++);
  let html=`<div class="report"><h4>本周完成（${dateLabel(start)} – ${dateLabel(end)}）</h4>
    <div class="kpis">${['career','ai','life','other'].map(k=>`<div class="kpi"><div class="n">${cnt[k]}</div><div class="l">${DIRS[k]}</div></div>`).join('')}</div>
    <ul>${done.length?done.map(a=>`<li>${escapeHtml(a.content)} <span style="color:var(--muted)">（${DIRS[a.dir]}）</span></li>`).join(''):'<li>本周还没有完成，挑一件开始吧。</li>'}</ul>`;
  const prog=state.projects.map(p=>{ const d=p.steps.filter(s=>s.status==='已完成').length; return {n:p.name,d,t:p.steps.length}; }).filter(x=>x.t>0);
  if(prog.length){ html+=`<h4 style="margin-top:10px">项目进展</h4><ul>`+prog.map(x=>`<li>${escapeHtml(x.n)}：${x.d}/${x.t}</li>`).join('')+`</ul>`; }
  html+=`</div><p style="font-size:13px;color:var(--muted);text-align:center;margin:6px 0 0">这周你推进了一点，这就够了。</p>`;
  return html;
}
function renderMonth(){
  const t=new Date(); const ym=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0');
  const done=state.actions.filter(a=>a.status==='已完成'&&(a.completedAt||'').slice(0,7)===ym);
  const cnt={career:0,ai:0,life:0,other:0}; done.forEach(a=>cnt[a.dir]++);
  const ach=state.actions.filter(a=>a.isAchievement);
  const finishedProj=state.projects.filter(p=>p.steps.length&&p.steps.every(s=>s.status==='已完成'));
  return `<div class="report"><h4>${t.getMonth()+1} 月小结</h4>
    <div class="kpis">${['career','ai','life','other'].map(k=>`<div class="kpi"><div class="n">${cnt[k]}</div><div class="l">${DIRS[k]}</div></div>`).join('')}</div>
    <ul>
      <li>完成行动共 <b>${done.length}</b> 件</li>
      <li>累计成果 <b>${ach.length}</b> 个</li>
      <li>已做完的小项目 <b>${finishedProj.length}</b> 个</li>
      <li>生活新体验 ${cnt.life} 次 · AI 实践 ${cnt.ai} 次 · 职业推进 ${cnt.career} 次</li>
    </ul>
    <p style="font-size:13px;color:var(--muted);margin:8px 0 0">这个月你其实做了不少事。继续，不急。</p></div>`;
}
function renderAch(){
  const ach=state.actions.filter(a=>a.isAchievement);
  if(ach.length===0) return `<div class="empty">还没有标记成果。在「记录」里，把值得沉淀的完成项标记为成果。</div>`;
  return ach.map(a=>`<div class="report">
    <h4>${escapeHtml(a.content)}</h4>
    <div class="rmeta" style="color:var(--muted);font-size:12px">${dateLabel((a.completedAt||'').slice(0,10))} · ${DIRS[a.dir]}</div>
    ${a.achDetail?`<div style="font-size:13.5px;margin-top:6px;white-space:pre-wrap">${escapeHtml(a.achDetail)}</div>`:''}
    <div style="margin-top:8px"><span class="raction" data-act="edit-ach" data-id="${a.id}">编辑成果说明</span></div>
  </div>`).join('');
}

/* ================= 行动台 CRUD ================= */
function addAction(obj){
  state.actions.push(Object.assign({ id:uid(), source:'临时想法', dir:'other', startDate:state.viewDay, dueDate:null,
    status:'待安排', projectId:null, stepId:null, createdAt:todayStr(), completedAt:null,
    feedback:'', isAchievement:false, achDetail:'' }, obj));
  save(); render();
}
function getAction(id){ return state.actions.find(a=>a.id===id); }
function toggleAction(id){
  const a=getAction(id); if(!a) return;
  if(a.status==='已完成'){ a.status='待安排'; a.completedAt=null; }
  else { a.status='已完成'; a.completedAt=new Date().toISOString(); }
  save(); render();
}
function cycleStatus(id){
  const a=getAction(id); if(!a) return;
  let i=STATUSES.indexOf(a.status); i=(i+1)%STATUSES.length; a.status=STATUSES[i];
  if(a.status==='已完成'&&!a.completedAt) a.completedAt=new Date().toISOString();
  if(a.status!=='已完成') a.completedAt=null;
  save(); render();
}
function deleteAction(id){ state.actions=state.actions.filter(a=>a.id!==id); save(); render(); }

/* ================= 模态框 ================= */
function openModal(title, body){ $('#modalTitle').textContent=title; $('#modalBody').innerHTML=body; $('#modal').hidden=false; }
function closeModal(){ $('#modal').hidden=true; $('#modalBody').innerHTML=''; }
$('#modalX').addEventListener('click', closeModal);
$('#modal').addEventListener('click', e=>{ if(e.target.id==='modal') closeModal(); });

function formFields(a){
  a=a||{};
  return `
    <div class="field"><label>事项</label><textarea id="f-content" placeholder="动词 + 明确产出，例如：整理一个采购案例">${escapeHtml(a.content||'')}</textarea></div>
    <div class="field"><label>方向</label>
      <div class="pick-row" id="f-dir">
        ${Object.entries(DIRS).map(([k,v])=>`<div class="pick ${!a.dir||a.dir===k?'on':''}" data-v="${k}">${v}</div>`).join('')}
      </div></div>
    <div class="field"><label>开始日期（哪天开始做，默认当天）</label><input id="f-start" type="date" value="${a.startDate||state.viewDay}"></div>
    <div class="field"><label>截止日期（可选，最晚什么时候完成）</label><input id="f-due" type="date" value="${a.dueDate||''}"></div>`;
}
function bindFormPicks(){
  $all('#f-dir .pick').forEach(p=>p.addEventListener('click',()=>{
    const grp=p.parentElement; $all('.pick',grp).forEach(x=>x.classList.remove('on')); p.classList.add('on');
  }));
}
function readForm(){
  const dir=($('#f-dir .pick.on')||{}).dataset?.v||'other';
  return { content:$('#f-content').value.trim(), dir, startDate:$('#f-start').value||state.viewDay, dueDate:$('#f-due').value||null };
}
function openAddMenu(){
  openModal('添加行动', `
    <p style="color:var(--muted);font-size:13px;margin-top:0">从哪来都可以，挑一个开始：</p>
    <button class="btn" data-act="add-self">✎ 自己新增一条</button>
    <button class="btn ghost" data-act="add-from-pool">✿ 从探索池选</button>
    <button class="btn ghost" data-act="add-from-proj">▣ 从项目下一步</button>
  `);
}
function openSelfForm(preset){
  openModal('新增行动', formFields(preset)+`<button class="btn" id="saveSelf">保存</button>`);
  bindFormPicks();
  $('#saveSelf').addEventListener('click',()=>{
    const f=readForm(); if(!f.content){ toast('先写点什么'); return; }
    addAction(f); closeModal(); toast('已加入行动台');
  });
}
function openPoolPicker(){
  const p=state.pool;
  let h='';
  ['career','ai','life'].forEach(dir=>{
    Object.entries(p[dir]).forEach(([cat,arr])=>{
      h+=`<div class="src-group"><h5>${DIRS[dir]} · ${cat}</h5>`+
        arr.map((it,i)=>{
          const added=poolInActive(it);
          return `<div class="pool-item"><span>${escapeHtml(it)}</span>
            <button class="pool-add ${added?'added':''}" data-act="pool-pick" data-dir="${dir}" data-cat="${encodeURIComponent(cat)}" data-i="${i}">${added?'已在行动台':'选'}</button></div>`;
        }).join('')+`</div>`;
    });
  });
  openModal('从探索池选', h);
}
function poolItem(dir,cat,i){ return (state.pool[dir]&&state.pool[dir][cat]&&state.pool[dir][cat][i])||null; }
function openProjPicker(){
  const items=[];
  state.projects.forEach(p=>{ const n=p.steps.find(s=>s.status!=='已完成'); if(n) items.push({p,n}); });
  if(items.length===0){ openModal('从项目下一步',`<p style="color:var(--muted)">项目下一步都做完了，或还没有项目。去项目库拆解动作吧。</p>`); return; }
  window.__projPick = items.map(({p,n})=>({pid:p.id,sid:n.id}));
  openModal('从项目下一步', items.map(({p,n},idx)=>`<div class="pool-item"><span><b>${escapeHtml(p.name)}</b><br><span style="font-size:12px;color:var(--muted)">${escapeHtml(n.content)}</span></span>
    <button class="pool-add" data-act="proj-pick" data-idx="${idx}">加入今日</button></div>`).join(''));
}
function openEditForm(id){
  const a=getAction(id); if(!a) return;
  openModal('编辑行动', formFields(a)+`
    <button class="btn" id="saveEdit">保存</button>
    <button class="btn ghost" id="delEdit" style="margin-top:8px">删除这条</button>`);
  bindFormPicks();
  $('#saveEdit').addEventListener('click',()=>{ const f=readForm(); if(!f.content){toast('内容不能为空');return;}
    Object.assign(a,f); save(); closeModal(); render(); });
  $('#delEdit').addEventListener('click',()=>{ if(confirm('删除这条行动？')){ deleteAction(id); closeModal(); } });
}
function openMenu(id){
  const a=getAction(id); if(!a) return;
  openModal('操作', `
    <button class="btn" data-act="m-edit" data-id="${id}">✎ 编辑</button>
    <button class="btn ghost" data-act="m-due" data-id="${id}" style="margin-top:8px">⏱ 设置截止日期</button>
    ${a.isAchievement?'':'<button class="btn ghost" data-act="m-ach" data-id="'+id+'" style="margin-top:8px">★ 标记为成果</button>'}
    <button class="btn ghost" data-act="m-fb" data-id="${id}" style="margin-top:8px">✓ 写反馈</button>
    <button class="btn ghost" data-act="m-del" data-id="${id}" style="margin-top:8px;color:#c0392b">删除</button>
  `);
}

function openDueModal(id){
  const a=getAction(id); if(!a) return;
  openModal('设置截止日期', `
    <div class="field"><label>截止日期（可选，最晚什么时候完成）</label><input id="d-due" type="date" value="${a.dueDate||''}"></div>
    <button class="btn" id="d-save">保存</button>
    ${a.dueDate?'<button class="btn ghost" id="d-clear" style="margin-top:8px">清除截止日期</button>':''}`);
  $('#d-save').addEventListener('click',()=>{ a.dueDate=$('#d-due').value||null; save(); closeModal(); render(); toast('已更新'); });
  if(a.dueDate) $('#d-clear').addEventListener('click',()=>{ a.dueDate=null; save(); closeModal(); render(); toast('已清除'); });
}

/* ================= 项目库动作 ================= */
function toggleStep(pid,sid){
  const p=state.projects.find(x=>x.id===pid); if(!p) return; const s=p.steps.find(x=>x.id===sid); if(!s) return;
  s.status = s.status==='已完成'?'待安排':'已完成'; save(); render();
}
function cycleStepStatus(pid,sid){
  const p=state.projects.find(x=>x.id===pid); if(!p) return; const s=p.steps.find(x=>x.id===sid); if(!s) return;
  let i=STATUSES.indexOf(s.status); i=(i+1)%STATUSES.length; s.status=STATUSES[i]; save(); render();
}
function stepInActive(pid,sid){
  const p=state.projects.find(x=>x.id===pid); if(!p) return false; const s=p.steps.find(x=>x.id===sid); if(!s) return false;
  return state.actions.some(a=>a.projectId===pid && a.stepId===sid && a.status!=='已完成');
}
function stepToToday(pid,sid){
  const p=state.projects.find(x=>x.id===pid); if(!p) return; const s=p.steps.find(x=>x.id===sid); if(!s) return;
  if(stepInActive(pid,sid)){ toast('这个动作已经在行动台了'); return; }
  openPickModal({ content:s.content, dir:'other', source:'项目', projectId:pid, stepId:sid });
}
function projStatus(pid){
  const p=state.projects.find(x=>x.id===pid); if(!p) return;
  let i=STATUSES.indexOf(p.status); i=(i+1)%STATUSES.length; p.status=STATUSES[i]; save(); render();
}
function openStepEdit(pid,sid){
  const p=state.projects.find(x=>x.id===pid); if(!p) return; const s=p.steps.find(x=>x.id===sid); if(!s) return;
  openModal('编辑动作', `
    <div class="field"><label>动作内容</label><textarea id="se-c">${escapeHtml(s.content)}</textarea></div>
    <button class="btn" id="se-save">保存</button>
    <button class="btn ghost" id="se-del" style="margin-top:8px;color:#c0392b">删除这个动作</button>`);
  $('#se-save').addEventListener('click',()=>{
    const c=$('#se-c').value.trim(); if(!c){toast('内容不能为空');return;}
    s.content=c; save(); closeModal(); render();
  });
  $('#se-del').addEventListener('click',()=>{ if(confirm('删除这个动作？')){ p.steps=p.steps.filter(x=>x.id!==sid); save(); closeModal(); render(); } });
}
function openProjEdit(pid){
  const p=pid?state.projects.find(x=>x.id===pid):null;
  openModal(pid?'编辑项目':'新建项目', `
    <div class="field"><label>项目名称</label><input id="p-name" value="${escapeHtml(p?p.name:'')}"></div>
    <div class="field"><label>目标</label><textarea id="p-goal" placeholder="这个长期事项为了什么">${escapeHtml(p?p.goal:'')}</textarea></div>
    <div class="field"><label>阶段描述</label><input id="p-stage" value="${escapeHtml(p?p.stage:'')}" placeholder="例如：V1 完成 / 收集痛点中"></div>
    <div class="field"><label>状态</label>
      <div class="pick-row" id="p-status">
        ${STATUSES.map(s=>`<div class="pick ${!p||p.status===s?'on':''}" data-v="${s}">${s}</div>`).join('')}
      </div></div>
    <button class="btn" id="p-save">保存</button>
    ${p?'<button class="btn ghost" id="p-del" style="margin-top:8px;color:#c0392b">删除项目</button>':''}
  `);
  $all('#p-status .pick').forEach(x=>x.addEventListener('click',()=>{ $all('#p-status .pick').forEach(y=>y.classList.remove('on')); x.classList.add('on'); }));
  $('#p-save').addEventListener('click',()=>{
    const name=$('#p-name').value.trim(); if(!name){toast('填个名字');return;}
    const status=($('#p-status .pick.on')||{}).dataset?.v||'进行中';
    if(p){ Object.assign(p,{name,goal:$('#p-goal').value.trim(),stage:$('#p-stage').value.trim(),status}); }
    else { state.projects.push({id:uid(),name,goal:$('#p-goal').value.trim(),stage:$('#p-stage').value.trim(),status,steps:[]}); }
    save(); closeModal(); render();
  });
  if(p) $('#p-del').addEventListener('click',()=>{ if(confirm('删除项目？其步骤会一起移除。')){ state.projects=state.projects.filter(x=>x.id!==pid); save(); closeModal(); render(); } });
}
function openAddStep(pid){
  openModal('拆解动作', `
    <div class="field"><label>动作（动词 + 明确产出）</label><textarea id="s-content" placeholder="例如：收集 3 个采购痛点"></textarea></div>
    <button class="btn" id="s-save">添加</button>`);
  $('#s-save').addEventListener('click',()=>{
    const c=$('#s-content').value.trim(); if(!c){toast('填点什么');return;}
    const p=state.projects.find(x=>x.id===pid); if(!p) return;
    p.steps.push({id:uid(),content:c,status:'待安排'}); save(); closeModal(); render();
  });
}
function openProjAddEvent(pid){
  openModal('记录完成事件', `
    <div class="field"><label>完成事件（这一步实际做了什么 / 产出了什么）</label><textarea id="pe-c" placeholder="例如：已抽完 28 个历史家具项目，按供应商归类"></textarea></div>
    <button class="btn" id="pe-save">保存</button>`);
  $('#pe-save').addEventListener('click',()=>{
    const c=$('#pe-c').value.trim(); if(!c){toast('写点什么');return;}
    const p=state.projects.find(x=>x.id===pid); if(!p) return;
    if(!p.events) p.events=[];
    p.events.push({id:uid(),date:todayStr(),text:c}); save(); closeModal(); render(); toast('已记录完成事件');
  });
}
function openProjEditEvent(pid,eid){
  const p=state.projects.find(x=>x.id===pid); if(!p) return; const ev=(p.events||[]).find(x=>x.id===eid); if(!ev) return;
  openModal('编辑完成事件', `
    <div class="field"><label>完成事件</label><textarea id="pee-c">${escapeHtml(ev.text)}</textarea></div>
    <button class="btn" id="pee-save">保存</button>
    <button class="btn ghost" id="pee-del" style="margin-top:8px;color:#c0392b">删除</button>`);
  $('#pee-save').addEventListener('click',()=>{ const c=$('#pee-c').value.trim(); if(!c){toast('写点什么');return;} ev.text=c; save(); closeModal(); render(); });
  $('#pee-del').addEventListener('click',()=>{ if(confirm('删除这个完成事件？')){ p.events=p.events.filter(x=>x.id!==eid); save(); closeModal(); render(); } });
}

/* ================= 探索池动作 ================= */
function poolAdd(dir,cat,i){
  const it=poolItem(dir,cat,i); if(!it) return;
  if(poolInActive(it)){ toast('这条已经在行动台了'); return; }
  openPickModal({ content:it, dir:dir, source:'探索池' });
}
function poolEdit(dir,cat,i){
  const arr=state.pool[dir]&&state.pool[dir][cat]; if(!arr||!arr[i]) return;
  openModal('编辑探索项', `<div class="field"><label>内容</label><textarea id="pe2-c">${escapeHtml(arr[i])}</textarea></div>
    <button class="btn" id="pe2-save">保存</button>`);
  $('#pe2-save').addEventListener('click',()=>{ const c=$('#pe2-c').value.trim(); if(!c){toast('内容不能为空');return;}
    arr[i]=c; save(); closeModal(); render(); toast('已更新'); });
}
function poolDelete(dir,cat,i){
  const arr=state.pool[dir]&&state.pool[dir][cat]; if(!arr||!arr[i]) return;
  if(confirm('把这条从探索池删除？')){ arr.splice(i,1); save(); render(); }
}
function openPickModal(opts){
  opts=opts||{};
  const preset={ content:opts.content||'', dir:opts.dir||'other', startDate:state.viewDay, dueDate:null };
  openModal('加入行动台', formFields(preset)+`<button class="btn" id="pick-save">保存并加入</button>
    <button class="btn ghost" id="pick-cancel" style="margin-top:8px">取消</button>`);
  bindFormPicks();
  $('#pick-save').addEventListener('click',()=>{
    const f=readForm(); if(!f.content){toast('先写点什么');return;}
    addAction(Object.assign({}, f, { source:opts.source||'临时想法', projectId:opts.projectId||null, stepId:opts.stepId||null }));
    closeModal(); toast('已加入行动台');
  });
  $('#pick-cancel').addEventListener('click', closeModal);
}
function poolNew(dir,cat){
  openModal('添加探索项', `<div class="field"><label>想以后可能做的事</label><textarea id="pn-c"></textarea></div>
    <button class="btn" id="pn-save">添加到探索池</button>`);
  $('#pn-save').addEventListener('click',()=>{ const c=$('#pn-c').value.trim(); if(!c){toast('填点什么');return;}
    if(!state.pool[dir][cat]) state.pool[dir][cat]=[]; state.pool[dir][cat].push(c); save(); closeModal(); render(); toast('已加入探索池'); });
}
function randomInsp(){
  const all=flatPool(); if(all.length===0){ toast('探索池为空'); return; }
  let pick=all[Math.floor(Math.random()*all.length)], guard=0;
  while(poolInActive(pick.it) && guard++ < all.length){ pick=all[Math.floor(Math.random()*all.length)]; }
  if(poolInActive(pick.it)){ toast('探索池里的都已在行动台了'); return; }
  addAction({ content:pick.it, dir:pick.dir, source:'探索池', startDate:state.viewDay, dueDate:null, status:'待安排' });
  toast('已随机加入：'+pick.it);
}

/* ================= 成果 / 反馈 ================= */
function markAch(id){
  const a=getAction(id); if(!a) return;
  openModal('标记为成果', `
    <p style="color:var(--muted);font-size:13px">补充一句它有什么用：</p>
    <div class="field"><label>成果说明（背景 / 做了什么 / 结果 / 后续用途）</label><textarea id="ach-d">${escapeHtml(a.achDetail||'')}</textarea></div>
    <button class="btn" id="ach-save">保存为成果</button>`);
  $('#ach-save').addEventListener('click',()=>{ a.isAchievement=true; a.achDetail=$('#ach-d').value.trim(); if(a.status!=='已完成'){a.status='已完成';a.completedAt=new Date().toISOString();} save(); closeModal(); render(); toast('已沉淀为成果'); });
}
function editAch(id){ markAch(id); }
function editFeedback(id){
  const a=getAction(id); if(!a) return;
  openModal('写反馈', `<div class="field"><label>简短反馈（可选）</label><textarea id="fb-c">${escapeHtml(a.feedback||'')}</textarea></div>
    <button class="btn" id="fb-save">保存</button>`);
  $('#fb-save').addEventListener('click',()=>{ a.feedback=$('#fb-c').value.trim(); save(); closeModal(); render(); toast('已保存'); });
}

/* ================= 导出 / 导入 ================= */
function exportData(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a');
  a.href=url; a.download='成长行动台备份_'+todayStr()+'.json'; a.click(); URL.revokeObjectURL(url); toast('已导出备份');
}
function importData(){
  openModal('导入备份', `<p style="color:var(--muted);font-size:13px">选择一个之前导出的 JSON 备份。会覆盖当前数据。</p>
    <input type="file" id="imp-f" accept="application/json">
    <button class="btn" id="imp-go" style="margin-top:10px">导入</button>`);
  $('#imp-go').addEventListener('click',()=>{ const f=$('#imp-f').files[0]; if(!f){toast('先选文件');return;}
    const r=new FileReader(); r.onload=()=>{ try{ const s=JSON.parse(r.result); state=Object.assign(freshState(),s); save(); closeModal(); render(); toast('导入成功'); }catch(e){ toast('文件格式不对'); } }; r.readAsText(f); });
}

/* ================= 云端同步（GitHub Gist） ================= */
const GS_TOKEN_KEY='growth_workbench_token', GS_GIST_KEY='growth_workbench_gist';
function gsToken(){ return localStorage.getItem(GS_TOKEN_KEY)||''; }
function gsSetToken(v){ if(v) localStorage.setItem(GS_TOKEN_KEY,v); else localStorage.removeItem(GS_TOKEN_KEY); }
function gsGist(){ return localStorage.getItem(GS_GIST_KEY)||''; }
function gsSetGist(v){ if(v) localStorage.setItem(GS_GIST_KEY,v); }
function gsHeaders(){ return { 'Authorization':'Bearer '+gsToken(), 'Content-Type':'application/json', 'Accept':'application/vnd.github+json' }; }
function gsPush(silent){
  const token=gsToken(); if(!token){ if(!silent) toast('先在数据管理里填写并保存 GitHub 令牌'); return; }
  const body={ files:{'growth-workbench.json':{content:JSON.stringify(state,null,2)}} };
  const id=gsGist();
  const url= id? 'https://api.github.com/gists/'+id : 'https://api.github.com/gists';
  const method= id?'PATCH':'POST';
  if(!id) body.description='growth-workbench-data';
  if(!silent) toast('正在上传…');
  fetch(url,{method,headers:gsHeaders(),body:JSON.stringify(body)})
    .then(r=>r.json()).then(d=>{ if(d&&d.id){ gsSetGist(d.id); if(!silent) toast('已上传到云端'); updateSyncDot(); } else if(!silent) toast('上传失败：'+(d&&d.message||'未知错误')); })
    .catch(()=>{ if(!silent) toast('上传失败：网络或令牌无效'); });
}
function gsPull(){
  const token=gsToken(); const id=gsGist();
  if(!token||!id){ toast('请先上传一次以建立云端备份'); return; }
  toast('正在下载…');
  fetch('https://api.github.com/gists/'+id,{headers:gsHeaders()})
    .then(r=>r.json()).then(d=>{
      const f=d&&d.files&&d.files['growth-workbench.json'];
      if(!f||!f.content){ toast('云端没有数据'); return; }
      if(!confirm('用云端数据覆盖本机当前数据？')) return;
      try{ state=Object.assign(freshState(),JSON.parse(f.content)); save(); closeModal(); render(); toast('已从云端恢复'); }
      catch(e){ toast('云端数据解析失败'); }
    }).catch(()=>toast('下载失败：网络或令牌无效'));
}
/* 自动同步：save() 后被触发（防抖），仅在已配置令牌时上传 */
let __gsTimer=null;
function gsAutoSync(){
  if(!gsToken()) return;
  if(__gsTimer) clearTimeout(__gsTimer);
  __gsTimer=setTimeout(()=>{ gsPush(true); }, 600);
}
function updateSyncDot(){
  const dot=document.getElementById('syncDot');
  if(dot) dot.classList.toggle('on', !!gsToken());
}

/* ================= 日历选择器 ================= */
function openCal(){
  calCursor = state.viewDay.slice(0,7);
  openModal('选择日期',''); showCal();
}
function showCal(){
  const [y,m]=calCursor.split('-').map(Number);
  const firstDow=new Date(y,m-1,1).getDay();
  const days=new Date(y,m,0).getDate();
  const doneSet=new Set(state.actions.filter(a=>a.status==='已完成').map(a=>(a.completedAt||'').slice(0,10)));
  let cells='';
  for(let i=0;i<firstDow;i++) cells+='<span></span>';
  for(let d=1;d<=days;d++){
    const ds=y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const cls=['cal-day'];
    if(ds===todayStr()) cls.push('today');
    if(ds===state.viewDay) cls.push('sel');
    if(doneSet.has(ds)) cls.push('dot');
    cells+=`<button class="${cls.join(' ')}" data-act="cal-pick" data-d="${ds}">${d}</button>`;
  }
  $('#modalBody').innerHTML = `
    <div class="cal">
      <div class="cal-head">
        <button class="cal-nav" data-act="cal-prev">‹</button>
        <div class="cal-title">${y}年${m}月</div>
        <button class="cal-nav" data-act="cal-next">›</button>
      </div>
      <div class="cal-dow">${['日','一','二','三','四','五','六'].map(s=>`<span>${s}</span>`).join('')}</div>
      <div class="cal-grid">${cells}</div>
    </div>
    <button class="btn ghost" data-act="cal-today" style="margin-top:12px">回到今天</button>`;
}
function shiftCal(n){
  let [y,m]=calCursor.split('-').map(Number); m+=n;
  if(m<1){m=12;y--;} if(m>12){m=1;y++;}
  calCursor=y+'-'+String(m).padStart(2,'0'); showCal();
}

/* ================= 事件委托 ================= */
document.addEventListener('click', e=>{
  const el=e.target.closest('[data-act]');
  if(el){ handleAct(el.dataset.act, el); return; }
});
function handleAct(act, el){
  const id=el.dataset.id;
  switch(act){
    case 'toggle': toggleAction(id); break;
    case 'menu': openMenu(id); break;
    case 'set-due': openDueModal(id); break;
    case 'body-toggle':{
      const t=todayStr(); if(!state.settings.bodyDone) state.settings.bodyDone={};
      state.settings.bodyDone[t]=!state.settings.bodyDone[t]; save(); render(); break;
    }
    case 'back-today': state.viewDay=todayStr(); save(); render(); break;
    case 'random-insp': randomInsp(); break;
    case 'anx-nothing':{ const n=state.actions.filter(a=>a.status==='已完成').length;
      openModal('你已经做了这些',`<p style="font-size:14px;line-height:1.7">${ANX.nothing}</p>
        <p style="color:var(--muted)">目前累计已完成 <b>${n}</b> 件行动。回顾它们，而不是盯着未完成列表。</p>`); break; }
    case 'anx-redesign': openModal('关于重新设计',`<p style="font-size:14px;line-height:1.7">${ANX.redesign}</p>`); break;
    // 日历
    case 'cal-prev': shiftCal(-1); break;
    case 'cal-next': shiftCal(1); break;
    case 'cal-pick': state.viewDay=el.dataset.d; save(); closeModal(); render(); break;
    case 'cal-today': state.viewDay=todayStr(); save(); closeModal(); render(); break;
    // 探索池
    case 'pool-filter': poolFilter=el.dataset.f; render(); break;
    case 'pool-add': poolAdd(el.dataset.dir, decodeURIComponent(el.dataset.cat), +el.dataset.i); break;
    case 'pool-new': poolNew(el.dataset.dir, decodeURIComponent(el.dataset.cat)); break;
    case 'pool-edit': poolEdit(el.dataset.dir, decodeURIComponent(el.dataset.cat), +el.dataset.i); break;
    case 'pool-del': poolDelete(el.dataset.dir, decodeURIComponent(el.dataset.cat), +el.dataset.i); break;
    case 'pool-pick': closeModal(); poolAdd(el.dataset.dir, decodeURIComponent(el.dataset.cat), +el.dataset.i); break;
    // 项目
    case 'step-toggle': toggleStep(el.dataset.pid, el.dataset.sid); break;
    case 'step-edit': openStepEdit(el.dataset.pid, el.dataset.sid); break;
    case 'step-to-today': stepToToday(el.dataset.pid, el.dataset.sid); break;
    case 'proj-status': projStatus(el.dataset.pid); break;
    case 'proj-add-step': openAddStep(el.dataset.pid); break;
    case 'proj-edit': openProjEdit(el.dataset.pid); break;
    case 'proj-new': openProjEdit(null); break;
    case 'proj-add-event': openProjAddEvent(el.dataset.pid); break;
    case 'proj-edit-event': openProjEditEvent(el.dataset.pid, el.dataset.eid); break;
    case 'proj-del-event': if(confirm('删除这个完成事件？')){ const p=state.projects.find(x=>x.id===el.dataset.pid); if(p&&p.events){ p.events=p.events.filter(x=>x.id!==el.dataset.eid); save(); render(); } } break;
    case 'proj-pick':{ const arr=window.__projPick||[]; const it=arr[+el.dataset.idx]; if(it){ closeModal(); stepToToday(it.pid,it.sid);} break; }
    // 记录
    case 'recfilter': state.recFilter=el.dataset.f; save(); render(); break;
    case 'mark-ach': markAch(id); break;
    case 'edit-ach': editAch(id); break;
    case 'edit-feedback': editFeedback(id); break;
    // 汇总
    case 'sumtab': state.sumTab=el.dataset.t; save(); render(); break;
    // 模态内
    case 'add-self': openSelfForm(); break;
    case 'add-from-pool': openPoolPicker(); break;
    case 'add-from-proj': openProjPicker(); break;
    case 'm-edit': closeModal(); openEditForm(id); break;
    case 'm-due': closeModal(); openDueModal(id); break;
    case 'm-ach': markAch(id); break;
    case 'm-fb': editFeedback(id); break;
    case 'm-del': if(confirm('删除这条行动？')){ deleteAction(id); closeModal(); } break;
  }
}

/* FAB：右下角 + */
const fab=document.createElement('button'); fab.className='fab'; fab.textContent='+'; fab.addEventListener('click', openAddMenu);
document.getElementById('app').appendChild(fab);
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>go(t.dataset.view)));

/* 顶栏：点日期 -> 弹出月历；点「今天」-> 回今天 */
$('#topDate').addEventListener('click', openCal);
$('#backToday').addEventListener('click', ()=>{ state.viewDay=todayStr(); save(); render(); });
/* 双击标题 -> 数据管理 */
$('.brand').addEventListener('dblclick', ()=>{
  const gistId=gsGist();
  openModal('数据管理', `
    <p style="color:var(--muted);font-size:13px">数据保存在本浏览器。换设备时可用下面方式迁移或同步。</p>
    <div class="sec" style="margin-top:12px"><h3>本地备份</h3></div>
    <button class="btn" id="ex-go">⬇ 导出备份（JSON）</button>
    <button class="btn ghost" id="im-go" style="margin-top:8px">⬆ 导入备份</button>
    <button class="btn ghost" id="reset-go" style="margin-top:8px;color:#c0392b">清空所有数据</button>
    <div class="sec" style="margin-top:16px"><h3>云同步（GitHub Gist）</h3></div>
    <p style="font-size:12.5px;color:var(--muted);margin:0 0 8px">用 GitHub 个人令牌把数据存到你的私有 Gist，手机/电脑登录同一令牌即可同步。令牌仅保存在本机，不上传他人。<br>保存令牌后：每次改动会<b>自动上传</b>（无需再点上传）；换设备时用「下载覆盖本机」拉取。</p>
    <div class="field"><label>GitHub 个人访问令牌（需 gist 权限）</label><input id="gs-token" type="password" placeholder="ghp_..." value="${escapeHtml(gsToken())}"></div>
    <button class="btn" id="gs-save" style="background:var(--ai)">保存令牌</button>
    <button class="btn ghost" id="gs-push" style="margin-top:8px">⬆ 上传到云端${gistId?'（已绑定）':''}</button>
    <button class="btn ghost" id="gs-pull" style="margin-top:8px">⬇ 从云端下载覆盖本机</button>
  `);
  $('#ex-go').addEventListener('click', exportData);
  $('#im-go').addEventListener('click', importData);
  $('#reset-go').addEventListener('click', ()=>{ if(confirm('确定清空？此操作不可恢复。')){ localStorage.removeItem(STORE_KEY); state=freshState(); save(); closeModal(); render(); toast('已清空'); } });
  $('#gs-save').addEventListener('click', ()=>{ const v=$('#gs-token').value.trim(); gsSetToken(v); toast(v?'令牌已保存':'令牌已清除'); });
  $('#gs-push').addEventListener('click', gsPush);
  $('#gs-pull').addEventListener('click', gsPull);
});

render();
