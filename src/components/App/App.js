import { useEffect, useState } from 'react';
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

const API = new RealworldDB();
const sAPI = new SessionAPI();

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [ArticlesCount, setArticlesCount] = useState(0);
  const [ArticlesData, setArticlesData] = useState([]);
  const [IsLogedIn, setIsLogedIn] = useState(false);
  const [IsEdited, setIsEdited] = useState(false);
  const [UserInfo, setUserInfo] = useState(null);
  const [UserMail, setUserMail] = useState(null);
  const [Page, setPage] = useState(1);

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
      setArticlesData(data.articles);
      setArticlesCount(data.articlesCount);
    });
  }

  function getInfo() {
    sAPI
      .getUserInfo()
      .then((data) => {
        getData();
        if (data) {
          if (IsEdited) {
            edited();
            setIsEdited(false);
          } else {
            success();
          }

          setUserMail(data.user.email);
          API.getProfile(data.user.username)
            .then((Userdata) => {
              setUserInfo(Userdata);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function auth() {
    sAPI
      .authSession()
      .then((status) => {
        if (status) {
          setIsLogedIn(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getData();
  }, [Page]);

  useEffect(() => {
    if (IsLogedIn) {
      getInfo();
    } else {
      auth();
    }
  }, [IsLogedIn, IsEdited]);

  function onClickPage(page) {
    API.page = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(page);
  }

  function onFormSubmit() {
    getData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLogedIn(true);
  }

  function onEditFormSubmit() {
    getData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEdited(true);
  }

  function onCreateFormSubmit() {
    getData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    created();
  }

  function onClickMainPage() {
    getData();
    API.page = 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPage(1);
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

  function onLogOut() {
    sAPI.LogOut().then(() => {
      getData();
      logout();
      setIsLogedIn(false);
    });
  }

  return (
    <div className="App">
      {contextHolder}
      <Router>
        <Header
          onClickMainPage={onClickMainPage}
          IsLogedIn={IsLogedIn}
          UserInfo={UserInfo}
          onLogOut={onLogOut}
        ></Header>
        <div className="App-main">
          <Switch>
            <Route path={['/', '/articles']} exact>
              <ArtisleList articles={ArticlesData} IsLogedIn={IsLogedIn} onFavorite={onFavorite}></ArtisleList>
              <Footer total={ArticlesCount} onClickPage={onClickPage} page={Page}></Footer>
            </Route>
            <Route
              path="/articles/:slug"
              exact
              render={({ match }) => {
                const slug = match.params.slug;
                return (
                  <ArticlePage
                    slug={slug}
                    IsLogedIn={IsLogedIn}
                    UserInfo={UserInfo}
                    onDelete={onDelete}
                    onFavorite={onFavorite}
                  ></ArticlePage>
                );
              }}
            ></Route>
            <Route
              path="/articles/:slug/edit"
              exact
              render={({ match }) => {
                const slug = match.params.slug;
                return <CreateArticle slug={slug} IsLogedIn={IsLogedIn} onFormSubmit={UserInfo}></CreateArticle>;
              }}
            ></Route>
            <Route path="/sign-in" exact>
              <LogInPage onFormSubmit={onFormSubmit} IsLogedIn={IsLogedIn}></LogInPage>
            </Route>
            <Route path="/sign-up" exact>
              <LogUpPage onFormSubmit={onFormSubmit} IsLogedIn={IsLogedIn}></LogUpPage>
            </Route>
            <Route path="/profile" exact>
              <EditProfile
                onFormSubmit={onEditFormSubmit}
                IsLogedIn={IsLogedIn}
                UserInfo={UserInfo}
                UserMail={UserMail}
              ></EditProfile>
            </Route>
            <Route path="/new-article" exact>
              <CreateArticle onFormSubmit={onCreateFormSubmit} IsLogedIn={IsLogedIn}></CreateArticle>
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
}

export default App;
