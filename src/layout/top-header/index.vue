<template>
    <div class="top-container">
        <div class="left">
            <div class="logo-wrap">
                <img :src="getImage(platform_logo, defaultLogoimg)" />
            </div>
            <div class="title-wrap" :title="platform_title">
                {{ platform_title.length > 32 ? platform_title.slice(0, 32) + '...' : platform_title }}
            </div>
        </div>
        <div class="right" @mouseleave="showFactorySelect = false">
            <div>
                <div class="current-factory" @click="showFactorySelect = true" v-show="showFactoryConfig">
                    <div class="label">{{ factoryMapping[currentFactory] }}</div>
                    <i class="arrow-down"></i>
                </div>
                <transition name="hide">
                    <div class="select-wrap" ref="showFactory" v-show="showFactorySelect">
                        <a-input-search placeholder="请输入工厂名称搜索"></a-input-search>
                        <div class="option-wrap">
                            <div
                                class="option-item"
                                :class="{ checked: currentFactory === item.uid }"
                                @click="changeFactory(item)"
                                v-for="(item, index) in factoryList"
                                :key="index"
                            >
                                {{ item.label }}
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <div class="user-wrap" @mousemove="showMenu = true" @mouseleave="showMenu = false">
                <img class="user-icon" :src="getUserHeaderImg()" />
                <div class="user-name flex-column">
                    <div class="flex-wrap flex-center">
                        <span>{{ user.username || 'admin' }}</span>
                        <caret-down-outlined style="font-size: 8px; margin-top: 2px" />
                    </div>
                </div>
                <div class="menu-wrap" v-show="showMenu">
                    <div class="menu-item" @click="userVisible = true">{{ $t('user_info') }}</div>
                    <div class="menu-item" @click="versionVisible = true">{{ $t('version_info') }}</div>
                </div>
            </div>
        </div>
        <a-drawer
            :title="$t('version_info')"
            placement="right"
            width="500px"
            :closable="false"
            :visible="versionVisible"
            @close="versionVisible = false"
        >
            <div class="version">
                <span>当前版本：</span>
                <span>{{ version }}</span>
            </div>
            <div class="warn-text">
                <i></i
                >本计算机程序受版权法及国际公约的保护，未经授权擅自复制或散布本程序的部分或全部，将承受严厉的民事和刑事处罚，对已知的违反者将给予法律范围内的全面制裁。
            </div>
        </a-drawer>
        <a-drawer
            :title="$t('user_info')"
            placement="right"
            width="500px"
            :closable="false"
            :visible="userVisible"
            @close="userVisible = false"
        >
            <div class="info-wrap">
                <div class="item">
                    <span class="name">账户头像 ：</span>
                    <span class="value">
                        <img :src="getUserHeaderImg()" />
                    </span>
                </div>
                <div class="item">
                    <span class="name">登录账号 ：</span>
                    <span class="value">{{ user.username }}</span>
                </div>
                <div class="item">
                    <span class="name">手机号码 ：</span>
                    <span class="value">{{ user.mobile }}</span>
                </div>
                <div class="item">
                    <span class="name">登录角色 ：</span>
                    <span class="value">{{ rolesName() }}</span>
                </div>
                <div class="item time">
                    <span class="name">邮箱 ：</span>
                    <span class="value">{{ user.email }}</span>
                </div>
                <div class="item time">
                    <span class="name">注册时间 ：</span>
                    <span class="value">{{ user.created_at }}</span>
                </div>
                <div class="item time">
                    <span class="name">描述：</span>
                    <span class="value">{{ user.description }}</span>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script setup>
defineOptions({
    name: 'topHeader'
})
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import defaultLogoimg from '@/assets/images/mixlinker.png'
import maleDefaultImg from '@/assets/images/male.svg'
import femaleDefaultImg from '@/assets/images/female.svg'
import defaultFavicon from '@/assets/images/website.png'
import BaseApi from '@/services/request/BaseApi.js'
import util from '@/utils/util.js'
const { proxy } = getCurrentInstance()
const platform_logo = ref('')
const platform_title = ref('Mixlinker')
const showFactory = ref(false)
const showFactoryConfig = ref(false)
const showFactorySelect = ref(false)
const showMenu = ref(false)
const versionVisible = ref(false)
const userVisible = ref(false)
const currentFactory = ref('all')
const factoryMapping = reactive({
    all: '全部工厂'
})
const router = new useRouter()
let user = reactive({})

const getImage = (url, defaultImg) => {
    if (!url || url === '-') {
        return defaultImg
    }
    if (url.indexOf('http:') > -1) {
        return url
    } else {
        //默认本地图片没有mixapplication
        return url.indexOf('mixservice/storage') === -1 ? defaultLogoimg : location.origin + url
    }
}

const getUserHeaderImg = () => {
    let defaultImg = user.gender == 1 ? maleDefaultImg : femaleDefaultImg
    let url = user.head_image ?? ''
    if (!url || url === '-') {
        return defaultImg
    }
    if (url.indexOf('http:') > -1) {
        return url
    } else {
        let file_url = url.indexOf('mixservice/storage') === -1 ? proxy.config.file_url : ''
        return location.origin + file_url + url
    }
}

const getPlatformLogo = () => {
    let data = {
        key: 'fidis_config',
        type: 'company'
    }

    proxy.api.post('get_public_config', data).then((res) => {
        if (res.code === 200) {
            let result = JSON.parse(res.result)
            platform_title.value = result.platform || 'MixIOT工业互联网平台'
            platform_logo.value = result.login_img
            if (result.website_logo) {
                let $favicon = document.querySelector('link[rel="icon"]')
                $favicon.href = result.website_logo.includes('mixservice/storag') ? result.website_logo : defaultFavicon
                console.log($favicon.href)
            }
        }
    })
}

const rolesName = () => {
    let roles = user.roles || []
    return roles.map((role) => role.role_name).join(',')
}

//设备管理应用时生效
let factoryList = ref([])
const getFactoryList = () => {
    factoryList.value = []
    proxy.api.post('device_factory_list').then((res) => {
        res.result.data.forEach((ele) => {
            let label = ele.serial_num ? `${ele.name}(${ele.serial_num})` : ele.name
            factoryMapping.value[ele.uid] = label
            factoryList.value.push({
                uid: ele.uid,
                label: label
            })
        })
        factoryList.value.unshift({
            uid: 'all',
            label: '全部工厂'
        })
    })
}

//获取当前版本
const version = ref('V0.0.0')
const getVersion = () => {
    BaseApi.get('./Version.ini').then((result) => {
        version.value = util.parseVersion(result)
    })
}

onMounted(() => {
    user = JSON.parse(localStorage.getItem('user')) || {}
    //获取最新版本
    // getVersion()
    //设备管理应用显示工厂筛选，加载获取工厂列表
    if (router.currentRoute.value.path.indexOf('/deviceManager') > -1) {
        getFactoryList()
    }
    // getPlatformLogo()
})
</script>
<style lang="scss" scoped>
@import '../../style/layout/top-header.scss';
</style>
