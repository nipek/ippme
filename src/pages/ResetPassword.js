import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  Card,
} from 'reactstrap';
import { post } from 'components/axios';
import logo200Image from 'assets/img/logo/logo_200.png';
import { Link } from 'react-router-dom';
const ResetPassword = props => {
  React.useEffect(() => {
    console.log(props.match.params.tk);
  }, []);
  const [password, setPassword] = React.useState('');

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const {
        data: { data },
      } = await post(`${process.env.REACT_APP_API}users/resetpassword`, {
        tk: props.match.params.tk,
        password,
      });
      alert('Password reset successful, please login');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Row
      style={{
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Col md={6} lg={4}>
        <Card body>
          <Form onSubmit={handleSubmit}>
            <div className="text-center pb-4">
              <img
                src={logo200Image}
                className="rounded"
                // style={{ width: 60, height: 60, cursor: 'pointer' }}
                style={{ height: 60, cursor: 'pointer' }}
                alt="logo"
                //  onClick={onLogoClick}
              />
            </div>

            <FormGroup>
              <Label>New Password</Label>
              <Input
                onChange={({ target: { value } }) => setPassword(value)}
                value={password}
                type="password"
                required={true}
              />
            </FormGroup>

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
              type="submit"
              // onClick={handleSubmit}
            >
              Reset Password
            </Button>

            <div className="text-center pt-1">
              <h6>or</h6>
              <h6>
                <Link to="/login">Login</Link>
              </h6>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;
