import { Database } from '@hocuspocus/extension-database';
import { Logger } from '@hocuspocus/extension-logger';
import { Server } from '@hocuspocus/server';
import { slateNodesToInsertDelta } from '@slate-yjs/core';
import * as Y from 'yjs';
import fetch, { FormData, File } from 'node-fetch';
import jwt_decode from "jwt-decode";

const PORT = parseInt(process.env.PORT ?? '12345')
const BACKEND_HOST = process.env.BACKEND_HOST ?? 'localhost'
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT ?? '3001')
const BACKEND_BASEURL = `${BACKEND_HOST}:${BACKEND_PORT}`

const initialValue = [{ "type": "paragraph", "children": [{ "text": "" }] }]

// Minimal hocuspocus server setup with logging. For more in-depth examples
// take a look at: https://github.com/ueberdosis/hocuspocus/tree/main/demos/backend
const server = Server.configure({
    port: PORT,
    onAuthenticate: async ({ connection, requestParameters, token }) => {
        if (requestParameters.get('writeable')?.toLowerCase() !== 'true') {
            connection.readOnly = true
        }

        let user: Record<string, any> | null = null
        if (token) {
            const resp = await fetch(`http://${BACKEND_BASEURL}/v1/users/me`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
            if (resp.status >= 300) {
                throw new Error(resp.statusText)
            }
            user = await resp.json()
        }

        return {
            user,
            token
        }
    },
    beforeHandleMessage: async ({ context }) => {
        const { token } = context
        if (!token) {
            return
        }

        const decoded: { exp: number } = jwt_decode(token)
        if (decoded.exp <= Date.now() / 1000) {
            throw new Error('token has expired')
        }
    },
    extensions: [
        new Logger(),
        new Database({
            fetch: async (payload) => {
                try {
                    const { token } = payload.context
                    const requestParameters = payload.requestParameters

                    const headers = token ? { authorization: `Bearer ${token}` } : {}

                    let resp = null
                    if (requestParameters.get('from') === 'share') {
                        const params = new URLSearchParams({
                            shareId: requestParameters.get('shareId'),
                            path: requestParameters.get('path')
                        })
                        resp = await fetch(`http://${BACKEND_BASEURL}/v1/share/document?${params.toString()}`, {
                            headers
                        })
                    } else if (requestParameters.get('from') === 'space') {
                        const params = new URLSearchParams({
                            path: requestParameters.get('path')
                        })
                        resp = await fetch(`http://${BACKEND_BASEURL}/v1/space/document?${params.toString()}`, {
                            headers
                        })
                    } else {
                        throw new Error('params "from" got an invalid value: ' + requestParameters.get('from'))
                    }

                    if (resp.status >= 300) {
                        throw new Error(resp.statusText)
                    }
                    
                    const arr = new Uint8Array(await resp.arrayBuffer())
                    if (arr.length > 0) {
                        return arr
                    } else {
                        return null
                    }
                } catch (err) {
                    console.error(err)
                    return null
                }
            },
            store: async (payload) => {
                try {
                    const { token } = payload.context
                    const requestParameters = payload.requestParameters

                    const headers = token ? { authorization: `Bearer ${token}` } : {}

                    const formData = new FormData();
                    formData.append("data", new File([payload.state], `${payload.documentName}.data`))

                    let resp = null
                    if (requestParameters.get('from') === 'share') {
                        const params = new URLSearchParams({
                            shareId: requestParameters.get('shareId'),
                            path: requestParameters.get('path')
                        })
                        resp = await fetch(`http://${BACKEND_BASEURL}/v1/share/document?${params.toString()}`, {
                            method: 'PUT',
                            headers,
                            body: formData
                        })
                    } else if (requestParameters.get('from') === 'space') {
                        const params = new URLSearchParams({
                            path: requestParameters.get('path')
                        })
                        resp = await fetch(`http://${BACKEND_BASEURL}/v1/space/document?${params.toString()}`, {
                            method: 'PUT',
                            headers,
                            body: formData
                        })
                    } else {
                        throw new Error('params "from" got an invalid value: ' + requestParameters.get('from'))
                    }
                    
                    if (resp.status >= 300) {
                        throw new Error(resp.statusText)
                    }
                } catch (err) {
                    console.error(err)
                }
            },
        }),
    ],

    async onLoadDocument(data) {
        if (data.document.isEmpty('content')) {
            const insertDelta = slateNodesToInsertDelta(initialValue);
            const sharedRoot = data.document.get(
                'content',
                Y.XmlText
            ) as Y.XmlText;
            sharedRoot.applyDelta(insertDelta);
        }

        return data.document;
    },
});

server.enableMessageLogging();
server.listen();