import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL

export const loadRazorpay = (order_id, amount, setIsSubscribed) => {
    const razorpay_key = import.meta.env.VITE_RAZORPAY_KEY
    console.log("orderID", order_id)
    let options = {
        "key": razorpay_key,
        "amount": amount * 100,
        "currency": "INR",
        "name": "Rutuja's Calc",
        "description": "Transaction for getting our calculator subscription",
        "image": "https://static.vecteezy.com/system/resources/previews/011/125/368/original/cute-calculator-icon-png.png",
        "order_id": order_id,
        "handler": async (response) => {
            console.log(response)

            const razorpay_order_id = response.razorpay_order_id;
            const razorpay_payment_id = response.razorpay_payment_id;
            const razorpay_signature = response.razorpay_signature;

            try {
                const url = `${API_URL}/verify_payment?razorpay_order_id=${razorpay_order_id}&razorpay_payment_id=${razorpay_payment_id}&razorpay_signature=${razorpay_signature}`;

                const response = await axios.post(url, {});

                order_id = response.data.order_id;

                handleSubscribe(setIsSubscribed)

            } catch (error) {
                console.error('Error creating payment order:', error.response ? error.response.data : error.message);
                throw error;
            }

        },

        // it is for prefilling the data so that user don't need to write again
        "prefill": {
            "name": "Gandharv Kulkarni",
            "email": "gandharv@gmail.com",
            "contact": "7972368497"
        },
        "theme": {
            "color": "#2DA94F"
        }

    };

    let rzp1 = new window.Razorpay(options);
    
    rzp1.on('payment.failed', function (response) {
        alert("Payment failed!")

    });

    rzp1.open();

};


const handleSubscribe = async (setIsSubscribed) => {
    const token = localStorage.getItem("token")


    const url = `${API_URL}/subscribe`

    try {
        const response = await axios.post(url, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

        setIsSubscribed(response.data.isSubscribed)
        localStorage.setItem("token", response.data.token);

    } catch (error) {
        console.log(error)
    }
}
