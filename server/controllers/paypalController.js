import axios from "axios";
import { plans } from "../config/plans.js";
import { getPaypalAccessToken } from "../config/paypal.js";
import User from "../model/userModel.js";
export const createOrder = async(req,res)=>{
    try {
        const { planId } = req.body;
        const plan = plans.find(p => p.id === planId);
        if(!plan){
            return res.status(400).json({success:false, message:'Invalid plan ID'});
        }

        const access_token = await getPaypalAccessToken();

        const orderData = await axios.post(
            `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: (plan.price / 100).toFixed(2)
                        }
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }
        );
        res.json({success:true, orderId: orderData.data.id,planId:plan.id});
    } catch (error) {
        console.error("Error creating PayPal order:", error);
        res.status(500).json({success:false, message:'Internal Server Error'});
    }
}

export const captureOrder = async(req,res)=>{
    try {
        const {orderId, planId} = req.body;
        const plan = plans.find(p => p.id === planId);
        if(!plan){
            return res.status(400).json({success:false, message:'Invalid plan ID'});
        }
        const access_token = await getPaypalAccessToken();
        const captureData = await axios.post(
            `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        );
        if (captureData.data.status !== "COMPLETED") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.creditBalance += plan.credits;
    await user.save();

    return res.json({
  success: true,
  user: {
    name: user.name,
    email: user.email,
    creditBalance: user.creditBalance
  }
});


    } catch (error) {
        console.error("Error capturing PayPal order:", error);
        res.status(500).json({success:false, message:'Internal Server Error'});
    }
}