import { useState } from 'react';
import { Pagination } from 'antd';

import './Footer.css';

const Footer = (props) => {
  const [current, setCurrent] = useState(1);
  const onChange = (page) => {
    props.onClickPage(page);
    setCurrent(page);
  };

  if (props.total === 0) {
    return null;
  } else {
    return (
      <Pagination
        className="Pagination"
        current={current}
        onChange={onChange}
        defaultCurrent={props.page}
        total={props.total}
        defaultPageSize={5}
        pageSizeOptions={[5]}
        showSizeChanger={false}
        hideOnSinglePage={true}
      />
    );
  }
};

export default Footer;
