import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Empty, message } from 'antd';
import './App.css';

import Header from '../Header';
import Footer from '../Footer';
import ArtisleList from '../ArticleList';
import ArticlePage from '../ArticlePage/ArticlePage';
import LogInPage from '../LogInPage';
import LogUpPage from '../LogUpPage';
import EditProfile from '../EditProfile';
import CreateArticle from '../CreateArticle';
import RealworldDB from '../../service/realworlAPI';
import SessionAPI from '../../service/sessionAPI';
import { getDataArticle, getPage } from '../../store/dataSlice';
import { setLogedin, getUserMail, getUserData } from '../../store/userSlice';

const API = new RealworldDB();
const sAPI = new SessionAPI();

const App = () => {
  const dispatch = useDispatch();
  const Page = useSelector((state) => state.data.Page);
  const IsLogedIn = useSelector((state) => state.user.Logedin);
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      key: 'login',
      type: 'success',
      content: 'You have successfully logged in',
      duration: 3,
    });
  };
  const created = () => {
    messageApi.open({
      key: 'created',
      type: 'success',
      content: 'You have successfully created a new article',
      duration: 3,
    });
  };
  const edited = () => {
    messageApi.open({
      key: 'edit',
      type: 'success',
      content: 'You have successfully edited profile',
      duration: 3,
    });
  };
  const deleted = () => {
    messageApi.open({
      key: 'delet',
      type: 'success',
      content: 'You have successfully deleted an article',
      duration: 3,
    });
  };
  const logout = () => {
    messageApi.open({
      key: 'logout',
      type: 'success',
      content: 'You have successfully logged out',
      duration: 3,
    });
  };

  function getData() {
    API.getArticles().then((data) => {
      dispatch(getDataArticle(data));
    });
  }

  function getInfo() {
    sAPI.getUserInfo().then((data) => {
      if (data) {
        dispatch(getUserMail(data.user.email));
        API.getProfile(data.user.username).then((Userdata) => {
          dispatch(getUserData(Userdata));
        });
      }
    });
  }

  function auth() {
    sAPI.authSession().then((status) => {
      if (status) {
        dispatch(setLogedin(true));
      }
    });
  }

  useEffect(() => {
    if (IsLogedIn) {
      success();
      getInfo();
    } else {
      auth();
    }
  }, [IsLogedIn]);

  useEffect(() => {
    API.page = Page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    getData();
  }, [Page]);

  function onFormSubmit() {
    getData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(setLogedin(true));
  }

  function onEditFormSubmit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    edited();
    getInfo();
  }

  function onCreateFormSubmit() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    created();
    getData();
  }

  function onDelete(slug) {
    sAPI.deleteArticle(slug).then(() => {
      getData();
      deleted();
    });
  }

  function onFavorite(slug, favorited) {
    if (favorited) {
      sAPI.unFavoritArticel(slug).then(() => {
        getData();
      });
    } else {
      sAPI.favoritArticel(slug).then(() => {
        getData();
      });
    }
  }

  function onMainPagge() {
    dispatch(getPage(1));
    getData();
  }

  function onLogOut() {
    sAPI.LogOut().then(() => {
      dispatch(setLogedin(false));
      getData();
      logout();
    });
  }

  const main = ['/', '/articles'];
  const article = '/articles/:slug';
  const editarticle = '/articles/:slug/edit';
  const signin = '/sign-in';
  const signup = '/sign-up';
  const profile = '/profile';
  const newarticle = '/new-article';

  return (
    <div className="App">
      {contextHolder}
      <Router>
        <Header onLogOut={onLogOut} onMainPage={onMainPagge}></Header>
        <div className="App-main">
          <Switch>
            <Route path={main} exact>
              <ArtisleList onFavorite={onFavorite}></ArtisleList>
              <Footer></Footer>
            </Route>
            <Route
              path={article}
              exact
              render={({ match }) => {
                const slug = match.params.slug;
                return <ArticlePage slug={slug} onDelete={onDelete} onFavorite={onFavorite}></ArticlePage>;
              }}
            ></Route>
            <Route
              path={editarticle}
              exact
              render={({ match }) => {
                const slug = match.params.slug;
                return <CreateArticle slug={slug}></CreateArticle>;
              }}
            ></Route>
            <Route path={signin} exact>
              <LogInPage onFormSubmit={onFormSubmit}></LogInPage>
            </Route>
            <Route path={signup} exact>
              <LogUpPage onFormSubmit={onFormSubmit}></LogUpPage>
            </Route>
            <Route path={profile} exact>
              <EditProfile onFormSubmit={onEditFormSubmit}></EditProfile>
            </Route>
            <Route path={newarticle} exact>
              <CreateArticle onFormSubmit={onCreateFormSubmit}></CreateArticle>
            </Route>
            <Route
              render={() => (
                <Empty
                  description={
                    <span>
                      Page not found! Go to{' '}
                      <Link to={'/articles'} className="Empty-link">
                        Main Page
                      </Link>
                    </span>
                  }
                ></Empty>
              )}
            ></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
