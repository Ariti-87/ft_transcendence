#!/bin/bash

python manage.py migrate --noinput
python manage.py compilemessages
python manage.py collectstatic --noinput
exec "$@"
