import request from "@/utils/request";
/**
 * 封装调用接口的api
 */
export function test1() {
    // Promise
    const _promise = request.get('/test');
    console.log('_promise', _promise);
    _promise.then(response => {
        console.log('test1', response);
    }).catch(error => {
        console.log('test1=error', error)
    });
}

/**
 * 封装api方法
 * @returns promise
 */
export function test2() {
    return request({
        url: '/test',
        method: 'GET'
    });
}


export function getList() {
    return request({
        url: '/test', // '/dev-api/test'
        method: 'GET'
    });
}