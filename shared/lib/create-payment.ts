// Yookassa - санкции
// import { PaymentData } from '@/@types/yookassa';
// import axios from 'axios';

// interface Props {
//   description: string;
//   orderId: number;
//   amount: number;
// }

// export async function createPayment(details: Props) {
//   const { data } = await axios.post<PaymentData>(
//     'https://api.yookassa.ru/v3/payments',
//     {
//       amount: {
//         value: details.amount.toString(),
//         currency: 'RUB',
//       },
//       capture: true,
//       description: details.description,
//       metadata: {
//         order_id: details.orderId,
//       },
//       confirmation: {
//         type: 'redirect',
//         return_url: process.env.YOOKASSA_CALLBACK_URL,
//       },
//     },
//     {
//       auth: {
//         username: process.env.YOOKASSA_STORE_ID as string,
//         password: process.env.YOOKASSA_API_KEY as string,
//       },
//       headers: {
//         'Content-Type': 'application/json',
//         'Idempotence-Key': Math.random().toString(36).substring(7),
//       },
//     },
//   );

//   return data;
// }


// LiqPay - не заработало
// import crypto from 'crypto';

// interface Props {
//   description: string;
//   orderId: number;
//   amount: number;
// }

// export async function createPayment(details: Props) {
//   const paymentData = {
//     public_key: process.env.LIQPAY_PUBLIC_KEY,
//     version: '3',
//     action: 'pay',
//     amount: details.amount,
//     currency: 'UAH',

//     description: details.description,
//     order_id: String(details.orderId),

//     result_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,

//     server_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/liqpay/callback`,
//   };

//   const data = Buffer.from(
//     JSON.stringify(paymentData)
//   ).toString('base64');

//   const signature = crypto
//     .createHash('sha1')
//     .update(
//       `${process.env.LIQPAY_PRIVATE_KEY}${data}${process.env.LIQPAY_PRIVATE_KEY}`
//     )
//     .digest('base64');

//   return {
//     data,
//     signature,
//   };
// }



import crypto from 'crypto';

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

export async function createPayment(details: Props) {
  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT!;
  const merchantSecretKey = process.env.WAYFORPAY_SECRET_KEY!;
  const merchantDomainName = process.env.WAYFORPAY_DOMAIN!;

  const orderReference = `${details.orderId}_${Date.now()}`
  const orderDate = Math.floor(Date.now() / 1000);
	const VAT = 5;
	const DELIVERY_PRICE = 100;
	const vatPrice = (details.amount * VAT) / 100;
	const totalPrice = details.amount + DELIVERY_PRICE + vatPrice;

  const signatureString = [
    merchantAccount,
    merchantDomainName,
    orderReference,
    orderDate,
    totalPrice,
    'UAH',
    details.description,
    1,
    totalPrice,
  ].join(';');

  const merchantSignature = crypto
    .createHmac('md5', merchantSecretKey)
    .update(signatureString)
    .digest('hex');

  const response = await fetch('https://api.wayforpay.com/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionType: 'CREATE_INVOICE',
      merchantAccount,
      merchantDomainName,
      merchantSignature,
      apiVersion: 1,

      orderReference,
      orderDate,

      amount: totalPrice,
      currency: 'UAH',

      productName: [details.description],
      productPrice: [totalPrice],
      productCount: [1],

			serviceUrl: process.env.WAYFORPAY_CALLBACK_URL,
    }),
  });

  const data = await response.json();

	console.log(
		'WAYFORPAY CREATE_INVOICE:',
		JSON.stringify(data, null, 2)
	);

  return data;
}