(() => {
  const KEY='eitango-grammar-v1';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const today=()=>new Date().toLocaleDateString('sv-SE');
  const later=n=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+n);return d.getTime();};
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const nouns={apple:'りんご',book:'本',cake:'ケーキ',dog:'犬',egg:'卵',guitar:'ギター',hat:'帽子',lemon:'レモン',melon:'メロン',notebook:'ノート',piano:'ピアノ',rabbit:'うさぎ',umbrella:'かさ',watch:'腕時計',box:'箱',bed:'ベッド',cap:'帽子',cat:'ねこ',cup:'カップ',map:'地図',pen:'ペン'};
  const likes={tennis:'テニス',music:'音楽',soccer:'サッカー',baseball:'野球',basketball:'バスケットボール',volleyball:'バレーボール',pizza:'ピザ',rice:'ご飯',spaghetti:'スパゲッティ',English:'英語',math:'数学',science:'理科',art:'美術'};
  const sports={tennis:'テニス',soccer:'サッカー',baseball:'野球',basketball:'バスケットボール',volleyball:'バレーボール'};
  const numbers={eleven:'11',twelve:'12',thirteen:'13',fourteen:'14',fifteen:'15'};
  const groupNames=['be動詞','一般動詞','否定文・疑問文','can','疑問詞','数・時刻・場所・命令'];
  const article=w=>/^[aeiou]/i.test(w)?'an':'a';
  const basics={i:'私は',am:'「私は〜です」の動詞',you:'あなたは／あなたを',are:'「あなたは〜です」の動詞',he:'彼は',she:'彼女は',is:'「〜です」の動詞',this:'これ／この',that:'あれ／あの',a:'1つの・1匹の',an:'母音の音で始まる語の前の a',the:'その',my:'私の',your:'あなたの',like:'〜が好き',play:'（スポーツを）する／（楽器を）演奏する',have:'持っている',do:'質問・否定で一般動詞を助ける語',not:'〜ではない／〜しない',can:'〜できる',what:'何',who:'誰',when:'いつ',where:'どこ',how:'どのように',many:'たくさんの（how many で「いくつ」）',time:'時刻',it:'それ／時刻を言うときの主語',color:'色',on:'〜の上に',in:'〜の中に',under:'〜の下に',open:'開ける',down:'下へ（sit down で「座る」）'};
  function catalog(learned){
    const set=new Set(learned.map(w=>w.english)),list=[];
    const add=(id,g,title,rule,req,jp,text)=>{if(req.every(w=>set.has(w)))list.push({id,g,title,rule,required:req,jp,tokens:text.toLowerCase().replace(/[.?]$/,'').split(' '),answer:text});};
    const each=(dict,fn)=>Object.entries(dict).filter(([w])=>set.has(w)).forEach(([w,j])=>fn(w,j));
    each(numbers,(w,j)=>{add('be-age',0,'私は〜です','I のあとには am。「私は→です→〜」の順だよ。',[w],`私は${j}歳です。`,`I am ${w}.`);add('be-age-question',2,'あなたは〜ですか','I am に対して You are。質問は Are you ...? の順。',[w],`あなたは${j}歳ですか。`,`Are you ${w}?`);});
    each(nouns,(w,j)=>{
      add('be-this',0,'これは〜です','This → is → a/an → 名前。1つのものには a/an を付けるよ。',[w],`これは${j}です。`,`This is ${article(w)} ${w}.`);
      add('be-that',0,'あれは〜です','This は「これ」、That は「あれ」。後ろの順番は同じ。',[w],`あれは${j}です。`,`That is ${article(w)} ${w}.`);
      add('verb-have',1,'私は〜を持っています','I → have → 持っているもの。動詞 have のあとにものを置くよ。',[w],`私は${j}を1つ持っています。`,`I have ${article(w)} ${w}.`);
      add('be-not',2,'〜ではありません','be動詞のすぐあとに not を置くよ。',[w],`これは${j}ではありません。`,`This is not ${article(w)} ${w}.`);
      add('be-question',2,'これは〜ですか','This is ... を質問にすると Is this ...?。is を前へ。',[w],`これは${j}ですか。`,`Is this ${article(w)} ${w}?`);
      add('where',4,'どこですか','Where → is → 探しているもの。「どこ→ですか→〜は」の順。',[w],`私の${j}はどこですか。`,`Where is my ${w}?`);
      add('what-color',4,'何色ですか','What color で「何色」。そのあとに is → もの。',[w],`その${j}は何色ですか。`,`What color is the ${w}?`);
    });
    for(const [w,j,p] of [['father','父','He'],['brother','兄弟','He'],['mother','母','She'],['sister','姉妹','She']])add('be-person',0,'人を紹介する','He（彼は）／She（彼女は）のあとは is。my は「私の」。',[w],`${p==='He'?'彼':'彼女'}は私の${j}です。`,`${p} is my ${w}.`);
    each(likes,(w,j)=>{
      add('verb-like',1,'私は〜が好きです','I → like → 好きなもの。be動詞の am は入れないよ。',[w],`私は${j}が好きです。`,`I like ${w}.`);
      add('verb-not',2,'私は〜が好きではありません','一般動詞の否定は do not → 動詞。is not と区別しよう。',[w],`私は${j}が好きではありません。`,`I do not like ${w}.`);
      add('verb-question',2,'あなたは〜が好きですか','Do → you → like → 好きなもの。Do を文の先頭へ。',[w],`あなたは${j}が好きですか。`,`Do you like ${w}?`);
    });
    each({...sports,guitar:'ギター',piano:'ピアノ'},(w,j)=>{
      const obj=['guitar','piano'].includes(w)?'the '+w:w;
      add('verb-play',1,'スポーツ・楽器','I → play → スポーツ。楽器の前には the を付けよう。',[w],`私は${j}${obj.startsWith('the')?'を演奏します':'をします'}。`,`I play ${obj}.`);
      add('can',3,'〜できます','can のあとは動詞のもとの形。I → can → play の順。',[w],`私は${j}${obj.startsWith('the')?'を演奏できます':'ができます'}。`,`I can play ${obj}.`);
      add('can-not',3,'〜できません','cannot → 動詞。cannot は「できない」。1つの単語で書くよ。',[w],`私は${j}${obj.startsWith('the')?'を演奏できません':'ができません'}。`,`I cannot play ${obj}.`);
      add('can-question',3,'〜できますか','Can → you → 動詞。Can を前へ出して質問しよう。',[w],`あなたは${j}${obj.startsWith('the')?'を演奏できますか':'ができますか'}。`,`Can you play ${obj}?`);
    });
    add('who',4,'誰ですか','Who → is → たずねたい人。Who は「誰」。',['friend'],'あなたの友達は誰ですか。','Who is your friend?');
    add('when',4,'いつですか','When → is → たずねたいこと。When は「いつ」。',['birthday'],'あなたの誕生日はいつですか。','When is your birthday?');
    each(sports,(w,j)=>add('how',4,'どのようにしますか','How → do → you → 動詞。「どのようにするか」を聞く形。',[w],`${j}はどのようにするのですか。`,`How do you play ${w}?`));
    for(const [w,j,plural] of [['book','本','books'],['pen','ペン','pens'],['box','箱','boxes'],['cat','ねこ','cats']]){
      add('how-many',5,'数をたずねる','How many → 複数形 → do you have?。2つ以上の語尾は s、box は boxes。',[w],`あなたは${j}をいくつ持っていますか。`,`How many ${plural} do you have?`);
      add('plural',5,'2つ以上のもの','数 → 複数形。two のあとには a を付けず、名前を複数形にするよ。',[w,'two'],`私は${j}を2つ持っています。`,`I have two ${plural}.`);
    }
    for(const [w,j] of [['one','1'],['two','2'],['three','3'],['four','4'],['five','5'],['six','6'],['seven','7'],['eight','8'],['nine','9'],['ten','10'],['eleven','11'],['twelve','12']])add('time',5,'時刻を伝える','時刻は It → is → 数。It は時刻を言うときの主語。',[w],`${j}時です。`,`It is ${w}.`);
    add('what-time',5,'何時ですか','What time で「何時」。そのあとに is it。',['ten'],'何時ですか。','What time is it?');
    for(const [prep,j] of [['on','上'],['in','中'],['under','下']])add('place-'+prep,5,'場所を伝える：'+j,'The → もの → is → 場所。'+prep+' は「〜の'+j+'に」。',['pen','box'],`そのペンはその箱の${j}にあります。`,`The pen is ${prep} the box.`);
    for(const [w,j] of [['book','本'],['box','箱']]){
      add('command',5,'〜してください','命令文は動詞から。Open → 開けるもの。「〜してください」の意味にもなるよ。',[w],`その${j}を開けてください。`,`Open the ${w}.`);
      add('command-not',5,'〜しないでください','Do not → 動詞。ここでは短縮せずに並べるよ。',[w],`その${j}を開けないでください。`,`Do not open the ${w}.`);
    }
    add('command-sit',5,'座ってください','命令文は動詞から。sit down で「座る」。',['sit'],'座ってください。','Sit down.');
    return list;
  }
  function create(host){
    basics.cannot='〜できない';
    let db;try{db=JSON.parse(localStorage.getItem(KEY));}catch{}
    if(!db||!db.cards)db={cards:{}};
    const screen=document.getElementById('quiz-screen'),result=document.getElementById('result-screen');
    let queue=[],item=null,tiles=[],selected=[],answered=false,phase='',count=0,wins=0,session=[];
    const rec=id=>db.cards[id]||{tries:0,correct:0,streak:0,due:0,lastDay:''};
    const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db));return true;}catch{return false;}};
    const show=target=>['welcome-screen','quiz-screen','result-screen'].forEach(id=>document.getElementById(id).classList.toggle('hidden',id!==target));
    const button=(key,label,cls='primary-button full-width')=>`<button class="${cls}" data-grammar="${key}">${label}</button>`;
    const heading=()=>`<div class="g-top">${button('home','← 最初の画面へ','text-button')}<span>かんたん英作文 ${count+1} / 3</span></div>`;
    function start(){
      const all=catalog(host.getWords());
      if(!all.length){phase='empty';screen.innerHTML=heading()+'<h2>単語を練習してから始めよう</h2><p>通常レッスンで回答した単語が増えると、使える英文も増えるよ。</p>';show('quiz-screen');return;}
      const ids=[...new Set(all.map(q=>q.id))].sort((a,b)=>all.find(q=>q.id===a).g-all.find(q=>q.id===b).g);
      const frontier=ids.find(id=>!rec(id).correct),known=ids.filter(id=>rec(id).tries>0);
      const due=known.filter(id=>rec(id).due<=Date.now()).sort((a,b)=>rec(a).due-rec(b).due);
      const chosen=[];
      // Review first; introduce at most one new pattern per round.
      if(due.length)chosen.push(due[0]);
      if(frontier&&!chosen.includes(frontier))chosen.push(frontier);
      for(const id of [...due,...shuffle(known)])if(chosen.length<3&&!chosen.includes(id))chosen.push(id);
      if(!chosen.length)chosen.push(frontier||ids[0]);
      while(chosen.length<3)chosen.push(chosen[chosen.length-1]);
      const used=new Set();queue=chosen.map(id=>{const pool=shuffle(all.filter(q=>q.id===id));const q=pool.find(q=>!used.has(q.answer))||pool[0];used.add(q.answer);return q;});
      count=0;wins=0;session=[];advance();
    }
    function advance(){
      if(!queue.length)return finish();
      item=queue.shift();
      if(!rec(item.id).tries){phase='intro';
        const glossary=[...new Set(item.tokens)].filter(t=>basics[t]).map(t=>`${esc(t)}：${esc(basics[t])}`).join(' ／ ');
        screen.innerHTML=heading()+`<p class="section-label">${groupNames[item.g]}</p><h2>${esc(item.title)}</h2><div class="g-box"><p>${esc(item.rule)}</p><p class="grammar-sentence">${esc(item.answer)}</p><p>${esc(item.jp)}</p></div><p>文を作るための基本語も、ここで少しずつ覚えよう。</p><p class="g-small">${glossary}</p>`+button('practice','並べ替えてみる');show('quiz-screen');
      }else question();
    }
    function question(){
      phase='question';answered=false;selected=[];
      tiles=shuffle(item.tokens.map((word,id)=>({word,id})));
      // Never start with a completely solved sequence.
      if(tiles.length>1&&tiles.every((t,i)=>t.word===item.tokens[i]))tiles.push(tiles.shift());
      screen.innerHTML=heading()+`<p class="section-label">${groupNames[item.g]}・単語を並べよう</p><h2>${esc(item.jp)}</h2><div id="grammar-built" class="grammar-built" aria-live="polite"></div><div class="g-letters">${tiles.map((t,i)=>`<button data-grammar="tile" data-index="${i}" aria-pressed="false">${esc(t.word)}</button>`).join('')}</div>`+button('undo','1語戻す','text-button')+button('clear','全部戻す','text-button')+'<p class="g-small">大文字・小文字や「.」「?」は、完成したら自動で整えるよ。</p><div id="grammar-feedback" role="status" class="g-feedback"></div>'+button('check','答え合わせ')+button('unknown','まだ分からない','text-button center-button');show('quiz-screen');
    }
    function update(){document.getElementById('grammar-built').textContent=selected.map(i=>tiles[i].word).join(' ');screen.querySelectorAll('[data-grammar="tile"]').forEach(b=>{const on=selected.includes(Number(b.dataset.index));b.disabled=on;b.classList.toggle('g-selected',on);b.setAttribute('aria-pressed',String(on));});}
    function check(unknown=false){
      if(phase!=='question'||answered)return;
      if(!unknown&&selected.length<tiles.length){document.getElementById('grammar-feedback').textContent='すべてのカードを並べてから答え合わせしよう。';return;}
      answered=true;count++;
      const answer=selected.map(i=>tiles[i].word).join(' '),ok=!unknown&&answer===item.tokens.join(' '),r={...rec(item.id)};
      r.tries++;if(ok){wins++;r.correct++;if(r.lastDay!==today()){r.streak++;r.lastDay=today();}r.due=later([1,3,7,14,30][Math.min(Math.max(r.streak-1,0),4)]);}else{r.streak=0;r.due=later(1);}
      db.cards[item.id]=r;session.push({item,ok,answer});const saved=save();host.onAttempt();host.playTone(ok);
      phase='feedback';
      screen.innerHTML=`<div class="g-top">${button('home','← 最初の画面へ','text-button')}<span>英作文 ${count} / 3</span></div><h2>${ok?'できたね！':'ここを覚え直そう'}</h2><p>${esc(item.jp)}</p><p class="grammar-sentence">${esc(item.answer)}</p><div class="g-box">${esc(item.rule)}</div>${!ok&&answer?`<p>あなたの並べ方：${esc(answer)}</p>`:''}${saved?'':'<p role="alert">復習記録を保存できませんでした。ブラウザの保存設定を確認してください。</p>'}`+button('next',queue.length?'次の問題へ':'結果を見る');show('quiz-screen');
    }
    function finish(){phase='result';result.innerHTML=host.renderPlant()+`<h2>英作文、おつかれさま！</h2><p class="result-score"><strong>${wins} / ${count}</strong>問 正解</p><p>間違えた文型は翌日以降に優先して復習するよ。単語の定着記録は変わりません。</p>${session.filter(a=>!a.ok).map(a=>`<div class="g-box"><p>${esc(a.item.jp)}</p><p class="grammar-sentence">${esc(a.item.answer)}</p><p>${esc(a.item.rule)}</p></div>`).join('')}`+button('start','もう一度英作文（3問）')+button('home','最初の画面へ','text-button center-button');show('result-screen');}
    function handle(b){
      const a=b.dataset.grammar;if(!a)return false;
      if(b.disabled)return true;
      switch(a){case'start':start();break;case'home':phase='';host.onHome();break;case'practice':if(phase==='intro')question();break;case'tile':if(phase==='question'&&!answered){const i=Number(b.dataset.index);if(Number.isInteger(i)&&tiles[i]&&!selected.includes(i)){selected.push(i);update();}}break;case'undo':if(phase==='question'){selected.pop();update();}break;case'clear':if(phase==='question'){selected=[];update();}break;case'check':check();break;case'unknown':check(true);break;case'next':if(phase==='feedback')advance();break;}
      return true;
    }
    const style=document.createElement('style');style.textContent='.grammar-built{min-height:84px;padding:16px;border:2px dashed #b7abe8;border-radius:14px;background:#faf8ff;font-size:26px;line-height:1.6;overflow-wrap:anywhere;margin:18px 0}.grammar-sentence{font-size:28px;line-height:1.6;overflow-wrap:anywhere;font-weight:bold;color:#342f69}';document.head.append(style);
    return {handle,start};
  }
  window.EitangoGrammar={create,catalog};
})();
