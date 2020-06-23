import { Item, PartType, Order } from "../generated/graphql";

export function calFormatter(date: Date) {

    if (date === undefined || date === null) {
        return ' - ';
    }
    const oDate = new Date(date);

    return `${oDate.getFullYear()}/${(oDate.getMonth() + 1)}/${oDate.getDate()}`;
}

export function cashFormatter(money: number | undefined | null) {

    if (money === undefined || money === null) {
        return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(0);
    }

    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(money);
}

export function numberFormatter(money: number | undefined | null) {
    return cashFormatter(money).slice(1);
}

export function orderNoGenerator(orderNo: string) {
    const year = new Date().getFullYear();
    return Number(orderNo.substr(0, 4)) === year ? Number(orderNo) + 1 : (year + "0001");
}

export function roundUp(input: number, digits: number) {
    return Math.ceil((Math.floor(input * digits * 10) / (digits * 10)) * digits) / 10;
}

export const totalCal =
    async (items: Item[], discount: number, installation: number, installationDiscount: number) => {
        const total = items.reduce((accumulator, item) => {
            const singlePrice = item.partType === PartType.Fabric ? (item.price - Math.floor(item.price * discount) / 100) : item.price * item.handrailLength;
            return accumulator + singlePrice;
        }, 0);
        return roundCal(total + installation - installationDiscount, 100);
    }

export const roundCal = (input: number, digits: number) => {
    return Math.round(input * digits) / digits
}

export const monthlyCal = (order: any) => {
    if (order !== undefined) {
        order.invTot = sumUp(order.invoice);
        order.cashTot = sumUp(order.cash);
    }
}

export const sumUp = (orders: Array<Order>) => {
    if (orders !== undefined) {
        return orders.reduce((acc, order) => {
            return acc + order.total!
        }, 0);
    }
}

export const paymentSlice = (payment: string) => {
    if (payment === "" || payment.indexOf(",") === -1) {
        return 0;
    } else if (payment.split(",").length < 3) {
        return 0;
    }

    return (Number)(payment.split(",")[2].trim());
}