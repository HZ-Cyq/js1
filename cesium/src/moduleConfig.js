export default [
    {
      name: '泰森多边形',
      key: 'voronoi',
      component: () => import('@/components/modules/Voronoi.vue'),
    },
    {
      name: 'primitive',
      key: 'primitive',
      component: () => import('@/components/modules/PrimitiveDemo.vue'),
    },
    {
      name: '泰森多边形2',
      key: 'voronoi2',
      component: () => import('@/components/modules/Voronoi2.vue'),
    },
    {
      name: 'primitive2',
      key: 'primitive2',
      component: () => import('@/components/modules/PrimitiveDemo2.vue'),
    },
  ]
  