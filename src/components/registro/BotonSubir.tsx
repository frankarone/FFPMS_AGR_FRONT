import { useRef } from 'react';

interface Props {
  tipo: string;
  label: string;
  onSubir: (tipo: string, archivo: File) => void;
}

function BotonSubir({ tipo, label, onSubir }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className="btn-historial" onClick={() => ref.current?.click()}>{label}</button>
      <input
        ref={ref}
        type="file"
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSubir(tipo, f);
          e.target.value = '';
        }}
      />
    </>
  );
}

export default BotonSubir;