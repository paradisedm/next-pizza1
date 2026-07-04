// import { PaymentCallbackData } from "@/@types/yookassa";
// import { prisma } from "@/prisma/prisma-client";
// import { OrderSuccessTemplate } from "@/shared/components/shared/email-temapltes/order-success";
// import { sendEmail } from "@/shared/lib";
// import { CartItemDTO } from "@/shared/services/dto/cart.dto";
// import { OrderStatus } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
// 	try {
// 		const body = (await req.json()) as PaymentCallbackData;
// 		const order = await prisma.order.findFirst({
// 			where: {
// 				id: Number(body.object.metadata.order_id),
// 			},
// 		});

// 		if (!order) {
// 			return NextResponse.json({ error: 'Order not found'});
// 		};

// 		const isSucceeded = body.object.status === 'succeeded';

// 		await prisma.order.update({
// 			where: {
// 				id: order.id,
// 			},
// 			data: {
// 				status: isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELLED,
// 			},
// 		});

// 		const items = JSON.parse(order?.items as string) as CartItemDTO[];

// 		if (isSucceeded) {
// 			await sendEmail(
// 				order.email,
// 				'Next Pizza / Ваш заказ успешно оформлен 🎉',
// 				OrderSuccessTemplate({ orderId: order.id, items }),
// 			)
// 		} else {
// 			// Письмо о неуспешной оплате
// 		}
// 	} catch (error) {
// 		console.log('[Checkout Callback] Error:', error);

// 		return NextResponse.json({ error: 'Server error'});
// 	}
// }

// import { WayForPayCallbackData } from '@/@types/wayforpay';
// import { prisma } from '@/prisma/prisma-client';
// import { OrderSuccessTemplate } from '@/shared/components/shared/email-templates/order-success';
// import { sendEmail } from '@/shared/lib';
// import { CartItemDTO } from '@/shared/services/dto/cart.dto';
// import { OrderStatus } from '@prisma/client';
// import { NextRequest, NextResponse } from 'next/server';

// // export async function POST(req: NextRequest) {
// //   console.log('CALLBACK HIT', new Date());

// //   const rawText = await req.text();
// //   console.log(rawText);

// //   return NextResponse.json({
// //     status: 'accept',
// //   });
// // }


// export async function POST(req: NextRequest) {
// 	console.log('=== CALLBACK START ===');
// 	try {
// 		console.log('POST REQUEST RECEIVED');
// 		const body = (await req.json()) as WayForPayCallbackData;
// 		console.log('BODY PARSED');

// 		console.log('WayForPay callback:', body);
// 		console.log('========================');
// 		console.log('WAYFORPAY CALLBACK');
// 		console.log(JSON.stringify(body, null, 2));
// 		console.log('========================');

// 		const orderId = Number(
// 			body.orderReference.split('_')[0]
// 		);

// 		const order = await prisma.order.findFirst({
// 			where: {
// 				id: orderId,
// 			},
// 		});

// 		if (!order) {
// 			return NextResponse.json(
// 				{ error: 'Order not found' },
// 				{ status: 404 }
// 			);
// 		}

// 		const isSucceeded =
//   body.transactionStatus === 'Approved';

// console.log('ORDER ID:', order.id);
// console.log('TRANSACTION STATUS:', body.transactionStatus);
// console.log(
//   'NEW STATUS:',
//   isSucceeded ? 'SUCCEEDED' : 'CANCELLED'
// );

// await prisma.order.update({
//   where: {
//     id: order.id,
//   },
//   data: {
//     status: isSucceeded
//       ? OrderStatus.SUCCEEDED
//       : OrderStatus.CANCELLED,
//   },
// });

// console.log('ORDER UPDATED');

		
// 		const items = JSON.parse(
// 			order.items as string
// 		) as CartItemDTO[];
		
// 			return NextResponse.json({
// 			orderReference: body.orderReference,
// 			status: 'accept',
// 			time: Math.floor(Date.now() / 1000),
// 		});
// 	} catch (error) {
// 		console.log('[WayForPay Callback] Error:', error);

// 		return NextResponse.json(
// 			{ error: 'Server error' },
// 			{ status: 500 }
// 		);
// 	}
// }

import { WayForPayCallbackData } from '@/@types/wayforpay';
import { prisma } from '@/prisma/prisma-client';
import { OrderSuccessTemplate } from '@/shared/components/shared/email-templates/order-success';
import { sendEmail } from '@/shared/lib';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as WayForPayCallbackData;

		const orderId = Number(
			body.orderReference.split('_')[0]
		);

				console.log(
			'WayForPay status:',
			body.transactionStatus
		);

		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});

		if (!order) {
			return NextResponse.json(
				{ error: 'Order not found' },
				{ status: 404 }
			);
		}

		const isSucceeded =
			body.transactionStatus === 'Approved';

		await prisma.order.update({
			where: {
				id: order.id,
			},
			data: {
				status: isSucceeded
					? OrderStatus.SUCCEEDED
					: OrderStatus.CANCELLED,
			},
		});

		const items = JSON.parse(
			order.items as string
		) as CartItemDTO[];

		if (isSucceeded) {
			await sendEmail(
				order.email,
				'Next Pizza / Ваш заказ успешно оформлен 🎉',
				// OrderSuccessTemplate({
				React.createElement(OrderSuccessTemplate, {
					orderId: order.id,
					items,
				}),
			);
		} else {
			// При желании можно отправлять письмо о неуспешной оплате
		}

		return NextResponse.json({
			orderReference: body.orderReference,
			status: 'accept',
			time: Math.floor(Date.now() / 1000),
		});
	} catch (error) {
		console.log(
			'[WayForPay Callback] Error:',
			error
		);

		return NextResponse.json(
			{ error: 'Server error' },
			{ status: 500 }
		);
	}
}