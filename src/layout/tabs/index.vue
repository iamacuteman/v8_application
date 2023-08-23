<template>
    <div class="tab-box">
        <a-tabs class="ant-tabs-self" v-model:activeKey="activeKey" type="editable-card" @tabClick="onTabClick" @edit="onEdit" hideAdd>
            <a-tab-pane v-for="tab in tabList" :key="tab.fullPath">
                <template #tab>
                    <a-dropdown :trigger="['contextmenu']">
                        <span style="display: inline-block">{{ tab.title }}</span>
                        <template #overlay>
                            <a-menu class="dropdown-menu">
                                <a-menu-item :key="1" @click="refresh">
                                    <reload-outlined />
                                    {{ $t('tags.refresh') }}
                                </a-menu-item>
                                <a-menu-item :key="2" @click="closeCurrentTab">
                                    <close-outlined />
                                    {{ $t('tags.close') }}
                                </a-menu-item>
                                <a-menu-divider />
                                <a-menu-item :key="3" @click="closeLeftTab(tab)">
                                    <vertical-right-outlined />
                                    {{ $t('tags.left') }}
                                </a-menu-item>
                                <a-menu-item :key="4" @click="closeRightTab(tab)">
                                    <vertical-left-outlined />
                                    {{ $t('tags.right') }}
                                </a-menu-item>
                                <a-menu-divider />
                                <a-menu-item :key="5" @click="closeOtherTab(tab)">
                                    <column-width-outlined />
                                    {{ $t('tags.other') }}
                                </a-menu-item>
                                <a-menu-item :key="6" @click="closeAllTab(tab)">
                                    <minus-outlined />
                                    {{ $t('tags.all') }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </a-tab-pane>
        </a-tabs>
        <a-tabs v-model:activeKey="activeKey22" class="ant-tabs-self2">
            <a-tab-pane :key="1">
                <div class="main">
                    <router-view v-slot="{ Component, route }">
                        <transition appear name="fade-transform" mode="out-in">
                            <keep-alive>
                                <component :is="Component" :key="route.fullPath" v-if="routerShow" />
                            </keep-alive>
                        </transition>
                    </router-view>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import { ref, computed, watch, unref, nextTick, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSystemStore } from '@/pinia/modules/system.js'

const route = useRoute()
const router = useRouter()
const systemStore = useSystemStore()
const { proxy } = getCurrentInstance

const activeKey = ref(route.fullPath)
const activeKey22 = ref(1)
const tabList = computed(() => systemStore.tabList)
const routerShow = ref(true)

// Tabs（白名单地址，不需要添加到 tabs 的路由地址）
const NAME_WHITE_LIST = ['403', '404', '500', 'login']
// 监听路由的变化
watch(
    () => router.currentRoute.value,
    async (curRoute) => {
        activeKey.value = curRoute.fullPath
        if (NAME_WHITE_LIST.includes(curRoute.name)) return
        // 添加Tab
        systemStore.addTab({
            title: curRoute.meta.title,
            fullPath: curRoute.fullPath,
            name: curRoute.name
        })
        // 添加keep-alive
        curRoute.meta.keepAlive !== false && systemStore.addKeepAliveName(curRoute.name)
        // 删除最后一个非 .ant-tabs-tab 元素, 否则 :last-child 选择器不生效
        await nextTick()
        const ele = document.querySelector('.tabs-box .ant-tabs-ink-bar')
        ele && ele.parentNode.removeChild(ele)
    },
    {
        immediate: true
    }
)

function onTabClick(fullPath) {
    router.push(fullPath)
}
// action = 'add' | 'remove'
const onEdit = (targetKey, action) => {
    // 关闭当前Tab
    action === 'remove' && removeTab(targetKey)
}
const removeTab = (fullPath) => {
    // 删除keepAlive
    const name = unref(tabList).find((item) => item.fullPath == fullPath)?.name || ''
    name && systemStore.removeKeepAliveName(name)

    if (unref(tabList).length === 1) {
        proxy.$message.info('无法关闭最后一个页面~')
        return
    }
    // 删除Tab
    const isCurrentTab = fullPath === route.fullPath
    systemStore.removeTab(fullPath, isCurrentTab)
}

// 刷新当前Tab
// 只刷新router-view的地方, 没有调用router.place, 因为不需要刷新整个页面
async function refresh() {
    routerShow.value = false
    await nextTick()
    routerShow.value = true
}
// 关闭当前Tab
const closeCurrentTab = () => {
    removeTab(route.fullPath)
}

const closeLeftTab = (tab) => {
    if (unref(tabList).length === 1) {
        message.info('左侧没有其它页面了~')
        return
    }

    const mouseRightIndex = systemStore.findIndex(tab.name)
    const curIndex = systemStore.findIndex(route.name)

    // 删除的Tab在当前Tab的右侧, 则默认跳转到当前鼠标右键的Tab
    if (tab.name !== route.name && mouseRightIndex > curIndex) {
        router.push(tab.fullPath)
    }

    systemStore.removeLeftTab(tab.fullPath)
    systemStore.removeLeftKeepAliveName(tab.name)
}
const closeRightTab = (tab) => {
    if (unref(tabList).length === 1) {
        message.info('右侧没有其它页面了~')
        return
    }

    const mouseRightIndex = systemStore.findIndex(tab.name)
    const curIndex = systemStore.findIndex(route.name)

    // 删除的Tab在当前Tab的左侧, 则默认跳转到当前鼠标右键的Tab
    if (tab.name !== route.name && mouseRightIndex < curIndex) {
        router.push(tab.fullPath)
    }

    systemStore.removeRightTab(tab.fullPath)
    systemStore.removeRightKeepAliveName(tab.name)
}

const closeOtherTab = (tab) => {
    if (unref(tabList).length === 1) {
        message.info('当前没有其它页面了~')
        return
    }

    systemStore.removeMultipleTab(tab ? tab.fullPath : route.fullPath)
    systemStore.setKeepAliveName(tab ? [tab.name] : [route.name])
}

const closeAllTab = (tab) => {
    systemStore.removeMultipleTab()
    systemStore.setKeepAliveName([])
    // Tabs组件会监听到路由的变化, 自动添加Tab
    router.push('/home')
}
</script>

<style lang="scss" scoped>
:deep(.ant-tabs-self) {
    height: auto;
}
.ant-tabs-self2 {
    height: calc(100% - 32px);
}
.ant-tabs-self2 :deep(.ant-tabs-nav-wrap) {
    height: 0;
    line-height: 0;
}
.ant-tabs-self2 :deep(.ant-tabs-nav-wrap) {
    height: 0;
    line-height: 0;
}
</style>
