import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { getToken, setToken, removeToken, setName, setPhone, removeName, removePhone, getName, getPhone } from '@/utils/auth';
import { getZoneId } from '@/utils/zone';
import { getToUrl, getFromUrl, setToUrl, setFromUrl } from '@/utils/url';
import service from '@/utils/request';
import store from '@/store';

export interface UserState {
    token: string;
    name: string;
    phone: string;
    zoneId: string;
    toUrl: string;
    fromUrl: string;
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements UserState {
    public token = getToken() || '';
    public name = getName() || '';
    public phone = getPhone() || '';
    public zoneId = getZoneId() || '';
    public toUrl = getToUrl() || '';
    public fromUrl = getFromUrl() || '';

    @Action
    public Login(LoginForm: { phone: string, code: string, openId: string }) {
        return new Promise((resolve, reject) => {
            service.post('/login', LoginForm).then((res: any) => {
                setToken(res.data.data.token);
                setName(res.data.data.userInfo.name);
                setPhone(res.data.data.userInfo.phone);
                this.SET_TOKEN(res.data.data.token);
                this.SET_NAME(res.data.data.userInfo.name);
                this.SET_PHONE(res.data.data.userInfo.phone);
                resolve();
            }).catch((err: any) => {
                reject(err.response.data.msg);
            });
        });
    }

    @Action
    public Logout() {
        return new Promise((resolve) => {
            removeToken();
            removeName();
            removePhone();
            this.SET_TOKEN('');
            this.SET_NAME('');
            this.SET_PHONE('');
            resolve();
        }).catch((err: any) => {
            console.log(err);
        });
    }

    @Action
    public SetToUrl(toUrl: string) {
        setToUrl(toUrl);
        this.SET_TOURL(toUrl);
    }

    @Action
    public SetFromUrl(fromUrl: string) {
        setFromUrl(fromUrl);
        this.SET_FROMURL(fromUrl);
    }

    @Mutation
    private SET_TOKEN(token: string) {
        this.token = token;
    }

    @Mutation
    private SET_NAME(name: string) {
        this.name = name;
    }

    @Mutation
    private SET_PHONE(phone: string) {
        this.phone = phone;
    }

    @Mutation
    private SET_TOURL(toUrl: string) {
        this.toUrl = toUrl;
    }

    @Mutation
    private SET_FROMURL(fromUrl: string) {
        this.fromUrl = fromUrl;
    }
}

export const UserModule = getModule(User);
