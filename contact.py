from datetime import datetime, timedelta
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
from flask import Flask, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'TU_SECRETO'

# Configura tu archivo credentials.json
SCOPES = ['https://www.googleapis.com/auth/calendar']
CREDENTIALS_FILE = 'credentials.json'

# Inicializar el servicio de Google Calendar
def get_calendar_service():
    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_FILE, scopes=SCOPES)
    service = build('calendar', 'v3', credentials=credentials)
    return service

# Ruta para agendar la cita
@app.route('/schedule', methods=['POST'])
def schedule():
    # Obtener datos del formulario
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    time_str = request.form.get('time')  # Formato esperado: 'HH:MM'
    comments = request.form.get('comments')

    # Configura la fecha y hora del evento
    today = datetime.now().date()
    start_time = datetime.strptime(f"{today} {time_str}", "%Y-%m-%d %H:%M")
    end_time = start_time + timedelta(minutes=30)  # Cita de 30 minutos

    # Inicializar el servicio
    service = get_calendar_service()

    # Verificar si ya existe una cita en el rango especificado
    events_result = service.events().list(
        calendarId='primary',
        timeMin=start_time.isoformat() + 'Z',
        timeMax=end_time.isoformat() + 'Z',
        singleEvents=True,
        orderBy='startTime'
    ).execute()
    events = events_result.get('items', [])

    if events:
        # Si hay eventos en el intervalo de tiempo, retornar un mensaje
        return "Ya existe una cita programada para esta fecha y hora."

    # Crear el evento si no hay conflicto
    event = {
        'summary': f'Cita con {first_name} {last_name}',
        'description': comments,
        'start': {'dateTime': start_time.isoformat(), 'timeZone': 'America/Bogota'},
        'end': {'dateTime': end_time.isoformat(), 'timeZone': 'America/Bogota'},
        'attendees': [{'email': email}],
        'reminders': {'useDefault': True},
    }

    service.events().insert(calendarId='primary', body=event).execute()
    return "Cita programada con éxito en Google Calendar."

# Ruta para formulario
@app.route('/')
def index():
    return '''
    <form action="/schedule" method="post">
        <input type="text" name="first_name" placeholder="Nombres" required><br>
        <input type="text" name="last_name" placeholder="Apellidos" required><br>
        <input type="email" name="email" placeholder="Correo" required><br>
        <input type="text" name="phone" placeholder="Teléfono" required><br>
        <input type="time" name="time" placeholder="Hora" required><br>
        <textarea name="comments" placeholder="Detalles de la cita"></textarea><br>
        <input type="submit" value="Agendar Cita">
    </form>
    '''

if __name__ == '__main__':
    app.run(debug=True)
