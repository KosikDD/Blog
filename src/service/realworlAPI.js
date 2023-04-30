export default class RealworldDB {
  _apiBase = 'https://blog.kata.academy/';

  constructor() {
    this.page = 1;
    this.limit = 5;
    this.offset = this.page * 5 - 5;
  }

  async getArticles() {
    try {
      const token = localStorage.getItem('user_token');
      this.offset = this.page * 5 - 5;
      let NewURL = new URL('api/articles', this._apiBase);
      NewURL.searchParams.set('limit', this.limit);
      NewURL.searchParams.set('offset', this.offset);
      if (token) {
        const res = await fetch(NewURL.href, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('NO success!');
        }
        return await res.json();
      } else {
        const res = await fetch(NewURL.href, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('NO success!');
        }
        return await res.json();
      }
    } catch (error) {
      console.log(`Could't fetch articles, received ${error}`);
      throw error;
    }
  }

  async getArticle(slug) {
    try {
      const token = localStorage.getItem('user_token');
      let NewURL = new URL(`api/articles/${slug}`, this._apiBase);
      if (token) {
        const res = await fetch(NewURL.href, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error('NO success!');
        }
        return await res.json();
      } else {
        const res = await fetch(NewURL.href, {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('NO success!');
        }
        return await res.json();
      }
    } catch (error) {
      console.log(`Could't fetch articles, received ${error}`);
      throw error;
    }
  }

  async getProfile(username) {
    try {
      let NewURL = new URL(`api/profiles/${username}`, this._apiBase);
      const res = await fetch(NewURL.href, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });
      if (!res.ok) {
        throw new Error('NO success!');
      }
      return await res.json();
    } catch (error) {
      console.log(`Could't fetch profile, received ${error}`);
      throw error;
    }
  }
}
