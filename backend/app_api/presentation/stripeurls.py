from django.urls import path
from app_api.presentation.views.Stripe_view import (StripeCancelPaymentIntentView,
    StripeConfirmPaymentIntentView, StripeCreatePaymentIntentView, StripeWebhookView)

urlpatterns = [
    path('webhook/', StripeWebhookView.as_view(), name='webhook'),
    path('create/', StripeCreatePaymentIntentView.as_view(), name='create'),
    path('cancel/', StripeCancelPaymentIntentView.as_view(), name='cancel'),
    path('confirm/', StripeConfirmPaymentIntentView.as_view(), name='confirm'),
]