/* Stottly Enterprises - v3 shared interactions
   Nav scroll shadow, word-by-word hero reveal, cursor spotlight, magnetic buttons,
   scroll reveal, proof-metric count-up, process-step cycling.
   Every block is guarded to no-op on pages missing the relevant elements. */
(function(){
  var nav = document.getElementById('siteNav');
  if(nav){
    window.addEventListener('scroll', function(){
      nav.classList.toggle('is-scrolled', window.scrollY > 4);
    }, {passive:true});
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- word-by-word headline reveal ---- */
  var heroH1 = document.getElementById('heroH1');
  if(heroH1 && !reduceMotion){
    var lines = heroH1.innerHTML.split('<br>');
    var wordIndex = 0;
    heroH1.innerHTML = lines.map(function(line, li){
      var words = line.trim().split(' ').filter(Boolean);
      var wrapped = words.map(function(w){
        var delay = (wordIndex * 0.045).toFixed(3);
        wordIndex++;
        return '<span class="rw"><span class="rw-inner" style="transition-delay:' + delay + 's">' + w + '</span></span>';
      }).join(' ');
      return wrapped + (li < lines.length - 1 ? '<br>' : '');
    }).join('');
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        heroH1.classList.add('rw-go');
      });
    });
  }

  /* ---- cursor spotlight on cards ---- */
  if(!reduceMotion && window.matchMedia('(hover: hover)').matches){
    document.querySelectorAll('.spot').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        card.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---- magnetic buttons ---- */
  if(!reduceMotion && window.matchMedia('(hover: hover)').matches){
    var MAG_STRENGTH = 0.28, MAG_MAX = 9;
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var mx = Math.max(-MAG_MAX, Math.min(MAG_MAX, (e.clientX - r.left - r.width / 2) * MAG_STRENGTH));
        var my = Math.max(-MAG_MAX, Math.min(MAG_MAX, (e.clientY - r.top - r.height / 2) * MAG_STRENGTH));
        el.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function(){
        el.style.transform = '';
      });
    });
  }

  if('IntersectionObserver' in window && !reduceMotion){
    var revealEls = document.querySelectorAll('.reveal:not(.is-visible)');
    var io = new IntersectionObserver(function(entries, obs){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
    /* Safety net: if the observer never fires for some reason (device quirk,
       layout shift during font load, etc.), force everything visible after
       1.5s so content can never get stuck permanently invisible. */
    setTimeout(function(){
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(el){
        el.classList.add('is-visible');
      });
    }, 1500);
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
  }

  var counted = false;
  var nums = document.querySelectorAll('.proof-item .num');
  function runCount(){
    if(counted || !nums.length) return;
    counted = true;
    nums.forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if(reduceMotion){
        el.textContent = target.toLocaleString() + suffix;
        return;
      }
      var start = null;
      var duration = 1100;
      function step(ts){
        if(start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var proofSection = document.querySelector('.proof');
  if(proofSection && 'IntersectionObserver' in window){
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting) runCount();
      });
    }, {threshold:0.4});
    io2.observe(proofSection);
  } else if(proofSection) {
    runCount();
  }

  var stepEls = document.querySelectorAll('#processCard .p-step');
  if(stepEls.length && !reduceMotion){
    var idx = 0;
    setInterval(function(){
      stepEls.forEach(function(s){ s.classList.remove('is-active'); });
      idx = (idx + 1) % stepEls.length;
      stepEls[idx].classList.add('is-active');
    }, 2200);
  }
})();
