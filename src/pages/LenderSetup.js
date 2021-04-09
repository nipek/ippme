import Page from 'components/Page';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
  FormGroup,
  Modal,
  Input,
  Label,
  Row,
} from 'reactstrap';
import PageSpinner from 'components/PageSpinner';
import { post, get } from 'components/axios';
import { MdCloudUpload, MdEmail, MdViewHeadline } from 'react-icons/md';
import { CSVReader, CSVDownloader } from 'react-papaparse';
import moment from 'moment';
import numeral from 'numeral';

const buttonRef = React.createRef();
const LenderSetup = props => {
  React.useEffect(() => {
    loadmore();
  }, []);
  const [loadMore, setLoadMore] = useState(false);
  const [loadMoreDeduction, setLoadMoreDeduction] = useState(false);

  const [lenders, setLenders] = useState([]);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedLender, setSelectedLender] = useState(null);
  const [deductions, setDeductions] = useState([]);
  const [modal, setModal] = useState(false);
  React.useEffect(() => {
    if (!modal) {
      //been closed
      setDeductions([]);
    } else {
      //been opened
      loadDeduction();
    }
  }, [modal]);
  const loadDeduction = async () => {
    try {
      setLoadMoreDeduction(true);
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}uploaddeductions?limit=10&sort=-createdAt&&skip=${deductions.length}&uploadedBy=${modal}&populate=employer`,
      );
      setDeductions([...deductions, ...data]);

      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadMoreDeduction(false);
    }
  };

  const loadmore = async isNew => {
    try {
      setLoadMore(true);
      const {
        data: { data },
      } = await get(
        `${
          process.env.REACT_APP_API
        }users?limit=10&sort=-createdAt&isSubAccount=false&skip=${
          isNew ? 0 : lenders.length
        }&isLender=true`,
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
      loadmore(true);
      props.changeLoading();
    }
  };

  const sendLink = async id => {
    try {
      if (!id) return;
      props.changeLoading();
      const { data } = await post(
        `${process.env.REACT_APP_API}users/sendactivationmail/${id}`,
      );
      console.log(data);
      props.notify('', 'Activation Link Sent Successfully');
    } catch (error) {
      console.log(error);
    } finally {
      loadmore(true);
      props.changeLoading();
    }
  };

  const handleOpenDialog = (e, lender) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current && lender) {
      setSelectedLender(lender);
      buttonRef.current.removeFile(e);
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = async data => {
    try {
      // console.log('---------------------------');
      if (!selectedLender) {
        return props.notify('', 'Could not process request');
      }
      if (window.confirm('Are you sure you want to upload this sheet')) {
        const upload = data
          .filter(
            datum =>
              datum.data['EMPLOYER'] &&
              datum.data['AMOUNT'] &&
              datum.data['STAFF NUMBER'] &&
              datum.data['FIRST NAME'] &&
              datum.data['LAST NAME'] &&
              datum.data['NO OF INSTALLMENTS'],
          )
          .map(datum => {
            datum.data.uploadBy = selectedLender;
            return datum.data;
          });
        props.changeLoading();
        // console.log(upload);
        await post(`${process.env.REACT_APP_API}uploaddeductions`, upload);
        props.notify(
          '',
          'Sheet has been uploaded successfully. Please check back in 10 minutes',
        );
      }
      // window.location.reload();
      //  console.log('---------------------------');
    } catch (error) {
      console.log(error);
      alert('An error occured');
    } finally {
      setSelectedLender(null);
      loadmore(true);
      props.changeLoading();
    }
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const handleOnRemoveFile = data => {
    // console.log('---------------------------');
    // console.log(data);
    // console.log('---------------------------');
  };

  const handleRemoveFile = e => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
    }
  };
  const toggle = () => {
    setModal(!modal);
  };

  return (
    <Page title="Lenders" breadcrumbs={[{ name: 'Lenders', active: true }]}>
      <Modal
        size="lg"
        isOpen={modal}
        toggle={toggle}
        centered
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader toggle={toggle}>Deduction List</ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={12} lg={12} md={12}>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Staff Number</th>
                    <th>Amount</th>
                    <th>No of Installments</th>
                    <th>Uploaded On</th>

                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {deductions.map(
                    (
                      {
                        createdAt,
                        _id,
                        errorCode,
                        log,
                        ippisNumber,
                        amount,
                        firstName,
                        lastName,
                        employer,
                        status,
                        tenure,
                      },
                      idx,
                    ) => (
                      <tr key={_id}>
                        <th scope="row">{idx + 1}</th>
                        <td>{firstName || 'N/A'}</td>
                        <td>{lastName || 'N/A'}</td>
                        <td>{ippisNumber}</td>
                        <td>{numeral(amount).format('0,0.00')}</td>
                        <td>{tenure}</td>
                        <td>{moment(createdAt).format('lll')}</td>
                        <td>
                          {status === 'failed'
                            ? 'Error occured while uploading deduction'
                            : ''}
                        </td>
                        <td>{errorCode ? log : 'N/A'}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </Table>
              <Row>
                <Col md={3} className="mx-auto my-3 text-center">
                  {loadMoreDeduction ? (
                    <PageSpinner />
                  ) : (
                    <Button onClick={loadDeduction} outline color="primary">
                      Load More
                    </Button>
                  )}
                </Col>
              </Row>{' '}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

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
                    <th />
                    <th />
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
                        <td>
                          {' '}
                          <Button
                            onClick={() => sendLink(_id)}
                            size="sm"
                            color="warning"
                          >
                            <MdEmail />
                          </Button>
                        </td>
                        <td>
                          <CSVReader
                            style={{ display: 'inline-block' }}
                            config={{ header: true }}
                            ref={buttonRef}
                            onFileLoad={handleOnFileLoad}
                            onError={handleOnError}
                            noClick
                            noDrag
                            // addRemoveButton
                            onRemoveFile={handleOnRemoveFile}
                          >
                            {({ file }) => (
                              <Button
                                size="sm"
                                onClick={e => handleOpenDialog(e, _id)}
                                color="info"
                              >
                                {file ? file.name : <MdCloudUpload />}
                              </Button>
                            )}
                          </CSVReader>
                        </td>
                        <td>
                          {' '}
                          <Button
                            onClick={() => setModal(_id)}
                            size="sm"
                            color="secondary"
                          >
                            <MdViewHeadline />
                          </Button>
                        </td>
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
