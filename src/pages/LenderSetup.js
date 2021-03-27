import Page from 'components/Page';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  Table,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import PageSpinner from 'components/PageSpinner';
import { post, get } from 'components/axios';
import moment from 'moment';
const LenderSetup = props => {
  React.useEffect(() => {
    loadmore();
  }, []);
  const [loadMore, setLoadMore] = useState(false);
  const [lenders, setLenders] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');

  const loadmore = async () => {
    try {
      setLoadMore(true);
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}users?limit=1&sort=-createdAt&skip=${lenders.length}&isLender=true`,
      );
      setLenders([...lenders, ...data]);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadMore(false);
    }
  };
  const handleSubmit = async e => {
    try {
      e.preventDefault();
      props.changeLoading();
      const { data } = await post(
        `${process.env.REACT_APP_API}users/setuplender`,
        {
          businessName,
          email,
        },
      );
      console.log(data);
      props.notify('', 'Lender Created Successfully');
    } catch (error) {
      console.log(error);
    } finally {
      loadmore();
      props.changeLoading();
    }
  };
  return (
    <Page title="Lenders" breadcrumbs={[{ name: 'Lenders', active: true }]}>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Business Name</th>
                    <th>Email</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {lenders.map(
                    ({ createdAt, businessName, _id, email }, idx) => (
                      <tr key={_id}>
                        <th scope="row">{idx + 1}</th>
                        <td>{businessName}</td>
                        <td>{email}</td>
                        <td>{moment(createdAt).format('lll')}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </Table>
              <Row>
                <Col md={3} className="mx-auto my-3 text-center">
                  {loadMore ? (
                    <PageSpinner />
                  ) : (
                    <Button onClick={loadmore} outline color="primary">
                      Load More
                    </Button>
                  )}
                </Col>
              </Row>{' '}
            </CardBody>
          </Card>
        </Col>

        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardHeader>Create Lender</CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup row>
                  <Label for="exampleName" sm={2}>
                    Business Name
                  </Label>
                  <Col sm={10}>
                    <Input
                      required
                      value={businessName}
                      onChange={({ target: { value } }) =>
                        setBusinessName(value)
                      }
                      type="text"
                      name="name"
                      placeholder="Kona"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleName" sm={2}>
                    Email
                  </Label>
                  <Col sm={10}>
                    <Input
                      required
                      value={email}
                      onChange={({ target: { value } }) => setEmail(value)}
                      type="email"
                      name="name"
                      placeholder="Kona@kona.com.ng"
                    />
                  </Col>
                </FormGroup>
                <FormGroup check row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button type="submit">Submit</Button>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  );
};

export default LenderSetup;
