import { Title } from '@/components/ui/Title';
import PaymentClient from './ui/PaymentClient';

export default function PaymentPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Title title="Completar pago" size="3xl" className="mb-6" />
        <PaymentClient />
      </div>
    </div>
  );
}