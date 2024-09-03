## Task todo
Ce projet impliquerait la création d’une application simple de liste de tâches utilisant Django
comme technologie principale.

## CRON
Les CRON se lancent tous les 08h, 10h, 13h, 15h, 17h

> Utiliser une adresse email valide pour les tâches CRON notification par mail

### Indications pour le lancement de l'application
1. Créer la base de données
```sql
create database todo_task;
```

2. Faire un backup de la base de données
```bash
cd backend/
psql -U postgres -d todo_task -f todo_task.sql
```

3. Installation des requiremntes et lancement du serveur Django
```bash
cd backend/

# Linux
python3 -m venv task_env
source task_env/bin/activate

# Windows
python -m venv task_env 
task_env\Scripts\activate

pip install -r requirements.txt
python manage.py runserver
```

4. Installation des dépendances et lancement du serveur React
```bash
cd frontend/
npm install
npm run dev
```

5. Lancer l'application dans un navigateur
Cliquer sur http://localhost:5173/

### Voici un utilisateur test
#### User 1
alainnambi@blueline.com
alain

### Principales caractéristiques ::
#### Fonctionnalités ::
- Authentification d’utilisateur (inscription et connexion des utilisateurs) OK
- Listes de tâches spécifiques à l’utilisateur OK
- Gestion de la liste de tâches (Filters, Tri, Recherche) OK 
- Créer, lire, mettre à jour et supprimer des éléments de tâche (CRUD) OK
- Marquer les tâches à accomplir comme terminées OK
- Filtrer les tâches à effectuer par statut (terminé, incomplet) OK
Implémentation du Front-end ::
- Application monopage OL
- Rendu dynamique des tâches à accomplir sans actualisation de page (Expérience
utilisateur fluide avec des interactions basées sur AJAX) OK
Intégration du Backend ::
- API Django REST pour gérer les opérations CRUD pour les éléments à faire OK
- Intégrer le front-end au backend Django OK
Fonctionnalités supplémentaires (facultatif) ::
- Dates d'échéance et rappels pour les tâches à accomplir (cron notification) (Pas terminé)
Les pré-requis techniques ::
- Utilisez Django comme framework Web pour le backend OK
- Choisissez un framework front-end (Django, React, Vue.js) pour créer l'application
monopage OK
- Implémentez une API Django REST pour gérer les opérations CRUD de la liste de
tâches OK
- Intégrez le framework front-end au backend Django à l'aide d'appels AJAX/API OK
- Implémentez l'authentification et l'autorisation des utilisateurs à l'aide du système
d'authentification intégré de Django OK
- Utilisez les modèles Django pour stocker les tâches à effectuer et les informations
utilisateur OK

#### Stack obligatoires ::
- Python >= 3.9
- Django >= 3.2
- PostreSQL
- React (Mantine UI)
- Docker (à voir)


## Links and Usefull Videos 
https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/GitHub-SSH-Key-Setup-Config-Ubuntu-Linux
https://www.youtube.com/watch?v=llrIu4Qsl7c

## Colors
Blue : #1E0B71
Red : #D20B34


