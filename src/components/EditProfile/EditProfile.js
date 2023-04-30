/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect } from 'react-router-dom';
import { message } from 'antd';

import SessionAPI from '../../service/sessionAPI';
import './EditProfile.css';

const EditProfile = ({ onFormSubmit, IsLogedIn, UserInfo, UserMail }) => {
  const API = new SessionAPI();
  const [messageApi, contextHolder] = message.useMessage();
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

  async function onSubmit(Data) {
    await API.editProfile(Data)
      .then((data) => {
        if (data.errors) {
          for (let el in data.errors) {
            error(`${el} - ${data.errors[el]}`, el);
          }
        } else {
          onFormSubmit();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  if (IsLogedIn) {
    const [username, setUsername] = useState(UserInfo.profile.username);
    const [email, setEmail] = useState(UserMail);
    return (
      <div className="Profile">
        {contextHolder}
        <form className="Profile-form" onSubmit={handleSubmit(onSubmit)}>
          <h1>Edit Profile</h1>
          <label className="Profile-span" htmlFor="username">
            Username
            {errors?.username && <p>{errors?.username?.message}</p>}
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChangeCapture={(event) => {
              setUsername(event.target.value);
            }}
            {...register('username', {
              required: 'This field should not be empty',
              minLength: {
                value: 3,
                message: 'Minimum 3 characters',
              },
              maxLength: {
                value: 20,
                message: 'Maximum 20 characters',
              },
              pattern: {
                value: /[^\s]$/,
                message: 'Incorrect username',
              },
            })}
            id="username"
          ></input>
          <label className="Profile-span" htmlFor="email">
            Email address
            {errors?.email && <p>{errors?.email?.message}</p>}
          </label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChangeCapture={(event) => {
              setEmail(event.target.value);
            }}
            {...register('email', {
              required: 'This field should not be empty',
              pattern: {
                value: /^([^ ]+@[^ ]+\.[a-z]{2,6}|)$/,
                message: 'Incorrect mail',
              },
            })}
            id="email"
          ></input>
          <label className="Profile-span" htmlFor="profilepassword">
            New password
            {errors?.password && <p>{errors?.password?.message}</p>}
          </label>
          <input
            type="password"
            placeholder="New password"
            {...register('password', {
              minLength: {
                value: 6,
                message: 'Minimum 6 characters',
              },
              maxLength: {
                value: 40,
                message: 'Maximum 40 characters',
              },
            })}
            id="profilepassword"
          ></input>
          <label className="Profile-span" htmlFor="url">
            Avatar image (url)
            {errors?.url && <p>{errors?.url?.message}</p>}
          </label>
          <input
            type="url"
            placeholder="Avatar image"
            {...register('url', {
              pattern: {
                value:
                  /[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?/,
                message: 'Incorrect url',
              },
            })}
            id="url"
          ></input>

          <button className="Profile-btn" type="submit">
            Save
          </button>
        </form>
      </div>
    );
  } else {
    return <Redirect to={'/'}></Redirect>;
  }
};

export default EditProfile;
