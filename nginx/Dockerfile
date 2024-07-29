# FROM nginx:latest

# COPY default.conf /etc/nginx/conf.d/default.conf

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

# COPY conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers statiques de Django
COPY ../mywebsite/static /static
COPY ../mywebsite/media /media

# Copie les fichiers frontend
# COPY ../frontend/public /usr/share/nginx/html

EXPOSE 80
