export default class AngrygramApiService {
    _apiBase = 'http://localhost:8000/api/'

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

    async getComments(postId) {
        return await this.getResource(`v1/post/${postId}/comment`)
    }
}
