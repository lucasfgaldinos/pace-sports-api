import Stripe from 'stripe';
import * as Yup from 'yup';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return current.price * current.quantity + acc;
  }, 0);

  return total * 100;
};

// biome-ignore lint: false positive
export class CreatePaymentIntentController {
  static async store(req, res) {
    const schema = Yup.object({
      products: Yup.array()
        .required('Products is required')
        .of(
          Yup.object({
            id: Yup.number().required('Id is required'),
            quantity: Yup.number().required('Quantity is required'),
          }),
        ),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ errors: err.errors });
    }

    const { products } = req.body;

    const amount = calculateOrderAmount(products);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  }
}
