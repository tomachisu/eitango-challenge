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
  function nextReview(days){const date=new Date();date.setHours(0,0,0,0);date.setDate(date.getDate()+days);return date.getTime();}
  function reviewAt(w){const time=record(w)[mode].due;if(!time)return 0;const date=new Date(time);date.setHours(0,0,0,0);return date.getTime();}
  function newWordsAvailable(){return daily().fresh.length<2&&words.some(w=>!record(w).introduced);}
  function plantMark(){return window.EitangoGarden.render(db.stars);}
  function save() { try {localStorage.setItem(KEY,JSON.stringify(db));} catch { statusText='記録を保存できません。ブラウザの保存設定を確認してください。';} dashboard(); }
  const mode='spelling';
  let queue=[], item=null, phase='home', usedHint=false, answered=false, attempts=0, wins=0, retry={}, selected=[], statusText='', started=0, extra=false, quizAnswers=[], quizWords=[];
  const screen=el('quiz-screen'), welcome=el('welcome-screen'), result=el('result-screen');
  const style=document.createElement('style'); style.textContent='.g-options{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}.g-options button,.g-letters button{padding:13px;border:2px solid #ddd9fa;border-radius:12px;background:white;font-size:18px;color:#342f69;min-height:48px}.g-letters{display:flex;gap:7px;flex-wrap:wrap;margin:16px 0}.g-box{padding:16px;background:#f0edff;border-radius:14px;margin:14px 0}.g-picture{font-size:64px}.g-answer{font-size:28px;letter-spacing:4px;min-height:45px}.g-small{font-size:14px;color:#625b80}.g-top{display:flex;justify-content:space-between;gap:8px;margin-bottom:20px}.g-progress{margin:10px 0;color:#625b80}.g-selected{background:#e7e2ff!important;border-color:#5c57d9!important}.g-feedback{min-height:40px;margin:15px 0;font-size:17px}.g-tabs{display:flex;gap:10px;margin:14px 0}.g-tabs button{flex:1}'; document.head.append(style);
  style.textContent += '#g-input{display:block;box-sizing:border-box;width:100%;min-height:68px;padding:16px 18px;font-size:26px;border:2px solid #dcd8f3;border-radius:14px;background:#fff;color:#292443;margin:12px 0}#g-input:focus{outline:3px solid #dcd8ff;border-color:#5c57d9}';
  style.textContent += '.garden-growth{width:240px;max-width:100%;margin:0 auto 12px;text-align:center}.garden-growth>svg{display:block;width:100%;height:auto}.garden-bouquet{display:flex;justify-content:center;flex-wrap:wrap;gap:5px;margin:4px auto 10px;padding:6px;background:#fff8fb;border-radius:14px}';
  style.textContent += '.g-quiz-review{list-style:none;padding:0;text-align:left}.g-quiz-review li{padding:20px 16px;margin:16px 0;background:#f5f2ff;border-radius:16px;overflow-wrap:anywhere}.g-quiz-review h3{font-size:24px;margin:0 0 14px}.g-quiz-review p{font-size:21px;line-height:1.6;margin:12px 0}.g-quiz-review .g-correct-answer{display:block;font-size:30px;line-height:1.4;color:#342f69;margin-top:5px}';
  function dashboard() {
    const learned=quizPool().length;
    const spelling=words.filter(w=>record(w).spelling.streak>=3).length;
    document.querySelector('.dashboard').innerHTML=`<div class="stat-card"><span>練習した単語</span><strong>${learned} / ${words.length}</strong></div><div class="stat-card"><span>つづりが定着</span><strong>${spelling} / ${words.length}</strong></div><div class="stat-card"><span>今日の新語</span><strong>${daily().fresh.length} / 2</strong></div>`;
  }
  function show(which) { [welcome,screen,result].forEach(s=>s.classList.toggle('hidden',s!==which)); }
  function home() {
    phase='home'; dashboard();
    const due=words.filter(w=>record(w).introduced&&reviewAt(w)<=Date.now()).length;
    daily().completed ||= {};
    const available=due>0||daily().fresh.length<2&&words.some(w=>!record(w).introduced)||words.some(w=>daily().fresh.includes(w.english)&&record(w)[mode].lastDay!==day());
    const done=!!daily().completed[mode]&&!newWordsAvailable()||!available;
    welcome.innerHTML=`${plantMark()}<h2>少しずつ、できるように！</h2><p class="muted">日→英で、毎日新語2語＋復習は最大4語。</p><p class="g-progress">復習待ち：${due}語　今日の練習：${daily().attempts}回</p><button class="primary-button full-width" data-action="start">今日のレッスンを始める</button><div class="g-box"><button class="secondary-button full-width" data-action="quiz" ${quizPool().length<10?'disabled':''}>小テスト（日→英・10問）</button><p class="g-small">${quizPool().length<10?'通常レッスンで回答した単語が10語になると始められるよ。':'好きなときに力だめし！ ヒントなしで10問、最後に答え合わせ。間違えた単語は翌日の復習へ。'}</p></div><div class="g-box">今日の取り組み　スタンプ ${db.stars}個<br><span class="g-small">1日1回、3問取り組むとスタンプ。お休みしても減らないよ。</span></div><p class="g-small">「覚える→選ぶ→並べる→穴埋め→入力」で練習。定着は別の日に3回、自力で答えた単語です。</p><p role="status">${esc(statusText)}</p><p class="tiny-note">更新版20・記録はこのスマホのブラウザに保存されます。</p>`; show(welcome);
    const startButton=welcome.querySelector('[data-action="start"]');
    if(done){startButton.textContent='今日のレッスン完了！';startButton.disabled=true;const button=document.createElement('button');button.className='secondary-button full-width';button.style.marginTop='12px';button.dataset.action='extra';button.textContent='もう少し練習する（3問）';button.disabled=!practiceWords().length;startButton.after(button);}
  }
  function practiceWords(){return words.filter(w=>{const r=record(w)[mode];return record(w).introduced&&(r.practiced||r.stage>0||r.wrong>0||r.lastDay);});}
  // Only normal-lesson answers set practiced; test errors/stages are not proof of learning.
  function quizPool(){return words.filter(w=>record(w).introduced&&record(w).spelling.practiced===true);}
  function pickQuizWords(){
    const pool=mix(quizPool()), picked=[];
    const take=(list,n)=>{if(n<=0)return;for(const w of list){if(!picked.includes(w)){picked.push(w);if(!--n)break;}}};
    // Fill from today's untested words first, keeping review/recent/older variety.
    const selectFrom=group=>{
      const weak=group.filter(w=>reviewAt(w)<=Date.now()||record(w).spelling.streak<3);
      weak.sort((a,b)=>(record(a).spelling.lastQuizAt||0)-(record(b).spelling.lastQuizAt||0)||reviewAt(a)-reviewAt(b)||record(b).spelling.wrong-record(a).spelling.wrong);
      take(weak,Math.min(6,10-picked.length));
      const recent=[...group].sort((a,b)=>words.indexOf(b)-words.indexOf(a));
      take(recent,Math.min(2,10-picked.length));take([...recent].reverse(),Math.min(2,10-picked.length));take(group,10-picked.length);
    };
    selectFrom(pool.filter(w=>record(w).spelling.lastQuizDay!==day()));
    selectFrom(pool.filter(w=>record(w).spelling.lastQuizDay===day()));
    const previous=db.quizLastWords||[];
    if(pool.length>10&&previous.length===10&&picked.every(w=>previous.includes(w.english))){
      const replacement=pool.find(w=>!previous.includes(w.english));
      if(replacement)picked[picked.length-1]=replacement;
    }
    return mix(picked);
  }
  function startQuiz(){
    if(quizPool().length<10){statusText='通常レッスンで回答した単語が10語になったら始めよう。';return home();}
    quizWords=pickQuizWords();quizAnswers=[];quizQuestion();
  }
  function quizQuestion(){
    phase='quiz';
    screen.innerHTML=`<div class="g-top"><button class="text-button" data-action="home">← 最初の画面へ</button><span>小テスト ${quizAnswers.length+1} / 10</span></div><p class="g-small">答え合わせは10問のあと。途中で戻ると、このテストは記録されません。</p><h2 class="meaning">${esc(quizWords[quizAnswers.length].japanese)}</h2><label for="g-input">英語を入力</label><input id="g-input" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="ここに入力"><button class="primary-button full-width" data-action="quiz-answer">${quizAnswers.length===9?'答え合わせを見る':'回答して次へ'}</button><button class="text-button center-button" data-action="quiz-skip">まだ分からない</button><p id="g-feedback" role="status"></p>`;
    show(screen);el('g-input').focus?.();
  }
  function quizSubmit(skip=false){
    if(phase!=='quiz')return;
    const answer=skip?'':el('g-input').value.trim();
    if(!skip&&!answer){el('g-feedback').textContent='入力するか「まだ分からない」を押してね。';return;}
    const w=quizWords[quizAnswers.length];
    const ok=[w.english,...(w.answers||[])].some(a=>norm(a)===norm(answer));
    quizAnswers.push({w,answer,ok});
    if(quizAnswers.length<10)return quizQuestion();
    finishQuiz();
  }
  function finishQuiz(){
    if(phase!=='quiz'||quizAnswers.length!==10)return;
    phase='quiz-result';
    const tomorrow=nextReview(1);
    for(const a of quizAnswers){
      const r=record(a.w).spelling;r.lastQuizAt=Date.now();r.lastQuizDay=day();
      if(!a.ok){
        // A repeated test cannot repeatedly lower the learning stage on one day.
        if(r.quizWrongDay!==day()){r.wrong++;r.stage=Math.max(0,r.stage-1);r.quizWrongDay=day();}
        r.streak=0;r.due=r.due?Math.min(r.due,tomorrow):tomorrow;
        r.quizReviewDue=r.quizReviewDue?Math.min(r.quizReviewDue,tomorrow):tomorrow;
      }
    }
    db.quizLastWords=quizWords.map(w=>w.english);
    daily().attempts+=10;
    if(!daily().stars){daily().stars=1;db.stars++;}
    save();
    const score=quizAnswers.filter(a=>a.ok).length,missed=quizAnswers.filter(a=>!a.ok);
    const review=missed.length?`<p class="muted">間違えた単語だけ確認しよう。翌日以降のレッスンでも優先して復習するよ。</p><ul class="g-quiz-review">${missed.map(a=>`<li><h3>${esc(a.w.japanese)}</h3><p>正しい答え<strong class="g-correct-answer">${esc(a.w.answers?.[0]||a.w.english)}</strong></p><p>あなたの答え：${esc(a.answer||'まだ分からない')}</p></li>`).join('')}</ul>`:'<p class="muted">全問正解！ よく思い出せたね！</p>';
    result.innerHTML=`${plantMark()}<h2>小テスト、おつかれさま！</h2><p class="result-score"><strong>${score} / 10</strong>問 正解</p>${review}<div class="g-box">スタンプ合計 ${db.stars}個（1日1個まで）</div>${score<10?'<button class="secondary-button full-width" data-action="quiz-relearn">間違えた単語を覚え直す</button>':''}<button class="secondary-button full-width" data-action="quiz">もう一度小テスト（10問）</button><button class="text-button center-button" data-action="home">最初の画面へ</button>`;
    show(result);
  }
  function relearnQuiz(){
    const missed=quizAnswers.filter(a=>!a.ok);
    if(!missed.length)return home();
    extra=true;attempts=0;wins=0;retry={};started=Date.now();
    queue=missed.map(a=>({w:a.w,study:true}));advance();
  }
  function startExtra(){
    const pool=practiceWords().sort((a,b)=>record(b)[mode].wrong-record(a)[mode].wrong||record(a)[mode].stage-record(b)[mode].stage);
    if(!pool.length){statusText='まず今日のレッスンで単語を練習してみよう。';return home();}
    const picked=mix(pool.slice(0,Math.max(3,Math.ceil(pool.length/2)))).slice(0,3);
    queue=Array.from({length:3},(_,i)=>({w:picked[i%picked.length],study:false}));
    extra=true;attempts=0;wins=0;retry={};started=Date.now();statusText='';advance();
  }
  function start() {
    daily().completed ||= {};
    if(daily().completed[mode]&&!newWordsAvailable())return home();
    extra=false;
    const now=Date.now(); let due=words.filter(w=>record(w).introduced&&reviewAt(w)<=now);
    const priority=w=>!!record(w).spelling.quizReviewDue&&record(w).spelling.quizReviewDue<=now;
    due.sort((a,b)=>Number(priority(b))-Number(priority(a))||reviewAt(a)-reviewAt(b)||record(b)[mode].wrong-record(a)[mode].wrong);
    const n=Math.max(0,2-daily().fresh.length);
    const fresh=words.filter(w=>!record(w).introduced).slice(0,n);
    fresh.forEach(w=>{record(w).introduced=true;daily().fresh.push(w.english);});
    const pending=words.filter(w=>daily().fresh.includes(w.english)&&record(w)[mode].lastDay!==day()&&!due.includes(w)&&!fresh.includes(w));
    queue=[...fresh.map(w=>({w,study:true})),...pending.map(w=>({w,study:true})),...due.slice(0,4).map(w=>({w,study:record(w)[mode].stage===0}))];
    attempts=0;wins=0;retry={};started=Date.now();statusText='';save();
    if(!queue.length){daily().completed[mode]=true;statusText='今日のレッスン完了！ 追加練習は好きなときにできるよ。';save();return home();} advance();
  }
  function picture(w) {return ({apple:'🍎',book:'📖',cake:'🍰',dog:'🐕',egg:'🥚',fish:'🐟',guitar:'🎸',hat:'👒',juice:'🧃',lemon:'🍋',melon:'🍈',notebook:'📓',piano:'🎹',rabbit:'🐇',sun:'☀️',tennis:'🎾',umbrella:'☂️',cat:'🐈',bed:'🛏️',box:'📦',pen:'🖊️',map:'🗺️',red:'🔴'})[w.english]||'🔤';}
  function frame(body) {screen.innerHTML=`<div class="g-top"><button class="text-button" data-action="home">← 最初の画面へ</button><span>練習 ${attempts}回・残り ${queue.length+1}問</span></div>${body}`;show(screen);}
  function study() {phase='study';const w=item.w;frame(`<p class="section-label">まず覚えよう</p><div class="g-picture" aria-hidden="true">${picture(w)}</div><h2>${esc(w.english)}</h2><p class="meaning">${esc(w.japanese)}</p><button class="listen-button" data-action="speak">🔊 英語を聞く</button><div class="g-box">音を聞いて、声に出してみよう。<br>文字も指で追ってみよう。覚え直すのも練習だよ。</div><button class="primary-button full-width" data-action="practice">練習してみる</button>`);}
  function advance() { if(!queue.length||attempts>=20||Date.now()-started>=8*60000)return finish(); item=queue.shift(); if(item.study)study();else question(); }
  function question() {
    phase='question';usedHint=false;answered=false;selected=[];
    const w=item.w,r=record(w)[mode],stage=extra?(mode==='spelling'?3:1):r.stage,target=mode==='meaning'?w.japanese:(w.answers?.[0]||w.english);
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
    if(!extra){
    r.practiced=true;
    if(r.quizReviewDue&&r.quizReviewDue<=Date.now()){if(ok)delete r.quizReviewDue;else r.quizReviewDue=nextReview(1);}
    if(ok){wins++;if(!usedHint)r.stage=Math.min(last,r.stage+1);if(independent&&r.lastDay!==day()){r.streak++;r.lastDay=day();}r.due=nextReview(independent?[1,3,7,14,30][Math.min(Math.max(r.streak-1,0),4)]:1);}
    else {r.wrong++;r.streak=0;r.stage=Math.max(0,r.stage-1);r.due=nextReview(1);}
    retry[w.english]=(retry[w.english]||0)+1;
    if((!ok||usedHint||item.stage<last)&&retry[w.english]<=3)queue.splice(Math.min(2,queue.length),0,{w,study:!ok});
    }else if(ok){wins++;}
    if(daily().attempts>=3&&!daily().stars){daily().stars=1;db.stars++;}
    save();tone(ok);
    screen.querySelectorAll('button,input').forEach(x=>{if(!['home','speak'].includes(x.dataset.action))x.disabled=true;});
    el('g-feedback').innerHTML=ok?`できたね！ ${usedHint?'ヒントを使って練習できたよ。':independent?'明日以降も思い出してみよう。':'次は少し難しい練習をしてみよう。'}`:`正しい答えは <b>${esc(target)}</b>。少し後に、やさしい練習で覚え直そう。`;
    if(extra)el('g-feedback').innerHTML=ok?'できたね！ 追加練習でもう一度思い出せたよ。':`正しい答えは <b>${esc(target)}</b>。確認できたね。翌日以降にも復習しよう。`;
    const next=document.createElement('button');next.className='primary-button full-width';next.dataset.action='next';next.textContent=queue.length&&attempts<20?'次へ':'今日の結果を見る';screen.append(next);
  }
  function tone(ok){const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A();[ok?660:180,ok?880:null].filter(Boolean).forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.14;o.frequency.value=f;o.type=ok?'sine':'triangle';g.gain.setValueAtTime(.42,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);o.connect(g).connect(c.destination);o.start(t);o.stop(t+.22);});setTimeout(()=>c.close(),600);}
  function finish(){phase='result';if(!extra){daily().completed ||= {};daily().completed[mode]=true;}save();result.innerHTML=`${plantMark()}<h2>${extra?'追加練習できたね！':'今日のレッスン完了！'}</h2><p class="result-score"><strong>${attempts}</strong>回 練習したよ</p><p>正解 ${wins}回。覚え直した時間も、ちゃんと練習だよ。</p><div class="g-box">${daily().stars?'今日のスタンプ獲得！':'あと少し練習するとスタンプが付くよ。'}<br>スタンプ合計 ${db.stars}個</div><p class="muted">今日はここで終えてもOK。追加練習は何回でもできるよ。翌日以降の復習予定はそのまま。</p><button class="primary-button full-width" data-action="extra">もう少し練習する（3問）</button><button class="text-button center-button" data-action="home">最初の画面へ</button>`;show(result);}
  function action(e){const b=e.target.closest('button');if(!b||!b.closest('#welcome-screen,#quiz-screen,#result-screen'))return;e.stopImmediatePropagation();if(b.disabled)return;
    switch(b.dataset.action){case'quiz':return startQuiz();case'quiz-answer':return quizSubmit();case'quiz-skip':return quizSubmit(true);case'quiz-relearn':return relearnQuiz();}
    if(b.dataset.choice!==undefined)return check(b.dataset.choice);if(b.dataset.tile!==undefined){selected.push(Number(b.dataset.tile));b.disabled=true;b.classList.add('g-selected');b.setAttribute('aria-pressed','true');el('g-built').textContent=selected.map(i=>item.tiles[i].c).join('');return;}switch(b.dataset.action){case'home':home();break;case'start':start();break;case'extra':startExtra();break;case'speak':speak(item.w.english);break;case'practice':question();break;case'next':advance();break;case'check':check();break;case'unknown':check('\u0000');break;case'hint':usedHint=true;el('g-hint').textContent=`最初は「${item.target[0]}」。${item.target.length}文字`;break;case'undo':{const i=selected.pop();if(i!==undefined){const tile=screen.querySelector(`[data-tile="${i}"]`);tile.disabled=false;tile.classList.remove("g-selected");tile.setAttribute("aria-pressed","false");}el('g-built').textContent=selected.map(i=>item.tiles[i].c).join('');break;}}}
  document.addEventListener('click',action,true);
  screen.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='g-input'&&!e.isComposing&&!e.repeat){e.preventDefault();if(phase==='quiz')quizSubmit();else if(phase==='question'){answered?advance():check();}}});
  home();
})();
