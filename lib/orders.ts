import { prisma } from './prisma';

interface CartItemInput {
  serviceId: string;
  quantity: number;
}

interface CreatePendingOrderInput {
  sessionId: string;
  items: CartItemInput[];
  email: string;
}

export async function createPendingOrder(input: CreatePendingOrderInput) {
  const services = await prisma.service.findMany({
    where: { id: { in: input.items.map((i) => i.serviceId) } },
  });

  const amountGrosze = input.items.reduce((sum, item) => {
    const service = services.find((s) => s.id === item.serviceId);
    if (!service) throw new Error(`Nieznana usługa: ${item.serviceId}`);
    return sum + service.priceGrosze * item.quantity;
  }, 0);

  return prisma.order.create({
    data: {
      sessionId: input.sessionId,
      customerEmail: input.email,
      amountGrosze,
      status: 'PENDING',
      items: {
        create: input.items.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
          priceGrosze: services.find((s) => s.id === item.serviceId)!.priceGrosze,
        })),
      },
    },
    include: { items: true },
  });
}

export async function markOrderAsPaid(sessionId: string) {
  return prisma.order.update({
    where: { sessionId },
    data: { status: 'PAID', paidAt: new Date() },
  });
}
