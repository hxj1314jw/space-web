export function getToUrl(): string {
  return localStorage.toUrl;
}

export function setToUrl(toUrl: string) {
  return localStorage.setItem('toUrl', toUrl);
}

export function removeToUrl() {
  return localStorage.removeItem('toUrl');
}

export function getFromUrl(): string {
  return localStorage.fromUrl;
}

export function setFromUrl(fromUrl: string) {
  return localStorage.setItem('fromUrl', fromUrl);
}

export function removeFromUrl() {
  return localStorage.removeItem('fromUrl');
}
