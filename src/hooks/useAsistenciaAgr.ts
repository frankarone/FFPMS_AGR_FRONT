import { useEffect, useState } from 'react';
import { listarNavesProceso, listarAreasProceso } from '../services/catalogoProcesoService';
import {
  obtenerAsistenciaDia, buscarPersonal, ubicacionHoy,
  marcarPresente as marcarPresenteApi, marcarInasistencia, guardarAreaAsistencia, editarAreaAsistencia,
  moverPersona, reemplazar, deshacerReemplazo, quitarInasistencia, activos, cupo,
} from '../services/asistenciaDiaService';
import type {
  NaveProceso, AreaProceso, AsistenciaNaveDia, ItemAsistencia, PersonaAsistencia, PersonaBase, UbicacionHoy,
} from '../types/asistencia';
import { fechaISO } from '../utils/fecha';

export type PasoModal = '' | 'opciones' | 'inasistencia' | 'cambiar' | 'mover';

const nombreDe = (p: PersonaBase) => `${p.apellidos} ${p.nombres}`;

export const textoUbicacion = (u: UbicacionHoy) =>
  `${u.nave} – ${u.area}${u.estado === 'PLANTILLA' ? ' (en plantilla)' : ''}`;

export function useAsistenciaAgr() {
  const fecha = fechaISO(); // siempre HOY
  const [naves, setNaves] = useState<NaveProceso[]>([]);
  const [areas, setAreas] = useState<AreaProceso[]>([]);
  const [naveId, setNaveId] = useState<number | null>(null);
  const [registro, setRegistro] = useState<AsistenciaNaveDia | null>(null);
  const [dni, setDni] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // --- cuadro (modal) ---
  const [paso, setPaso] = useState<PasoModal>('');
  const [itemModal, setItemModal] = useState<ItemAsistencia | null>(null);       // persona de la tarjeta (X)
  const [personaMover, setPersonaMover] = useState<PersonaBase | null>(null);    // persona a mover
  const [ubicacion, setUbicacion] = useState<UbicacionHoy | null>(null);         // dónde está hoy
  const [motivo, setMotivo] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<PersonaAsistencia[]>([]);
  const [elegido, setElegido] = useState<PersonaAsistencia | null>(null);
  const [esServis, setEsServis] = useState(false);
  const [destinoNaveId, setDestinoNaveId] = useState<number | null>(null);
  const [destinoAreaId, setDestinoAreaId] = useState<number | null>(null);
  const [destinoRegistro, setDestinoRegistro] = useState<AsistenciaNaveDia | null>(null);
  const [errorModal, setErrorModal] = useState('');

  useEffect(() => {
    listarNavesProceso().then(setNaves);
    listarAreasProceso().then(setAreas);
  }, []);

  // Al elegir nave: cargar (y sincronizar con la plantilla) la asistencia de hoy
  useEffect(() => {
    setMensaje('');
    setError('');
    if (naveId === null) {
      setRegistro(null);
      return;
    }
    obtenerAsistenciaDia(fecha, naveId).then(setRegistro);
  }, [naveId, fecha]);

  // Al elegir nave de destino (mover): cargar sus cupos
  useEffect(() => {
    if (destinoNaveId === null) {
      setDestinoRegistro(null);
      return;
    }
    obtenerAsistenciaDia(fecha, destinoNaveId).then(setDestinoRegistro);
  }, [destinoNaveId, fecha]);

  const recargar = async () => {
    if (naveId !== null) setRegistro(await obtenerAsistenciaDia(fecha, naveId));
  };

  const limpiarAvisos = () => { setMensaje(''); setError(''); };
  const areaBloqueada = (areaId: number) => registro?.areasGuardadas.includes(areaId) ?? false;
  const avisoBloqueada = (area: string) => setError(`El área ${area} está guardada. Pulsa EDITAR para modificarla.`);
  const nombreNave = (id: number | null) => naves.find((n) => n.id === id)?.nombre ?? '';
  const nombreArea = (id: number | null) => areas.find((a) => a.id === id)?.nombre ?? '';

  // ✓ verde
  const marcarPresente = async (item: ItemAsistencia) => {
    limpiarAvisos();
    if (!registro) return;
    if (areaBloqueada(item.areaId)) { avisoBloqueada(item.area); return; }
        if (item.reemplazadoPor !== null) { setError(`${nombreDe(item)} ya fue reemplazado hoy. Primero quita su inasistencia.`); return; }
    if (item.estado === 'AUSENTE' && activos(registro, item.areaId) >= cupo(registro, item.areaId)) {
      setError(`${item.area} ya está completa (${cupo(registro, item.areaId)}). Su lugar ya fue cubierto.`);
      return;
    }
  
    const err = await marcarPresenteApi(fecha, registro.naveId, item.personalId);
    if (err) { setError(err); return; }
    await recargar();
    setMensaje(`${nombreDe(item)}: PRESENTE`);
  };

  const reiniciarModal = () => {
    setMotivo('');
    setBusqueda('');
    setResultados([]);
    setElegido(null);
    setEsServis(false);
    setUbicacion(null);
    setPersonaMover(null);
    setDestinoNaveId(null);
    setDestinoAreaId(null);
    setErrorModal('');
  };

  const abrirMover = (persona: PersonaBase, donde: UbicacionHoy | null, item: ItemAsistencia | null) => {
    reiniciarModal();
    setItemModal(item);
    setPersonaMover(persona);
    setUbicacion(donde);
    setDestinoNaveId(naveId); // por defecto, la nave en la que se está pasando lista
    setPaso('mover');
  };

  // DNI escrito o escaneado + Enter
  const marcarPorDni = async () => {
    limpiarAvisos();
    if (!registro || naveId === null) { setError('Selecciona la nave de proceso'); return; }
    const valor = dni.trim();
    if (!valor) return;
    setDni('');

    // Está en esta nave → presente
    const item = registro.items.find((i) => i.dni === valor && i.reemplazadoPor === null);
    if (item) { await marcarPresente(item); return; }

    // No está en esta nave → ofrecer moverlo
    const p = (await buscarPersonal(valor)).find((x) => x.dni === valor);
    if (!p) { setError(`DNI ${valor} no registrado en Registro Personal`); return; }
    if (!p.activo) { setError(`${nombreDe(p)} está CESADO.`); return; }
    abrirMover(p, await ubicacionHoy(fecha, p.personalId), null);
  };

  // X roja
  const abrirModal = (item: ItemAsistencia) => {
    limpiarAvisos();
    if (areaBloqueada(item.areaId)) { avisoBloqueada(item.area); return; }
    reiniciarModal();
    setItemModal(item);
    setMotivo(item.motivo ?? '');
    setPaso('opciones');
  };

  const cerrarModal = () => {
    setPaso('');
    setItemModal(null);
    setPersonaMover(null);
  };

  const irA = (p: PasoModal) => { setErrorModal(''); setPaso(p); };

  const irMoverDesdeItem = () => {
    if (!itemModal || naveId === null) return;
    if (itemModal.reemplazadoPor !== null) { setErrorModal('Ya tiene reemplazo. Primero quita su inasistencia.'); return; }
    abrirMover(itemModal, {
      naveId, nave: nombreNave(naveId), areaId: itemModal.areaId, area: itemModal.area, estado: itemModal.estado,
    }, itemModal);
  };

  const confirmarInasistencia = async () => {
    if (!registro || !itemModal) return;
    if (!motivo) { setErrorModal('Elige el motivo de inasistencia'); return; }
    const err = await marcarInasistencia(fecha, registro.naveId, itemModal.personalId, motivo);
    if (err) { setErrorModal(err); return; }
    await recargar();
    setMensaje(`${nombreDe(itemModal)}: AUSENTE (${motivo})`);
    cerrarModal();
  };

  const buscarReemplazo = async () => {
    setErrorModal('');
    setElegido(null);
    setUbicacion(null);
    const r = (await buscarPersonal(busqueda)).filter((p) => p.personalId !== itemModal?.personalId);
    setResultados(r);
    if (r.length === 0) setErrorModal('No se encontró personal (mínimo 3 caracteres)');
  };

  const elegirReemplazo = async (p: PersonaAsistencia) => {
    setErrorModal('');
    if (!p.activo) {
      setElegido(null);
      setUbicacion(null);
      setErrorModal(`${nombreDe(p)} está CESADO. Elige a otra persona.`);
      return;
    }
    const donde = await ubicacionHoy(fecha, p.personalId);
    if (donde?.estado === 'AUSENTE') {
      setElegido(null);
      setUbicacion(null);
      setErrorModal(`${nombreDe(p)} está AUSENTE hoy (${donde.nave} – ${donde.area}).`);
      return;
    }
    setElegido(p);
    setUbicacion(donde);
  };

  const confirmarCambio = async () => {
    if (!registro || !itemModal || naveId === null) return;
    if (!elegido) { setErrorModal('Busca y elige a la persona que reemplaza'); return; }
    if (!motivo) { setErrorModal(`Elige el motivo de inasistencia de ${nombreDe(itemModal)}`); return; }
    if (ubicacion && !window.confirm(
      `${nombreDe(elegido)} está en ${textoUbicacion(ubicacion)}.\n\n¿Aceptar el cambio y moverlo a ${nombreNave(naveId)} – ${itemModal.area}?`,
    )) return;

    const err = await reemplazar(fecha, naveId, itemModal, elegido, motivo, esServis);
    if (err) { setErrorModal(err); return; }
    await recargar();
    setMensaje(`${nombreDe(elegido)}${esServis ? ' (SERVIS)' : ''} reemplaza a ${nombreDe(itemModal)}`);
    cerrarModal();
  };

  const confirmarMover = async () => {
    if (!personaMover || destinoNaveId === null) return;
    if (destinoAreaId === null) { setErrorModal('Elige el área de destino'); return; }
    const hacia = `${nombreNave(destinoNaveId)} – ${nombreArea(destinoAreaId)}`;
    const desde = ubicacion ? textoUbicacion(ubicacion) : 'sin asignar';
    if (!window.confirm(`¿Aceptar el cambio de ${nombreDe(personaMover)}?\n\nDe: ${desde}\nA: ${hacia}`)) return;

    const estado = itemModal ? itemModal.estado : 'PRESENTE'; // si se escaneó, está aquí → presente
    const err = await moverPersona(fecha, personaMover, destinoNaveId, destinoAreaId, estado);
    if (err) { setErrorModal(err); return; }
    await recargar();
    setMensaje(`${nombreDe(personaMover)} ahora está en ${hacia}`);
    cerrarModal();
  };

  const quitarReemplazo = async () => {
    if (!itemModal || naveId === null) return;
    const err = await deshacerReemplazo(fecha, naveId, itemModal);
    if (err) { setErrorModal(err); return; }
    await recargar();
    setMensaje(`Reemplazo de ${nombreDe(itemModal)} quitado`);
    cerrarModal();
  };

  const deshacerInasistencia = async () => {
    if (!itemModal || naveId === null) return;
    if (itemModal.reemplazadoPor !== null && !window.confirm(
      `${nombreDe(itemModal)} tiene un reemplazo.\n\nSi quitas la inasistencia, el reemplazo saldrá de la asistencia y de la plantilla. ¿Continuar?`,
    )) return;

    const err = await quitarInasistencia(fecha, naveId, itemModal);
    if (err) { setErrorModal(err); return; }
    await recargar();
    setMensaje(`${nombreDe(itemModal)} quedó sin marcar`);
    cerrarModal();
  };

  const guardarArea = async (areaId: number) => {
    limpiarAvisos();
    if (!registro) return;
    const pendientes = registro.items.filter((i) => i.areaId === areaId && i.estado === 'PENDIENTE').length;
    if (pendientes > 0) { setError(`Faltan marcar ${pendientes} persona(s) en esta área`); return; }
    const err = await guardarAreaAsistencia(fecha, registro.naveId, areaId);
    if (err) { setError(err); return; }
    await recargar();
    setMensaje('Asistencia del área guardada');
  };

  const editarArea = async (areaId: number) => {
    limpiarAvisos();
    if (!registro) return;
    const err = await editarAreaAsistencia(fecha, registro.naveId, areaId);
    if (err) { setError(err); return; }
    await recargar();
  };

  // Tarjetas por área; cada reemplazo aparece justo debajo de quien reemplaza
  const tarjetas = areas
    .map((a) => {
      const items = (registro?.items ?? []).filter((i) => i.areaId === a.id);
      const conReemplazos = (i: ItemAsistencia): ItemAsistencia[] =>
        [i, ...items.filter((r) => r.reemplazaA === i.personalId).flatMap(conReemplazos)];
      const ordenados = [
        ...items.filter((i) => !i.esReemplazo).sort((x, y) => nombreDe(x).localeCompare(nombreDe(y))).flatMap(conReemplazos),
        // reemplazos cuyo original ya no está en esta área
        ...items.filter((i) => i.esReemplazo && !items.some((o) => o.personalId === i.reemplazaA)),
      ];
      return {
        area: a,
        items: ordenados,
        presentes: items.filter((i) => i.estado === 'PRESENTE').length,
        activos: registro ? activos(registro, a.id) : 0,
        cupo: registro ? cupo(registro, a.id) : 0,
        guardada: registro?.areasGuardadas.includes(a.id) ?? false,
      };
    })
    .filter((t) => t.items.length > 0 || t.cupo > 0);

  // Áreas de la nave destino con su cupo y lugares libres
  const areasDestino = areas
    .map((a) => {
      const c = destinoRegistro ? cupo(destinoRegistro, a.id) : 0;
      return { id: a.id, nombre: a.nombre, cupo: c, libres: destinoRegistro ? c - activos(destinoRegistro, a.id) : 0 };
    })
    .filter((a) => a.cupo > 0);

  return {
    fecha, naves, naveId, setNaveId,
    dni, setDni, marcarPorDni, marcarPresente,
    tarjetas,
    presentesNave: tarjetas.reduce((s, t) => s + t.presentes, 0),
    puestosNave: tarjetas.reduce((s, t) => s + t.cupo, 0),
    guardarArea, editarArea,
    mensaje, error,
    // modal
    paso, irA, itemModal, personaMover, ubicacion, abrirModal, cerrarModal, irMoverDesdeItem,
    motivo, setMotivo, busqueda, setBusqueda, resultados, elegido, esServis, setEsServis,
    destinoNaveId, setDestinoNaveId, destinoAreaId, setDestinoAreaId, areasDestino,
    errorModal,
    buscarReemplazo, elegirReemplazo, confirmarInasistencia, confirmarCambio, confirmarMover, quitarReemplazo, deshacerInasistencia,
  };
}