import { useEffect, useState } from 'react';
import {
  listarCargos, listarAreas, listarTiposPersonal, listarNacionalidades, listarGradosInstruccion,listarBancos
} from '../services/maestroService';
import {
  crearPersonal, listarPersonal, actualizarPersonal, eliminarPersonal,
  cesarPersonal, reingresarPersonal, historialPersonal,
  listarDocumentos, subirDocumento, verDocumento, eliminarDocumento
} from '../services/personalService';
import type { Maestro, PersonalInput, PersonalListado, PersonalPeriodo, PersonalDocumento } from '../types/personal';

const FORM_INICIAL: PersonalInput = {
  dni: '', nombres: '', apellidos: '', sexo: 'Masculino', estadoCivil: 'Soltero',
  hijos: false, cv: false, copiaDni: false, recibo: false, antecedentePolicial: false,
  cargoId: null, areaId: null, tipoPersonalId: null, nacionalidadId: null, gradoInstruccionId: null,
  correoElectronico: '', celular: '', domicilio: '', observacion: '',
  fechaNacimiento: '', fechaIngreso: '', fechaCese: '', activo: true,
  sueldo: null, tieneSeguro: false, sistemaPension: '',
  bancoId: null, nroCuenta: '',
};

function hoyStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fechaDe(p: PersonalListado, campo: string): string {
  if (campo === 'fechaIngreso') return p.fechaIngreso ?? '';
  if (campo === 'fechaCese') return p.fechaCese ?? '';
  if (campo === 'fechaRegistro') {
    if (!p.fechaRegistro) return '';
    const d = new Date(p.fechaRegistro);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return '';
}

export function useRegistroPersonal() {
  const [form, setForm] = useState<PersonalInput>(FORM_INICIAL);
  const [cargos, setCargos] = useState<Maestro[]>([]);
  const [areas, setAreas] = useState<Maestro[]>([]);
  const [tipos, setTipos] = useState<Maestro[]>([]);
  const [nacionalidades, setNacionalidades] = useState<Maestro[]>([]);
  const [grados, setGrados] = useState<Maestro[]>([]);
  const [personal, setPersonal] = useState<PersonalListado[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [campoFecha, setCampoFecha] = useState('');
  const [fDesde, setFDesde] = useState('');
  const [fHasta, setFHasta] = useState('');
  const [editarId, setEditarId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [bancos, setBancos] = useState<Maestro[]>([]);
  // modal cesar/reingresar/historial
  const [modalModo, setModalModo] = useState('');
  const [modalPersona, setModalPersona] = useState<PersonalListado | null>(null);
  const [modalFecha, setModalFecha] = useState('');
  const [modalMotivo, setModalMotivo] = useState('');
  const [historial, setHistorial] = useState<PersonalPeriodo[]>([]);
  const [documentos, setDocumentos] = useState<PersonalDocumento[]>([]);

  const cargarLista = () => {
    listarPersonal().then((d) => { if (Array.isArray(d)) setPersonal(d); });
  };

  useEffect(() => {
    listarCargos().then((d) => { if (Array.isArray(d)) setCargos(d); });
    listarAreas().then((d) => { if (Array.isArray(d)) setAreas(d); });
    listarTiposPersonal().then((d) => { if (Array.isArray(d)) setTipos(d); });
    listarNacionalidades().then((d) => { if (Array.isArray(d)) setNacionalidades(d); });
    listarGradosInstruccion().then((d) => { if (Array.isArray(d)) setGrados(d); });
    listarBancos().then((d) => { if (Array.isArray(d)) setBancos(d); });
    cargarLista();
  }, []);

  const setCampo = <K extends keyof PersonalInput>(campo: K, valor: PersonalInput[K]) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  };

  const asignacionFamiliar = form.hijos ? 'DERECHO A.F.' : 'SIN DERECHO';

  const filtradas = personal.filter((p) => {
    const t = busqueda.toLowerCase();
    const okTexto =
      p.dni.toLowerCase().includes(t) ||
      p.nombres.toLowerCase().includes(t) ||
      p.apellidos.toLowerCase().includes(t) ||
      (p.area || '').toLowerCase().includes(t) ||
      (p.cargo || '').toLowerCase().includes(t);
    const okTipo = !filtroTipo || p.tipoPersonalId === Number(filtroTipo);
    let okFecha = true;
    if (campoFecha && (fDesde || fHasta)) {
      const f = fechaDe(p, campoFecha);
      if (!f) okFecha = false;
      else {
        if (fDesde && f < fDesde) okFecha = false;
        if (fHasta && f > fHasta) okFecha = false;
      }
    }
    return okTexto && okTipo && okFecha;
  });

  const editar = (p: PersonalListado) => {
    setEditarId(p.id);
    setForm({
      dni: p.dni, nombres: p.nombres, apellidos: p.apellidos,
      sexo: p.sexo, estadoCivil: p.estadoCivil, hijos: p.hijos,
      cv: p.cv, copiaDni: p.copiaDni, recibo: p.recibo, antecedentePolicial: p.antecedentePolicial,
      cargoId: p.cargoId, areaId: p.areaId, tipoPersonalId: p.tipoPersonalId,
      nacionalidadId: p.nacionalidadId, gradoInstruccionId: p.gradoInstruccionId,
      correoElectronico: p.correoElectronico ?? '', celular: p.celular ?? '', domicilio: p.domicilio ?? '', observacion: p.observacion ?? '',
      fechaNacimiento: p.fechaNacimiento ?? '', fechaIngreso: p.fechaIngreso ?? '', fechaCese: p.fechaCese ?? '',
      activo: p.activo ?? true,
      sueldo: p.sueldo ?? null,
      tieneSeguro: p.tieneSeguro ?? false,
      sistemaPension: p.sistemaPension ?? '',
      bancoId: p.bancoId ?? null,
      nroCuenta: p.nroCuenta ?? '',
    });
    setMensaje(''); setError('');
    cargarDocumentos(p.id);   
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setEditarId(null); setForm(FORM_INICIAL); setMensaje(''); setError('');
    setDocumentos([]);
  };

  const guardar = async () => {
    setMensaje(''); setError('');
    if (!form.dni.trim() || !form.nombres.trim() || !form.apellidos.trim()) {
      setError('DNI, Nombres y Apellidos son obligatorios'); return;
    }
    if (!form.cargoId || !form.areaId) {
      setError('Cargo y Área son obligatorios'); return;
    }
    setGuardando(true);
    try {
      const r = editarId ? await actualizarPersonal(editarId, form) : await crearPersonal(form);
      if (r && r.ok) {
        setMensaje(editarId ? 'Personal actualizado' : 'Personal registrado');
        setForm(FORM_INICIAL); setEditarId(null); setDocumentos([]); cargarLista();
      } else {
        setError(r?.mensaje || 'No se pudo guardar');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este registro? No se puede deshacer.')) return;
    const r = await eliminarPersonal(id);
    if (r && r.ok) { setMensaje('Personal eliminado'); cargarLista(); }
    else setError('No se pudo eliminar');
  };

  // ----- Modal cesar / reingresar / historial -----
  const abrirModal = (modo: string, p: PersonalListado) => {
    setModalModo(modo);
    setModalPersona(p);
    setModalFecha(hoyStr());
    setModalMotivo('');
    setHistorial([]);
    if (modo === 'historial') {
      historialPersonal(p.id).then((d) => { if (Array.isArray(d)) setHistorial(d); });
    }
  };

  const cerrarModal = () => {
    setModalModo(''); setModalPersona(null); setHistorial([]);
  };

  const confirmarAccion = async () => {
    if (!modalPersona) return;
    const id = modalPersona.id;
    let r;
    if (modalModo === 'cesar') {
      r = await cesarPersonal(id, { fechaCese: modalFecha, motivoCese: modalMotivo });
    } else if (modalModo === 'reingresar') {
      r = await reingresarPersonal(id, { fechaIngreso: modalFecha });
    } else return;
    if (r && r.ok) {
      setMensaje(modalModo === 'cesar' ? 'Personal cesado' : 'Personal reingresado');
      cerrarModal(); cargarLista();
    } else {
      setError(r?.mensaje || 'No se pudo completar la acción');
    }
  };

  const cargarDocumentos = (id: number) => {
    listarDocumentos(id).then((d) => { if (Array.isArray(d)) setDocumentos(d); });
  };
  const subirDoc = async (tipo: string, archivo: File) => {
    if (!editarId) return;
    const r = await subirDocumento(editarId, tipo, archivo);
    if (r && r.ok) cargarDocumentos(editarId);
    else setError(r?.mensaje || 'No se pudo subir el documento');
  };
  const verDoc = (docId: number) => { verDocumento(docId); };
  const eliminarDoc = async (docId: number) => {
    if (!editarId) return;
    if (!window.confirm('¿Eliminar este documento?')) return;
    const r = await eliminarDocumento(editarId ? docId : docId);
    if (r && r.ok) cargarDocumentos(editarId);
  };

  return {
    form, setCampo, asignacionFamiliar,
    cargos, areas, tipos, nacionalidades, grados,bancos,
    filtradas, busqueda, setBusqueda,
    filtroTipo, setFiltroTipo,
    campoFecha, setCampoFecha, fDesde, setFDesde, fHasta, setFHasta,
    editarId, editar, cancelarEdicion, eliminar,
    mensaje, error, guardando, guardar,
    //documentos
    documentos, subirDoc, verDoc, eliminarDoc,
    // modal
    modalModo, modalPersona, modalFecha, setModalFecha, modalMotivo, setModalMotivo, historial,
    abrirModal, cerrarModal, confirmarAccion,
  };
}