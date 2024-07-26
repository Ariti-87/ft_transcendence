FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
# COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers statiques de Django
COPY ../myWebSite/static /static
COPY ../myWebSite/media /media

# Copie les fichiers frontend
# COPY ../frontend/public /usr/share/nginx/html

EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
