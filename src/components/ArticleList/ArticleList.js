import { useSelector } from 'react-redux';
import { Spin } from 'antd';

import Article from '../Article';
import './ArticleList.css';

const ArtisleList = ({ onFavorite }) => {
  const articles = useSelector((state) => state.data.Data);
  if (articles.length === 0) {
    return <Spin></Spin>;
  } else {
    return (
      <ul className="Article-list">
        {articles.articles.map((item) => {
          const { slug } = item;
          return <Article {...item} key={slug} onFavorite={onFavorite} />;
        })}
      </ul>
    );
  }
};

export default ArtisleList;
