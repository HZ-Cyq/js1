export default [
    {
      name: '泰森多边形',
      key: 'voronoi',
      component: () => import('@/components/modules/voronoi/Voronoi.vue'),
    },
    {
      name: 'primitive',
      key: 'primitive',
      component: () => import('@/components/modules/primitive/PrimitiveDemo.vue'),
    },
    {
      name: '泰森多边形2',
      key: 'voronoi2',
      component: () => import('@/components/modules/voronoi/Voronoi2.vue'),
    },
    {
      name: 'primitive2',
      key: 'primitive2',
      component: () => import('@/components/modules/primitive/PrimitiveDemo2.vue'),
    },
  ]
  