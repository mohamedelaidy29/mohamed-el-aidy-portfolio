// Smooth in-page navigation
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    }
  });
});

// Fullscreen portfolio image viewer.
// Opening a design adds a same-URL history entry, so the browser Back button closes the image
// and leaves the visitor at the exact same scroll position.
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const backButton = document.querySelector('.lightbox-back');
const closeButton = document.querySelector('.lightbox-close');
let lightboxOpen = false;

function openLightbox(src, alt='Portfolio artwork'){
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('lightbox-open');
  lightboxOpen = true;

  // same URL = Back closes the preview without navigating away or changing scroll position
  history.pushState({portfolioLightbox:true}, '', window.location.href);
}

function closeLightboxDirect(){
  if(!lightboxOpen) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('lightbox-open');
  lightboxImage.removeAttribute('src');
  lightboxOpen = false;
}

document.querySelectorAll('.lightbox-trigger').forEach(card=>{
  card.addEventListener('click',()=>{
    const img = card.querySelector('img');
    openLightbox(card.dataset.src || img.src, img?.alt || 'Portfolio artwork');
  });
});

function requestClose(){
  if(!lightboxOpen) return;
  if(history.state && history.state.portfolioLightbox){
    history.back();
  }else{
    closeLightboxDirect();
  }
}

backButton.addEventListener('click', requestClose);
closeButton.addEventListener('click', requestClose);

lightbox.addEventListener('click', e=>{
  if(e.target === lightbox || e.target.classList.contains('lightbox-stage')){
    requestClose();
  }
});

document.addEventListener('keydown', e=>{
  if(e.key === 'Escape' && lightboxOpen) requestClose();
});

window.addEventListener('popstate', ()=>{
  if(lightboxOpen) closeLightboxDirect();
});
