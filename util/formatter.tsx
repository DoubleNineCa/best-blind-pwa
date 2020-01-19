export function calFormatter(date: Date) {

    if (date === undefined || date === null) {
        return ' - ';
    }
    const oDate = new Date(date);

    return `${oDate.getFullYear()} / ${(oDate.getMonth() + 1)} / ${oDate.getDate()}`;
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
    return Number(orderNo.substr(0, 4)) === year ? year + digitConverter((Number(orderNo.substr(4, 8)) + 1)) : Number(year + "0001");
}

function digitConverter(input: number) {
    return (input / 1000).toString().replace(".", "");
}