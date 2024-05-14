import axios from 'axios';


const request = axios.create({
    baseURL: apiUrl,
    timeout: 50 * 1000,
    headers: {
        'Content-Type': 'application/json',
    }
});
// import jsonServerProvider from "ra-data-json-server";
import { stringify } from "query-string";
import { fetchUtils } from "react-admin";
import {apiUrl} from "./const";
const httpClient = fetchUtils.fetchJson;

export const dataProvider = {
    validateLogin: async (resource, params) => {
        return request.post(`${apiUrl}/${resource}/`, params).then((resp) => {
            return   {
                success: resp.data.success,
                message: resp.data.message
            }
        });
    },
    getList: (resource, params) => {
        try {
            let url;
            if (params) {
                const { page, perPage } = params.pagination;
                const { field, order } = params.sort;
                const query = {
                    sort: JSON.stringify([field, order]),
                    range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
                    filter: JSON.stringify(params.filter),
                };
                url = `${apiUrl}/${resource}?${stringify(query)}`;
            } else {
                url = `${apiUrl}/${resource}`;
            }
            return request.get(url, params).then((resp) => {
                return   {
                    data: resp.data.data,
                    total: resp.data.total,
                }
            });
        } catch (e) {
            return Promise.reject(e);
        }

    },
    getListWithoutFile: (resource) => {
        try {
            let url= `${apiUrl}/${resource}/getListWithoutFile`;
            return request.get(url).then((resp) => {
                return   {
                    data: resp.data.data,
                    total: resp.data.total,
                }
            });
        } catch (e) {
            return Promise.reject(e);
        }

    },
    getOne: (resource, params) => {
        const url = `${apiUrl}/${resource}/${params.id}`
        return request.get(url, params).then((resp) => {
            return   {
                data: resp.data.data,
            }
        });
    },
    getImageBuffer: (resource, params, config) => {
        const url = `${apiUrl}/${resource}/${params.id}`
        return request.get(url, config).then((resp) => {
            return resp;
        });
    },
    getImg: (resource, params) => {
        const url = `${apiUrl}/${resource}/get_img/${params.id}`
        return request.get(url, params).then((resp) => {
            return   {
                data: resp.data.data,
            }
        });
    },
    getUnconfirmedMessage: (resource, params) => {
        const url = `${apiUrl}/${resource}/get_unconfirmed_message`
        return request.get(url, params).then((resp) => {
            return   {
                data: resp.data.data,
            }
        });
    },


    getMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${apiUrl}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt((headers.get('content-range') || "0").split('/').pop() || '0', 10),
        }));
    },

    update: (resource, params, query) => {
        return request.put(`${apiUrl}/${resource}/${params.id}${query??''}`, params).then((resp) => {
            return   {
                success: resp.data?.success,
            }
        });
    },

    updateMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
    create: (resource, params, config) => {
            const url = `${resource}/create_${resource}`
            return request.post(url, params, config).then((resp) => {
                return   {
                    success: resp?.data?.success,
                    data: resp?.data?.data,
                    message: resp?.data?.message || ''
                }
            });
    },
    updateImage: (resource, fileId, formData, config) => {
        const url = `${resource}/${fileId}`
        return request.put(url, formData, config).then((resp) => {
            return   {
                success: resp?.data?.success,
                data: resp?.data?.data,
                message: resp?.data?.message || ''
            }
        });
    },

    // export: (resource, params) => {
    //     const url = `${resource}/export_${resource}/${params.id}`
    //     return request.get(url, params).then((resp) => {
    //         return   {
    //             success: resp?.data?.success,
    //             data: resp?.data?.data,
    //             message: resp?.data?.message || ''
    //         }
    //     });
    // },

    delete: (resource, params) => {
        return request.delete(`${apiUrl}/${resource}/${params.id}`, { data: params }).then((resp) => {
            return   {
                success: resp.data.success,
            }
        });
    },
    deleteMany: (resource, params) => {
        const query = {
            filter: JSON.stringify({ id: params.ids}),
        };
        return request.delete(`${apiUrl}/${resource}/?${stringify(query)}`, params).then((resp) => {
            console.log('resPL', resp);
            return   {
                success: resp.data.success,
                // data: resp?.data?.data,
                data: []
            }
        });
    }
};