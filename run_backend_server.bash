cd backend
source task_env/bin/activate
python manage.py makemigrations
python manage.py migrate
python manage.py runserver