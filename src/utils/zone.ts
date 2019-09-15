export function getZoneId(): string {
    return localStorage.zoneId;
  }

export function setZoneId(zoneId: string) {
  return localStorage.setItem('zoneId', zoneId);
}

export function removeZoneId() {
  return localStorage.removeItem('zoneId');
}
