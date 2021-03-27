import { AnnouncementCard, TodosCard } from 'components/Card';
import HorizontalAvatarList from 'components/HorizontalAvatarList';
import MapWithBubbles from 'components/MapWithBubbles';
import Page from 'components/Page';
import ProductMedia from 'components/ProductMedia';
import Employers from 'components/Employers';
import Lenders from 'components/Lenders';

import SupportTicket from 'components/SupportTicket';
import UserProgressTable from 'components/UserProgressTable';
import { IconWidget, NumberWidget } from 'components/Widget';
import { getStackLineChart, stackLineChartOptions } from 'demos/chartjs';
import {
  avatarsData,
  chartjs,
  productsData,
  supportTicketsData,
  todosData,
  userProgressTableData,
} from 'demos/dashboardPage';
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  MdBubbleChart,
  MdInsertChart,
  MdPersonPin,
  MdPieChart,
  MdRateReview,
  MdShare,
  MdShowChart,
  MdThumbUp,
} from 'react-icons/md';
import InfiniteCalendar from 'react-infinite-calendar';
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
class SearchDeductions extends React.Component {
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
        }deductions?limit=1&sort=-createdAt&ippisNumber=${
          this.state.ippis
        }&populate=lender employer&skip=${
          newSearch ? 0 : this.state.deductions.length
        }`,
      );
      if (!newSearch) {
        this.setState(prevState => {
          return {
            deductions: [...prevState.deductions, ...data],
          };
        });
      } else {
        this.setState({ deductions: data });
      }

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
              </CardBody>
              <CardBody>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Lender Name</th>
                      <th>Employer Name</th>
                      <th>Staff Number(IPPIS)</th>
                      <th>Amount</th>
                      <th>Uploaded On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.deductions.map(
                      (
                        {
                          createdAt,
                          lender,
                          employer,
                          ippisNumber,
                          amount,
                          _id,
                        },
                        idx,
                      ) => (
                        <tr key={_id}>
                          <th scope="row">{idx + 1}</th>
                          <td>{lender.businessName}</td>
                          <td>{employer.name}</td>
                          <td>{ippisNumber}</td>
                          <td>{numeral(amount).format('0,0.00')}</td>

                          <td>{moment(createdAt).format('lll')}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </Table>
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
export default SearchDeductions;
