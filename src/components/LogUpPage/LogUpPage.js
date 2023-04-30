import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect } from 'react-router-dom';
import { message } from 'antd';

import SessionAPI from '../../service/sessionAPI';
import './LogUpPage.css';

const LogUpPage = ({ onFormSubmit, IsLogedIn }) => {
  const API = new SessionAPI();
  const [messageApi, contextHolder] = message.useMessage();
  const [checkbox, setCheckbox] = useState(false);
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
    watch,
  } = useForm({
    mode: 'onBlur',
  });

  async function onSubmit(Data) {
    await API.authRegister(Data)
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
        <div className="Logup">
          {contextHolder}
          <form className="Logup-form" onSubmit={handleSubmit(onSubmit)}>
            <h1>Create new account</h1>
            <label className="Logup-span" htmlFor="username">
              Username
              {errors?.username && <p>{errors?.username?.message}</p>}
            </label>
            <input
              type="text"
              placeholder="Username"
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
            <label className="Logup-span" htmlFor="email">
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
              id="email"
            ></input>
            <label className="Logup-span" htmlFor="loguppassword">
              Password
              {errors?.password && <p>{errors?.password?.message}</p>}
            </label>
            <input
              type="password"
              placeholder="Password"
              {...register('password', {
                required: 'This field should not be empty',
                minLength: {
                  value: 6,
                  message: 'Minimum 6 characters',
                },
                maxLength: {
                  value: 40,
                  message: 'Maximum 40 characters',
                },
              })}
              id="loguppassword"
            ></input>
            <label className="Logup-span" htmlFor="loguppasswordr">
              Repeat Password
              {errors?.repeatPass && <p>{errors?.repeatPass?.message}</p>}
            </label>
            <input
              type="password"
              placeholder="Password"
              {...register('repeatPass', {
                required: 'This field should not be empty',
                validate: (val) => {
                  if (watch('password') != val) {
                    return 'Your passwords do not match';
                  }
                },
              })}
              id="loguppasswordr"
            ></input>
            <div className="Logup-agree">
              <input
                type="checkbox"
                id="logup"
                {...register('check', { value: checkbox, required: 'The field must be filled in' })}
                onChange={(e) => {
                  setCheckbox(e.target.checked);
                }}
              ></input>
              <label className="Logup-span" htmlFor="logup">
                I agree to the processing of my personal information
                {errors?.check && <p>{errors?.check?.message}</p>}
              </label>
            </div>

            <button className="Logup-btn" type="submit">
              Create
            </button>
            <label className="Logup-info">
              Already have an account?
              <Link to={'sign-in'}> Sign In</Link>
            </label>
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

export default LogUpPage;
