
export const basicRouter = [
    {
        path: '/menu',
        name: 'menu',
        redirect: '/menu/menu1',
        meta: {
            icon: 'MenuOutlined',
            title: '多级菜单',
            rank: 3
        },
        children: [
            {
                path: '/menu/menu1',
                name: 'menu1',
                component: () => import('@/views//menu/menu1/index.vue'),
                meta: {
                    title: '菜单1'
                }
            },
            {
                path: '/menu/menu2',
                name: 'menu2',
                redirect: '/menu/menu2/menu21',
                meta: {
                    title: '菜单2'
                },
                children: [
                    {
                        path: '/menu/menu2/menu21',
                        name: 'menu21',
                        component: () => import('@/views//menu/menu2/menu21/index.vue'),
                        meta: {
                            title: '菜单2-1'
                        }
                    },
                    {
                        path: '/menu/menu2/menu23',
                        name: 'menu23',
                        component: () => import('@/views//menu/menu2/menu23/index.vue'),
                        meta: {
                            title: '菜单2-3'
                        }
                    }
                ]
            },
            {
                path: '/menu/menu3',
                name: 'menu3',
                component: () => import('@/views//menu/menu3/index.vue'),
                meta: {
                    title: '菜单3'
                }
            }
        ]
    }
]
