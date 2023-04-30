import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';
import { message } from 'antd';
import './LogInPage.css';

import SessionAPI from '../../service/sessionAPI';

const LogInPage = ({ onFormSubmit, IsLogedIn }) => {
  const API = new SessionAPI();

  const [messageApi, contextHolder] = message.useMessage();
  const [logedin, setLogedin] = useState(false);
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
    await API.authLogin(Data)
      .then((data) => {
        if (data.errors) {
          for (let el in data.errors) {
            error(`${el} - ${data.errors[el]}`, el);
          }
        } else {
          onFormSubmit();
          setLogedin(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  if (!logedin) {
    if (!IsLogedIn) {
      return (
        <div className="Login">
          {contextHolder}
          <form className="Login-form" onSubmit={handleSubmit(onSubmit)}>
            <h1>Sign In</h1>
            <label className="Login-span" htmlFor="mail">
              Email address
              {errors?.email && <p>{errors?.email?.message}</p>}
            </label>
            <input
              type="email"
              placeholder="Email address"
              {...register('email', {
                required: 'This field should not be empty',
                pattern: {
                  value: /^([^ ]+@[^ ]+\.[a-z]{2,6}|)$/,
                  message: 'Incorrect mail',
                },
              })}
              id="mail"
            ></input>

            <label className="Login-span" htmlFor="loginpassword">
              Password
              {errors?.password && <p>{errors?.password?.message}</p>}
            </label>
            <input
              type="password"
              placeholder="Password"
              minLength={6}
              maxLength={40}
              {...register('password', {
                required: 'This field should not be empty',
              })}
              id="loginpassword"
            ></input>
            <button type="submit" className="Login-btn">
              Login
            </button>
            <span className="Login-info">
              Don&apos;t have an account?
              <Link to={'sign-up'}> Sign Up</Link>
            </span>
          </form>
        </div>
      );
    } else {
      return <Redirect to={'/'}></Redirect>;
    }
  } else {
    return <Redirect to={'/'}></Redirect>;
  }
};

export default LogInPage;
