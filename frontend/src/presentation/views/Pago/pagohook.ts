import { useEffect, useState } from "react";
import { APIGateway } from "../../../infraestructure/services/APIGateway";
import { PagoStripeUseCase } from "../../../application/usecases/pagostripe_uc";


interface PagoHookState {
    id?: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    loading: boolean;
    message: string | null;
    userId: string;
    carritoId: string;
}

export const usePagoHook = ({id,amount, currency, paymentMethod, loading, message, carritoId, userId}:PagoHookState) => {

    const [state, setState] = useState<PagoHookState>({
        id: id,
        amount: amount,
        currency: currency,
        paymentMethod: paymentMethod,
        loading: loading,
        message: message,
        userId: userId,
        carritoId: carritoId,
    });

    const pagouc = new PagoStripeUseCase(new APIGateway());

    const crearPago = async ()=>{

    setState(prev => ({ ...prev, loading: true , message: null}));

    try {
    //   // 1️⃣ Crear el método de pago
    //   const cardElement = elements.getElement(CardElement);
    //   if (!cardElement) throw new Error("No se encontró el CardElement");

    //   const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
    //     type: "card",
    //     card: cardElement,
    //     billing_details: {
    //       name: "Cliente de prueba",
    //     },
    //   });

    //   if (pmError || !paymentMethod) {
    //     throw new Error(pmError?.message || "Error al crear el método de pago");
    //   }

      // 2️⃣ Crear el PaymentIntent desde tu API Django
      const response = await pagouc.create({
        "amount": amount * 100,
        "currency":currency,
        "payment_method_id": paymentMethod,
        "carrito_id": carritoId,
        "user": userId,
      });

      const { client_secret } = response;

      if (!client_secret) {
        throw new Error("Error al crear el PaymentIntent: client_secret no encontrado");
      }
      setState(prev => ({ ...prev, message: "✅ Pago exitoso"}));

    //   // 3️⃣ Confirmar el pago en el cliente
    //   const { error: confirmError, paymentIntent } =
    //     await stripe.confirmCardPayment(client_secret);

    //   if (confirmError) {
    //     throw new Error(confirmError.message);
    //   }

    //   if (paymentIntent?.status === "succeeded") {
    //     setMessage("✅ Pago exitoso");
    //   } else {
    //     setMessage(`Estado del pago: ${paymentIntent?.status}`);
    //   }
    } catch (err: any) {
      setState(prev => ({ ...prev, message: err.message }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const confirmarPago = async () => {
    setState(prev => ({ ...prev, loading: true , message: null}));
    try{
        const response = await pagouc.confirm(id);
        const {payment_intent_id} = response;
        if (!payment_intent_id){
            throw new Error("Error confirmando pago");
        }
        setState(prev => ({ ...prev, message: "✅ Pago confirmado"}));
        
    }catch (error:any) {
        setState(prev => ({ ...prev, message: `Error confirmando pago: ${error}`}));
    }finally{
        setState(prev => ({ ...prev, loading: false }));
    }
  };

  const cancelarPago = async () => {
    setState(prev => ({ ...prev, loading: true , message: null}));
    try{
        const response = await pagouc.cancel(id);
        const {payment_intent_id} = response;
        if (!payment_intent_id){
            throw new Error("Error confirmando pago");
        }
        setState(prev => ({ ...prev, message: "✅ Pago confirmado"}));
        
    }catch (error:any) {
        setState(prev => ({ ...prev, message: `Error confirmando pago: ${error}`}));
    }finally{
        setState(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    // aqui pongo lo que quiero que se ejecute

// con [] se ejecuta una sola vez
// sin nada se ejecuta en cada render
// con [carritoId] se ejecuta cuando cambia carritoId
  }, []);

  return {
    ...state,
    crearPago,
    confirmarPago,
    cancelarPago,
  }
}