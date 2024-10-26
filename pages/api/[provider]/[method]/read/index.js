export default (req, res) => {
    res.status(201).json({
        suported: [
            {
                name: 'balance',
                description: 'get balance from provider',
                method: 'GET'
            },
            {
                name: 'transactions',
                description: 'get transaction list',
                method: 'GET'
            },
            {
                name: 'qrcodes',
                description: 'search qrcode by reference',
                method: 'GET'
            },
        ]
    });
}