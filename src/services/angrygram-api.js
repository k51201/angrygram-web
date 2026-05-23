export default class AngrygramApiService {
    _apiBase = 'http://192.168.1.107:8000/api/'

    async getResource(url, options = {method: 'GET'}) {
        const res = await fetch(`${this._apiBase}${url}`, options)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, received ${res.status}`)
        }

        return await res.json()
    }

    async getPosts() {
        return await this.getResource('v1/post')
    }

    async postImage(authToken, authTokenType, image) {
        const formData = new FormData()
        formData.append('image', image)

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `${authTokenType} ${authToken}`,
            },
            body: formData
        }

        return await this.getResource('v1/post/image', requestOptions)
    }

    async createPost(authToken, authTokenType, imageUrl, caption) {
        const postJson = JSON.stringify({
            imageUrl: imageUrl,
            imageUrlType: 'relative',
            caption: caption,
        })

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authTokenType} ${authToken}`,
            },
            body: postJson
        }

        return await this.getResource('v1/post', requestOptions)
    }

    async deletePost(authToken, authTokenType, postId) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': `${authTokenType} ${authToken}`,
            },
        }

        const res = await fetch(`${this._apiBase}v1/post/${postId}`, requestOptions)
        
        if (!res.ok) {
            throw new Error(`Could not delete post ${postId}, received ${res.status}`)
        }

        return res.ok
    }

    async getComments(authToken, authTokenType, postId) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': `${authTokenType} ${authToken}`,
            },
        }

        return await this.getResource(`v1/post/${postId}/comment`, requestOptions)
    }

    async postComment(authToken, authTokenType, postId, commentText) {
        const commentJson = JSON.stringify({
            text: commentText,
            postId: postId,
        })

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${authTokenType} ${authToken}`,
            },
            body: commentJson
        }

        return await this.getResource(`v1/post/${postId}/comment`, requestOptions)
    }

    async login(username, password) {
        const formData = new FormData()
        formData.append('grant_type', 'password')
        formData.append('password', password)
        formData.append('username', username)

        const requestOptions = {
            method: 'POST',
            body: formData
        }

        return await this.getResource('v1/auth/login', requestOptions)
    }

    async signUp(username, email, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        }

        return await this.getResource('v1/user', requestOptions)
    }
}
