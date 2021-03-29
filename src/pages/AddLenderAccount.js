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
import CardText from 'reactstrap/lib/CardText';
const AddLenderAccount = props => {
  React.useEffect(() => {
    loadmore();
  }, []);
  const [loadMore, setLoadMore] = useState(false);
  const [lenders, setLenders] = useState([]);
  const [email, setEmail] = useState('');

  const loadmore = async isNew => {
    try {
      setLoadMore(true);
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}users?limit=10&sort=-createdAt&lender=${
          props.user._id
        }&skip=${isNew ? 0 : lenders.length}&isLender=true`,
      );
      isNew ? setLenders(data) : setLenders([...lenders, ...data]);

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
        `${process.env.REACT_APP_API}users/setupsublender`,
        {
          email,
        },
      );
      console.log(data);
      props.notify('', 'Account Created Successfully');
    } catch (error) {
      console.log(error);
    } finally {
      loadmore(true);
      props.changeLoading();
    }
  };
  return (
    <Page
      title="Account"
      breadcrumbs={[
        { name: 'setup', active: false },
        { name: 'account', active: true },
      ]}
    >
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                {!lenders.length ? (
                  <CardText>No data found</CardText>
                ) : (
                  <tbody>
                    {lenders.map(
                      ({ createdAt, businessName, _id, email }, idx) => (
                        <tr key={_id}>
                          <th scope="row">{idx + 1}</th>
                          <td>{email}</td>
                          <td>{moment(createdAt).format('lll')}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                )}
              </Table>
              {lenders.length ? (
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
                </Row>
              ) : null}{' '}
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

export default AddLenderAccount;
