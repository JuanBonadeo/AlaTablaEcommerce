
export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED',
}

export enum PaymentProvider {
    MERCADOPAGO = 'MERCADOPAGO',
    TRANSFERENCIA = 'TRANSFERENCIA',
    CASH = 'CASH',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    TRANSFERRED = 'TRANSFERRED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum ShipmentStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    RETURNED = 'RETURNED',
}
