export default class SessionAPI {
  _apiBase = 'https://blog.kata.academy/';

  //Register
  async authRegister(data) {
    try {
      let NewURL = new URL('api/users', this._apiBase);
      const res = await fetch(NewURL.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { username: data.username, email: data.email, password: data.password },
        }),
      });
      const responcedata = await res.json();
      if (!res.ok) {
        return responcedata;
      } else {
        localStorage.setItem('user_token', responcedata.user.token);
        return responcedata;
      }
    } catch (error) {
      console.log(`Could't fetch sing-up, received ${error}`);
      throw error;
    }
  }

  // Login
  async authLogin(data) {
    try {
      let NewURL = new URL('api/users/login', this._apiBase);
      const res = await fetch(NewURL.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { email: data.email, password: data.password },
        }),
      });
      const responcedata = await res.json();
      if (!res.ok) {
        return responcedata;
      } else {
        localStorage.setItem('user_token', responcedata.user.token);
        return responcedata;
      }
    } catch (error) {
      console.log(`Could't fetch sing-in, received ${error}`);
      throw error;
    }
  }

  //Edit Profile
  async editProfile(data) {
    try {
      const token = localStorage.getItem('user_token');
      let NewURL = new URL('api/user', this._apiBase);
      const res = await fetch(NewURL.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: { username: data.username, email: data.email, password: data.password, image: data.url },
        }),
      });
      const responcedata = await res.json();
      return responcedata;
    } catch (error) {
      console.log(`Could't fetch profile, received ${error}`);
      throw error;
    }
  }

  //Session Auth
  async authSession() {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        console.log('no token');
        return;
      } else {
        return 'success';
      }
    } catch (error) {
      console.log(error);
    }
  }

  //GetUser
  async getUserInfo() {
    try {
      const token = localStorage.getItem('user_token');
      if (token !== null) {
        let NewURL = new URL('api/user', this._apiBase);
        const res = await fetch(NewURL.href, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responcedata = await res.json();
        if (!res.ok) {
          throw Error('no Token');
        } else {
          return responcedata;
        }
      }
    } catch (error) {
      console.log(error);
      throw Error(error);
    }
  }

  //Log Out
  async LogOut() {
    localStorage.removeItem('user_token');
  }

  async postArticle(data, tags) {
    try {
      const token = localStorage.getItem('user_token');
      let NewURL = new URL('api/articles', this._apiBase);
      const res = await fetch(NewURL.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: tags,
          },
        }),
      });
      const responcedata = await res.json();
      return responcedata;
    } catch (error) {
      console.log(`Could't fetch post article, received ${error}`);
      throw error;
    }
  }

  async editArticle(slug, data, tags) {
    try {
      const token = localStorage.getItem('user_token');
      let NewURL = new URL(`api/articles/${slug}`, this._apiBase);
      const res = await fetch(NewURL.href, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: tags,
          },
        }),
      });
      const responcedata = await res.json();
      return responcedata;
    } catch (error) {
      console.log(`Could't fetch put article, received ${error}`);
      throw error;
    }
  }

  async deleteArticle(slug) {
    try {
      const token = localStorage.getItem('user_token');
      let NewURL = new URL(`api/articles/${slug}`, this._apiBase);
      await fetch(NewURL.href, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(`Could't fetch delete article, received ${error}`);
      throw error;
    }
  }

  async favoritArticel(slug) {
    try {
      const token = localStorage.getItem('user_token');
      let NewURL = new URL(`api/articles/${slug}/favorite`, this._apiBase);
      await fetch(NewURL.href, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(`Could't fetch favorite article, received ${error}`);
      throw error;
    }
  }

  async unFavoritArticel(slug) {
    try {
      const token = localStorage.getItem('user_token');
      let NewURL = new URL(`api/articles/${slug}/favorite`, this._apiBase);
      await fetch(NewURL.href, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(`Could't fetch favorite article, received ${error}`);
      throw error;
    }
  }
}
