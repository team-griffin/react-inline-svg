import React from 'react';
import { lifecycle, withState, compose, withProps } from 'recompose';
import axios from 'axios';

export default compose(
  withState(
    'rawSrc',
    'setRawSrc',
    null,
  ),
  lifecycle({
    componentDidMount: function() {
      axios.get(this.props.src).then((response) => this.props.setRawSrc(response.data));
    }
  }),
  withProps((ownerProps) => ({
    src: ownerProps.rawSrc,
  })),
);
