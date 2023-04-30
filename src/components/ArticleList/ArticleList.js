import Article from '../Article';
import './ArticleList.css';

const ArtisleList = ({ articles, IsLogedIn, onFavorite }) => {
  return (
    <ul className="Article-list">
      {articles.map((item) => {
        const { slug } = item;
        return <Article {...item} key={slug} IsLogedIn={IsLogedIn} onFavorite={onFavorite} />;
      })}
    </ul>
  );
};

export default ArtisleList;
