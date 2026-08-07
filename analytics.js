(function(){
  var API = 'https://codigo-mu.vercel.app/api/analytics';

  var sessaoId = (function(){
    try{
      var id = sessionStorage.getItem('sl_sessao');
      if(!id){
        id = 's' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
        sessionStorage.setItem('sl_sessao', id);
      }
      return id;
    }catch(e){
      return 's' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    }
  })();

  function classificarReferrer(ref){
    if(!ref) return 'Direto';
    var host = '';
    try{ host = new URL(ref).hostname.replace(/^www\./, ''); }catch(e){ return 'Outros'; }
    if(host === location.hostname) return 'Navegação interna';
    if(host.indexOf('google.') >= 0) return 'Google';
    if(host.indexOf('facebook.com') >= 0 || host.indexOf('fb.com') >= 0) return 'Facebook';
    if(host.indexOf('instagram.com') >= 0) return 'Instagram';
    if(host.indexOf('wa.me') >= 0 || host.indexOf('whatsapp.com') >= 0) return 'WhatsApp';
    if(host.indexOf('bing.com') >= 0) return 'Bing';
    return host;
  }

  function origemDaSessao(){
    try{
      var salva = sessionStorage.getItem('sl_origem');
      if(salva) return salva;
    }catch(e){}
    var origem = classificarReferrer(document.referrer);
    try{ sessionStorage.setItem('sl_origem', origem); }catch(e){}
    return origem;
  }

  function enviar(tipo, elemento){
    try{
      var corpo = {
        tipo: tipo,
        pagina: location.pathname,
        elemento: elemento || null,
        sessao_id: sessaoId
      };
      if(tipo === 'pageview') corpo.origem = origemDaSessao();
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
        keepalive: true
      }).catch(function(){});
    }catch(e){}
  }

  enviar('pageview');
  enviar('heartbeat');
  setInterval(function(){ enviar('heartbeat'); }, 20000);

  document.addEventListener('click', function(e){
    var el = e.target.closest ? e.target.closest('a,button') : null;
    if(!el) return;
    var nome = el.getAttribute('data-track')
      || (el.textContent || '').trim().slice(0, 40)
      || el.getAttribute('href')
      || el.tagName;
    enviar('click', nome);
  });
})();
