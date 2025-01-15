const axios = require("axios");

const generateAccessToken = async () => {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
        method: "POST",
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password:process.env.PAYPAL_SECRET
        }
    });

    
    return response.data.access_token
}

exports.createOrder = async (developerId) => {
    const accessToken = await generateAccessToken();

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        data: JSON.stringify({
            "intent": "CAPTURE",
            "payment_source": { 
                "paypal": { 
                    "experience_context": {
                        "brand_name": "AppJa", 
                        "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED", 
                        "landing_page": "LOGIN",
                        "shipping_preference": "NO_SHIPPING", 
                        "user_action": "PAY_NOW", 
                        "return_url": process.env.SERVER_BASE_URL + `/paypal/complete-order/${developerId}`, 
                        "cancel_url": process.env.CLIENT_BASE_URL + "/profile", 
                    } 
                } 
            }, 
            "purchase_units": [
                {
                    "items": [
                        {
                            "name": "Standard Developer membership",
                            "description": "Developer plan for premium service",
                            "quantity": "1",
                            "unit_amount": {
                                "currency_code": "USD",
                                "value": "15.00"
                            }
                        }
                    ],

                    "amount": {
                        "currency_code": "USD",
                        "value": "15.00",
                        "breakdown": {
                            "item_total": {
                                "currency_code": "USD",
                                "value": "15.00"
                            }
                        }
                    }
                }
            ],
        })
    })
    
    return response.data.links.find(link => link.rel == "payer-action").href;
}

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    });

    return response.data;
}