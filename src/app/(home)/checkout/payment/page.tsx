import { Title } from '@/components/ui/Title';
import PaymentClient from './ui/PaymentClient';

export default function PaymentPage() {
  return (
    <div className="flex flex-col lg:justify-center lg:items-center mb-72 px-10 sm:px-0">
      <div className="w-full xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Pagar" size="3xl" />
        <PaymentClient />
      </div>
    </div>
  );
}