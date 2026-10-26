(() => {
  const labels=['小さな芽','双葉がひらいた','茎が伸びた','葉がふえた','ぐんと育った','つぼみ','五分咲き','満開！'];
  let serial=0;
  const palettes=[{light:'#f68982',color:'#c62e40',line:'#8b2030'}, {light:'#fff3a3',color:'#edc437',line:'#a47b21'}, {light:'#ffc8dd',color:'#ef8fbc',line:'#bd5688'}, {light:'#ffffff',color:'#f1f0ec',line:'#a8a59e'}, {light:'#e3c8f7',color:'#aa7bd0',line:'#714896'}];
  function info(stamps){
    const value=Number(stamps),count=Number.isFinite(value)?Math.max(0,Math.floor(value)):0,total=30;
    const progress=count>0?(count%total||total):0;
    const completed=Math.floor(count/total),plantIndex=count>0?Math.floor((count-1)/total):0;
    const steps=[0,1,3,6,10,16,23,30];
    let stage=0;steps.forEach((n,i)=>{if(progress>=n)stage=i;});
    const fraction=stage<7?(progress-steps[stage])/(steps[stage+1]-steps[stage]):0;
    return {count,progress,total,completed,plantIndex,palette:palettes[plantIndex%palettes.length],stage,fraction,kind:'rose',name:'バラ',label:labels[stage],icon:'🌹'};
  }
  function petal(x,y,id,palette){
    return `<g transform="translate(${x} ${y})"><circle r="13" fill="url(#${id}-flower)"/><path d="M-10 2C-13-10 3-15 9-6C18 3 6 16-4 9C-14 4-4-7 4-5C11-2 4 7-1 3C-5 0-1-3 2-1" fill="none" stroke="${palette.line}" stroke-width="1.5" stroke-linecap="round"/><path d="M-8-7Q0-13 8-6M-10 3Q-4 13 5 10" fill="none" stroke="${palette.light}" stroke-width="1.8" stroke-linecap="round"/></g>`;
  }
  function bud(x,y,palette){return `<g transform="translate(${x} ${y})"><ellipse cy="-2" rx="5" ry="9" fill="${palette.color}" stroke="${palette.line}"/><path d="M-7 2L0 8 7 2 2 4 0-3-2 4Z" fill="#549667"/></g>`;}
  function render(stamps){
    const p=info(stamps),id='eitango-garden-'+(++serial),heights=[9,28,53,81,115,135,135,135],h=heights[p.stage]+(p.stage<7?(heights[p.stage+1]-heights[p.stage])*p.fraction:0),top=225-h;
    const pairs=[0,1,2,3,4,4,4,4][p.stage];
    let leaves='';
    for(let i=0;i<pairs;i++){
      const y=225-h*(.23+i*.18),size=16+i*3;
      for(const side of [-1,1])leaves+=`<path d="M140 ${y}Q${140+side*size*.9} ${y-28} ${140+side*size*1.6} ${y-16}Q${140+side*size} ${y+8} 140 ${y}Z" fill="url(#${id}-leaf)" stroke="#57966a" stroke-width=".8"/><path d="M140 ${y}L${140+side*size*1.25} ${y-12}" stroke="#c4dfad" stroke-width="1"/>`;
    }
    const points=[[140,50],[101,68],[180,67],[74,104],[124,96],[163,98],[205,106],[92,144],[142,135],[185,143]];
    let branches='',flowers='';
    if(p.stage>=5)points.forEach(([x,y],i)=>{
      const startY=166+(i%3)*6;
      branches+=`<path d="M140 ${startY}Q${140+(x-140)*.35} ${y+45} ${x} ${y}" fill="none" stroke="${p.kind==='rose'?'#639773':'#a38276'}" stroke-width="${p.kind==='rose'?2:2.6}" stroke-linecap="round"/>`;
      const openCount=p.stage===7?10:p.stage===6?5+Math.floor((p.progress-23)*5/7):0;
      const blossomOrder=i%2===0?i/2:5+(i-1)/2;
      flowers+=blossomOrder<openCount?petal(x,y,id,p.palette):bud(x,y,p.palette);
    });
    const bouquet=p.completed?`<div class="garden-bouquet" role="list" aria-label="これまでに咲いたバラ ${p.completed}株">${Array.from({length:p.completed},(_,i)=>{const color=palettes[i%palettes.length],gid=id+'-saved-'+i;return `<svg viewBox="-20 -20 40 48" width="36" height="44" role="img" aria-label="育てたバラ ${i+1}株目"><defs><radialGradient id="${gid}-flower"><stop stop-color="${color.light}"/><stop offset="1" stop-color="${color.color}"/></radialGradient></defs><path d="M0 9V25M0 21Q-13 8-12 15Q-7 22 0 21" fill="#72a77d" stroke="#62946b" stroke-width="1.3"/>${petal(0,0,gid,color)}</svg>`;}).join('')}</div>`:'';
    return `<figure class="garden-growth"><svg viewBox="0 0 280 260" role="img" aria-label="バラ${p.plantIndex+1}株目：${p.label}、今の株のスタンプ${p.progress} / ${p.total}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${id}-leaf" x2="1" y2="1"><stop stop-color="#add69a"/><stop offset="1" stop-color="#4c9365"/></linearGradient><radialGradient id="${id}-flower"><stop stop-color="${p.palette.light}"/><stop offset="1" stop-color="${p.palette.color}"/></radialGradient></defs><circle cx="140" cy="130" r="119" fill="${p.stage>=6?'#fff2f7':'#f0f7ef'}"/><ellipse cx="140" cy="235" rx="63" ry="9" fill="#dce7d2"/><path d="M103 234Q140 219 177 234" fill="#aa937c" opacity=".6"/><path d="M140 231C135 ${225-h*.3} 145 ${225-h*.65} 140 ${top}" fill="none" stroke="${p.kind==='sakura'&&p.stage>=5?'#998578':'#639b70'}" stroke-width="${p.stage>=4?5:3}" stroke-linecap="round"/>${branches}${leaves}${p.stage===0?'<path d="M140 220Q121 205 124 215Q128 224 140 224Q156 212 157 218Q151 226 140 225" fill="#8ebd80"/>':''}${flowers}${p.stage===7?'<g fill="#e5b650"><path d="M40 61l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/><path d="M232 172l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/></g>':''}</svg>${bouquet}</figure>`;
  }
  window.EitangoGarden={info,render};
})();

