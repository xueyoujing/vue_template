import './public-path'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './router'
import store from './store'
import './icons'
import SvgIcon from './components/SvgIcon'// svg组件
import toggleTheme from "@zougt/theme-css-extract-webpack-plugin/dist/toggleTheme"

function GetToken () {
    let strUrl = window.location.href;
    let token = null;
    let index = strUrl.indexOf('token=');
    if (index > 0) {
        token = strUrl.substr(index + 6).split('&')[0]
    }
    return token
}

let router = null;
let instance = null;
let history = null;
function render(props = {}) {
    const { container, onGlobalStateChange, setGlobalState } = props;
    if (onGlobalStateChange){
        onGlobalStateChange((state) => {
            store.commit("user/SetTheme", state.theme);
            store.commit("user/SetToken", state.cds_token);
            store.commit("user/SetProjectID", state.project_id);
            if (typeof state.theme !== 'undefined') {
                toggleTheme({
                    scopeName: state.theme,
                    publicPath: '/xxx/'
                });
                document.documentElement.setAttribute( "class", state.theme );
            }
        }, true);
    }

    history = createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/portal/xxx' : '/');
    router = createRouter({
        history: history,
        routes
    });

    router.beforeEach((to,from,next) => {
        if (!window.__POWERED_BY_QIANKUN__) {
            let token = GetToken();
            if (token) {
                store.commit('user/SetToken', token);
            }
        }

        if (setGlobalState) {
            let pathList = ['/server', '/task'];
            if(pathList.indexOf(to.path) !== -1){
                setGlobalState({project_status: '2', project_status_disabled: false})
            }else{
                setGlobalState({project_status: '2', project_status_disabled: true}) // 禁用项目
            }
        }
        next();
    });

    instance = createApp(App);
    instance.component('SvgIcon', SvgIcon);

    instance.use(store)
        .use(router)
        .mount(container ? container.querySelector('#xxx') : '#xxx');
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

export async function bootstrap() {
    console.log('[vue] vue app bootstraped');
}
export async function mount(props) {
    console.log('[vue] props from main framework', props);
    render(props);
}
export async function unmount() {
    instance.unmount();
    instance._container.innerHTML = '';
    instance = null;
    router = null;
    history.destroy();
}
