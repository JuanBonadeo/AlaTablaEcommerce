'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Percent, Calendar, X, Save, Tag, Clock } from 'lucide-react';
import { createOfferAction, updateOfferAction, deleteOfferAction } from '@/lib/actions/offer/offer.actions';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { currencyFormat } from '@/lib/helpers/currencyFormat';

type Offer = {
  id: string;
  productId: string | null;
  descuento: number;
  descripcion: string | null;
  desde: Date;
  hasta: Date;
  createdAt: Date;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
  } | null;
};

type Product = {
  id: string;
  name: string;
  price: number;
  slug: string;
};

interface OffersClientProps {
  offers: Offer[];
  products: Product[];
}

export default function OffersClient({ offers, products }: OffersClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    productIds: [] as string[], // Para crear nuevas ofertas con múltiples productos
    descuento: '',
    descripcion: '',
    desde: '',
    hasta: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [pendingDeleteOfferId, setPendingDeleteOfferId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Convertir las fechas agregando las horas (00:00:00 y 23:59:59)
    const desdeWithTime = `${formData.desde}T00:00:00`;
    const hastaWithTime = `${formData.hasta}T23:59:59`;

    // Si estamos editando, usamos productId (single)
    // Si estamos creando, usamos productIds (multiple)
    if (editingOffer) {
      const data = new FormData();
      data.append('productId', formData.productId);
      data.append('descuento', formData.descuento);
      data.append('descripcion', formData.descripcion);
      data.append('desde', desdeWithTime);
      data.append('hasta', hastaWithTime);

      try {
        const result = await updateOfferAction(editingOffer.id, data);

        if (result.ok) {
          setShowModal(false);
          setEditingOffer(null);
          setFormData({
            productId: '',
            productIds: [],
            descuento: '',
            descripcion: '',
            desde: '',
            hasta: '',
          });
          router.refresh();
        } else {
          setError(result.message || 'Error al actualizar la oferta');
        }
      } catch (err) {
        setError('Error inesperado al actualizar la oferta');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Crear nuevas ofertas para cada producto seleccionado
      if (formData.productIds.length === 0) {
        setError('Selecciona al menos un producto');
        setIsSubmitting(false);
        return;
      }

      const data = new FormData();
      data.append('productIds', JSON.stringify(formData.productIds));
      data.append('descuento', formData.descuento);
      data.append('descripcion', formData.descripcion);
      data.append('desde', desdeWithTime);
      data.append('hasta', hastaWithTime);

      try {
        const result = await createOfferAction(data);

        if (result.ok) {
          setShowModal(false);
          setEditingOffer(null);
          setFormData({
            productId: '',
            productIds: [],
            descuento: '',
            descripcion: '',
            desde: '',
            hasta: '',
          });
          router.refresh();
        } else {
          setError(result.message || 'Error al crear la oferta');
        }
      } catch (err) {
        setError('Error inesperado al crear la oferta');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      productId: offer.productId || '',
      productIds: [],
      descuento: offer.descuento.toString(),
      descripcion: offer.descripcion || '',
      desde: new Date(offer.desde).toISOString().slice(0, 10),
      hasta: new Date(offer.hasta).toISOString().slice(0, 10),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setConfirmMessage('¿Estás seguro de eliminar esta oferta?');
    setPendingDeleteOfferId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteOfferId) return;
    setIsSubmitting(true);
    try {
      const result = await deleteOfferAction(pendingDeleteOfferId);
      if (result.ok) {
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error al eliminar la oferta');
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
      setPendingDeleteOfferId(null);
    }
  };

  const handleNew = () => {
    setEditingOffer(null);
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      productId: '',
      productIds: [],
      descuento: '',
      descripcion: '',
      desde: today,
      hasta: today,
    });
    setError(null);
    setShowModal(true);
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const isOfferActive = (offer: Offer) => {
    const now = new Date();
    return now >= new Date(offer.desde) && now <= new Date(offer.hasta);
  };

  const isOfferUpcoming = (offer: Offer) => {
    const now = new Date();
    return now < new Date(offer.desde);
  };

  const isOfferExpired = (offer: Offer) => {
    const now = new Date();
    return now > new Date(offer.hasta);
  };

  const activeOffers = offers.filter(isOfferActive);
  const upcomingOffers = offers.filter(isOfferUpcoming);
  const expiredOffers = offers.filter(isOfferExpired);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <ConfirmModal
            open={confirmOpen}
            title="Eliminar oferta"
            message={confirmMessage}
            confirmLabel="Eliminar"
            cancelLabel="Cancelar"
            loading={isSubmitting}
            onConfirm={confirmDelete}
            onCancel={() => { setConfirmOpen(false); setPendingDeleteOfferId(null); }}
          />
          <h1 className="text-3xl font-bold text-white mb-1">Ofertas</h1>
          <p className="text-gray-400">
            {activeOffers.length} activas · {upcomingOffers.length} próximas · {expiredOffers.length} expiradas
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Nueva Oferta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#171718] border border-green-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Activas</span>
            <Tag className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-400">{activeOffers.length}</p>
        </div>

        <div className="bg-[#171718] border border-blue-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Próximas</span>
            <Clock className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-400">{upcomingOffers.length}</p>
        </div>

        <div className="bg-[#171718] border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Expiradas</span>
            <Percent className="text-gray-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-400">{expiredOffers.length}</p>
        </div>
      </div>

      {/* Offers List */}
      <div className="bg-[#171718] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-[#0a0a0a]">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Producto</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Descuento</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Precio Original</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Precio con Oferta</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Periodo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Estado</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => {
                const product = getProductById(offer.productId || '');
                const isActive = isOfferActive(offer);
                const isUpcoming = isOfferUpcoming(offer);
                const originalPrice = product?.price || 0;
                const discountedPrice = originalPrice * (1 - offer.descuento / 100);

                return (
                  <tr key={offer.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{product?.name || 'Producto no encontrado'}</p>
                        {offer.descripcion && (
                          <p className="text-gray-500 text-sm">{offer.descripcion}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg font-bold">
                        <Percent size={14} />
                        {offer.descuento}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-400 line-through">{currencyFormat(originalPrice)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-green-400 font-bold text-lg">{currencyFormat(discountedPrice)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="text-gray-300">
                          {new Date(offer.desde).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-gray-500">hasta</p>
                        <p className="text-gray-300">
                          {new Date(offer.hasta).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg text-xs font-medium">
                          Activa
                        </span>
                      ) : isUpcoming ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg text-xs font-medium">
                          Próxima
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/50 rounded-lg text-xs font-medium">
                          Expirada
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          disabled={isSubmitting}
                          className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {offers.length === 0 && (
            <div className="text-center py-12">
              <Percent className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-400">No hay ofertas creadas</p>
              <button
                onClick={handleNew}
                className="mt-4 text-orange-400 hover:text-orange-300 transition-colors"
              >
                Crear la primera oferta
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#171718] border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Percent className="text-orange-400" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {editingOffer ? 'Editar Oferta' : 'Nueva Oferta'}
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Producto{!editingOffer && 's'} <span className="text-red-500">*</span>
                  </label>
                  {!editingOffer && products.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, productIds: products.map(p => p.id) })}
                        className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        Seleccionar todos
                      </button>
                      <span className="text-gray-600">|</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, productIds: [] })}
                        className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}
                </div>
                {editingOffer ? (
                  // Modo edición: select simple
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {currencyFormat(product.price)}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Modo creación: checkboxes múltiples
                  <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg max-h-64 overflow-y-auto">
                    {products.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                      >
                        <input
                          type="checkbox"
                          checked={formData.productIds.includes(product.id)}
                          onChange={(e) => {
                            const newProductIds = e.target.checked
                              ? [...formData.productIds, product.id]
                              : formData.productIds.filter((id) => id !== product.id);
                            setFormData({ ...formData, productIds: newProductIds });
                          }}
                          className="w-4 h-4 rounded border-gray-700 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 bg-[#0a0a0a]"
                        />
                        <span className="flex-1 text-white">{product.name}</span>
                        <span className="text-gray-400 text-sm">{currencyFormat(product.price)}</span>
                      </label>
                    ))}
                    {products.length === 0 && (
                      <div className="px-4 py-6 text-center text-gray-500">
                        No hay productos disponibles
                      </div>
                    )}
                  </div>
                )}
                {!editingOffer && formData.productIds.length > 0 && (
                  <p className="mt-2 text-sm text-gray-400">
                    {formData.productIds.length} producto{formData.productIds.length !== 1 ? 's' : ''} seleccionado{formData.productIds.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descuento (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.descuento}
                  onChange={(e) => setFormData({ ...formData, descuento: e.target.value })}
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Ej: 15"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  placeholder="Ej: Oferta de verano"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha Inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.desde}
                    onChange={(e) => setFormData({ ...formData, desde: e.target.value })}
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">Empieza a las 00:00 hs</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha Fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.hasta}
                    onChange={(e) => setFormData({ ...formData, hasta: e.target.value })}
                    required
                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">Termina a las 23:59 hs</p>
                </div>
              </div>

              {/* Preview */}
              {((editingOffer && formData.productId && formData.descuento) || 
                (!editingOffer && formData.productIds.length > 0 && formData.descuento)) && (
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-3">Vista previa:</p>
                  {editingOffer ? (
                    // Vista previa para edición (un solo producto)
                    (() => {
                      const product = getProductById(formData.productId);
                      const discount = parseFloat(formData.descuento) || 0;
                      const originalPrice = product?.price || 0;
                      const discountedPrice = originalPrice * (1 - discount / 100);

                      return (
                        <div>
                          <p className="text-white font-medium mb-1">{product?.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 line-through">{currencyFormat(originalPrice)}</span>
                            <span className="text-green-400 font-bold text-xl">{currencyFormat(discountedPrice)}</span>
                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm font-bold">
                              -{discount}%
                            </span>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    // Vista previa para creación (múltiples productos)
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {formData.productIds.map((productId) => {
                        const product = getProductById(productId);
                        const discount = parseFloat(formData.descuento) || 0;
                        const originalPrice = product?.price || 0;
                        const discountedPrice = originalPrice * (1 - discount / 100);

                        return (
                          <div key={productId} className="pb-3 border-b border-gray-800 last:border-0 last:pb-0">
                            <p className="text-white font-medium mb-1 text-sm">{product?.name}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-400 line-through text-sm">{currencyFormat(originalPrice)}</span>
                              <span className="text-green-400 font-bold">{currencyFormat(discountedPrice)}</span>
                              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs font-bold">
                                -{discount}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save size={18} />
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
