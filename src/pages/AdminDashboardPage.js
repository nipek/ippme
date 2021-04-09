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
  CardGroup,
  CardHeader,
  CardTitle,
  Col,
  ListGroup,
  Table,
  Row,
} from 'reactstrap';
import { getColor } from 'utils/colors';
import { get } from 'components/axios';
import moment from 'moment';
const today = new Date();
const lastWeek = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() - 7,
);

class AdminDashboardPage extends React.Component {
  state = {
    employers: [],
    lenders: [],
  };
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
    this.getEmployers();
    this.getLenders();
  }
  getEmployers = async () => {
    try {
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}employers?limit=5&sort=-createdAt`,
      );
      this.setState({ employers: data });
      console.log(data, ' data');
    } catch (error) {
      console.log(error);
    }
  };
  getLenders = async () => {
    try {
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}users?isSubAccount=false&isLender=true&limit=5&sort=-createdAt`,
      );
      this.setState({ lenders: data });
      console.log(data, ' data');
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const primaryColor = getColor('primary');
    const secondaryColor = getColor('secondary');

    return (
      <Page
        className="DashboardPage"
        title="Dashboard"
        breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row>
          <Col md="6" sm="12" xs="12">
            <Card>
              <CardHeader>Recent Employers</CardHeader>
              <CardBody>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th> Name</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.employers.map(
                      ({ _id: id, name: title, createdAt }, idx) => (
                        <tr key={id}>
                          <th scope="row">{idx + 1}</th>
                          <td>{title}</td>
                          <td>{moment(createdAt).format('lll')}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </Table>
                {/* {this.state.employers.map(
                  ({ _id: id, name: title, createdAt }) => (
                    <Employers key={id} title={title} createdAt={createdAt} />
                  ),
                )} */}
              </CardBody>
            </Card>
          </Col>

          <Col md="6" sm="12" xs="12">
            <Card>
              <CardHeader>Recent Lenders</CardHeader>
              <CardBody>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th> Name</th>
                      <th> Email</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.lenders.map(
                      ({ _id: id, email, businessName, createdAt }, idx) => (
                        <tr key={id}>
                          <th scope="row">{idx + 1}</th>
                          <td>{businessName}</td>
                          <td>{email}</td>
                          <td>{moment(createdAt).format('lll')}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </Table>
                {/* {this.state.lenders.map(
                  ({ _id: id, email, businessName, createdAt },idx) => (
                    <Lenders
                      key={id}
                      email={email}
                      businessName={businessName}
                      createdAt={createdAt}
                    />
                  ),
                )} */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default AdminDashboardPage;
