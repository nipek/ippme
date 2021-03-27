import React from 'react';
import PropTypes from 'utils/propTypes';
import moment from 'moment';
import { Media } from 'reactstrap';

import Typography from 'components/Typography';

const Lenders = ({ email, businessName, createdAt, ...restProps }) => {
  return (
    <Media {...restProps}>
      <Media body className="overflow-hidden">
        <Media heading tag="h5" className="text-truncate">
          {businessName || 'N/A'}
        </Media>
        <p className="text-muted text-truncate">{email}</p>
      </Media>

      <Media right className="align-self-center">
        <Typography type="h6">{moment(createdAt).format('lll')}</Typography>
      </Media>
    </Media>
  );
};

export default Lenders;
