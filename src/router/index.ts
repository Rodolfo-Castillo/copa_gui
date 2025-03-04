import { createRouter, createWebHistory } from "vue-router";
import { validarToken } from '@/utils/utils'

const routes = <any>[
    {
        path: '/login',
        component: () => import('@/layout/AuthLayout.vue'),
        meta:{auth:false},
        children: [{
            path: '',
            name: 'Login',
            component: () => import('@/pages/Login.vue'),
            }
        ]
    },
    {
        path: '/',
        component: () => import('@/layout/quasar-classic.vue'),
        meta:{auth:true},
        children: [
            {
                path: '',
                name: 'Equipos',
                component: () => import('@/pages/Equipo/List.vue'),
            },
            {
                path: '/equipo/:idequipo?',
                name: 'EquipoAgregar',
                component: () => import('@/pages/Equipo/Add.vue'),
            },
            {
                path: '/grupos',
                name: 'Grupos',
                component: () => import('@/pages/Grupos/Grupos.vue'),
            },
            {
                path: '/partidos',
                name: 'Partidos',
                component: () => import('@/pages/Partidos/Partidos.vue'),
            },
            {
                path: '/partidosfinales',
                name: 'PartidosFinales',
                component: () => import('@/pages/Partidos/PartidosFinales.vue'),
            },
            {
                path: '/resultados',
                name: 'Resultados',
                component: () => import('@/pages/Resultados/Resultados.vue'),
            },
            {
                path: '/resultado/:id',
                name: 'Resultado',
                component: () => import('@/pages/Resultados/Resultado.vue'),
            },
            {
                path: '/resultadoliguilla/:id',
                name: 'Resultado Liguilla',
                component: () => import('@/pages/Resultados/ResultadoLiguilla.vue'),
            },
            {
                path: '/estadisticas/grupo',
                name: 'EstadisticaGrupo',
                component: () => import('@/pages/Estadisticas/Grupos.vue'),
            },
            {
                path: '/estadisticas/jugador',
                name: 'EstadisticaJugador',
                component: () => import('@/pages/Estadisticas/Jugador.vue'),
            },
            {
                path: '/finales',
                name: 'Brackets',
                component: () => import('@/pages/Finales/Brackets.vue'),
            },
            {
                path: '/expulsiones',
                name: 'Expulsiones',
                component: () => import('@/pages/Expulsiones/Expulsiones.vue'),
            },
            {
                path: '/bitacora',
                name: 'Bitacora',
                component: () => import('@/pages/Bitacora/Bitacora.vue'),
            },
            {
                path: '/copa',
                name: 'Copa',
                component: () => import('@/pages/Copa/Copa.vue'),
            },
            {
                path: '/permisos',
                name: 'Permisos',
                component: () => import('@/pages/Config/Permisos.vue'),
            }
        ]
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('@/pages/404/NotFound.vue'),
        children: []
    },
    {
        path: '/:catchAll(.*)', // Captura cualquier ruta no definida
        component: () => import('@/pages/404/NotFound.vue'),
        children: []
    },
    {
        path: '/resultadosTorneo',
        component: () => import('@/pages/Publico/Publico.vue'),
        meta: {auth:false}
    }
];

const base_url = import.meta.env.VITE_BASE_URL || "";

const router = createRouter({
    history: createWebHistory(base_url),
    routes,
});

router.beforeEach(async (to: any, _from: any, next: any) => {
    if (to.meta.auth) {
        if (await validarToken()) {
            next();
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("permisos");
            next("/login");
        }
    }
    else {
        next();
    }
});

export default router;
