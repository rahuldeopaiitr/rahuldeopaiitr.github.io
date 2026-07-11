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

