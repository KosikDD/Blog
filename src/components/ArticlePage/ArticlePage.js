import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HeartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Rate, Spin, Empty, Modal } from 'antd';
import { Link, Redirect } from 'react-router-dom';

import RealworldDB from '../../service/realworlAPI';

import './ArticlePage.css';

const ArticlePage = ({ slug, onDelete, onFavorite }) => {
  const API = new RealworldDB();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    API.getArticle(slug)
      .then((data) => {
        setArticle(data.article);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
        setLoading(false);
      });
  }, []);

  const spinner = loading ? <Spin size="large" className="Spin-Page" /> : null;

  const content =
    !loading && !error ? <Article article={article} onDelete={onDelete} onFavorite={onFavorite}></Article> : null;

  const onError = error ? (
    <Empty
      description={
        <span>
          Page no found! Go to{' '}
          <Link to={'/articles'} className="Empty-link">
            Main Page
          </Link>
        </span>
      }
    ></Empty>
  ) : null;

  return (
    <React.Fragment>
      {spinner}
      {content}
      {onError}
    </React.Fragment>
  );
};

const Article = ({ article, onDelete, onFavorite }) => {
  const IsLogedIn = useSelector((state) => state.user.Logedin);
  const UserInfo = useSelector((state) => state.user.UserData);
  const [deleted, setDeleted] = useState(false);
  const { confirm } = Modal;
  const date = new Date(article.updatedAt);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const showConfirm = () => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure to delete this article?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        onDelete(article.slug);
        setDeleted(true);
      },
      onCancel() {},
    });
  };

  const [active, setActive] = useState(article.favorited);
  const [count, setCount] = useState(article.favoritesCount);
  const btn = () => {
    setActive((active) => !active);
    setCount(() => (active ? count - 1 : count + 1));
    onFavorite(article.slug, active);
  };

  useEffect(() => {
    if (IsLogedIn) {
      setActive(article.favorited);
    } else {
      setActive(false);
    }
  }, [article]);

  if (deleted) {
    return <Redirect to={'/'}></Redirect>;
  } else {
    return (
      <div className="Article-Page">
        <div className="Article-Page-info">
          <div className="Article-main">
            <span>
              <label className="Title">{article.title}</label>
              <Rate
                className="Title-rate"
                disabled={!IsLogedIn}
                character={<HeartOutlined />}
                count={1}
                value={active}
                onChange={() => {
                  btn();
                }}
              />
              <span className="Title-rate-count">{count}</span>
            </span>
            <ul className="genres-list">
              {article.tagList?.map((el, index) => {
                return (
                  <li className="genres-item" key={index}>
                    {el}
                  </li>
                );
              })}
            </ul>
            <span className="description-page">{article.description}</span>
          </div>
          <div className="Article-author">
            <span className="author-name">{article.author.username}</span>
            <span className="created">{date.toLocaleString('en-US', options)}</span>
            <img className="author-img" src={article.author.image}></img>
            {IsLogedIn && UserInfo ? (
              UserInfo.profile.username === article.author.username ? (
                <div className="author-btns">
                  <button
                    className="Delete-btn"
                    onClick={() => {
                      showConfirm();
                    }}
                  >
                    Delete
                  </button>
                  <Link to={`/articles/${article.slug}/edit`} className="Edit-btn">
                    Edit
                  </Link>
                </div>
              ) : null
            ) : null}
          </div>
        </div>
        <div className="Article-Page-main">
          <span>
            <ReactMarkdown>{article.body}</ReactMarkdown>
          </span>
        </div>
      </div>
    );
  }
};

export default ArticlePage;
