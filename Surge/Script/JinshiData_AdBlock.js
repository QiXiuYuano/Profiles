/**
 * 金十数据去广告脚本
 * 完全本地化执行，默认拦截所有广告
 * 
 * @author AI Assistant
 * @date 2026-02-02
 * @version 1.1.0
 */

// ========== 工具函数 ==========

/**
 * 日志输出
 */
function log(message) {
    console.log(`[金十数据去广告] ${message}`);
}

/**
 * 创建空响应
 */
function createEmptyResponse(includeData = true) {
    const response = {
        status: 200,
        message: "ok"
    };
    if (includeData) {
        response.data = null;
    }
    return response;
}

// ========== 主逻辑 ==========

// 获取请求信息
const url = $request.url;
const method = $request.method;

log(`收到请求: ${method} ${url}`);

/**
 * 主处理逻辑 - 默认拦截所有 /ad2/ 路径下的请求
 */
function processRequest() {
    // 1. 开屏广告获取: /ad2/opening?xxx (但不包括 /ad2/opening/show)
    if (url.includes('/ad2/opening') && !url.includes('/ad2/opening/show')) {
        log('✅ 已拦截开屏广告请求');
        const body = JSON.stringify(createEmptyResponse(true));
        return { body };
    }

    // 2. 开屏广告展示统计: /ad2/opening/show
    if (url.includes('/ad2/opening/show')) {
        log('✅ 已拦截广告统计请求');
        const body = JSON.stringify(createEmptyResponse(false));
        return { body };
    }

    // 3. APP内部通知广告: /ad2/single_unread
    if (url.includes('/ad2/single_unread')) {
        log('✅ 已拦截内部广告请求');
        const body = JSON.stringify(createEmptyResponse(true));
        return { body };
    }

    // 4. 其他 /ad2/ 路径的广告请求 - 也拦截
    if (url.includes('/ad2/')) {
        log('✅ 已拦截其他广告请求');
        const body = JSON.stringify(createEmptyResponse(true));
        return { body };
    }

    // 未匹配到任何规则，放行（理论上不会到这里，因为正则已经限制了）
    log('⚠️ 未匹配到拦截规则，放行');
    return {};
}

// 执行处理
const result = processRequest();

// 返回修改后的响应
if (result.body) {
    $done({
        response: {
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Connection': 'keep-alive'
            },
            body: result.body
        }
    });
} else {
    $done({});
}
