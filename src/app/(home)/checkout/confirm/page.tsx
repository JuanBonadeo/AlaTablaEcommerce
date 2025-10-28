import { Title } from '@/components/ui/Title';
import ConfirmOrderClient from './ui/ConfirmOrderClient';

export default function ConfirmPage() {
  return (
    <div className="flex flex-col lg:justify-center lg:items-center mb-72 px-10 sm:px-0">

      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">

        <Title title="Confirmar y pagar" size="3xl" />

        <ConfirmOrderClient />
      </div>

    </div>
  );
}
