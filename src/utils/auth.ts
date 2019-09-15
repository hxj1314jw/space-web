export function getToken(): string {
  return localStorage.token;
}

export function setToken(token: string) {
  return localStorage.setItem('token', token);
}

export function removeToken() {
  return localStorage.removeItem('token');
}

export function getName(): string {
  return localStorage.name;
}

export function setName(name: string) {
  return localStorage.setItem('name', name);
}

export function removeName() {
  return localStorage.removeItem('name');
}

export function getPhone(): string {
  return localStorage.phone;
}

export function setPhone(phone: string) {
  return localStorage.setItem('phone', phone);
}

export function removePhone() {
  return localStorage.removeItem('phone');
}
