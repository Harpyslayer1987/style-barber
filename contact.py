from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_cors import CORS  # Si necesitas CORS

app = Flask(__name__)
CORS(app)  # Si necesitas CORS

# Configuración del correo
EMAIL_ADDRESS = "tu_correo@gmail.com"
EMAIL_PASSWORD = "tu_contraseña_de_aplicacion"  # Usar contraseña de aplicación de Google
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

@app.route('/enviar-email', methods=['POST'])
def enviar_email():
    try:
        # Obtener datos del formulario
        datos = request.json
        nombre = datos.get('nombre')
        email = datos.get('email')
        mensaje = datos.get('mensaje')

        # Crear el mensaje
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = EMAIL_ADDRESS  # A donde quieres recibir los mensajes
        msg['Subject'] = f"Nuevo mensaje de contacto de {nombre}"

        # Cuerpo del mensaje
        cuerpo = f"""
        Has recibido un nuevo mensaje de contacto:
        
        Nombre: {nombre}
        Email: {email}
        Mensaje: {mensaje}
        """

        msg.attach(MIMEText(cuerpo, 'plain'))

        # Conectar al servidor SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)

        return jsonify({"success": True, "message": "Correo enviado exitosamente"})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
