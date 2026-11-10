import { useEffect, useState } from 'react';
import { listarNavesProceso, listarAreasProceso } from '../services/catalogoProcesoService';
import {
  buscarPersonalPorDni, obtenerPlantilla, buscarAsignacion,
  asignar, quitarDePlantilla, guardarAreaPlantilla, editarAreaPlantilla,guardarEstimado,
} from '../services/plantillaService';
import type { NaveProceso, AreaProceso, PersonaAsistencia, PlantillaNave, ItemPlantilla } from '../types/asistencia';
import { fechaISO } from '../utils/fecha';

function manana(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return fechaISO(d);
}

function nombreCompleto(p: { apellidos: string; nombres: string }) {
  return `${p.apellidos} ${p.nombres}`;
}

export function usePlantilla() {
  const [naves, setNaves] = useState<NaveProceso[]>([]);
  const [areas, setAreas] = useState<AreaProceso[]>([]);
  const [naveId, setNaveId] = useState<number | null>(null);
  const [plantilla, setPlantilla] = useState<PlantillaNave | null>(null);
  const [dni, setDni] = useState('');
  const [persona, setPersona] = useState<PersonaAsistencia | null>(null);
  const [areaId, setAreaId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listarNavesProceso().then(setNaves);
    listarAreasProceso().then(setAreas);
  }, []);

  const recargar = async (id: number) => setPlantilla(await obtenerPlantilla(id));

  // Al cambiar de nave, cargar su plantilla desde la base de datos
  useEffect(() => {
    setMensaje('');
    setError('');
    if (naveId === null) {
      setPlantilla(null);
      return;
    }
    recargar(naveId);
  }, [naveId]);

  // Buscar a la persona apenas el DNI tenga 8 caracteres o más
  useEffect(() => {
    const valor = dni.trim();
    if (valor.length < 8) {
      setPersona(null);
      return;
    }
    buscarPersonalPorDni(valor).then(setPersona);
  }, [dni]);

  const agregar = async () => {
    setMensaje('');
    setError('');
    if (naveId === null || !plantilla) { setError('Selecciona la nave de proceso'); return; }

    const p = await buscarPersonalPorDni(dni);
    if (!p) { setError('DNI no registrado en Registro Personal'); return; }
    const nombre = nombreCompleto(p);
    if (!p.activo) { setError(`${nombre} está CESADO. No se puede agregar a la plantilla.`); return; }

    const area = areas.find((a) => a.id === areaId);
    if (!area) { setError('Selecciona el área'); return; }
    if (plantilla.areasGuardadas.includes(area.id)) {
      setError(`El área ${area.nombre} está guardada. Pulsa EDITAR en su tarjeta para modificarla.`);
      return;
    }

    const naveNombre = naves.find((n) => n.id === naveId)?.nombre ?? '';
    
    // TOTAL ESTIMADO: obligatorio; se pide al agregar a la primera persona del área
    let estimado: number | undefined = plantilla.estimados[area.id];
    if (estimado === undefined) {
      const txt = window.prompt(`TOTAL ESTIMADO para ${area.nombre} en ${naveNombre}\n(máximo de personas en esta área):`);
      if (txt === null) return;
      const n = Number(txt);
      if (!Number.isInteger(n) || n <= 0) { setError('El TOTAL ESTIMADO debe ser un número entero mayor a 0'); return; }
      const re = await guardarEstimado(naveId, area.id, n);
      if (!re?.ok) { setError(re?.mensaje ?? 'No se pudo guardar el total estimado'); return; }
      await recargar(naveId);
      estimado = n;
    }

    const enArea = plantilla.items.filter((i) => i.areaId === area.id && i.personalId !== p.personalId).length;
    if (enArea >= estimado) {
      setError(`${area.nombre} llegó a su TOTAL ESTIMADO (${estimado}). Auméntalo en su tarjeta si necesitas más.`);
      return;
    }

    const asignada = await buscarAsignacion(p.personalId);
    if (asignada) {
      if (asignada.naveId === naveId && asignada.areaId === area.id) {
        setError(`${nombre} ya está en ${naveNombre} – ${area.nombre}`);
        return;
      }
      if (!window.confirm(
        `${nombre} ya está asignado en ${asignada.nave} – ${asignada.area}.\n\n¿Moverlo a ${naveNombre} – ${area.nombre}?`,
      )) return;
    }

    const r = await asignar(naveId, p.personalId, area.id); // el backend mueve si ya estaba en otra
    if (!r?.ok) { setError(r?.mensaje ?? 'No se pudo asignar'); return; }
    await recargar(naveId);
    setMensaje(asignada ? `${nombre} movido a ${naveNombre} – ${area.nombre}` : `${nombre} agregado a ${area.nombre}`);
    setDni(''); // listo para el siguiente DNI
  };

  const quitar = async (item: ItemPlantilla) => {
    if (naveId === null) return;
    if (!window.confirm(`¿Quitar a ${nombreCompleto(item)} de la plantilla?`)) return;
    setMensaje('');
    setError('');
    const r = await quitarDePlantilla(naveId, item.personalId);
    if (!r?.ok) { setError(r?.mensaje ?? 'No se pudo quitar'); return; }
    await recargar(naveId);
    setMensaje(`${nombreCompleto(item)} quitado de la plantilla`);
  };

  const guardarArea = async (id: number) => {
    if (naveId === null) return;
    setMensaje('');
    setError('');
    const r = await guardarAreaPlantilla(naveId, id);
    if (!r?.ok) { setError(r?.mensaje ?? 'No se pudo guardar el área'); return; }
    await recargar(naveId);
    setMensaje('Área guardada');
  };

  const editarArea = async (id: number) => {
    if (naveId === null) return;
    setMensaje('');
    setError('');
    const r = await editarAreaPlantilla(naveId, id);
    if (!r?.ok) { setError(r?.mensaje ?? 'No se pudo abrir el área'); return; }
    await recargar(naveId);
  };

  // Cambiar el TOTAL ESTIMADO desde la tarjeta. Devuelve false si no se pudo (la tarjeta vuelve al valor anterior)
  const cambiarEstimado = async (id: number, total: number): Promise<boolean> => {
    if (naveId === null) return false;
    setMensaje('');
    setError('');
    if (!Number.isInteger(total) || total <= 0) { setError('El TOTAL ESTIMADO debe ser un número entero mayor a 0'); return false; }
    const r = await guardarEstimado(naveId, id, total);
    if (!r?.ok) { setError(r?.mensaje ?? 'No se pudo guardar el total estimado'); return false; }
    await recargar(naveId);
    setMensaje('Total estimado guardado');
    return true;
  };

  // Una tarjeta por cada área que tiene personal en esta nave
  const tarjetas = areas
    .map((a) => ({
      area: a,
      items: (plantilla?.items ?? [])
        .filter((i) => i.areaId === a.id)
        .sort((x, y) => nombreCompleto(x).localeCompare(nombreCompleto(y))),
      guardada: plantilla?.areasGuardadas.includes(a.id) ?? false,
      estimado: plantilla?.estimados[a.id] ?? null,
    }))
    .filter((t) => t.items.length > 0);

  return {
    naves, areas, naveId, setNaveId,
    dni, setDni, persona, areaId, setAreaId,
    agregar, quitar, guardarArea, editarArea, cambiarEstimado,
    tarjetas, totalNave: plantilla?.items.length ?? 0,
    fechaPlantilla: manana(), mensaje, error,
  };
}