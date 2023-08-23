const Test = () => import(/* webpackChunkName: "Test" */'@/views/test.vue');

const routes = [
    {
        path: '/',
        name: 'Test',
        component: Test
    }
];

export default routes
