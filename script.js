  document.getElementById('yr').textContent = new Date().getFullYear();
  const burger=document.getElementById('burger'), menu=document.getElementById('menu');
  burger.addEventListener('click',()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false);}));

  (function(){
    const slider=document.getElementById('slider');
    if(!slider) return;
    const track=document.getElementById('sliderTrack');
    const slides=track.children;
    const N=slides.length;
    const dotsWrap=document.getElementById('sliderDots');
    let i=0, timer=null;
    const DELAY=4000;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for(let k=0;k<N;k++){
      const b=document.createElement('button');
      b.type='button';
      b.setAttribute('aria-label','Go to highlight '+(k+1));
      b.addEventListener('click',()=>{go(k);restart();});
      dotsWrap.appendChild(b);
    }
    const dots=dotsWrap.children;

    function go(n){
      i=(n+N)%N;
      track.style.transform='translateX(-'+(i*100)+'%)';
      for(let k=0;k<N;k++) dots[k].classList.toggle('active',k===i);
    }
    function next(){go(i+1);}
    function prev(){go(i-1);}
    function start(){ if(!reduce && !timer) timer=setInterval(next,DELAY); }
    function stop(){ if(timer){clearInterval(timer);timer=null;} }
    function restart(){ stop(); start(); }

    document.getElementById('sliderNext').addEventListener('click',()=>{next();restart();});
    document.getElementById('sliderPrev').addEventListener('click',()=>{prev();restart();});
    // pause when the cursor rests on it, or when focused via keyboard
    slider.addEventListener('mouseenter',stop);
    slider.addEventListener('mouseleave',start);
    slider.addEventListener('focusin',stop);
    slider.addEventListener('focusout',start);
    // pause when the tab is hidden
    document.addEventListener('visibilitychange',()=>{document.hidden?stop():start();});

    go(0);
    start();
  })();


// ---- Delhi 2023 flood photo lightbox ----
(function(){
  const lb=document.getElementById('lightbox');
  if(!lb) return;
  const img=document.getElementById('lbImg');
  const countEl=document.getElementById('lbCount');
  const N=20; let i=0;
  const path=n=>'assets/flood/'+(((n%N)+N)%N+1)+'.jpg';
  function preload(n){ const p=new Image(); p.src=path(n); }
  function show(n){ i=((n%N)+N)%N; img.src=path(i); countEl.textContent=(i+1)+' / '+N; preload(i+1); preload(i-1); }
  function open(n){ show(n||0); lb.classList.add('open'); document.body.style.overflow='hidden'; }
  function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  const cardBtn=document.getElementById('floodCardBtn'); if(cardBtn) cardBtn.addEventListener('click',()=>open(0));
  const fab=document.getElementById('floodFab'); if(fab) fab.addEventListener('click',()=>open(0));
  document.getElementById('lbClose').addEventListener('click',close);
  document.getElementById('lbNext').addEventListener('click',()=>show(i+1));
  document.getElementById('lbPrev').addEventListener('click',()=>show(i-1));
  lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    else if(e.key==='ArrowRight') show(i+1);
    else if(e.key==='ArrowLeft') show(i-1);
  });
})();

// ---- Generic photo sliders (auto-play, hover-pause, optional shuffle per visit) ----
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.js-slider').forEach(function(wrap){
    var track=wrap.querySelector('.slider-track');
    if(!track) return;
    var slides=Array.prototype.slice.call(track.children);
    if(wrap.getAttribute('data-shuffle')==='true'){
      for(var k=slides.length-1;k>0;k--){var j=Math.floor(Math.random()*(k+1));var t=slides[k];slides[k]=slides[j];slides[j]=t;}
      slides.forEach(function(s){track.appendChild(s);});
    }
    var N=slides.length, i=0, timer=null, DELAY=4000;
    var dotsWrap=wrap.querySelector('.slider-dots'), dots=[];
    if(dotsWrap){
      for(var d=0;d<N;d++){(function(d){
        var b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','Go to slide '+(d+1));
        b.addEventListener('click',function(){go(d);restart();});
        dotsWrap.appendChild(b); dots.push(b);
      })(d);}
    }
    function go(n){ i=((n%N)+N)%N; track.style.transform='translateX(-'+(i*100)+'%)'; dots.forEach(function(b,x){b.classList.toggle('active',x===i);}); }
    function next(){go(i+1);} function prev(){go(i-1);}
    function start(){ if(!reduce && !timer && N>1) timer=setInterval(next,DELAY); }
    function stop(){ if(timer){clearInterval(timer);timer=null;} }
    function restart(){ stop(); start(); }
    var nb=wrap.querySelector('.slider-btn.next'), pb=wrap.querySelector('.slider-btn.prev');
    if(nb) nb.addEventListener('click',function(){next();restart();});
    if(pb) pb.addEventListener('click',function(){prev();restart();});
    wrap.addEventListener('mouseenter',stop); wrap.addEventListener('mouseleave',start);
    wrap.addEventListener('focusin',stop); wrap.addEventListener('focusout',start);
    document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
    go(0); start();
  });
})();

// ---- Lightweight click-to-play YouTube facade ----
(function(){
  document.querySelectorAll('.yt-facade').forEach(function(f){
    function load(){
      var id=f.getAttribute('data-yt'); if(!id) return;
      var ifr=document.createElement('iframe');
      ifr.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';
      ifr.title='YouTube video player';
      ifr.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      ifr.allowFullscreen=true;
      f.innerHTML=''; f.appendChild(ifr); f.removeAttribute('role'); f.style.cursor='default';
    }
    f.addEventListener('click',load);
    f.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); load(); } });
  });
})();
