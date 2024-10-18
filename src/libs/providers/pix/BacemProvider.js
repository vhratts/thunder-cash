import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();

export default class {
    client;
    isStatic = true;

    constructor() {
        this.client = wrapper(axios.create({
            jar: jar
        }));

    }

    async qrcode(body = {
        value: 0,
        expire: 3600,
    }) {
        return {
            image: "base64;...",
            cpcl: "pix-bacem.govbr...",
            status: 'paid|pedding|error',
            code: "uniq-code",
            value: {
                cents: 0,
                float: 0.00
            },
            expires: {
                timestamp: 0,
                datetime: '--- -:-',
                isodate: ''
            }
        }
    }

    async status(body = {
        code: 'uniq-code'
    }) {
        return {
            image: "base64;...",
            cpcl: "pix-bacem.govbr...",
            status: 'paid|pedding|error',
            code: "uniq-code",
            value: {
                cents: 0,
                float: 0.00
            },
            expires: {
                timestamp: 0,
                datetime: '--- -:-',
                isodate: ''
            }
        }
    }

    async widthdraw(body = {
        value: 0,
        address: "address@email.com|87233644789|1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed|5581988762234"
    }) {
        return {
            status: 'paid|pedding|error',
            code: "uniq-code",
            value: {
                cents: 0,
                float: 0.00
            },
            voucher: {
                dinamic: "https://...",
                static: "https://static..."
            }
        }
    }

}