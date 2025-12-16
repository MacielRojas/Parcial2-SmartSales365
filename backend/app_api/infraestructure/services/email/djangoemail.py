from app_api.application.services.email_service import EmailService
from django.core.mail import send_mail

class DjangoEmailService(EmailService):
    def send_email(self, email, subject, message)-> bool:
        '''
        Envía un correo electrónico utilizando Django.
        '''
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email="no-reply@smartsales",
                recipient_list=[email],
                fail_silently=False,
            )
            return True
        except Exception as e:
            raise Exception(f"No se pudo enviar el correo: {e}")
        