FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia por lista explicita, nunca "COPY . .".
# A chave OAuth do Google vazou porque a pasta inteira foi publicada na Vercel;
# aqui so entra o que e realmente do site.
# voz-facil-ai.html fica de fora de proposito: da 404 no site atual, ou seja
# nunca foi publicado. Publicar agora seria mudar o site sem ninguem pedir.
COPY index.html aplicativos.html automacoes.html sites.html \
     politica-de-privacidade.html privacidade.html Painel_Clientes.html \
     estilo-servicos.css analytics.js favicon.jpg logo-painel.png \
     /usr/share/nginx/html/

# SEO: sem estes tres o site sai do indice do Google e a propriedade no Search
# Console deixa de ser verificada.
COPY robots.txt sitemap.xml google7be0779074a45538.html /usr/share/nginx/html/

COPY blog      /usr/share/nginx/html/blog
COPY FOTOS     /usr/share/nginx/html/FOTOS
COPY PARCEIROS /usr/share/nginx/html/PARCEIROS
COPY VIDEOS    /usr/share/nginx/html/VIDEOS

# quebra o build se a config do nginx estiver invalida, em vez de subir
# um container que reinicia em loop
RUN nginx -t

EXPOSE 80
