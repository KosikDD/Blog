import { useSelector, useDispatch } from 'react-redux';
import { Pagination } from 'antd';

import { getPage } from '../../store/dataSlice';

import './Footer.css';

const Footer = () => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.data.Page);
  const articles = useSelector((state) => state.data.Data);
  const onChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(getPage(page));
  };

  if (articles.length === 0) {
    return null;
  } else {
    return (
      <Pagination
        className="Pagination"
        current={page}
        onChange={onChange}
        defaultCurrent={1}
        total={articles.articlesCount}
        defaultPageSize={5}
        pageSizeOptions={[5]}
        showSizeChanger={false}
        hideOnSinglePage={true}
      />
    );
  }
};

export default Footer;
