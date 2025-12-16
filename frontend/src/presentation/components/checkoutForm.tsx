// src/components/CheckoutForm.tsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PagoStripeUseCase } from "../../application/usecases/pagostripe_uc";
import { APIGateway } from "../../infraestructure/services/APIGateway";
import { FacturaDetails } from "./factura";
import Loading from "./loading";

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  metadata: Record<string, any>;
  userId: number;
}

function CheckoutForm({
  amount,
  currency = "usd",
  metadata,
  userId,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [carrito_id, setCarrito_id] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("No se encontró el CardElement");

      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: "Cliente de prueba" },
      });

      if (pmError || !paymentMethod) {
        throw new Error(pmError?.message || "Error al crear el método de pago");
      }

      const pagouc = new PagoStripeUseCase(new APIGateway());
      const data = {
        amount: amount * 100,
        currency,
        payment_method_id: paymentMethod.id,
        user_id: userId,
        ...metadata,
      };
      const response = await pagouc.create(data);

      const { client_secret, id } = response;
      if (!client_secret || !id) throw new Error("Error al crear el PaymentIntent");

      const confirm = await pagouc.confirm(id);
      if (!confirm) throw new Error("Error confirmando pago");

      if (confirm.status === "succeeded") {
        const carrito = confirm.metadata.carrito_id;
        if (!carrito) throw new Error("Error obteniendo carrito");
        setCarrito_id(carrito);
        localStorage.removeItem("productos");
      } else {
        throw new Error("Pago no completado");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error en el pago");
      setCarrito_id(null);
    } finally {
      setLoading(false);
    }
  }

  if (carrito_id) {
    return <FacturaDetails carrito_id={carrito_id} currency={currency} />;
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
      <form onSubmit={handleSubmit}>
        <h3>Pagar ${amount} {currency.toUpperCase()}</h3>

        <CardElement
          options={{
            style: {
              base: { fontSize: "16px", color: "#424770", "::placeholder": { color: "#aab7c4" } },
              invalid: { color: "#9e2146" },
            },
          }}
        />

        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

        <button
          type="submit"
          disabled={!stripe || loading}
          style={{ marginTop: 20, width: "100%", padding: "10px", fontSize: 16 }}
        >
          {loading ? "Procesando..." : "Pagar"}
        </button>
      </form>

      {loading && (
        <div
        >
          <Loading />
        </div>
      )}
    </div>
  );
}

export default CheckoutForm;
