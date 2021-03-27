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
const EmployerSetup = props => {
  React.useEffect(() => {
    loadmore();
  }, []);
  const [loadMore, setLoadMore] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [name, setName] = useState('');

  const loadmore = async () => {
    try {
      setLoadMore(true);
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}employers?limit=1&sort=name&skip=${employers.length}`,
      );
      setEmployers([...employers, ...data]);
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
      const { data } = await post(`${process.env.REACT_APP_API}employers`, {
        name,
      });
      console.log(data);
      props.notify('', 'Employer Created Successfully');
    } catch (error) {
      console.log(error);
    } finally {
      loadmore();
      props.changeLoading();
    }
  };
  return (
    <Page title="Employers" breadcrumbs={[{ name: 'Employer', active: true }]}>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map(({ createdAt, name, _id }, idx) => (
                    <tr key={_id}>
                      <th scope="row">{idx + 1}</th>
                      <td>{name}</td>
                      <td>{moment(createdAt).format('lll')}</td>
                    </tr>
                  ))}
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
            <CardHeader>Create Employer</CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <FormGroup row>
                  <Label for="exampleName" sm={2}>
                    Name
                  </Label>
                  <Col sm={10}>
                    <Input
                      required
                      value={name}
                      onChange={({ target: { value } }) => setName(value)}
                      type="text"
                      name="name"
                      placeholder="Kona"
                    />
                  </Col>
                </FormGroup>{' '}
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

export default EmployerSetup;
