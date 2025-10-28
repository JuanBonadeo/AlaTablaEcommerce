
import { Title } from '@/components/ui/Title';
import { AddressClient } from './ui/AddressClient';

export default function Adress() {
  return (
    <div className="flex flex-col lg:justify-center lg:items-center mb-72 px-10 sm:px-0">

      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">

        <Title title="Elegí la forma de entrega" size="3xl" />

        <AddressClient/>
      </div>





    </div>
  );
}