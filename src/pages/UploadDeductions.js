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
import { post, get } from 'components/axios';
import moment from 'moment';
import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef();

const UploadDeductions = props => {
  React.useEffect(() => {
    //  loadmore();
  }, []);
  const [loadMore, setLoadMore] = useState(false);
  const [lenders, setLenders] = useState([]);
  const [lender, setLender] = useState('');
  const [lenderId, setLenderId] = useState('');
  const [lenderSuggestions, setLenderSuggestion] = useState([]);
  const [employer, setEmployer] = useState('');
  const [employerId, setEmployerId] = useState('');
  const [employerSuggestions, setEmployerSuggestions] = useState([]);

  const [ippisNumber, setIppisNumber] = useState('');
  const [amount, setAmount] = useState('');

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
      const { data } = await post(`${process.env.REACT_APP_API}deductions`, {
        lender: props.user.lender || props.user._id,
        uploadedBy: props.user._id,
        employer: employerId,
        amount,
        ippisNumber,
      });
      console.log(data);
      props.notify('', 'Deduction Uploaded Successfully');
    } catch (error) {
      console.log(error);
    } finally {
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
    placeholder: 'Select a Employer.....',
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
              datum.data['STAFF NUMBER'],
          )
          .map(datum => datum.data);
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
          <Button size="sm" outline color="primary">
            View Sample CSV
          </Button>{' '}
          <a
            rel="noopener noreferrer"
            href={process.env.REACT_APP_EMPLISTCSV}
            className="btn btn-outline-secondary btn-sm"
            target="_blank"
          >
            Download Employer List
          </a>
        </Col>
      </Row>
      <Row>
        <Col xl={12} lg={12} md={12}>
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
                    <Button onClick={handleOpenDialog} outline color="warning">
                      {file ? file.name : 'Upload CSV'}
                    </Button>
                  )}
                </CSVReader>{' '}
              </div>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                {/* <FormGroup row>
                  <Label for="exampleName" sm={2}>
                    Lender
                  </Label>
                  <Col sm={10}>
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
                  <Label for="exampleName" sm={2}>
                    Employer
                  </Label>
                  <Col sm={10}>
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
                  <Label for="exampleName" sm={2}>
                    Staff Number(IPPIS Number/Payroll No)
                  </Label>
                  <Col sm={10}>
                    <Input
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
                  <Label for="exampleName" sm={2}>
                    Deduction Amount
                  </Label>
                  <Col sm={10}>
                    <Input
                      required
                      value={amount}
                      onChange={({ target: { value } }) => setAmount(value)}
                      type="number"
                      name="amt"
                      placeholder="20000"
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

export default UploadDeductions;
