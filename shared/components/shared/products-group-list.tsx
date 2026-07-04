'use client';

import React, { useEffect, useRef } from 'react';
// import { useIntersection } from 'react-use'
import { ProductCard, Title } from '.';
import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store/category';
import { ProductWithRelations } from '@/@types/prisma';

interface Props {
	title: string;
  items: ProductWithRelations[];
	categoryId: number;
  className?: string;
  listClassName?: string;	
}

export const ProductsGroupList: React.FC<Props> = ({ 
	title,
  items,
  listClassName,
  categoryId,
  className,
}) => {
	const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
	// const intersectionRef = useRef(null);
	// const intersection = useIntersection(intersectionRef, {
  //   threshold: 0.4,
  // });

	// useEffect(() => {
  //   if (intersection?.isIntersecting) {
  //     setActiveCategoryId(categoryId);
  //   }
  // }, [categoryId, intersection?.isIntersecting, title]);
	const intersectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = intersectionRef.current;

		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setActiveCategoryId(categoryId);
				}
			},
			{
				threshold: 0.4,
			}
		);

		observer.observe(element);

		return () => observer.disconnect();
	}, [categoryId, setActiveCategoryId]);

	return (
		<div className={className} id={title} ref={intersectionRef}>
			<Title text={title} size="lg" className="font-extrabold mb-5" />
			<div className={cn('grid grid-cols-3 gap-[50px]', listClassName)}>
        {items.map((product, i) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.items[0].price}
						ingredients={product.ingredients}
          />
        ))}
      </div>
		</div>
	);
};