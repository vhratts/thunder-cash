import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();

export default class {
    client;
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

}