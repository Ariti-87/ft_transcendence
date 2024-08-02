from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from .forms import CustomUserCreationForm

def index(request):
	return render(request, 'frontend/index.html')

def signup_view(request):
	if request.method == 'POST':
		form = CustomUserCreationForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user)
			return redirect('index')
	else:
		form = CustomUserCreationForm()
	return render(request, 'frontend/signup.html', {'form': form})

def login_view(request):
	# Implémentez la logique de connexion ici
	return render(request, 'frontend/login.html')

from django.http import HttpResponse
from django.templatetags.static import static
def debug_static_path(request):
    # Construire le chemin complet pour l'image
    image_path = static('img/pusheen_drink.png')
    return HttpResponse(f'Full path: {image_path}')
