import { Title } from '@/components/ui/Title';
import ConfirmOrderClient from './ui/ConfirmOrderClient';
import { requireAuth } from '@/lib/auth/require-auth';

export default async function ConfirmPage() {
  await requireAuth();

  return (
    <div className="flex flex-col lg:justify-center lg:items-center mb-72 px-10 sm:px-0">

      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">

        <Title title="Confirmar y pagar" size="3xl" />

        <ConfirmOrderClient />
      </div>

    </div>
  );
}
