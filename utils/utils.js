// utils/utils.js
const xml2js = require('xml2js');

const getBusinessDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const getShippingDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 7);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const extractField740 = (xmlString) => {
  let field740Value = null;
  xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }
    const transaction = result?.ProtoBase_Transaction_Batch?.Transaction;
    if (transaction?.API_Field) {
      const fields = Array.isArray(transaction.API_Field) 
        ? transaction.API_Field 
        : [transaction.API_Field];
      
      const field740 = fields.find(f => f.Field_Number === '0740');
      if (field740) {
        field740Value = field740.Field_Value;
      }
    }
  });
  return field740Value;
};

const extractField1005 = (xmlString) => {
  let field1005Value = null;
  xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }
    const transaction = result?.ProtoBase_Transaction_Batch?.Transaction;
    if (transaction?.API_Field) {
      const fields = Array.isArray(transaction.API_Field) 
        ? transaction.API_Field 
        : [transaction.API_Field];
      
      const field1005 = fields.find(f => f.Field_Number === '1005');
      if (field1005) {
        field1005Value = field1005.Field_Value;
      }
    }
  });
  return field1005Value;
};

const extractTokenFromXml = (xmlString) => {
  let tokenValue = null;
  xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }
    const transaction = result?.ProtoBase_Transaction_Batch?.Transaction;
    if (transaction?.API_Field) {
      const fields = Array.isArray(transaction.API_Field) 
        ? transaction.API_Field 
        : [transaction.API_Field];
      
      const field0003 = fields.find(f => f.Field_Number === '0003');
      if (field0003) {
        tokenValue = field0003.Field_Value;
      }
    }
  });
  return tokenValue;
};

const obtenerNumeroAutorizacion = (xmlString) => {
    let authNumber = null;
    xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        return;
      }
      const transaction = result?.ProtoBase_Transaction_Batch?.Transaction;
      if (transaction?.API_Field) {
        const fields = Array.isArray(transaction.API_Field) 
          ? transaction.API_Field 
          : [transaction.API_Field];
        
        // Cambiar de 0008 a 1012 (que es donde está el authorization number)
        const field1012 = fields.find(f => f.Field_Number === '1012');
        if (field1012) {
          authNumber = field1012.Field_Value;
        }
      }
    });
    return authNumber;
  };

module.exports = {
  getBusinessDate,
  getShippingDate,
  extractField740,
  extractField1005,
  extractTokenFromXml,
  obtenerNumeroAutorizacion
};