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
import { post, get, patch } from 'components/axios';
import moment from 'moment';
import numeral from 'numeral';
import SearchInput from 'components/SearchInput';

const Staffs = props => {
  const [loading, setLoading] = React.useState(false);
  const [ippis, setIppis] = React.useState('');
  const [staffs, setStaffs] = React.useState([]);

  React.useEffect(() => {
    getStaffs();
  }, []);

  const resolvelastnameissue = async (id, ignore = false) => {
    if (!id) return;
    try {
      props.changeLoading();

      await patch(
        `${process.env.REACT_APP_API}staffs/resolvelastnameissue/${id}`,
        { ignore },
      );
      props.notify('', 'Request Successful');
    } catch (error) {
      console.log(error);
    } finally {
      getStaffs(true);
      props.changeLoading();
    }
  };
  const getStaffs = async newSearch => {
    try {
      //  if (!ippis) return;
      setLoading(true);
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}staffs?limit=10&sort=-createdAt${
          ippis ? '&ippisNumber=ippis' : ''
        }&populate=reportedBy uploadedBy&skip=${newSearch ? 0 : staffs.length}`,
      );
      if (!newSearch) {
        setStaffs([...staffs, ...data]);
      } else {
        setStaffs(data);
      }
      if (!data.length && ippis) props.notify('', `${ippis} not found`);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Page
      className="DashboardPage"
      title="Dashboard"
      breadcrumbs={[{ name: 'Staffs', active: true }]}
    >
      <Row>
        <Col md="12" sm="12" xs="12">
          <Card>
            <CardBody className="d-flex justify-content-between align-items-center">
              <SearchInput
                onChange={({ target: { value } }) => setIppis(value)}
                placeholder="Search by Staff Number"
                searchAction={() => {
                  getStaffs(true);
                }}
                search={ippis}
              />
            </CardBody>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Staff Number(IPPIS)</th>
                    <th>Uploaded On</th>
                    <th>Uploaded By</th>

                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {staffs.map(
                    (
                      {
                        createdAt,
                        errorCode,
                        firstName,
                        ippisNumber,
                        lastName,
                        reportedBy,
                        uploadedBy,
                        _id,
                        suggestedLastName,
                      },
                      idx,
                    ) => (
                      <tr key={_id}>
                        <th scope="row">{idx + 1}</th>
                        <td>{firstName}</td>
                        <td>{lastName}</td>
                        <td>{ippisNumber}</td>
                        <td>{moment(createdAt).format('lll')}</td>

                        <td>{uploadedBy.businessName}</td>
                        <td>
                          {errorCode ? (
                            <div style={{ width: '200px' }}>
                              {errorCode === 5 ? (
                                <>
                                  {' '}
                                  {reportedBy?.businessName} reported Invalid
                                  Last Name. <br />
                                  <br /> Suggested Last Name -
                                  <b>{suggestedLastName}</b>
                                </>
                              ) : (
                                ''
                              )}
                              <br /> <br />
                              <Button
                                onClick={() => resolvelastnameissue(_id, false)}
                                size="sm"
                                color="primary"
                              >
                                Resolve
                              </Button>{' '}
                              <Button
                                onClick={() => resolvelastnameissue(_id, true)}
                                size="sm"
                                color="secondary"
                              >
                                Ignore
                              </Button>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </Table>
              <Row>
                <Col md={3} className="mx-auto my-3 text-center">
                  {loading ? (
                    <PageSpinner />
                  ) : (
                    <Button
                      onClick={() => getStaffs(false)}
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
};

export default Staffs;
