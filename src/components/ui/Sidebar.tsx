'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { IoCloseOutline, IoPersonOutline, IoTicketOutline, IoLogOutOutline, IoShirtOutline, IoPeopleOutline } from 'react-icons/io5';

import { authClient } from '@/lib/auth/auth-client';
import { useUIStore } from '@/lib/store/ui-store';
import { useRouter } from 'next/navigation';


export const Sidebar = () => {

  const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
  const closeMenu = useUIStore(state => state.closeSideMenu);
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const isAdmin = (session?.user.role === 'admin')

  const onLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          closeMenu();
          router.push('/auth/login');
        },
      },
    });
  }

  return (
    <div>

      {/* Background black */}
      {
        isSideMenuOpen && (
          <div
            className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
          />

        )
      }


      {/* Blur */}
      {
        isSideMenuOpen && (
          <div
            onClick={closeMenu}
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          />

        )
      }

      {/* Sidemenu */}
      <nav
        className={clsx(
          "fixed p-3 md:p-5 right-0 top-0 w-[200px] sm:w-[250px] md:w-[300px]  h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen
          }
        )}
      >


        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => closeMenu()}
        />


        {/* Menú */}

        <>
          <Link
            href="/profile"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => closeMenu()}
          >
            <IoPersonOutline size={30} />
            <span className="ml-3 text-xl">Perfil</span>
          </Link>

          <Link
            href="/orders"
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => closeMenu()}
          >
            <IoTicketOutline size={30} />
            <span className="ml-3 text-xl">Ordenes</span>
          </Link>

          <button
            className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => onLogout()}
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        </>
        










        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className="w-full h-px bg-gray-200 my-10" />

            <Link
              href="/admin/products"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeMenu()}
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>

          </>
        )
        }
      </nav>
    </div>
  );
};