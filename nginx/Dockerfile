FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf


# Copie les fichiers statiques de Django
COPY ../mywebsite/static /static
COPY ../mywebsite/media /media

# Copie les fichiers frontend
# COPY ../frontend/public /usr/share/nginx/html

EXPOSE 8080
