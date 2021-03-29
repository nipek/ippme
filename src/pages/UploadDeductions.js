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
  CardText,
  Input,
  Label,
  Row,
} from 'reactstrap';
import PageSpinner from 'components/PageSpinner';
import Autosuggest from 'react-autosuggest';
import 'components/autosuggest.css';
import { post, get, patch } from 'components/axios';
import moment from 'moment';
import { CSVReader, CSVDownloader } from 'react-papaparse';
import numeral from 'numeral';

const buttonRef = React.createRef();

const UploadDeductions = props => {
  React.useEffect(() => {
    getEmployers();
    loadmore();
  }, []);

  const getEmployers = async () => {
    try {
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}employers?select=name,_id&limit=-1`,
      );
      setEmployers(data);
    } catch (error) {
      console.log(error);
    }
  };
  const [loadMore, setLoadMore] = useState(false);
  const [lenders, setLenders] = useState([]);
  const [lender, setLender] = useState('');
  const [lenderId, setLenderId] = useState('');
  const [lenderSuggestions, setLenderSuggestion] = useState([]);
  const [employers, setEmployers] = useState([]);

  const [employer, setEmployer] = useState('');
  const [employerId, setEmployerId] = useState('');
  const [employerSuggestions, setEmployerSuggestions] = useState([]);

  const [ippisNumber, setIppisNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [deductions, setDeductions] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tenure, setTenure] = useState(1);
  const [errorCode, setErrorCode] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const loadmore = async isNew => {
    try {
      setLoadMore(true);
      const {
        data: { data },
      } = await get(
        `${
          process.env.REACT_APP_API
        }uploaddeductions?limit=10&sort=-createdAt&&skip=${
          isNew ? 0 : deductions.length
        }&uploadedBy=${props.user._id}&populate=employer`,
      );
      isNew ? setDeductions(data) : setDeductions([...deductions, ...data]);

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
      if (!employerId)
        return props.notify(
          '',
          'Please select an employer from the list',
          'error',
        );
      props.changeLoading();

      // const { data } = await post(`${process.env.REACT_APP_API}deductions`, {
      //   lender: props.user.lender || props.user._id,
      //   uploadedBy: props.user._id,
      //   employer: employerId,
      //   amount,
      //   ippisNumber,
      // });
      if (!isUpdate) {
        await post(`${process.env.REACT_APP_API}uploaddeductions`, {
          uploadedBy: props.user._id,
          employer: employerId,
          amount,
          ippisNumber,
          firstName,
          lastName,
          tenure,
        });
      } else {
        await patch(
          `${process.env.REACT_APP_API}uploaddeductions/${isUpdate}`,
          {
            lastName,
          },
        );
      }
      props.notify(
        '',
        `Deduction ${isUpdate ? 'Updated' : 'Uploaded'} Successfully`,
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdate(false);
      setErrorCode(null);
      setEmployer('');
      setEmployerId('');
      setIppisNumber('');
      setFirstName('');
      setLastName('');
      setAmount('');
      setTenure(1);
      loadmore(true);
      props.changeLoading();
    }
  };

  const lenderInputProps = {
    placeholder: 'Select a Lender.....',
    value: lender,
    required: true,
    onChange: (event, { newValue }) => {
      const value = newValue.split('?');
      setLender(value[0]);
      setLenderId(value[1]);
    },
    className: 'form-control',
  };
  const getLenderSuggestions = async value => {
    const inputLength = value.length;
    if (inputLength === 0) {
      return [];
    } else {
      const {
        data: { data },
      } = await get(
        `${
          process.env.REACT_APP_API
        }users?isLender=true&isSubAccount=false&search=${value.trim()}`,
      );
      return data;
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onLenderSuggestionsFetchRequested = async ({ value }) => {
    setLenderSuggestion(await getLenderSuggestions(value));
  };
  // Autosuggest will call this function every time you need to clear suggestions.
  const onLenderSuggestionsClearRequested = () => {
    setLenderSuggestion([]);
  };
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getLenderSuggestionValue = suggestion =>
    `${suggestion.businessName}?${suggestion._id}`;

  const renderLenderSuggestion = suggestion => (
    <div>
      <span className="data-text"> {suggestion.businessName}</span>
    </div>
  );

  const employerInputProps = {
    disabled: errorCode && errorCode === 5,
    placeholder: 'Select an Employer',
    value: employer,
    required: true,
    onChange: (event, { newValue }) => {
      const value = newValue.split('?');
      setEmployer(value[0]);
      setEmployerId(value[1]);
    },
    className: 'form-control',
  };
  const getEmployerSuggestions = async value => {
    const inputLength = value.length;
    if (inputLength === 0) {
      return [];
    } else {
      const {
        data: { data },
      } = await get(
        `${process.env.REACT_APP_API}employers?search=${value.trim()}`,
      );
      return data;
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onEmployerSuggestionsFetchRequested = async ({ value }) => {
    setEmployerSuggestions(await getEmployerSuggestions(value));
  };
  // Autosuggest will call this function every time you need to clear suggestions.
  const onEmployerSuggestionsClearRequested = () => {
    setEmployerSuggestions([]);
  };
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getEmployerSuggestionValue = suggestion =>
    `${suggestion.name}?${suggestion._id}`;

  const renderEmployerSuggestion = suggestion => (
    <div>
      <span className="data-text"> {suggestion.name}</span>
    </div>
  );

  const handleOpenDialog = e => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e);
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = async data => {
    try {
      // console.log('---------------------------');

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
          .map(datum => datum.data);
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
  const openInNewTab = url => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Page
      title="Upload Deductions"
      breadcrumbs={[
        { name: 'Deductions', active: false },
        { name: 'Upload', active: true },
      ]}
    >
      <Row>
        <Col>
          <Button
            onClick={() => openInNewTab(process.env.REACT_APP_SAMPLEUPLOADCSV)}
            size="sm"
            outline
            color="primary"
          >
            View Sample Upload CSV
          </Button>{' '}
          {employers.length ? (
            <CSVDownloader
              data={employers}
              type="button"
              filename={'employers'}
              bom={true}
              className="btn btn-outline-secondary btn-sm"
            >
              Download Employer&apos;s List
            </CSVDownloader>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col xl={8} lg={12} md={12}>
          <Card>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Staff Number</th>
                    <th>Amount</th>
                    <th>Uploaded On</th>
                    <th>Status</th>
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
                        <td>{moment(createdAt).format('lll')}</td>
                        <td>
                          {errorCode === 5 ? (
                            <Button
                              onClick={() => {
                                setEmployer(employer.name);
                                setEmployerId(employer._id);
                                setIppisNumber(ippisNumber);
                                setFirstName(firstName);
                                setLastName(lastName);
                                setAmount(amount);
                                setTenure(tenure);
                                setErrorCode(errorCode);
                                setIsUpdate(_id);
                              }}
                              size="sm"
                              color="danger"
                            >
                              Edit Last Name
                            </Button>
                          ) : (
                            status
                          )}
                        </td>
                        <td>{errorCode ? log : 'N/A'}</td>
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

        <Col xl={4} lg={12} md={12}>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <CardText>Upload</CardText>
              <div>
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
                      onClick={handleOpenDialog}
                      outline
                      color="warning"
                    >
                      {file ? file.name : 'Upload CSV'}
                    </Button>
                  )}
                </CSVReader>{' '}
              </div>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                {/* <FormGroup row>
                  <Label for="exampleName" sm={4}>
                    Lender
                  </Label>
                  <Col sm={8}>
                    <Autosuggest
                      id={'lender'}
                      suggestions={lenderSuggestions}
                      onSuggestionsFetchRequested={
                        onLenderSuggestionsFetchRequested
                      }
                      onSuggestionsClearRequested={
                        onLenderSuggestionsClearRequested
                      }
                      getSuggestionValue={getLenderSuggestionValue}
                      renderSuggestion={renderLenderSuggestion}
                      inputProps={lenderInputProps}
                      //  alwaysRenderSuggestions
                      //  shouldRenderSuggestionsfunction={(value) => true}
                    />
                  </Col>
                </FormGroup> */}
                <FormGroup row>
                  <Label for="exampleName" sm={4}>
                    First Name
                  </Label>
                  <Col sm={8}>
                    <Input
                      disabled={errorCode && errorCode === 5}
                      required
                      value={firstName}
                      onChange={({ target: { value } }) => setFirstName(value)}
                      type="text"
                      name="fname"
                      placeholder="ifeoluwa"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleName" sm={4}>
                    Last Name
                  </Label>
                  <Col sm={8}>
                    <Input
                      required
                      value={lastName}
                      onChange={({ target: { value } }) => setLastName(value)}
                      type="text"
                      name="lname"
                      placeholder="olanipekun"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleName" sm={4}>
                    Employer
                  </Label>
                  <Col sm={8}>
                    <Autosuggest
                      id={'employer'}
                      suggestions={employerSuggestions}
                      onSuggestionsFetchRequested={
                        onEmployerSuggestionsFetchRequested
                      }
                      onSuggestionsClearRequested={
                        onEmployerSuggestionsClearRequested
                      }
                      getSuggestionValue={getEmployerSuggestionValue}
                      renderSuggestion={renderEmployerSuggestion}
                      inputProps={employerInputProps}
                      //  alwaysRenderSuggestions
                      //  shouldRenderSuggestionsfunction={(value) => true}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleName" sm={4}>
                    Staff Number(IPPIS Number/Payroll No)
                  </Label>
                  <Col sm={8}>
                    <Input
                      disabled={errorCode && errorCode === 5}
                      required
                      value={ippisNumber}
                      onChange={({ target: { value } }) =>
                        setIppisNumber(value)
                      }
                      type="number"
                      name="ippis"
                      placeholder="11111"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleName" sm={4}>
                    Deduction Amount
                  </Label>
                  <Col sm={8}>
                    <Input
                      disabled={errorCode && errorCode === 5}
                      required
                      value={amount}
                      onChange={({ target: { value } }) => setAmount(value)}
                      type="number"
                      name="amt"
                      placeholder="20000"
                    />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label for="exampleName" sm={4}>
                    No of Installments(Months)
                  </Label>
                  <Col sm={8}>
                    <Input
                      disabled={errorCode && errorCode === 5}
                      required
                      value={tenure}
                      onChange={({ target: { value } }) => setTenure(value)}
                      type="number"
                      name="tenure"
                      placeholder="1"
                    />
                  </Col>
                </FormGroup>
                <FormGroup check row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button type="submit">
                      {isUpdate ? 'Update' : 'Submit'}
                    </Button>
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

export default UploadDeductions;
