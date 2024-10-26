export default (req, res) => {
    /**
     * Suporte a ISP (EM desenvolvimento)
     */
    res.status(200).json({
        method: 'Pix',
        provider: req.query.provider,
        isp: null,
        datetime: {
            iso: new Date().toISOString(),
            timestamp: new Date().getTime()
        }
    });
}