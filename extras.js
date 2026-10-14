(() => {
  const KEY = 'eitango-guided-v1';
  const day = () => new Date().toLocaleDateString('sv-SE');
  const el = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mix = a => { a = [...a]; for (let i=a.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  let db; try { db=JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (!db || !db.cards) db={cards:{},days:{},stars:0};
  db.days ||= {}; db.stars ||= 0;
  const blank = () => ({stage:0,streak:0,due:0,wrong:0,lastDay:''});
  function record(w) {
    if (!db.cards[w.english]) {
      const old = typeof state !== 'undefined' ? state.cards[w.english] : null;
      db.cards[w.english]={introduced:!!(old&&(old.seen||old.correct||old.wrong)),meaning:blank(),spelling:blank()};
    }
    return db.cards[w.english];
  }
  function daily() { return db.days[day()] ||= {fresh:[],attempts:0,stars:0}; }
  function save() { try {localStorage.setItem(KEY,JSON.stringify(db));} catch { statusText='記録を保存できません。ブラウザの保存設定を確認してください。';} dashboard(); }
  let mode='spelling', queue=[], item=null, phase='home', usedHint=false, answered=false, attempts=0, wins=0, retry={}, selected=[], statusText='', started=0;
  const screen=el('quiz-screen'), welcome=el('welcome-screen'), result=el('result-screen');
  const style=document.createElement('style'); style.textContent='.g-options{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}.g-options button,.g-letters button{padding:13px;border:2px solid #ddd9fa;border-radius:12px;background:white;font-size:18px;color:#342f69;min-height:48px}.g-letters{display:flex;gap:7px;flex-wrap:wrap;margin:16px 0}.g-box{padding:16px;background:#f0edff;border-radius:14px;margin:14px 0}.g-picture{font-size:64px}.g-answer{font-size:28px;letter-spacing:4px;min-height:45px}.g-small{font-size:14px;color:#625b80}.g-top{display:flex;justify-content:space-between;gap:8px;margin-bottom:20px}.g-progress{margin:10px 0;color:#625b80}.g-selected{background:#e7e2ff!important;border-color:#5c57d9!important}.g-feedback{min-height:40px;margin:15px 0;font-size:17px}.g-tabs{display:flex;gap:10px;margin:14px 0}.g-tabs button{flex:1}#g-input{display:block;box-sizing:border-box;width:100%;min-height:68px;padding:16px 18px;font-size:26px;border:2px solid #dcd8f3;border-radius:14px;background:#fff;color:#292443;margin:12px 0}#g-input:focus{outline:3px solid #dcd8ff;border-color:#5c57d9}'; document.head.append(style);
  function dashboard() {
    const meaning=words.filter(w=>record(w).meaning.streak>=3).length;
    const spelling=words.filter(w=>record(w).spelling.streak>=3).length;
    document.querySelector('.dashboard').innerHTML=`<div class="stat-card"><span>意味が定着</span><strong>${meaning} / ${words.length}</strong></div><div class="stat-card"><span>つづりが定着</span><strong>${spelling} / ${words.length}</strong></div><div class="stat-card"><span>今日の新語</span><strong>${daily().fresh.length} / 2</strong></div>`;
  }
  function show(which) { [welcome,screen,result].forEach(s=>s.classList.toggle('hidden',s!==which)); }
  function home() {
    phase='home'; dashboard();
    const due=words.filter(w=>record(w).introduced&&record(w)[mode].due<=Date.now()).length;
    welcome.innerHTML=`<div class="hero-mark">🌱</div><h2>少しずつ、できるように！</h2><p class="muted">新語は1日2語まで。復習が多い日は復習を優先するよ。</p><div class="g-tabs"><button class="${mode==='spelling'?'primary':'secondary'}-button" data-mode="spelling">日→英・つづり</button><button class="${mode==='meaning'?'primary':'secondary'}-button" data-mode="meaning">英→日・意味</button></div><p class="g-progress">この向きの復習：${due}語　今日の練習：${daily().attempts}回</p><button class="primary-button full-width" data-action="start">今日のレッスンを始める</button><div class="g-box">🌱 ことばの庭　スタンプ ${db.stars}個<br><span class="g-small">${db.stars<5?'まずは5個で芽が育つよ':db.stars<15?'🌿 葉っぱが育った！ 次は15個':'🌸 花が咲いた！ 続けて庭を育てよう'}<br>1日1回、3問取り組むとスタンプ。お休みしても減らないよ。</span></div><p class="g-small">「覚える→選ぶ→並べる→穴埋め→入力」で練習。定着は別の日に3回、自力で答えた単語です。</p><p role="status">${esc(statusText)}</p><p class="tiny-note">更新版9・記録はこのスマホのブラウザに保存されます。</p>`; show(welcome);
  }
  function start() {
    const now=Date.now(); let due=words.filter(w=>record(w).introduced&&record(w)[mode].due<=now);
    due.sort((a,b)=>record(a)[mode].due-record(b)[mode].due||record(b)[mode].wrong-record(a)[mode].wrong);
    const n=due.length>=6?0:Math.max(0,2-daily().fresh.length);
    const fresh=words.filter(w=>!record(w).introduced).slice(0,n);
    fresh.forEach(w=>{record(w).introduced=true;daily().fresh.push(w.english);});
    const pending=words.filter(w=>daily().fresh.includes(w.english)&&record(w)[mode].lastDay!==day()&&!due.includes(w)&&!fresh.includes(w));
    queue=[...fresh.map(w=>({w,study:true})),...pending.map(w=>({w,study:true})),...due.slice(0,6).map(w=>({w,study:record(w)[mode].stage===0}))];
    attempts=0;wins=0;retry={};started=Date.now();statusText='';save();
    if(!queue.length){statusText='今日の復習はおしまい。明日また来よう！';return home();} advance();
  }
  function picture(w) {return ({apple:'🍎',book:'📖',cake:'🍰',dog:'🐕',egg:'🥚',fish:'🐟',guitar:'🎸',hat:'👒',juice:'🧃',lemon:'🍋',melon:'🍈',notebook:'📓',piano:'🎹',rabbit:'🐇',sun:'☀️',tennis:'🎾',umbrella:'☂️',cat:'🐈',bed:'🛏️',box:'📦',pen:'🖊️',map:'🗺️',red:'🔴'})[w.english]||'🔤';}
  function frame(body) {screen.innerHTML=`<div class="g-top"><button class="text-button" data-action="home">← 最初の画面へ</button><span>練習 ${attempts}回・残り ${queue.length+1}問</span></div>${body}`;show(screen);}
  function study() {phase='study';const w=item.w;frame(`<p class="section-label">まず覚えよう</p><div class="g-picture" aria-hidden="true">${picture(w)}</div><h2>${esc(w.english)}</h2><p class="meaning">${esc(w.japanese)}</p><button class="listen-button" data-action="speak">🔊 英語を聞く</button><div class="g-box">音を聞いて、声に出してみよう。<br>文字も指で追ってみよう。覚え直すのも練習だよ。</div><button class="primary-button full-width" data-action="practice">練習してみる</button>`);}
  function advance() { if(!queue.length||attempts>=20||Date.now()-started>=8*60000)return finish(); item=queue.shift(); if(item.study)study();else question(); }
  function question() {
    phase='question';usedHint=false;answered=false;selected=[];
    const w=item.w,r=record(w)[mode],stage=r.stage,target=mode==='meaning'?w.japanese:(w.answers?.[0]||w.english);
    item.stage=stage; item.target=target;
    let body=`<p class="section-label">${mode==='meaning'?'意味を思い出そう':['正しい英語を選ぼう','文字を並べよう','抜けた文字を入れよう','英語を入力してみよう'][stage]}</p><h2 class="meaning">${esc(mode==='meaning'?w.english:w.japanese)}</h2><button class="listen-button" data-action="speak">🔊 英語を聞く</button>`;
    if(stage===0){const candidates=mix(words.filter(x=>(mode==='meaning'?x.japanese:(x.answers?.[0]||x.english))!==target));const choices=[target];for(const x of candidates){const a=mode==='meaning'?x.japanese:(x.answers?.[0]||x.english);if(!choices.includes(a))choices.push(a);if(choices.length===3)break;}body+=`<div class="g-options">${mix(choices).map(a=>`<button data-choice="${esc(a)}">${esc(a)}</button>`).join('')}</div>`;}
    else if(mode==='spelling'&&stage===1){item.tiles=mix([...target].map((c,i)=>({c,i})));body+=`<div class="g-answer" id="g-built" aria-live="polite"></div><div class="g-letters">${item.tiles.map((t,i)=>`<button data-tile="${i}">${esc(t.c===' '?'␣':t.c)}</button>`).join('')}</div><button class="text-button" data-action="undo">1文字戻す</button>`;}
    else { if(mode==='spelling'&&stage===2){item.mask=[...target].map((c,i)=>/[a-z]/i.test(c)&&i%2===1?'_':c);body+=`<p class="g-answer">${esc(item.mask.join(''))}</p><p class="g-small">抜けた文字だけ入力。単語全部でもOK。</p>`;} body+=`<label for="g-input">${mode==='meaning'?'日本語で答える':'英語を入力'}</label><input id="g-input" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="ここに入力"><button class="text-button" data-action="hint">ヒントを見る</button><p id="g-hint" class="hint-text"></p>`; }
    body+=`<div id="g-feedback" class="g-feedback" role="status"></div>${stage===0?'':'<button class="primary-button full-width" data-action="check">答え合わせ</button>'}<button class="text-button center-button" data-action="unknown">まだ分からない</button>`;frame(body);
  }
  const norm=s=>String(s).toLowerCase().replace(/[\s、,（）()〜～…・]/g,'');
  function check(answer) {
    if(answered||phase!=='question')return;
    const w=item.w,target=item.target;
    if(answer===undefined){if(mode==='spelling'&&item.stage===1)answer=selected.map(i=>item.tiles[i].c).join('');else answer=el('g-input').value; if(!answer.trim()){el('g-feedback').textContent='入力してみよう。「まだ分からない」でも大丈夫。';return;}}
    let ok=norm(answer)===norm(target);
    if(mode==='spelling'){ok=ok||(w.answers||[]).some(a=>norm(a)===norm(answer));if(item.stage===2)ok=ok||norm(answer)===norm([...target].filter((c,i)=>item.mask[i]==='_').join(''));}
    answered=true; attempts++;daily().attempts++;const r=record(w)[mode],last=mode==='spelling'?3:1;
    const independent=ok&&!usedHint&&item.stage===last;
    if(ok){wins++;if(!usedHint)r.stage=Math.min(last,r.stage+1);if(independent&&r.lastDay!==day()){r.streak++;r.lastDay=day();}r.due=Date.now()+86400000*(independent?[1,3,7,14,30][Math.min(Math.max(r.streak-1,0),4)]:1);}
    else {r.wrong++;r.streak=0;r.stage=Math.max(0,r.stage-1);r.due=Date.now()+86400000;}
    retry[w.english]=(retry[w.english]||0)+1;
    if((!ok||usedHint||item.stage<last)&&retry[w.english]<=3)queue.splice(Math.min(2,queue.length),0,{w,study:!ok});
    if(daily().attempts>=3&&!daily().stars){daily().stars=1;db.stars++;}
    save();tone(ok);
    screen.querySelectorAll('button,input').forEach(x=>{if(!['home','speak'].includes(x.dataset.action))x.disabled=true;});
    el('g-feedback').innerHTML=ok?`できたね！ ${usedHint?'ヒントを使って練習できたよ。':independent?'明日以降も思い出してみよう。':'次は少し難しい練習をしてみよう。'}`:`正しい答えは <b>${esc(target)}</b>。少し後に、やさしい練習で覚え直そう。`;
    const next=document.createElement('button');next.className='primary-button full-width';next.dataset.action='next';next.textContent=queue.length&&attempts<20?'次へ':'今日の結果を見る';screen.append(next);
  }
  function tone(ok){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A();[ok?660:180,ok?880:null].filter(Boolean).forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.14;o.frequency.value=f;o.type=ok?'sine':'triangle';g.gain.setValueAtTime(.42,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.22);});setTimeout(()=>c.close(),600);}
  function finish(){phase='result';save();result.innerHTML=`<div class="hero-mark">${daily().stars?'🌿':'🌱'}</div><h2>今日も取り組めたね！</h2><p class="result-score"><strong>${attempts}</strong>回 練習したよ</p><p>正解 ${wins}回。覚え直した時間も、ちゃんと練習だよ。</p><div class="g-box">${daily().stars?'今日のスタンプ獲得！':'あと少し練習するとスタンプが付くよ。'}<br>スタンプ合計 ${db.stars}個</div><p class="muted">復習は明日以降にまた出るよ。今日はここで終えてもOK。</p><button class="primary-button full-width" data-action="home">最初の画面へ</button>`;show(result);}
  function action(e){const b=e.target.closest('button');if(!b||!b.closest('#welcome-screen,#quiz-screen,#result-screen'))return;e.stopImmediatePropagation();if(b.disabled)return;if(b.dataset.mode){mode=b.dataset.mode;return home();}if(b.dataset.choice!==undefined)return check(b.dataset.choice);if(b.dataset.tile!==undefined){selected.push(Number(b.dataset.tile));b.disabled=true;el('g-built').textContent=selected.map(i=>item.tiles[i].c).join('');return;}switch(b.dataset.action){case'home':home();break;case'start':start();break;case'speak':speak(item.w.english);break;case'practice':question();break;case'next':advance();break;case'check':check();break;case'unknown':check('\u0000');break;case'hint':usedHint=true;el('g-hint').textContent=`最初は「${item.target[0]}」。${item.target.length}文字`;break;case'undo':{const i=selected.pop();if(i!==undefined)screen.querySelector(`[data-tile="${i}"]`).disabled=false;el('g-built').textContent=selected.map(i=>item.tiles[i].c).join('');break;}}}
  document.addEventListener('click',action,true);
  screen.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='g-input'){e.preventDefault();answered?advance():check();}});
  home();
})();

