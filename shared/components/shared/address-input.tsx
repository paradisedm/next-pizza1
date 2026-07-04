// 'use client';

// import React from 'react';
// import { AddressSuggestions } from 'react-dadata';
// import 'react-dadata/dist/react-dadata.css';

// interface Props {
//   onChange?: (value?: string) => void;
// }

// export const AddressInput: React.FC<Props> = ({ onChange }) => {
//   return (
//     <AddressSuggestions
//       token="e88c4cc1e7935abb34929583edca24698a37ad7f"
//       onChange={(data) => onChange?.(data?.value)}
//     />
//   );
// };

'use client';

import { useLoadScript } from '@react-google-maps/api';
import { useRef } from 'react';
import React from 'react';

interface Props {
  onChange?: (value?: string) => void;
}

const libraries: ('places')[] = ['places'];

export const AddressInput: React.FC<Props> = ({ onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const initAutocomplete = (input: HTMLInputElement) => {
    const autocomplete =
      new google.maps.places.Autocomplete(input, {
        componentRestrictions: {
          country: 'ua',
        },
        fields: ['formatted_address'],
      });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      onChange?.(place.formatted_address || '');
    });
  };

  React.useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    initAutocomplete(inputRef.current);
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <input
        disabled
        placeholder="Загрузка..."
        className="w-full h-12 px-4 border rounded-md"
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Введите адрес доставки"
      className="w-full h-12 px-4 border rounded-md"
    />
  );
};