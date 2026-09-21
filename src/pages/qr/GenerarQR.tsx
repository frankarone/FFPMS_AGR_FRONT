import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { buscarPallet } from '../../services/palletService';
import './GenerarQR.css';

function GenerarQR() {
  const [nroPallet, setNroPallet] = useState('');
  const [textoQR, setTextoQR] = useState('');
  const [error, setError] = useState('');

  const buscar = async () => {
    setError('');
    setTextoQR('');

    if (!nroPallet.trim()) {
      setError('Escribe un numero de pallet');
      return;
    }

    try {
      const datos = await buscarPallet(nroPallet);
      if (datos && datos.ok) {
        setTextoQR(datos.textoQR || '');
      } else {
        setError(datos?.mensaje || 'No se encontró el pallet');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    }
  };

  const imprimir = () => {
    window.print();
  };

  return (
    <div className="contenedor">
      <h1>GENERAR QR PALLET</h1>

      <div className="qr-buscador no-imprimir">
         <input
          type="text"
          placeholder="Ej: CTV-HA-EX00008"
          value={nroPallet}
          onChange={(e) => setNroPallet(e.target.value)}
        />
        <button onClick={buscar}>Buscar</button>
      </div>   

      {error && <p className="qr-error no-imprimir">{error}</p>}

      {textoQR && (
        <div className="qr-resultado">
          <div className="etiqueta">
            <QRCodeSVG value={textoQR} size={320} level="M" marginSize={4} 
            bgColor="#ffffff" fgColor="#000000" />
          </div>

          <button className="qr-btn-imprimir no-imprimir" 
          onClick={imprimir}>Imprimir QR
          </button>

          <h3 className="qr-datos-titulo no-imprimir">DATOS DEL PALLET</h3>

          <pre className="qr-datos no-imprimir">{textoQR}</pre>
        </div>
      )}
    </div>
  );
}

export default GenerarQR;