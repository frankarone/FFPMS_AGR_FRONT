import MaestroAbm from '../../components/mantenimiento/MaestroAbm';

function AreasProcesoPage() { 
    return  <MaestroAbm 
        titulo="ÁREAS DE PROCESO" base="/api/areas-proceso" etiqueta="área" 
        />; 
}

export default AreasProcesoPage;