import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

const BuyCredit = () => {
  const { user, token, backendURL, loadCreditsData } =
    useContext(AppContext);

  const buyPlan = async (planId) => {
  if (!user) {
    toast.error("Please login to purchase a plan");
    return;
  }

  const container = document.getElementById("paypal-button-container");
  container.innerHTML = "";

  window.paypal
    .Buttons({
      createOrder: async () => {
        const { data } = await axios.post(
          `${backendURL}/api/paypal/create-order`,
          { planId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return data.orderId;
      },

      onApprove: async (data) => {
        await axios.post(
          `${backendURL}/api/paypal/capture-order`,
          {
            orderId: data.orderID,
            planId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Payment successful 🎉");
        loadCreditsData();
      },

      onError: (err) => {
        console.error(err);
        toast.error("Payment failed");
      },
    })
    .render("#paypal-button-container");
};


  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>

      <h1 className="text-3xl font-medium mb-6">
        Choose Your Plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{plan.id}</p>
            <p className="text-sm">{plan.desc}</p>

            <p className="mt-6">
              <span className="text-3xl font-medium">
                ₹{plan.price}
              </span>{" "}
              / {plan.credits} credits
            </p>

            <button
              onClick={() => buyPlan(plan.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5"
            >
              {user ? "Get Started" : "Login to Get Started"}
            </button>
          </div>
        ))}
      </div>

      
      <div
        id="paypal-button-container"
        className="mt-10 flex justify-center"
      />
    </motion.div>
  );
};

export default BuyCredit;