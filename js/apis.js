import { dialog } from './subassembly/dialog.js';

const fetchCache = new Map();

function customFetch(url, options = {}) {
    const now = Date.now();
    if (fetchCache.has(url)) {
        const lastFetchTime = fetchCache.get(url);
        if (now - lastFetchTime < 1200) {
            // console.log(`请求过于频繁，忽略请求：${url}`);
            // dialog({
            //     content: "The request is too frequent.",
            //     type: 'warning',
            //     noText: 'Close',
            // })
            return Promise.resolve(null);
        }
    }
    fetchCache.set(url, now);
    return window.fetch(url, options)
        .then(response => {
            if (response.status === 404) {
                dialog({
                    content: "You may be missing dependencies at the moment. For details, please refer to the ComfyUI logs.",
                    type: 'error'
                })
            }
            return response.json();
        })
        .then(data => {
            const { code, message } = data;
            if (code !== 20000) {
                dialog({
                    type: 'warning',
                    content: message,
                    noText: 'Close',
                    onNo: () => {
                        if (code === 401000) {
                            document.querySelector('.menus-item-key').click()
                        }
                    }
                })

                return;
            }
            return data;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;
        });
}


export function check_model_exists ( type, name ) {
    return customFetch('/bizyair/modelhost/check_model_exists', {
        method: 'POST',
        body: JSON.stringify({ type, name })
    })
}

export function model_upload ( data ) {
    return customFetch('/bizyair/modelhost/model_upload', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function file_upload ( data ) {
    return customFetch('/bizyair/modelhost/file_upload', {
        method: 'POST',
        body: data
    })
}

export function set_api_key ( data ) {
    return customFetch('/bizyair/set_api_key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    })
}

export function models_files ( data ) {
    return customFetch(`/bizyair/modelhost/models/files?type=${data.type}&public=${data.public}`, {method: 'GET'})
}

export function change_public ( data ) {
    return customFetch('/bizyair/modelhost/models/change_public', {method: 'PUT', body: JSON.stringify(data)})
}

export function model_types () {
    return customFetch('/bizyair/modelhost/model_types', {method: 'GET'})
}

export function check_folder (url) {
    return customFetch(`/bizyair/modelhost/check_folder?absolute_path=${encodeURIComponent(url)}`, {method: 'GET'})
}

export function submit_upload (data) {
    return customFetch(`/bizyair/modelhost/submit_upload?clientId=${sessionStorage.getItem('clientId')}`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function delModels ( data ) {
    return customFetch('/bizyair/modelhost/models', {
        method: 'DELETE',
        body: JSON.stringify({
            type: data.type,
            name: data.name,
        }),
    })
}

export function getUserInfo () {
    return customFetch('/bizyair/user/info', { method: 'get' })
}

export function putShareId (data) {
    return customFetch('/bizyair/user/share_id', {
        method: 'put',
        body: JSON.stringify(data)
    })
}

export function getDescription (data) {
    return customFetch(`/bizyair/modelhost/models/description?${new URLSearchParams(data).toString()}`, {
        method: 'get'
    })
}

export function putDescription (data) {
    return customFetch('/bizyair/modelhost/models/description', {
        method: 'put',
        body: JSON.stringify(data)
    })
}
