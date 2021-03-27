import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { post } from './axios';
class AuthForm extends React.Component {
  state = { email: '', password: '' };
  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

  handleSubmit = async event => {
    try {
      event.preventDefault();
      if (!this.state.email || !this.state.password) return;
      // console.log(this.state.email, this.state.password);
      const {
        data: { data },
      } = await post(`${process.env.REACT_APP_API}users/login`, {
        email: this.state.email,
        password: this.state.password,
      });
      sessionStorage.setItem('zer', data.token);
      console.log(this.props);
      this.props.history.push('/dashboard/home');
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }
  updateForm = (key, value) => {
    this.setState({ [key]: value });
  };
  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      confirmPasswordLabel,
      confirmPasswordInputProps,
      children,
      onLogoClick,
    } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        {showLogo && (
          <div className="text-center pb-4">
            <img
              src={logo200Image}
              className="rounded"
              // style={{ width: 60, height: 60, cursor: 'pointer' }}
              style={{ height: 60, cursor: 'pointer' }}
              alt="logo"
              onClick={onLogoClick}
            />
          </div>
        )}
        <FormGroup>
          <Label for={usernameLabel}>{usernameLabel}</Label>
          <Input
            onChange={({ target: { value } }) =>
              this.updateForm('email', value)
            }
            value={this.state.email}
            {...usernameInputProps}
          />
        </FormGroup>
        <FormGroup>
          <Label value={this.state.password} for={passwordLabel}>
            {passwordLabel}
          </Label>
          <Input
            onChange={({ target: { value } }) =>
              this.updateForm('password', value)
            }
            {...passwordInputProps}
          />
        </FormGroup>
        {this.isSignup && (
          <FormGroup>
            <Label for={confirmPasswordLabel}>{confirmPasswordLabel}</Label>
            <Input {...confirmPasswordInputProps} />
          </FormGroup>
        )}
        {/* <FormGroup check>
          <Label check>
            <Input type="checkbox" />{' '}
            {this.isSignup ? 'Agree the terms and policy' : 'Remember me'}
          </Label>
        </FormGroup> */}
        <hr />
        <Button
          size="lg"
          className="bg-gradient-theme-left border-0"
          block
          onClick={this.handleSubmit}
        >
          {this.renderButtonText()}
        </Button>

        {/* <div className="text-center pt-1">
          <h6>or</h6>
          <h6>
            {this.isSignup ? (
              <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                Login
              </a>
            ) : (
              <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>
                Signup
              </a>
            )}
          </h6>
        </div> */}

        {children}
      </Form>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Email',
  usernameInputProps: {
    type: 'email',
    placeholder: 'your@email.com',
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
  },
  onLogoClick: () => {},
};

export default withRouter(AuthForm);
