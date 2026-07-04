'use client';

import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import React from 'react';
import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import { ProductForm } from '..';
import { ProductWithRelations } from '@/@types/prisma';

interface Props {
	product: ProductWithRelations;
	className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
	const router = useRouter();

	return (
		<Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
			<DialogContent className={cn(
				'p-0 w-[1060px] max-w-[1060px] min-h-[500px] min-w-[1000px] bg-white overflow-hidden',
				className,
      )}>

			<ProductForm 
				product={product}
				onSubmit={() => router.back()}
			/>

			</DialogContent>
		</Dialog>
	);
};