import ThunderPix, { PixProvider } from 'thunderpix';

export default async (req, res) => {
   var provider = new PixProvider('91b7482c-3ef1-4eff-8d80-9a59c87773a8');
   /**
    * Inicia o construtor do ThunderPix
    * passando a instancia do provedor de pagamento
    */
   var thunder = new ThunderPix(provider);
 
   /**
    * Gerando um QrCode Pix de cobrança
    */
   var qrcode = await thunder.createQrCode({
     valueCents: 199,
     expires: 3600,
   });
 
   res.json(qrcode);
}