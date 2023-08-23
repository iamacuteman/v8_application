<template>
    <template v-for="subItem in menuList" :key="subItem.path">
        <a-menu-item v-if="!subItem.children || !subItem.children.length" :key="subItem.path" :title="subItem.meta.title">
            <template #icon v-if="!child">
                <component :is="subItem.meta.icon || 'appstore-outlined'" />
            </template>
            <span :style="{ 'font-weight': child ? 500 : 600 }">{{ subItem.meta.title }}</span>
        </a-menu-item>
        <a-sub-menu v-else>
            <template #icon>
                <component :is="subItem.meta.icon || 'appstore-outlined'" />
            </template>
            <template #title>{{ subItem.meta.title }}</template>
            <SubMenu :menuList="subItem.children" :child="true" />
        </a-sub-menu>
    </template>
</template>

<script setup>
import SubMenu from './subMenu.vue'

defineProps({
    menuList: {
        type: Array,
        default: () => []
    },
    child: {
        //用来判断当前菜单是一级还是二级菜单
        type: Boolean,
        default: false
    }
})
</script>

<style lang="scss">
.ant-menu .ant-menu-submenu-title {
    display: flex !important;
    align-items: center;
}
.ant-menu .ant-menu-item {
    margin-bottom: 0 !important;
}
</style>
