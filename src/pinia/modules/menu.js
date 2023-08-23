import { defineStore } from 'pinia'
import {basicRouter} from '@/router/modules/basic.js'
export const usePermissionStore = defineStore({
    id: 'permission',
    state: () => ({
        menuList: [...basicRouter], // 菜单权限
        curRouteName: '', // 当前页面的 route name, 用来做按钮权限筛选
        activeKey: "",//当前菜单的key，由menu_id和menu_view_id组成
        block_name: "",//当前应用名称以应用中心设置的名称为准
    }),
    getters: {
        breadcrumbListGet: state => {
            const getBreadcrumbList = (key, menuList) => {
                let matchRouteList = []
                try {
                    const getNodePath = node => {
                        matchRouteList.push(node)
                        // 找到该路径, 结束循环
                        if (path.includes(node.key)) throw new Error('Find IT!')
                        if (node.children?.length) node.children.forEach(item => getNodePath(item))
                        // 没有找到该路径, 删除路由对象
                        matchRouteList.pop()
                    }
                    menuList.forEach(item => getNodePath(item))
                } catch (e) {
                    return matchRouteList
                }
            }
            return path => getBreadcrumbList(path, state.menuList)
        }
    },
    actions: {
        setRouteName(name) {
            this.curRouteName = name
        },
        setMenuList(value) {
            this.menuList = value
        },
        setActiveKey(value) {
            this.activeKey = value
        },
        setBlockName(value) {
            this.block_name = value
        },
    }
})