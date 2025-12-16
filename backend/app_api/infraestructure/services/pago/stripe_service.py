from app_api.application.services.pago_service import PagoService
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY
class StripeService(PagoService):
    def __init__(self):
        
        pass

    def crear_pago(self, amount: int, payment_method_id: str, currency: str, **kwargs):
        '''
        amount: int
        payment_method_id: str
        currency: str
        **kwargs
        '''
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                automatic_payment_methods={
                    "enabled": True,
                    "allow_redirects": "never",
                },
                payment_method=payment_method_id,
                metadata={**kwargs},
            )
            return intent
        except Exception as e:
            raise Exception(f"No se pudo crear el pago: {e}")

    def confirmar_pago(self, id: str)-> dict:
        '''
        id: str
        '''
        try:
            intent = stripe.PaymentIntent.confirm(
                id,
            )
            print(intent)
            return intent
        except Exception as e:
            raise Exception(f"No se pudo confirmar el pago: {e}")
    
    def cancelar_pago(self, id: str):
        '''
        id: str
        '''
        try:
            intent = stripe.PaymentIntent.cancel(
                id,
            )
            return intent
        except Exception as e:
            raise Exception(f"No se pudo cancelar el pago: {e}")
    
    def obtener_pago(self, id: str):
        '''
        id: str
        '''
        try:
            intent = stripe.PaymentIntent.retrieve(
                id,
            )
            return intent
        except Exception as e:
            raise Exception(f"No se pudo obtener el pago: {e}")
    
    def obtener_reembolso(self, charge_id: str, amount: int)->dict:
        '''
        charge_id: str
        amount: int
        '''
        try:
            obj = stripe.Refund.create(
                charge=charge_id,
                amount=amount,
            )
            return obj.__dict__
        except Exception as e:
            raise Exception(f"No se pudo obtener el reembolso: {e}")
    
    def handle_webhook(self, payload: bytes, sigheader: str) -> dict:
        """
        payload: bytes
        sigheader: str
        """
        try:
            event = stripe.Webhook.construct_event(
                payload,
                sigheader,
                settings.STRIPE_WEBHOOK_SECRET
            )

            if not event or "type" not in event:
                raise Exception("Evento Stripe inválido o sin tipo")

            intent = event["data"]["object"]
            event_type = event["type"]

            # metadata puede no existir
            metadata = intent.get("metadata", {})

            match event_type:
                case "payment_intent.created":
                    message = "Pago creado"
                case "payment_intent.succeeded":
                    message = "Pago exitoso"
                case "payment_intent.payment_failed":
                    message = "Pago fallido"
                case "payment_intent.processing":
                    message = "Pago en proceso"
                case "charge.succeeded":
                    message = "Cargo exitoso"
                case "charge.failed":
                    message = "Cargo fallido"
                case "charge.refunded":
                    message = "Cargo reembolsado"
                case "charge.updated":
                    message = "Cargo actualizado"
                case _:
                    message = "Evento no reconocido"
            return {
                **intent,
                "message": message,
            }

        except Exception as e:
            raise Exception(f"No se pudo obtener el webhook: {e}")
