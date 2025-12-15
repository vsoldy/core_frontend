import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type OfferStatus = 'proposed' | 'accepted' | 'rejected'

export interface Offer {
  id: string
  listingId: string
  buyerId: string
  buyerName: string
  price: number
  etaDays: number
  comment?: string
  status: OfferStatus
  createdAt: string
}

interface CreateOfferPayload {
  listingId: string
  buyerId: string
  buyerName: string
  price: number
  etaDays: number
  comment?: string
}

const mockOffers: Offer[] = [
  {
    id: 'offer-1',
    listingId: 'service-1',
    buyerId: 'buyer-7',
    buyerName: 'Buyer Pro',
    price: 4500,
    etaDays: 2,
    comment: 'Готов взять в работу, есть опыт с электроникой.',
    status: 'proposed',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
  },
  {
    id: 'offer-2',
    listingId: 'service-1',
    buyerId: 'buyer-9',
    buyerName: 'Express Team',
    price: 4800,
    etaDays: 1,
    comment: 'Отправлю в день выкупа, страховка включена.',
    status: 'proposed',
    createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  }
]

export const useOffersStore = defineStore('offers', () => {
  const offers = ref<Offer[]>([...mockOffers])
  const isLoading = ref(false)

  const offersByListing = computed(() => (listingId: string) =>
    offers.value.filter((offer) => offer.listingId === listingId)
  )

  const acceptedOffer = computed(() => (listingId: string) =>
    offers.value.find((offer) => offer.listingId === listingId && offer.status === 'accepted') || null
  )

  const loadOffers = async (listingId: string) => {
    isLoading.value = true
    try {
      // TODO: replace with API call
      offers.value = offers.value.filter((offer) => offer.listingId === listingId || !offer.listingId)
      return offersByListing.value(listingId)
    } finally {
      isLoading.value = false
    }
  }

  const createOffer = (payload: CreateOfferPayload) => {
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      listingId: payload.listingId,
      buyerId: payload.buyerId,
      buyerName: payload.buyerName,
      price: payload.price,
      etaDays: payload.etaDays,
      comment: payload.comment,
      status: 'proposed',
      createdAt: new Date().toISOString()
    }
    offers.value.unshift(newOffer)
    return newOffer
  }

  const acceptOffer = (listingId: string, offerId: string) => {
    offers.value = offers.value.map((offer) => {
      if (offer.listingId !== listingId) return offer
      if (offer.id === offerId) return { ...offer, status: 'accepted' }
      if (offer.status === 'accepted') return { ...offer, status: 'rejected' }
      return { ...offer, status: 'rejected' }
    })
  }

  const rejectOffer = (offerId: string) => {
    offers.value = offers.value.map((offer) =>
      offer.id === offerId ? { ...offer, status: 'rejected' } : offer
    )
  }

  const hasOfferFromBuyer = (listingId: string, buyerId: string) =>
    offers.value.some((offer) => offer.listingId === listingId && offer.buyerId === buyerId)

  return {
    offers,
    isLoading,
    offersByListing,
    acceptedOffer,
    loadOffers,
    createOffer,
    acceptOffer,
    rejectOffer,
    hasOfferFromBuyer
  }
})
