'use client';

import { CircleMinus, CirclePlus } from "lucide-react";



interface Props {
  quantity: number;
  onQuantityChanged: (value: number ) => void
}



export const QuantitySelector = ( { quantity, onQuantityChanged }: Props ) => {


  const onValueChanged = ( value: number ) => {
    
    if ( quantity + value < 1 ) return;
    if ( quantity + value > 30 ) return;
    onQuantityChanged( quantity + value );
  };


  return (
    <div className="flex items-center">
      <button onClick={ () => onValueChanged( -1 ) }>
        <CircleMinus className="w-5 h-5 cursor-pointer" />
      </button>

      <span className="w-20 text-center text-xl font-bold">
        { quantity }
      </span>

      <button onClick={ () => onValueChanged( +1 ) }>
        <CirclePlus className="w-5 h-5 cursor-pointer" />
      </button>

    </div>
  );
};