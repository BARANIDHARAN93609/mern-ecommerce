import { useCallback } from "react";
import { createRazorpayOrder, verifyPayment } from "../api/services";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export const useRazorpay = () => {
  const { emptyCart } = useCart();

  const initiatePayment = useCallback(async ({ orderId, user, onSuccess, onFailure }) => {
    try {
      const { data } = await createRazorpayOrder({ orderId });
      const { razorpay_order_id, amount, currency, key } = data.data;

      const options = {
        key,
        amount,
        currency,
        name:        "ShopMERN",
        description: "Order Payment",
        order_id:    razorpay_order_id,
        prefill: {
          name:    user?.name  || "",
          email:   user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#185FA5" },

        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              orderId,
            });
            await emptyCart();
            toast.success("Payment successful! 🎉");
            onSuccess && onSuccess(verifyRes.data.data);
          } catch (err) {
            toast.error("Payment verification failed");
            onFailure && onFailure(err);
          }
        },

        modal: {
          ondismiss: () => {
            toast("Payment cancelled", { icon: "ℹ️" });
            onFailure && onFailure(new Error("dismissed"));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (res) => {
        toast.error(`Payment failed: ${res.error.description}`);
        onFailure && onFailure(res.error);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not initiate payment");
      onFailure && onFailure(err);
    }
  }, [emptyCart]);

  return { initiatePayment };
};
