import { useEffect, useState } from 'react';
import { listarMaestro, crearMaestro, actualizarMaestro, eliminarMaestro } from '../services/maestroService';
import type { Maestro } from '../types/personal';

export function useMaestro(base: string) {
  const [items, setItems] = useState<Maestro[]>([]);
  const [nombre, setNombre] = useState('');
  const [editarId, setEditarId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargar = () => {
    listarMaestro(base).then((d) => { if (Array.isArray(d)) setItems(d); });
  };
  useEffect(() => { cargar(); }, [base]);

  const guardar = async () => {
    setMensaje(''); setError('');
    if (!nombre.trim()) { setError('Escribe un nombre'); return; }
    const r = editarId
      ? await actualizarMaestro(base, editarId, nombre.trim())
      : await crearMaestro(base, nombre.trim());
    if (r && r.ok) {
      setMensaje(editarId ? 'Actualizado' : 'Agregado');
      setNombre(''); setEditarId(null); cargar();
    } else {
      setError(r?.mensaje || 'No se pudo guardar');
    }
  };

  const editar = (m: Maestro) => { setEditarId(m.id); setNombre(m.nombre); setMensaje(''); setError(''); };
  const cancelar = () => { setEditarId(null); setNombre(''); };
  const eliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    const r = await eliminarMaestro(base, id);
    if (r && r.ok) cargar();
  };

  const filtrados = items.filter((m) => m.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return { filtrados, nombre, setNombre, editarId, editar, cancelar, guardar, eliminar, busqueda, setBusqueda, mensaje, error };
}