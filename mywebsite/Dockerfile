# Use the official Python image from the DockerHub
FROM python:3.10-slim

# Set the working directory in docker
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN apt-get update && \
	apt-get install -y postgresql-client && \
	pip install --no-cache-dir -r requirements.txt

# Copy the script to the working directory and make it executable
COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "/entrypoint.sh" ]

# Gunicorn configuration
EXPOSE 8000

# Run the application
CMD [ "gunicorn", mywebsite.wsgi:application, "--bind", "0.0.0.0:8000" ]

# Run database migrations and start the Django server
# CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
