import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { message } from 'antd';

import SessionAPI from '../../service/sessionAPI';
import RealworldDB from '../../service/realworlAPI';

import './CreateArticle.css';

const CreateArticle = ({ onFormSubmit, IsLogedIn, slug }) => {
  const API = new RealworldDB();
  const sAPI = new SessionAPI();
  const [messageApi, contextHolder] = message.useMessage();
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (slug) {
      API.getArticle(slug).then((data) => {
        setTitle(data.article.title);
        setDescription(data.article.description);
        setBody(data.article.body);
        setTags(data.article.tagList);
      });
    }
  }, []);

  const [created, setCreated] = useState(false);
  const error = (content, key) => {
    messageApi.open({
      key: key,
      type: 'error',
      content: content,
      duration: 3,
    });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: 'onBlur',
  });

  function editTitle(event) {
    setTitle(event.target.value);
  }

  function editDescription(event) {
    setDescription(event.target.value);
  }

  function editBody(event) {
    setBody(event.target.value);
  }

  function addTag() {
    setTags([...tags, '']);
  }

  function editTag(event, index) {
    const prevTags = tags.slice(0, index);
    const nextTags = tags.slice(index + 1);
    setTags([...prevTags, event.target.value, ...nextTags]);
  }

  function deleteTag(index) {
    const prevTags = tags.slice(0, index);
    const nextTags = tags.slice(index + 1);
    setTags([...prevTags, ...nextTags]);
  }

  async function onSubmit(Data) {
    if (slug) {
      await sAPI
        .editArticle(slug, Data, tags)
        .then((data) => {
          if (data.errors) {
            for (let el in data.errors) {
              error(`${el} - ${data.errors[el]}`, el);
            }
          } else {
            setCreated(data.article.slug);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await sAPI
        .postArticle(Data, tags)
        .then((data) => {
          if (data.errors) {
            for (let el in data.errors) {
              error(`${el} - ${data.errors[el]}`, el);
            }
          } else {
            onFormSubmit();
            setCreated(data.article.slug);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  if (IsLogedIn) {
    if (created) {
      return <Redirect to={`/articles/${created}`}></Redirect>;
    } else {
      return (
        <div className="Create">
          {contextHolder}
          {slug ? <div className="hidden"></div> : null}
          <form className="Create-form" onSubmit={handleSubmit(onSubmit)}>
            <h1>{slug ? 'Edit Article' : 'Create new Article'}</h1>
            <label className="Create-span" htmlFor="title">
              Title
              {errors?.title && <p>{errors?.title?.message}</p>}
            </label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChangeCapture={() => editTitle(event)}
              {...register('title', {
                value: title,
                required: 'This field should not be empty',
              })}
              id="title"
            ></input>
            <label className="Create-span" htmlFor="description">
              Short description
              {errors?.description && <p>{errors?.description?.message}</p>}
            </label>
            <input
              type="text"
              placeholder="Short description"
              value={description}
              onChangeCapture={() => editDescription(event)}
              {...register('description', {
                value: description,
                required: 'This field should not be empty',
              })}
              id="description"
            ></input>
            <label className="Create-span" htmlFor="textarea">
              Text
              {errors?.body && <p id="ptext">{errors?.body?.message}</p>}
            </label>
            <textarea
              value={body}
              onChangeCapture={() => editBody(event)}
              placeholder="Some Text"
              {...register('body', {
                value: body,
                required: 'This field should not be empty',
              })}
              id="textarea"
            ></textarea>
            <label className="Create-span">Tags</label>
            <ul className="Create-genres">
              {tags?.map((el, index) => {
                return (
                  <li className="Create-item" key={index}>
                    <input
                      type="text"
                      placeholder="Tag"
                      value={el}
                      onChange={() => editTag(event, index)}
                      required
                    ></input>
                    <button type="button" className="Delete-item" onClick={() => deleteTag(index)}>
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
            <button className="Create-tag" type="button" onClick={addTag}>
              Add Tag
            </button>

            <button className="Create-btn" type="submit">
              Send
            </button>
          </form>
        </div>
      );
    }
  } else {
    return <Redirect to={'/sign-in'}></Redirect>;
  }
};

export default CreateArticle;
