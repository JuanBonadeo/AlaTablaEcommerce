import { Title } from '@/components/ui/Title';
import { AddressClient } from './ui/AddressClient';
import { requireAuth } from '@/lib/auth/require-auth';

export default async function Adress() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20 px-3 sm:px-6 lg:px-10 pt-4 sm:pt-8">

      <div className="max-w-4xl mx-auto">

        <div className="mb-6 sm:mb-8">
          <Title title="Elegí la forma de entrega" size="3xl" />
        </div>

        <AddressClient/>
      </div>

    </div>
  );
}