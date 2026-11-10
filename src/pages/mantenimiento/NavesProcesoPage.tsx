import MaestroAbm from '../../components/mantenimiento/MaestroAbm';

function NavesProcesoPage() { 
    return <MaestroAbm 
        titulo="NAVES DE PROCESO" base="/api/naves-proceso" etiqueta="nave" 
        />; 
}

export default NavesProcesoPage;