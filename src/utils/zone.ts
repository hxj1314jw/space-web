export function getZoneId(): string {
    return localStorage.zoneId;
}

export function setZoneId(zoneId: string) {
    return localStorage.setItem('zoneId', zoneId);
}

export function removeZoneId() {
    return localStorage.removeItem('zoneId');
}

export function initChargeMethod(chargeMethod: string) {
    switch (chargeMethod) {
        case '1':
            return "小时";
            break;
        case '2':
            return "天";
            break;
        case '3':
            return "月";
            break;
        case '4':
            return "年";
            break;
        default:
            return "";
    }
}
