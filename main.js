/* main.js - interaction & animations */

document.addEventListener('DOMContentLoaded', function(){

  // AOS init
  if(window.AOS) AOS.init({ duration: 700, once: true });

  // Mobile toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if(menuToggle){
    menuToggle.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Product filter
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b=> b.classList.remove('bg-red-600','text-white'));
      btn.classList.add('bg-red-600','text-white');

      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('#productGrid > div').forEach(card=>{
        const cat = card.getAttribute('data-category') || 'all';
        if(filter==='all' || filter === cat){
          card.style.display = '';
          card.classList.remove('opacity-0','scale-95');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Counters animation when in viewport
  const counters = document.querySelectorAll('.counter');
  const runCounter = (el) => {
    const target = +el.getAttribute('data-target');
    const duration = 1400;
    let start = 0;
    const step = (timestamp) => {
      start += Math.ceil(target / (duration / 16));
      if(start >= target) start = target;
      el.textContent = start.toLocaleString();
      if(start < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        runCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => obs.observe(c));

  // Simple canvas background (soft animated particles)
  (function canvasBG(){
    const canvas = document.getElementById('bgCanvas');
    if(!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.6;
    const ctx = canvas.getContext('2d');

    const particles = [];
    for(let i=0;i<60;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: 1 + Math.random()*3,
        vx: (Math.random()-0.5)*0.3,
        vy: -0.1 - Math.random()*0.3,
        alpha: 0.03 + Math.random()*0.12
      });
    }

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.y < -10){ p.y = canvas.height + 10; p.x = Math.random()*canvas.width; }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(204,0,0,'+p.alpha+')';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', ()=> {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.6;
    });
  })();

  // Contact form submit - opens mailto (fallback)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const form = new FormData(contactForm);
      const name = form.get('name') || '';
      const email = form.get('email') || '';
      const message = form.get('message') || '';
      const subject = encodeURIComponent('Website Inquiry from ' + name);
      const body = encodeURIComponent('Name: '+name+'%0AEmail: '+email+'%0A%0AMessage:%0A'+message);
      window.location.href = `mailto:chandufiresafetyhsn@gmail.com?subject=${subject}&body=${body}`;
    });
  }

});
