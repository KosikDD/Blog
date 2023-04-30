import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import { Rate } from 'antd';

import './Article.css';

const Article = ({
  slug,
  title,
  tagList,
  description,
  favoritesCount,
  updatedAt,
  author,
  favorited,
  IsLogedIn,
  onFavorite,
}) => {
  const date = new Date(updatedAt);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const [active, setActive] = useState(favorited);
  const btn = () => {
    setActive((active) => !active);
    onFavorite(slug, active);
  };

  useEffect(() => {
    if (IsLogedIn) {
      setActive(favorited);
    } else {
      setActive(false);
    }
  }, [favorited]);

  return (
    <li className="Article">
      <div className="Article-main">
        <span>
          <Link className="Title" to={`articles/${slug}`}>
            {title}
          </Link>
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
          <span className="Title-rate-count">{favoritesCount}</span>
        </span>
        <ul className="genres-list">
          {tagList?.map((el, index) => {
            return (
              <li className="genres-item" key={index}>
                {el}
              </li>
            );
          })}
        </ul>
        <span className="description">{description}</span>
      </div>
      <div className="Article-author">
        <span className="author-name">{author.username}</span>
        <span className="created">{date.toLocaleString('en-US', options)}</span>
        <img className="author-img" src={author.image}></img>
      </div>
    </li>
  );
};

export default Article;
