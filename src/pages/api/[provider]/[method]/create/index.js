export default (req, res) => {
    res.status(201).json({
        suported: [
            {
                name: 'qrcode',
                description: 'Create new QrCode pix from provider',
                method: 'POST'
            },
            {
                name: 'transaction',
                description: 'Send payment or widthdraw',
                method: 'POST'
            }
        ]
    });
}