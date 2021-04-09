import Page from 'components/Page';

import React from 'react';

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardDeck,
  Table,
  CardHeader,
  CardTitle,
  CardText,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { getColor } from 'utils/colors';
import PageSpinner from 'components/PageSpinner';
import { post, get } from 'components/axios';
import moment from 'moment';
import numeral from 'numeral';
import SearchInput from 'components/SearchInput';
import ReactToPrint from 'react-to-print';

class SearchDeductions extends React.PureComponent {
  state = {
    deductions: [],
    loading: false,
    ippis: '',
  };

  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.getDeductions();
  }
  getDeductions = async newSearch => {
    try {
      if (!this.state.ippis) return;
      this.setState({ loading: true });
      const {
        data: { data },
      } = await get(
        `${
          process.env.REACT_APP_API
        }deductions?limit=10&sort=-createdAt&ippisNumber=${
          this.state.ippis
        }&populate=lender employer staff&skip=${
          newSearch ? 0 : this.state.deductions.length
        }`,
      );

      //did user change ippis number and click on load more
      //if ippis number differs, show new data with new ippis number
      if (
        !newSearch &&
        this.state.ippis === this.state.deductions[0].ippisNumber
      ) {
        this.setState(prevState => {
          return {
            deductions: [...prevState.deductions, ...data],
          };
        });
      } else {
        this.setState({ deductions: data });
      }
      if (!data.length)
        this.props.notify('', `No more data found for ${this.state.ippis}`);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  };
  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');

    return (
      <Page
        className="DashboardPage"
        title="Dashboard"
        breadcrumbs={[
          { name: 'Deductions', active: false },
          { name: 'Search', active: true },
        ]}
      >
        <Row>
          <Col md="12" sm="12" xs="12">
            <Card>
              <CardBody className="d-flex justify-content-between align-items-center">
                <SearchInput
                  onChange={({ target: { value } }) =>
                    this.setState({ ippis: value })
                  }
                  placeholder="Search by Staff Number"
                  searchAction={() => {
                    this.getDeductions(true);
                  }}
                  search={this.state.ippis}
                />
                <ReactToPrint
                  documentTitle={`${this.state.ippis} deductions`}
                  trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return (
                      <Button size="sm" color="primary" outline>
                        Print
                      </Button>
                    );
                  }}
                  content={() => this.componentRef}
                />
              </CardBody>
              <CardBody>
                <ComponentToPrint
                  ref={el => (this.componentRef = el)}
                  data={this.state.deductions}
                />

                <Row>
                  <Col md={3} className="mx-auto my-3 text-center">
                    {this.state.loading ? (
                      <PageSpinner />
                    ) : (
                      <Button
                        onClick={() => this.getDeductions(false)}
                        outline
                        color="primary"
                      >
                        Load More
                      </Button>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Lender Name</th>
            <th>Employer Name</th>
            <th>Staff Number(IPPIS)</th>
            <th>Amount</th>
            <th>Tenure</th>
            <th>Uploaded On</th>
          </tr>
        </thead>
        <tbody>
          {this.props.data.map(
            (
              {
                createdAt,
                lender,
                employer,
                ippisNumber,
                amount,
                staff,
                tenure,
                _id,
              },
              idx,
            ) => (
              <tr key={_id}>
                <th scope="row">{idx + 1}</th>
                <td>{staff?.firstName || 'N/A'}</td>
                <td>{staff?.lastName || 'N/A'}</td>
                <td>{lender.businessName}</td>
                <td>{employer.name}</td>
                <td>{ippisNumber}</td>
                <td>{numeral(amount).format('0,0.00')}</td>
                <td>{tenure}</td>
                <td>{moment(createdAt).format('lll')}</td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    );
  }
}

export default SearchDeductions;
