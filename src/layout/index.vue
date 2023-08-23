<template>
    <a-config-provider :locale="locales[lang]">
        <a-layout class="app">
            <topHeader />
            <a-layout style="height: calc(100% - 48px)">
                <a-layout-sider class="sider" v-model:collapsed="isCollapse" :trigger="null" collapsible :collapsedWidth="48" :width="200">
                    <div class="logo">
                        <div class="block flex-wrap">
                            <img src="../assets/images/header-block-icon.png" />
                        </div>
                        <span class="logo-title" v-if="!isCollapse">{{ block_name }}</span>
                    </div>
                    <a-menu
                        v-model:selectedKeys="state.selectedKeys"
                        :open-keys="state.openKeys"
                        @openChange="openKeysChange"
                        mode="inline"
                        @click="handleClick"
                    >
                        <SubMenu :menuList="menuList" />
                    </a-menu>
                    <div class="collapsed-btn flex-wrap justify-center flex-center" @click="toggleSidebar">
                        <i class="arrow-down" :class="{ open: !isCollapse, close: isCollapse }"></i>
                    </div>
                </a-layout-sider>
                <a-layout-content class="content">
                    <Tabs />
                </a-layout-content>
            </a-layout>
        </a-layout>
        <div class="mix-loading" v-if="loading">
            <a-spin></a-spin>
        </div>
    </a-config-provider>
</template>

<script setup>
import { computed, reactive, watch, unref, ref, getCurrentInstance, onMounted } from 'vue'
import topHeader from './top-header/index.vue'
import Tabs from './tabs/index.vue'
import SubMenu from './left-menu/subMenu.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore } from '@/pinia/modules/menu.js'
import { useSystemStore } from '@/pinia/modules/system'
import { filterMenuData } from '@/router/utils'
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import useLang from '@/i18n/useLang'
import 'dayjs/locale/zh-cn'
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const { lang } = useLang()
const locales = reactive({
    cn: zhCN,
    en: enUS
})

const state = reactive({
    selectedKeys: [], // 当前选中的 MenuItem
    openKeys: [] // 当前展开的菜单
})
const menuList = computed(() => filterMenuData(usePermissionStore().menuList)) //菜单列表
const block_name = computed(() => usePermissionStore().block_name) //应用的名称
const loading = computed(() => useSystemStore().loading) //页面全局的loading状态
const isCollapse = computed(() => useSystemStore().sideBar.isCollapse) // 是否折叠菜单（左右）
// 点击左侧菜单 ->跳转路由
function handleClick({ key }) {
    // 获取点击的路由
    const clickRoute = router.getRoutes().find((item) => item.path === key)
    router.push(key)
}
const openKeysChange = (key) => {
    state.openKeys = key
}
//左右折叠菜单
function toggleSidebar() {
    useSystemStore().setCollapse(!isCollapse.value)
}
// 跟随页面路由变化, 切换菜单选中状态
// () => router.currentRoute.value,
// (curRoute) => {
//     if (curRoute.name === '404') {
//         state.openKeys = []
//         state.selectedKeys = []
//         return
//     }
//     let active_key = curRoute.query.active_key || sessionStorage.getItem('active_key')
//     sessionStorage.setItem('active_key', active_key)
//     //展开当前菜单 设置打开的菜单 && 避免收缩的时候弹出二级菜单
//     state.openKeys.push(Number(active_key.split('_')[0]))
//     //输入url 路径发生变化, 修改selectedKeys
//     if (Number(active_key)) {
//         active_key = Number(active_key)
//     }
//     state.selectedKeys = [active_key]
//     state.openKeys = Array.from(new Set(state.openKeys))
// }
</script>

<style lang="scss" scoped>
.app {
    height: 100%;
    width: 100%;
}
@import url('@/style/layout.scss');
</style>
