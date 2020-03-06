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
    return Number(orderNo.substr(0, 4)) === year ? Number(orderNo) + 1 : (year + "0001");
}

export function roundUp(input: number, digits: number) {
    return Math.ceil((Math.floor(input * digits * 10) / (digits * 10)) * digits) / 10;
}
function digitConverter(input: number) {
    if (input < 10) {
        return "000" + input;
    } else if (input >= 10 && input < 100) {
        return "00" + input;
    } else if (input >= 100 && input < 1000) {
        return "0" + input;
    } else {
        return input;
    }
}