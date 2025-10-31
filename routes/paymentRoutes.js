// routes/paymentRoutes.js
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();
const { extractField1005, extractField740, extractTokenFromXml, obtenerNumeroAutorizacion, getBusinessDate, getShippingDate } = require('../utils/utils');

router.post('/process', async (req, res) => {
  const { cardNumber, expDate, cvv, amount, zipCode, address } = req.body;

  if (!cardNumber || !expDate || !cvv || !amount || !zipCode || !address) {
    return res.status(400).json({ error: 'Faltan datos de tarjeta o monto' });
  }

  const idAuth = Math.floor(1000 + Math.random() * 9000).toString();

  const xmlRequestAuth = `<?xml version="1.0" encoding="UTF-8"?>
<ProtoBase_Transaction_Batch xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.protobase.com/XML/PBAPI1.xsd">
  <Settlement_Batch>false</Settlement_Batch>
  <Transaction>
    <API_Field><Field_Number>0001</Field_Number><Field_Value>2</Field_Value></API_Field>
    <API_Field><Field_Number>0002</Field_Number><Field_Value>${amount}</Field_Value></API_Field>
    <API_Field><Field_Number>0003</Field_Number><Field_Value>${cardNumber}</Field_Value></API_Field>
    <API_Field><Field_Number>0004</Field_Number><Field_Value>${expDate}</Field_Value></API_Field>
    <API_Field><Field_Number>0007</Field_Number><Field_Value>${idAuth}</Field_Value></API_Field>
    <API_Field><Field_Number>0025</Field_Number><Field_Value>${getBusinessDate()}</Field_Value></API_Field>
    <API_Field><Field_Number>0047</Field_Number><Field_Value>"K;0;0;0;5;0;K;0;5;1;3;0;2;5"</Field_Value></API_Field>
    <API_Field><Field_Number>0050</Field_Number><Field_Value>${cvv}</Field_Value></API_Field>
    <API_Field><Field_Number>0054</Field_Number><Field_Value>85</Field_Value></API_Field>
    <API_Field><Field_Number>0070</Field_Number><Field_Value>7</Field_Value></API_Field>
    <API_Field><Field_Number>0071</Field_Number><Field_Value>0</Field_Value></API_Field>
    <API_Field><Field_Number>0072</Field_Number><Field_Value>0.00</Field_Value></API_Field>
    <API_Field><Field_Number>0110</Field_Number><Field_Value>ONLINE</Field_Value></API_Field>
    <API_Field><Field_Number>0115</Field_Number><Field_Value>10</Field_Value></API_Field>
    <API_Field><Field_Number>0190</Field_Number><Field_Value>7</Field_Value></API_Field>
    <API_Field><Field_Number>0191</Field_Number><Field_Value>P</Field_Value></API_Field>
    <API_Field><Field_Number>0647</Field_Number><Field_Value>0</Field_Value></API_Field>
    <API_Field><Field_Number>0700</Field_Number><Field_Value>${zipCode}</Field_Value></API_Field>
    <API_Field><Field_Number>0701</Field_Number><Field_Value>${address}</Field_Value></API_Field>
    <API_Field><Field_Number>0711</Field_Number><Field_Value>${getShippingDate()}</Field_Value></API_Field>
    <API_Field><Field_Number>0712</Field_Number><Field_Value>7</Field_Value></API_Field>
    <API_Field><Field_Number>0715</Field_Number><Field_Value>7</Field_Value></API_Field>
    <API_Field><Field_Number>0717</Field_Number><Field_Value>EVENT</Field_Value></API_Field>
    <API_Field><Field_Number>0720</Field_Number><Field_Value>Service;EventTicket</Field_Value></API_Field>
    <API_Field><Field_Number>5027</Field_Number><Field_Value>VN</Field_Value></API_Field>
    <API_Field><Field_Number>8002</Field_Number><Field_Value>${process.env.FUSEBOX_LOCATION_NAME}</Field_Value></API_Field>
    <API_Field><Field_Number>8006</Field_Number><Field_Value>${process.env.FUSEBOX_CHAIN_CODE}</Field_Value></API_Field>
    <API_Field><Field_Number>1008</Field_Number><Field_Value>ID:REQUEST</Field_Value></API_Field>
    <API_Field><Field_Number>0109</Field_Number><Field_Value>${process.env.FUSEBOX_TERMINAL_ID}</Field_Value></API_Field>
  </Transaction>
</ProtoBase_Transaction_Batch>`;

  const xmlRequest22 = `<?xml version="1.0" encoding="UTF-8"?>
<ProtoBase_Transaction_Batch xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.protobase.com/XML/PBAPI1.xsd">
  <Settlement_Batch>false</Settlement_Batch>
  <Transaction>
    <API_Field><Field_Number>0001</Field_Number><Field_Value>22</Field_Value></API_Field>
    <API_Field><Field_Number>0002</Field_Number><Field_Value>${amount}</Field_Value></API_Field>
    <API_Field><Field_Number>0003</Field_Number><Field_Value>${cardNumber}</Field_Value></API_Field>
    <API_Field><Field_Number>0004</Field_Number><Field_Value>${expDate}</Field_Value></API_Field>
    <API_Field><Field_Number>0007</Field_Number><Field_Value>${idAuth}</Field_Value></API_Field>
    <API_Field><Field_Number>0025</Field_Number><Field_Value>${getBusinessDate()}</Field_Value></API_Field>
    <API_Field><Field_Number>0050</Field_Number><Field_Value>${cvv}</Field_Value></API_Field>
    <API_Field><Field_Number>0647</Field_Number><Field_Value>0</Field_Value></API_Field>
    <API_Field><Field_Number>0700</Field_Number><Field_Value>${zipCode}</Field_Value></API_Field>
    <API_Field><Field_Number>0701</Field_Number><Field_Value>${address}</Field_Value></API_Field>
    <API_Field><Field_Number>8002</Field_Number><Field_Value>${process.env.FUSEBOX_LOCATION_NAME}</Field_Value></API_Field>
    <API_Field><Field_Number>8006</Field_Number><Field_Value>${process.env.FUSEBOX_CHAIN_CODE}</Field_Value></API_Field>
    <API_Field><Field_Number>1008</Field_Number><Field_Value>ID:REQUEST</Field_Value></API_Field>
    <API_Field><Field_Number>0109</Field_Number><Field_Value>${process.env.FUSEBOX_TERMINAL_ID}</Field_Value></API_Field>
  </Transaction>
</ProtoBase_Transaction_Batch>`;

  try {
    const response = await axios.post(process.env.FUSEBOX_URL, xmlRequestAuth, {
      headers: { 'Content-Type': 'application/xml' }
    });

    console.log("XML auth response:", response.data);

    const codeAuth = extractField1005(response.data);
    const complianceData = extractField740(response.data);
    const tokenAuth = extractTokenFromXml(response.data);
    const numeroAutorizacion = obtenerNumeroAutorizacion(response.data);

    console.log("Token auth:", tokenAuth);
    console.log("Numero de autorizacion:", numeroAutorizacion);

    if (numeroAutorizacion) {
      const response22 = await axios.post(process.env.FUSEBOX_URL, xmlRequest22, {
        headers: { 'Content-Type': 'application/xml' }
      });

      console.log("Respuesta XML 22:", response22.data);

      res.status(200).json({ 
        numeroAutorizacion, 
        tokenAuth, 
        complianceData,
        success: true 
      });
    } else {
      res.status(400).json({ error: 'Pago rechazado', success: false });
    }

  } catch (error) {
    console.error('Error al procesar el pago:', error.message);
    return res.status(500).json({ error: 'Error al conectar con Fusebox' });
  }
});

module.exports = router;