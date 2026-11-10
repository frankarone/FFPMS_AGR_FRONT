import { useEffect, useState } from 'react';
import { listarNavesProceso, listarAreasProceso } from '../services/catalogoProcesoService';
import {
  buscarPersonalPorDni, obtenerPlantilla,
  guardarPlantilla, buscarAsignacion, quitarDePlantilla,
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

  // Al cambiar de nave, cargar su plantilla
  useEffect(() => {
    setMensaje('');
    setError('');
    if (naveId === null) {
      setPlantilla(null);
      return;
    }
    obtenerPlantilla(naveId).then(setPlantilla);
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

  const guardarYRecargar = async (p: PlantillaNave) => {
    await guardarPlantilla(p);
    setPlantilla(await obtenerPlantilla(p.naveId));
  };

  const agregar = async () => {
    setMensaje('');
    setError('');
    if (naveId === null) { setError('Selecciona la nave de proceso'); return; }

    const p = await buscarPersonalPorDni(dni);
    if (!p) { setError('DNI no registrado en Registro Personal'); return; }
    const nombre = nombreCompleto(p);
    if (!p.activo) { setError(`${nombre} está CESADO. No se puede agregar a la plantilla.`); return; }

    const area = areas.find((a) => a.id === areaId);
    if (!area) { setError('Selecciona el área'); return; }

    const actual = await obtenerPlantilla(naveId);
    if (actual.areasGuardadas.includes(area.id)) {
      setError(`El área ${area.nombre} está guardada. Pulsa EDITAR en su tarjeta para modificarla.`);
      return;
    }

    const naveNombre = naves.find((n) => n.id === naveId)?.nombre ?? '';
    const asignada = await buscarAsignacion(p.personalId);
    if (asignada) {
      if (asignada.naveId === naveId && asignada.areaId === area.id) {
        setError(`${nombre} ya está en ${naveNombre} – ${area.nombre}`);
        return;
      }
      const mover = window.confirm(
        `${nombre} ya está asignado en ${asignada.nave} – ${asignada.area}.\n\n¿Moverlo a ${naveNombre} – ${area.nombre}?`,
      );
      if (!mover) return;
      if (asignada.naveId !== naveId) await quitarDePlantilla(asignada.naveId, p.personalId);
    }

    const nuevo: ItemPlantilla = {
      personalId: p.personalId, dni: p.dni, nombres: p.nombres, apellidos: p.apellidos,
      areaId: area.id, area: area.nombre,
    };
    const base = await obtenerPlantilla(naveId);
    await guardarYRecargar({
      ...base,
      items: [...base.items.filter((i) => i.personalId !== p.personalId), nuevo],
    });
    setMensaje(asignada ? `${nombre} movido a ${naveNombre} – ${area.nombre}` : `${nombre} agregado a ${area.nombre}`);
    setDni(''); // listo para el siguiente DNI
  };

  const quitar = async (item: ItemPlantilla) => {
    if (!plantilla) return;
    if (!window.confirm(`¿Quitar a ${nombreCompleto(item)} de la plantilla?`)) return;
    await guardarYRecargar({ ...plantilla, items: plantilla.items.filter((i) => i.personalId !== item.personalId) });
    setMensaje(`${nombreCompleto(item)} quitado de la plantilla`);
  };

  const guardarArea = async (id: number) => {
    if (!plantilla) return;
    await guardarYRecargar({ ...plantilla, areasGuardadas: [...new Set([...plantilla.areasGuardadas, id])] });
    setMensaje('Área guardada');
  };

  const editarArea = async (id: number) => {
    if (!plantilla) return;
    await guardarYRecargar({ ...plantilla, areasGuardadas: plantilla.areasGuardadas.filter((a) => a !== id) });
    setMensaje('');
  };

  // Una tarjeta por cada área que tiene personal en esta nave
  const tarjetas = areas
    .map((a) => ({
      area: a,
      items: (plantilla?.items ?? [])
        .filter((i) => i.areaId === a.id)
        .sort((x, y) => nombreCompleto(x).localeCompare(nombreCompleto(y))),
      guardada: plantilla?.areasGuardadas.includes(a.id) ?? false,
    }))
    .filter((t) => t.items.length > 0);

  return {
    naves, areas, naveId, setNaveId,
    dni, setDni, persona, areaId, setAreaId,
    agregar, quitar, guardarArea, editarArea,
    tarjetas, totalNave: plantilla?.items.length ?? 0,
    fechaPlantilla: manana(), mensaje, error,
  };
}