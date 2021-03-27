import React from 'react';
import PropTypes from 'utils/propTypes';
import moment from 'moment';
import { Media } from 'reactstrap';

import Typography from 'components/Typography';

const Employers = ({ title, createdAt, ...restProps }) => {
  return (
    <Media {...restProps}>
      <Media body className="overflow-hidden">
        <h6 className="text-muted text-truncate">{title}</h6>
      </Media>
      <Media right className="align-self-center">
        <Typography type="h6">{moment(createdAt).format('lll')}</Typography>
      </Media>
    </Media>
  );
};

Employers.propTypes = {
  createdAt: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Employers;
